import express, { Express, json } from 'express'
import { Router } from './routes'
import { Logger } from '../../infra/logger/logger'

const app: Express = express()
app.use(json())

Router.setupRoutes(app)

app.listen(3000, () => {
    Logger.info({
        message: '[APP] - app is running on port 3000',
    })
})