import { Router } from "express";
import { Controller } from "../protocols/controller";
import { GetBalanceController } from "../controllers/balance/GetBalanceController";
import { RouterAdapter } from "../adapters/RouterAdapter";

export function balanceRoute(route: Router) {
    const getBalanceController: Controller = new GetBalanceController() 

    route.get('/balance', RouterAdapter.adapt(getBalanceController).bind(getBalanceController))
}