import { Request, Response, NextFunction } from 'express'
import { Nothing } from 'purify-ts/Maybe'
import { MaybeAsync } from 'purify-ts/MaybeAsync'
import {
  getAccessTokenFromRequest,
  verifyAccessToken
} from '../../infrastructure/Jwt'
import { findUserByUsername } from './UserRepo'

export const optionalUser = (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  MaybeAsync.liftMaybe(getAccessTokenFromRequest(req))
    .chain(async authHeader => verifyAccessToken(authHeader).toMaybe())
    .chain(({ username }) =>
      findUserByUsername(username, req.env.pool).orDefault(Nothing)
    )
    .ifJust(user => {
      req.env.user = user
    })
    .run()
    .then(() => next())
}

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  optionalUser(req, res, () => {
    if (!req.env.user) {
      res.status(401).send()
    } else {
      next()
    }
  })
}
