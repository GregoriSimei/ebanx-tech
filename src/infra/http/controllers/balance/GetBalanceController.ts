import { Controller } from "../../../../infra/http/protocols/controller";
import { HttpRequest, HttpResponse } from "../../../../infra/http/protocols/http";
import { ok } from "../../../../infra/http/protocols/httpResponses";
import { IGetBalanceUseCase } from "../../../../application/useCases/GetBalanceUseCase/IGetBalanceUseCase";
import { GetBalanceUseCase } from "../../../../application/useCases/GetBalanceUseCase/GetBalanceUseCase";

export class GetBalanceController implements Controller {

    constructor(
        private getBalanceUseCase: IGetBalanceUseCase = new GetBalanceUseCase()
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const accountId = httpRequest.query.account_id as string
        const result = await this.getBalanceUseCase.execute({ accountId })

        return ok(result)
    }
}