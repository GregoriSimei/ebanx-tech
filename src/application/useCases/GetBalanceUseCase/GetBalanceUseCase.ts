import { IAccountRepository } from "../../../domain/repositories/IAccountRepository";
import { IGetBalanceUseCase } from "./IGetBalanceUseCase";
import { TGetBalanceUseCaseRequest } from "./TGetBalanceUseCase";
import { AccountRepository } from "../../../infra/persistence/repository/AccountRepository";
import { NotFound } from "../../../infra/http/errors/NotFound";
import { Logger } from "infra/logger/logger";

export class GetBalanceUseCase implements IGetBalanceUseCase {

    constructor(
        private accountRepository: IAccountRepository = new AccountRepository()
    ) {}

    async execute(request: TGetBalanceUseCaseRequest): Promise<number> {
        const { accountId } = request

        const accountFound = this.accountRepository.find(parseInt(accountId))
        if (!accountFound) {
            Logger.error({
                message: 'account not found',
                additionalInfo: request
            })
            throw new NotFound((0).toString())
        }

        return accountFound.amount
    }
}