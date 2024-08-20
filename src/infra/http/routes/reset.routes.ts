import { Router } from "express";
import { Controller } from "../protocols/controller";
import { RouterAdapter } from "../adapters/RouterAdapter";
import { ResetDataController } from "../controllers/reset/ResetDataController";

export function resetRoute(route: Router) {
    const resetDataController: Controller = new ResetDataController()

    route.post('/reset', RouterAdapter.adapt(resetDataController).bind(resetDataController))
}