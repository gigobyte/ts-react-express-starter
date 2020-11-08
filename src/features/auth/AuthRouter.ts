import { Request, Response } from 'express'
import { toPublicUser } from './User'
import { login as processLogin, LoginError } from './LoginService'
import { register as processRegister, RegisterError } from './RegisterService'

export const authRoutes = {
  me(req: Request, res: Response): void {
    res.json(toPublicUser(req.env.user))
  },

  login(req: Request, res: Response): void {
    processLogin(req.env, req.body)
      .ifLeft(code => {
        switch (code) {
          case LoginError.UserNotFound:
            return res.status(400).json({ code })

          default:
            return res.status(500).json({ code })
        }
      })
      .ifRight(jwt => {
        res.json({ jwt })
      })
      .run()
  },

  register(req: Request, res: Response): void {
    processRegister(req.env, req.body)
      .ifLeft(code => {
        switch (code) {
          case RegisterError.UserAlreadyExists:
            return res.status(400).json({ code })

          default:
            return res.status(500).json({ code })
        }
      })
      .ifRight(jwt => {
        console.log('right!')
        res.json({ jwt })
      })
      .run()
  }
}
