import { EHttpStatusCode } from "./EHttpStatusCode";
import { HttpResponse } from "./http";

export function ok(data: any): HttpResponse {
    return {
        body: data,
        statusCode: EHttpStatusCode.OK
    }
}