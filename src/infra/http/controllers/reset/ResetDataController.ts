import { IResetDataUseCase } from "../../../../application/useCases/ResetDataUseCase/IResetDataUSeCase";
import { Controller } from "../../../../infra/http/protocols/controller";
import { HttpRequest, HttpResponse } from "../../../../infra/http/protocols/http";
import { okNoData } from "../../../../infra/http/protocols/httpResponses";
import { ResetDataUseCase } from "../../../../application/useCases/ResetDataUseCase/ResetDataUseCase";

export class ResetDataController implements Controller {

    constructor(
        private resetDataUseCase: IResetDataUseCase = new ResetDataUseCase()
    ) {}

    async handle(_: HttpRequest): Promise<HttpResponse> {
        await this.resetDataUseCase.execute()
        return okNoData()
    }
}