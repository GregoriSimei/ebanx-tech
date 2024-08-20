import { DataBase } from "../../../infra/persistence/Database";
import { IResetDataUseCase } from "./IResetDataUSeCase";

export class ResetDataUseCase implements IResetDataUseCase {
    
    constructor(
        private dataBase: DataBase = DataBase.init('account')
    ) {}

    async execute(request: void): Promise<void> {
        this.dataBase.reset('account')
    }
}