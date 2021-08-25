import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminAuth {
  public async handle ({session, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (!session.get('admin_logged_in', false)) {
      session.flash('msg', 'Please login to continue')
      session.flash('flag', 'warning')
      response.redirect().toRoute('admin_login_page')
    }
    await next()
  }
}
