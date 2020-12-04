import { Request, Response, NextFunction } from 'express'
import { Maybe, Nothing } from 'purify-ts/Maybe'
import { MaybeAsync } from 'purify-ts/MaybeAsync'
import { verifyJwt } from '../../infrastructure/Jwt'
import { jwtSecret } from '../../infrastructure/Secrets'
import { findUserByUsername } from './UserRepo'

export const optionalUser = (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  MaybeAsync.liftMaybe(Maybe.fromNullable(req.header('Authorization')))
    .chain(async authHeader => verifyJwt(authHeader).toMaybe())
    .chain(username =>
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
