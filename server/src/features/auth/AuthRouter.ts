import { Request, Response } from 'express'
import { toPublicUser } from './User'
import { login as processLogin } from './LoginService'
import { register as processRegister } from './RegisterService'
import { processError } from '../../infrastructure/Error'

export const authRoutes = {
  me(req: Request, res: Response): void {
    res.json(toPublicUser(req.env.user))
  },

  login(req: Request, res: Response): void {
    processLogin(req.env, req.body)
      .ifLeft(processError(res))
      .ifRight(jwt => {
        res.json({ jwt })
      })
      .run()
  },

  register(req: Request, res: Response): void {
    processRegister(req.env, req.body)
      .ifLeft(processError(res))
      .ifRight(jwt => {
        res.json({ jwt })
      })
      .run()
  }
}
