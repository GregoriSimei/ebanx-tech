import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ICreateEventUseCase } from "./ICreateEventUseCase";
import { IAccountRepository } from "../../../domain/repositories/IAccountRepository";
import { AccountRepositoryMock } from "../../../tests/mock/AccountRepositoryMock";
import { CreateEventUseCase } from "./CreateEventUseCase";
import { EEventType } from "../../../domain/entities/IEvent";
import { Account } from "../../../domain/entities/Account";
import { NotFound } from "../../../infra/http/errors/NotFound";
import { Logger } from "../../../infra/logger/logger";

let repository: IAccountRepository
let useCase: ICreateEventUseCase 

describe('CreateEventUseCase', () => {

    beforeAll(() => {
        repository = new AccountRepositoryMock()
        useCase = new CreateEventUseCase(repository)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('deposit',() => {
        it('when some account not exist should create the account with the deposit', async () => {
            const findAccountSpy = vi.spyOn(repository, 'find').mockReturnValue(null)
            const saveAccountSpy = vi.spyOn(repository, 'save')

            const expectedAmount = 100
            const destination = 1
            const result = await useCase.execute({
                amount: expectedAmount,
                destination,
                type: EEventType.DEPOSIT,
            })

            expect(result.destination?.balance).toBe(expectedAmount)
            expect(result.destination?.id).toBe(destination.toString())
            expect(result.origin).toBeUndefined()
            expect(saveAccountSpy).toBeCalledTimes(1)
            expect(findAccountSpy).toBeCalledTimes(1)
        })

        it('when some account exist should increase the amount with deposit', async () => {
            const destination = 1
            const defaultAmount = 100
            const amountToIncrease = 100 

            const foundAccount = new Account({
                id: destination,
                amount: defaultAmount
            })

            const findAccountSpy = vi.spyOn(repository, 'find').mockReturnValue(foundAccount)
            const saveAccountSpy = vi.spyOn(repository, 'save')

            const result = await useCase.execute({
                amount: amountToIncrease,
                destination,
                type: EEventType.DEPOSIT,
            })
            const expectedAmount = defaultAmount + amountToIncrease

            expect(result.destination?.balance).toBe(expectedAmount)
            expect(result.destination?.id).toBe(destination.toString())
            expect(result.origin).toBeUndefined()
            expect(saveAccountSpy).toBeCalledTimes(1)
            expect(findAccountSpy).toBeCalledTimes(1)
        })

        it('when dont have a destination on request should throw a NotFound error', async () => {
            let throwAnError = false

            try {
                await useCase.execute({
                    amount: 100,
                    type: EEventType.DEPOSIT
                })
            } catch (e) {
                throwAnError = true
                expect(e).toBeInstanceOf(NotFound)
            }
        
            expect(throwAnError).toBeTruthy()
        })
    })

    describe('withdraw',() => {
        it('when some account exist should decrease the amount with withdraw', async () => {
            const origin = 1
            const defaultAmount = 100
            const amountToDecrease = 100 

            const foundAccount = new Account({
                id: origin,
                amount: defaultAmount
            })

            const findAccountSpy = vi.spyOn(repository, 'find').mockReturnValue(foundAccount)
            const saveAccountSpy = vi.spyOn(repository, 'save')

            const result = await useCase.execute({
                amount: amountToDecrease,
                origin,
                type: EEventType.WITHDRAW,
            })
            const expectedAmount = defaultAmount - amountToDecrease

            expect(result.origin?.balance).toBe(expectedAmount)
            expect(result.origin?.id).toBe(origin.toString())
            expect(result.destination).toBeUndefined()
            expect(saveAccountSpy).toBeCalledTimes(1)
            expect(findAccountSpy).toBeCalledTimes(1)
        })

        it('when the origin account not found should throw a NotFound error', async () => {
            let throwAnError = false

            const findAccoundSpy = vi.spyOn(repository, 'find').mockReturnValue(null)

            try {
                await useCase.execute({
                    origin: 1,
                    amount: 100,
                    type: EEventType.WITHDRAW
                })
            } catch (e) {
                throwAnError = true
                expect(e).toBeInstanceOf(NotFound)
            }
        
            expect(findAccoundSpy).toBeCalledTimes(1)
            expect(throwAnError).toBeTruthy()
        })

        it('when dont have a origin on request should throw a NotFound error', async () => {
            let throwAnError = false

            try {
                await useCase.execute({
                    amount: 100,
                    type: EEventType.WITHDRAW
                })
            } catch (e) {
                throwAnError = true
                expect(e).toBeInstanceOf(NotFound)
            }
        
            expect(throwAnError).toBeTruthy()
        })
    })
    
    describe('transfer',() => {
        it('when dont have a origin on request should throw a NotFound error', async () => {
            let throwAnError = false

            try {
                await useCase.execute({
                    destination: 1,
                    amount: 100,
                    type: EEventType.WITHDRAW,
                    origin: undefined
                })
            } catch (e) {
                throwAnError = true
                expect(e).toBeInstanceOf(NotFound)
            }
        
            expect(throwAnError).toBeTruthy()
        })

        it('when dont have a destination on request should throw a NotFound error', async () => {
            let throwAnError = false

            try {
                await useCase.execute({
                    destination: undefined,
                    amount: 100,
                    type: EEventType.TRANSFER,
                    origin: 1
                })
            } catch (e) {
                throwAnError = true
                expect(e).toBeInstanceOf(NotFound)
            }
        
            expect(throwAnError).toBeTruthy()
        })

        it('when the origin account not found should throw a NotFound error', async () => {
            let throwAnError = false

            const findAccoundSpy = vi.spyOn(repository, 'find').mockReturnValue(null)

            try {
                await useCase.execute({
                    origin: 1,
                    amount: 100,
                    type: EEventType.TRANSFER,
                    destination: 2
                })
            } catch (e) {
                throwAnError = true
                expect(e).toBeInstanceOf(NotFound)
            }
        
            expect(findAccoundSpy).toBeCalledTimes(1)
            expect(throwAnError).toBeTruthy()
        })

        it('when the destination account not found should create the account', async () => {
            const origin = 1
            const defaultAmount = 100

            const foundAccount = new Account({
                id: origin,
                amount: defaultAmount
            })

            const findAccoundSpy = vi.spyOn(repository, 'find').mockReturnValueOnce(foundAccount).mockReturnValueOnce(null)
            const saveAccoundSpy = vi.spyOn(repository, 'save')

            await useCase.execute({
                origin: 1,
                amount: 100,
                type: EEventType.TRANSFER,
                destination: 2
            })
        
            expect(findAccoundSpy).toBeCalledTimes(2)
            expect(saveAccoundSpy).toBeCalledTimes(2)
        })

        it('when found the destination and origin account should decrease from origin and increase from destination', async () => {
            const origin = 1
            const defaultOriginAmount = 100
            const originAccount = new Account({
                id: origin,
                amount: defaultOriginAmount
            })

            const destination = 2
            const defaultDestinationAmount = 100
            const destinationAccount = new Account({
                id: destination,
                amount: defaultDestinationAmount
            })

            const findAccoundSpy = vi.spyOn(repository, 'find').mockReturnValueOnce(originAccount).mockReturnValueOnce(destinationAccount)

            const amoutToTransfer = 100
            const result = await useCase.execute({
                origin,
                amount: amoutToTransfer,
                type: EEventType.TRANSFER,
                destination
            })
        
            const expectedOriginAmount = defaultOriginAmount - amoutToTransfer
            const expectedDestinationAmount = defaultDestinationAmount + amoutToTransfer

            expect(findAccoundSpy).toBeCalledTimes(2)
            expect(result.destination?.balance).toBe(expectedDestinationAmount)
            expect(result.destination?.id).toBe(destination.toString())
            expect(result.origin?.balance).toBe(expectedOriginAmount)
            expect(result.origin?.id).toBe(origin.toString())
        })
    })
})