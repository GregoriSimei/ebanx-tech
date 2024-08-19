export enum EEventType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
}

export interface IEvent {
    id: string
    type: EEventType
    amount: number
    origin?: number
    destination?: number
}