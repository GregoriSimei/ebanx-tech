import { Express, Router as ExpressRouter } from 'express'

export class Router {
    static setupRoutes(app: Express) {
        const router = ExpressRouter()

        app.use(router)
    }
}