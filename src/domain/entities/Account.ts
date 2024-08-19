import { IAccount } from "./IAccount"
import { EEventType, IEvent } from "./IEvent"

export enum EAccountErr {
    INVALID_AMOUNT = 'invalid amount',
    INVALID_DEPOSIT = 'invalid deposit',
    INVALID_TRANSFER = 'invalid transfer',
    INVALID_WITHDRAW = 'invalid withdraw',
    INVALID_TYPE = 'Invalid event type'
}

export const AccountInvalidAmountError = Error(EAccountErr.INVALID_AMOUNT)
export const AccountInvalidDepositError = Error(EAccountErr.INVALID_DEPOSIT)
export const AccountInvalidTransferError = Error(EAccountErr.INVALID_TRANSFER)
export const AccountInvalidWithdrawError = Error(EAccountErr.INVALID_WITHDRAW)
export const AccountInvalidTypeError = Error(EAccountErr.INVALID_AMOUNT)


export class Account implements IAccount {
    amount: number
    events: IEvent[]
    id: number

    constructor({ id = 0, events = [], amount = 0 }: Partial<IAccount>) {
        this.id = id
        this.events = events
        this.amount = amount
    }

    validate() {
        if (this.amount < 0) throw Error(EAccountErr.INVALID_AMOUNT)
    }

    addEvent(event: IEvent) {
        const { amount, type } = event

        switch (type) {
            case EEventType.DEPOSIT:
                if (amount < 0) throw AccountInvalidAmountError
                this.amount += amount
                break
            case EEventType.TRANSFER:
                if (amount < 0 || (this.amount - amount) < 0) throw AccountInvalidTransferError
                this.amount -= amount
                break
            case EEventType.WITHDRAW:
                if ((this.amount - amount) < 0) throw AccountInvalidWithdrawError
                this.amount -= amount
                break
            default:
                throw AccountInvalidTypeError
        }

        this.events.push(event)
    }
}