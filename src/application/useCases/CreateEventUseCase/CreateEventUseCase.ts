import { NotFound } from "../../../infra/http/errors/NotFound";
import { ICreateEventUseCase } from "./ICreateEventUseCase";
import { TCreateEventUseCaseRequest, TCreateEventUseCaseResponse } from "./TCreateEventUseCase";
import { EEventType } from "../../../domain/entities/IEvent";
import { Event } from "../../../domain/entities/Event";
import { IAccountRepository } from "../../../domain/repositories/IAccountRepository";
import { AccountRepository } from "../../../infra/persistence/repository/AccountRepository";
import { Logger } from "../../../infra/logger/logger";
import { randomUUID } from "crypto";
import { Account } from "../../../domain/entities/Account";

export class CreateEventUseCase implements ICreateEventUseCase {

    constructor(
        private accountRepository: IAccountRepository = new AccountRepository()
    ) {}

    async execute(request: TCreateEventUseCaseRequest): Promise<TCreateEventUseCaseResponse> {
        const availablesEvents: { [K in EEventType]: (request: TCreateEventUseCaseRequest) => Promise<TCreateEventUseCaseResponse> } = {
            deposit: this.depositEvent.bind(this),
            transfer: this.transferEvent.bind(this),
            withdraw: this.withdrawEvent.bind(this)
        }

        try {
            const { type } = request
            const availableEvent = availablesEvents[type]

            if (!availableEvent) {
                Logger.error({
                    message: 'invalid event type',
                    additionalInfo: request
                })
                throw Error('invalid event')
            }
            
            return await availableEvent(request)
        } catch {
            throw new NotFound((0).toString())
        }
    }

    private async depositEvent(request: TCreateEventUseCaseRequest): Promise<TCreateEventUseCaseResponse> {
        const { destination, amount } = request

        if (!destination) {
            Logger.error({
                message: 'request need a destination',
                additionalInfo: request
            })
            throw new NotFound('invalid destination')
        }

        const event: Event = new Event(randomUUID().toString(), EEventType.DEPOSIT, amount)
        const accountFound = this.accountRepository.find(destination)
        const account: Account = accountFound ? new Account({ ...accountFound }) : new Account({ id: destination })
        account.addEvent(event)
        account.validate()
    
        const accountUpdated = accountFound ?
            this.accountRepository.save(account) :
            this.accountRepository.create(account)
        
        return {
            destination: {
                balance: accountUpdated.amount,
                id: accountUpdated.id.toString()
            }
        }
    }

    private async transferEvent(request: TCreateEventUseCaseRequest): Promise<TCreateEventUseCaseResponse> {
        const { origin, destination, amount } = request

        if (!origin || !destination) {
            Logger.error({
                message: 'request need a origin and destination',
                additionalInfo: request
            })
            throw new NotFound('invalid origin and destination')
        }

        const accountOriginFound = this.accountRepository.find(origin)
        if (!accountOriginFound) {
            Logger.error({
                message: 'account not found on db',
                additionalInfo: request
            })
            throw new NotFound('account not found')
        }
        
        const accountDestinationFound = this.accountRepository.find(destination)
        if (!accountDestinationFound) {
            Logger.error({
                message: 'account not found on db',
                additionalInfo: request
            })
            throw new NotFound('account not found')
        }

        const eventId = randomUUID().toString()

        const accountOrigin: Account = new Account({ ...accountOriginFound })
        const originEvent: Event = new Event(eventId, EEventType.TRANSFER, amount)
        accountOrigin.addEvent(originEvent)
        accountOrigin.validate()

        const accountDestination: Account = new Account({ ...accountDestinationFound })
        const destinationEvent: Event = new Event(eventId, EEventType.TRANSFER, amount)
        accountDestination.addEvent(destinationEvent)
        accountDestination.validate()

        const originUpdated = this.accountRepository.save(accountOrigin)
        const destinationUpdated = this.accountRepository.save(accountDestination)

        return {
            destination: {
                balance: destinationUpdated.amount,
                id: destinationUpdated.id.toString()
            },
            origin: {
                balance: originUpdated.amount,
                id: originUpdated.id.toString()
            }
        }
    }

    private async withdrawEvent(request: TCreateEventUseCaseRequest): Promise<TCreateEventUseCaseResponse> {
        const { origin, amount } = request

        if (!origin) {
            Logger.error({
                message: 'request need a origin',
                additionalInfo: request
            })
            throw new NotFound('invalid origin')
        }

        const accountFound = this.accountRepository.find(origin)
        if (!accountFound) {
            Logger.error({
                message: 'account not found on db',
                additionalInfo: request
            })
            throw new NotFound('account not found')
        }

        const account = new Account({ ...accountFound })
        const event: Event = new Event(randomUUID().toString(), EEventType.WITHDRAW, amount)
        account.addEvent(event)
        account.validate()

        const updatedAccount = this.accountRepository.save(account)

        return {
            origin: {
                balance: updatedAccount.amount,
                id: updatedAccount.id.toString()
            }
        }
    }
}