import { Express, Router as ExpressRouter } from 'express'
import { Routes } from '../../infra/http/routes/Routes'

export class Router {
    static setupRoutes(app: Express) {
        const router = ExpressRouter()

        Routes.balanceRoutes(router)
        Routes.eventRoutes(router)
        Routes.resetRoutes(router)

        app.use(router)
    }
}