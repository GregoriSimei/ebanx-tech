import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { IGetBalanceUseCase } from "./IGetBalanceUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { IAccountRepository } from "../../../domain/repositories/IAccountRepository";
import { AccountRepositoryMock } from "../../../tests/mock/AccountRepositoryMock";
import { NotFound } from "../../../infra/http/errors/NotFound";

let repository: IAccountRepository
let useCase: IGetBalanceUseCase

describe('GetBalanceUseCase', () => {
    beforeAll(() => {
        repository = new AccountRepositoryMock()
        useCase = new GetBalanceUseCase(repository)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('when account exist should return a balance', async () => {
        const existingAccountId = 1

        const result = await useCase.execute({
            accountId: existingAccountId.toString()
        })

        expect(result).not.toBeNaN()
        expect(result).not.toBeNull()
    })

    it('when account not exist should return throw a NotFound error', async () => {
        let throwAnError = false

        const findAccoundSpy = vi.spyOn(repository, 'find').mockReturnValue(null)

        try {
            await useCase.execute({
                accountId: 'not_exist'
            })
        } catch (e) {
            throwAnError = true
            expect(e).toBeInstanceOf(NotFound)
        }
        
        expect(findAccoundSpy).toBeCalledTimes(1)
        expect(throwAnError).toBeTruthy()
    })
})