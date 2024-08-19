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

            if (!availableEvent) throw Error('invalid event')
            
            return await availableEvent(request)
        } catch (e) {
            console.log(e)
            throw new NotFound((0).toString())
        }
    }

    async depositEvent(request: TCreateEventUseCaseRequest): Promise<TCreateEventUseCaseResponse> {
        const { destination, amount } = request

        if (!destination) {
            Logger.error({
                message: 'request need a destination',
                aditionalInfo: request
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

    async transferEvent(request: TCreateEventUseCaseRequest): Promise<TCreateEventUseCaseResponse> {
        throw Error()
    }

    async withdrawEvent(request: TCreateEventUseCaseRequest): Promise<TCreateEventUseCaseResponse> {
        throw Error()
    }
}