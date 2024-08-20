import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ICreateEventUseCase } from "./ICreateEventUseCase";
import { IAccountRepository } from "../../../domain/repositories/IAccountRepository";
import { AccountRepositoryMock } from "../../../tests/mock/AccountRepositoryMock";
import { CreateEventUseCase } from "./CreateEventUseCase";
import { EEventType } from "../../../domain/entities/IEvent";
import { Account } from "../../../domain/entities/Account";
import { NotFound } from "../../../infra/http/errors/NotFound";

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

    describe('withdraw',() => {})
    
    describe('transfer',() => {})
})