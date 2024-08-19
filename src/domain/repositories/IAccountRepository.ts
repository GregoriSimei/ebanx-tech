import { IAccount } from "domain/entities/IAccount";

export interface IAccountRepository {
    create(account: Omit<IAccount, 'id'>): IAccount
    save(account: IAccount): IAccount
    find(id: number): IAccount | null
}