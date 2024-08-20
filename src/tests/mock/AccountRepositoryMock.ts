import { IAccount } from "domain/entities/IAccount";
import { IAccountRepository } from "domain/repositories/IAccountRepository";

export class AccountRepositoryMock implements IAccountRepository {
    find(id: number): IAccount | null {
        return {
            amount: 10,
            events: [],
            id
        }
    }

    save(account: IAccount): IAccount {
        return account
    }
}