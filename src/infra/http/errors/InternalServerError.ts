import { EHttpStatusCode } from "../protocols/EHttpStatusCode";
import { HttpError } from "./HTTPError";

export class InternalServerError extends HttpError {
    constructor(message: string, aditionalInfo?:any) {
        super(EHttpStatusCode.INTERNAL_SERVER_ERROR, message, aditionalInfo)
    }
}