import { EHttpStatusCode } from "./EHttpStatusCode";
import { HttpResponse } from "./http";

export function ok(data: any): HttpResponse {
    return {
        body: data,
        statusCode: EHttpStatusCode.OK
    }
}

export function okNoData(): HttpResponse {
    return {
        statusCode: EHttpStatusCode.OK
    }
}

export function created(data: any): HttpResponse {
    return {
        body: data,
        statusCode: EHttpStatusCode.CREATED
    }
}