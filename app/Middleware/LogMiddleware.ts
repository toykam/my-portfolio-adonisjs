import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

export default class LogMiddleware {
  public async handle ({request}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    Logger.info(`${request.protocol()} ${request.url()} ${request.method()}`)
    await next()
  }
}
