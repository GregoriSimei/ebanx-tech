import { IEvent } from "./IEvent"


export interface IAccount {
    id: number
    events: IEvent[]
    amount: number
}