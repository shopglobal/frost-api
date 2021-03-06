import * as Joi from 'joi'

import { errors } from '../../errors/errors'
import { AccountsController } from '../../modules/Accounts/Accounts.controller'
import { SendEmailTo } from '../../utils/SendEmail'
import { Token } from '../Tokens'

import { getToken } from './utils/utils'

const { ResourceNotFound } = errors

export const ForgotPasswordSchema = () => ({
  email: Joi.string()
    .email()
    .required(),
})

export const setResponseStatus = (isOk: boolean) => (isOk ? 200 : ResourceNotFound.code)

export const ForgotPassword = (sendEmail: SendEmailTo, verifiedAccount: boolean, pwnedCheckerRoot: string) => async (
  ctx: any,
  next: any,
): Promise<any> => {
  const logger = ctx.logger(__dirname)

  try {
    const { email } = ctx.request.body
    const usersController = new AccountsController(ctx.logger, verifiedAccount, pwnedCheckerRoot)
    const user = await usersController.get(email)

    ctx.status = setResponseStatus(!!user)
    if (user) {
      const token = await getToken(email, Token.ForgotPassword)
      await sendEmail(email).sendForgotPassword(token)
    } else ctx.body = ResourceNotFound.message
  } catch (exception) {
    const { InternalError } = errors
    logger.error({ exception }, 'api.ForgotPassword')
    ctx.throw(InternalError.code, InternalError.message)
  }
}
