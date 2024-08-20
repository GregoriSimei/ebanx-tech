import { EEventType, IEvent } from "./IEvent";

export enum EEventErr {
    INVALID_AMOUNT = 'invalid amount',
    INVALID_EVENT = 'invalid event'
}

export const EventInvalidAmountError = Error(EEventErr.INVALID_AMOUNT)
export const EventInvalidEventError = Error(EEventErr.INVALID_EVENT)

export class Event implements IEvent {
    amount: number;
    destination?: number | undefined;
    id: string;
    origin?: number | undefined;
    type: EEventType;

    constructor({id, type, amount, destination, origin}: IEvent) {
        this.amount = amount
        this.id = id
        this.type = type
        this.destination = destination
        this.origin = origin
    }

    valid() {
        if (this.amount < 0) {
            throw EventInvalidAmountError
        }

        if (this.destination && !this.origin) {
            throw EventInvalidEventError
        }
    }
}