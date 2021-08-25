import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {

    public async login({view}: HttpContextContract) {
    
        return view.render('admin/pages/auth/login')
    }

    public async login_post({request, session, response}: HttpContextContract) {
        const { email, password } = request.only(['email', 'password'])
        if (email == 'toykam@toykam.com' && password == 'hello') {
            session.put('admin_logged_in', true)
            session.put('admin_email', email)
            response.redirect().toRoute('admin_home_page')
        } else {
            session.flash('msg', 'Incorrect password')
            session.flash('flag', 'danger')
            response.redirect().back()
        }
    }
}
