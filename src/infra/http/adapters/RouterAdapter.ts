import { NextFunction, Response, Request } from "express";
import { Controller } from "../protocols/controller";
import { HttpRequest } from "../protocols/http";
import { HTTPErrorHandler } from "../errors/HTTPErrorHandler";

export class RouterAdapter {
  public static adapt(controller: Controller) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const httpRequest: HttpRequest = {
        body:    req.body,
        params:  req.params,
        query:   req.query,
        headers: req.headers,
      }
  
      try {
          const httpResponse = await controller.handle(httpRequest)
      
          const responseType = httpResponse.type ?? 'json'

          if (responseType == "json") res.status(httpResponse.statusCode).json(httpResponse.body)
          else res.status(httpResponse.statusCode).send(httpResponse.body)
          
          next()
      } catch (e) {
        HTTPErrorHandler.handle(e, req, res, next)
      }
    }
  }
}