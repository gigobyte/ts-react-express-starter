import { Response } from 'express'
import { CustomError } from 'ts-custom-error'
import { logger } from './Logger'

export interface ApplicationError extends Error {
  /** What HTTP status code to respond with */
  status: number
  /**
   * Error code to return in the response,
   * used to conceal implementation details (error messages, stack traces)
   * while still providing a code that can be traced to specific logs
   * */
  code: string
  /** Whether the error should be logged, true for unexpected errors, false for bussiness logic errors */
  log: boolean
}

export class ApplicationError {}

export const processError = (res: Response) => (
  err: ApplicationError
): void => {
  if (err.log) {
    logger.error(err)
  }

  res.status(err.status).json({ code: err.code })
}

// General errors

export class InvalidRequest extends CustomError implements ApplicationError {
  status = 500
  code = 'InvalidRequest'
  log = false
}

export class ValidationFailed extends CustomError implements ApplicationError {
  status = 500
  code = 'ValidationFailed'
  log = false
}
