import { EHttpStatusCode } from "../protocols/EHttpStatusCode";
import { HttpError } from "./HTTPError";

export class NotFound extends HttpError {
    constructor(message: string, aditionalInfo?:any) {
        super(EHttpStatusCode.NOT_FOUND, message, aditionalInfo)
    }
}