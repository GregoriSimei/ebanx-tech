import { IAccount } from "../../domain/entities/IAccount";

export interface IAccountRepository {
    create(account: IAccount): IAccount
    save(account: IAccount): IAccount
    find(id: number): IAccount | null
}