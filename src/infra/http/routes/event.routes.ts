import { Router } from "express";
import { Controller } from "../protocols/controller";
import { RouterAdapter } from "../adapters/RouterAdapter";
import { CreateEventController } from "../controllers/event/CreateEventController";

export function eventRoute(route: Router) {
    const createEventController: Controller = new CreateEventController()

    route.post('/event', RouterAdapter.adapt(createEventController).bind(createEventController))
}