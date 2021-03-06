import { describe } from 'riteway'

import { logger } from '../../../tests/helpers/logger'
import { PasswordChangeToken } from './PasswordChangeToken'

describe('PasswordChangeToken()', async (assert: any) => {
  {
    const ctx = {
      state: {
        tokenData: { data: { meta: { name: 'foo' } } },
      },
      status: 1,
      logger,
    }

    const pwnedCheckerRoot = ''
    const accountVerified = false
    const sendEmail = (email: string) => {
      return {
        changePassword: () => Promise.resolve(),
        sendForgotPassword: () => Promise.resolve(),
        sendVerified: () => Promise.resolve(),
      }
    }

    await PasswordChangeToken(sendEmail, accountVerified, pwnedCheckerRoot)(ctx, (): any => undefined)

    assert({
      given: 'a missing password change token in the context state',
      should: 'set the status property of context to 500',
      actual: ctx.status,
      expected: 500,
    })
  }
})
