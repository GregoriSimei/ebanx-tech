import winston from 'winston'

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

type TLoggerLog = {
    message: string
    aditionalInfo: any
}

enum EAvailableType {
    ERROR = 'error',
    INFO = 'info',
    WARN = 'warn'
}

function logMessage(availableType: EAvailableType, request: TLoggerLog) {
    const { message, aditionalInfo } = request
    logger[availableType](message, { aditionalInfo })
}

export class Logger {
    static info(request: TLoggerLog): void {
        logMessage(EAvailableType.INFO, request)
    }

    static error(request: TLoggerLog): void {
        logMessage(EAvailableType.ERROR, request)
    }

    static warn(request: TLoggerLog): void {
        logMessage(EAvailableType.WARN, request)
    }
}