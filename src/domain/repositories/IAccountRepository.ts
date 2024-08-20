import { IAccount } from "../../domain/entities/IAccount";

export interface IAccountRepository {
    save(account: IAccount): IAccount
    find(id: number): IAccount | null
}