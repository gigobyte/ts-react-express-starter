import winston, { format } from 'winston'

export const logger = winston.createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [new winston.transports.Console()]
})

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ filename: 'error.log' }))
}
