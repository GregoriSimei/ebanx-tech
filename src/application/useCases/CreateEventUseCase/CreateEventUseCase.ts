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

        let account: Account = this.createAccountIfNotExist(destination)
        account = this.createAndValidateEvent(account, EEventType.DEPOSIT, amount)
    
        const accountUpdated = this.accountRepository.save(account)
        
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

        let accountOrigin: Account = this.getAccount(origin)
        accountOrigin = this.createAndValidateEvent(accountOrigin, EEventType.TRANSFER, amount, origin, destination)

        let accountDestination: Account = this.createAccountIfNotExist(destination)
        accountDestination = this.createAndValidateEvent(accountDestination, EEventType.DEPOSIT, amount, origin, destination)

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

        let account: Account = this.getAccount(origin)
        account = this.createAndValidateEvent(account, EEventType.WITHDRAW, amount)

        const updatedAccount = this.accountRepository.save(account)

        return {
            origin: {
                balance: updatedAccount.amount,
                id: updatedAccount.id.toString()
            }
        }
    }

    private getAccount(id: number): Account {
        const accountFound = this.accountRepository.find(id)
        if (!accountFound) {
            Logger.error({
                message: 'account not found',
                additionalInfo: { id }
            })
            throw new NotFound('account not found')
        }
        const account = new Account({ ...accountFound })

        return account
    }

    private createAccountIfNotExist(id: number): Account {
        const accountFound = this.accountRepository.find(id)
        const account: Account = accountFound ? 
            new Account({ ...accountFound }) : 
            new Account({ id })
        return account
    }

    private createAndValidateEvent(account: Account, type: EEventType, amount: number, origin?: number, destination?: number): Account {
        const eventId = randomUUID().toString()
        const originEvent: Event = new Event({id: eventId, type, amount, origin, destination})
        account.addEvent(originEvent)
        account.validate()
        return account
    }
}