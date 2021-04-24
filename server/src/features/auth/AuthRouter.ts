import { Request, Response } from 'express'
import { toPublicUser } from './User'
import { login as processLogin } from './LoginService'
import { register as processRegister } from './RegisterService'
import { processError } from '../../infrastructure/Error'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../../infrastructure/Jwt'
import ms from 'ms'

const setRefreshToken = (res: Response, token: string) => {
  res.cookie('rtid', token, {
    httpOnly: true,
    path: '/refresh-token',
    /** Must be same as the refresh token exp! */
    expires: new Date(Date.now() + ms('30d'))
  })
}

export const authRoutes = {
  me(req: Request, res: Response): void {
    res.json(toPublicUser(req.env.user))
  },

  login(req: Request, res: Response): void {
    processLogin(req.env, req.body)
      .ifLeft(processError(res))
      .ifRight(({ accessToken, refreshToken }) => {
        setRefreshToken(res, refreshToken)
        res.json({ accessToken })
      })
      .run()
  },

  register(req: Request, res: Response): void {
    processRegister(req.env, req.body)
      .ifLeft(processError(res))
      .ifRight(() => {
        res.status(200).send()
      })
      .run()
  },

  refreshToken(req: Request, res: Response): void {
    verifyRefreshToken(req.cookies.rtid)
      .ifLeft(() => res.status(401).send())
      .ifRight(({ username }) => {
        setRefreshToken(res, generateRefreshToken(username))
        res.json({ accessToken: generateAccessToken(username) })
      })
  },

  logout(_: Request, res: Response): void {
    setRefreshToken(res, '')
    res.status(200).send()
  }
}
