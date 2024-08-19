import { IAccount } from "domain/entities/IAccount";
import { IAccountRepository } from "domain/repositories/IAccountRepository";
import { DataBase } from "../Database";

enum ETable {
    TABLE = 'account'
}


export class AccountRepository implements IAccountRepository {
    constructor (private dataBase: DataBase = DataBase.init(ETable.TABLE)) {}

    create(account: Omit<IAccount, 'id'>): IAccount {
        return this.dataBase.createData(
            ETable.TABLE,
            account
        )
    }

    find(id: number): IAccount | null {
        return this.dataBase.getData(
            ETable.TABLE,
            id.toString()
        )
    }

    save(account: IAccount): IAccount {
        return this.dataBase.saveData(
            ETable.TABLE,
            account.id.toString(),
            account
        )
    }
}