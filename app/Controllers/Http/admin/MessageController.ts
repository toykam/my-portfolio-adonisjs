import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';


export default class ProjectController {

    public async index({view}: HttpContextContract) {
        return view.render('admin/pages/messages/index', {
            messages: await Database.from('messages').select('*')
        })
    }

    public async view_message({view, request}: HttpContextContract) {

        // console.log(request.param('message_id'))
        const message = await Database.from('messages').select('*').limit(1).where('message_id', request.param('message_id'))
        // console.log(message)

        return view.render('admin/pages/messages/view_message', {
            message
        })
    }

    public async mark_as_seen({request, response}: HttpContextContract) {
        const { message_id } = request.params()
        await Database.from('messages').where('message_id', message_id).update({seen: true})
        response.redirect().toRoute('admin_view_message', {message_id: message_id})
    }

    public async delete_message({request, response, session}: HttpContextContract) {
        try {
            await Database.from('messages').where('message_id', request.param('message_id')).delete()
            // ''
            session.flash('msg', 'Message deleted successfully')
            session.flash('flag', 'success')
            response.redirect().back()
        } catch (error) {
            session.flash('msg', error)
            session.flash('flag', 'danger')
            response.redirect().back()
        }

    }
}
