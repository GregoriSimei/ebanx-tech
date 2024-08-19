import { ICreateEventUseCase } from "../../../../application/useCases/CreateEventUseCase/ICreateEventUseCase";
import { Controller } from "../../../../infra/http/protocols/controller";
import { HttpRequest, HttpResponse } from "../../../../infra/http/protocols/http";
import { created } from "../../../../infra/http/protocols/httpResponses";
import { CreateEventUseCase } from "../../../../application/useCases/CreateEventUseCase/CreateEventUseCase";

export class CreateEventController implements Controller {

    constructor(
        private createEventUseCase: ICreateEventUseCase = new CreateEventUseCase()
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const body = httpRequest.body
        const result = await this.createEventUseCase.execute(body)

        return created(result)
    }
} 