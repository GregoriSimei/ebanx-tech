import { EEventType } from "domain/entities/IEvent"

export type TCreateEventUseCaseRequest = {
    type: EEventType
    amount: number
    destination?: number
    origin?: number
}

export type TCreateEventUseCaseResponse = {
    origin?: {
        id: string,
        balance: number
    }
    destination: {
        id: string,
        balance: number
    }
}
