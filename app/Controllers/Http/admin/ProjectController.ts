import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from "@ioc:Adonis/Core/Application";
import CreateProjectValidator from 'App/Validators/CreateProjectValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import { v4 } from "uuid";


export default class ProjectController {

    public async index({view}: HttpContextContract) {
        return view.render('admin/pages/projects/index', {
            projects: await Database.from('projects').select('*')
        })
    }

    public async new({view}: HttpContextContract) {
        return view.render('admin/pages/projects/new_project')
    }

    public async edit_project({view, request}: HttpContextContract) {

        
        return view.render('admin/pages/projects/edit_project', {
            project: await Database.from('projects').select('*').where('project_id', request.param('project_id')).then((values) => values[0])
        })
    }

    public async save_project({request, response, session}: HttpContextContract) {
        try {

            await request.validate(CreateProjectValidator)
            const {project_name, project_description, project_url} = request.body()
    
            const project_image = request.file('project_image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif'],
            })
    
            console.log(project_name, project_description, project_url)
            if (!project_image) {
                session.flash('msg', "An image is required")
                session.flash('flag', 'danger')
                response.redirect().back()
                return
            }

            
    
            if (!project_image!.isValid) {
                session.flash('msg', project_image!.errors)
                session.flash('flag', 'danger')
                response.redirect().back()
            }
            
            await project_image!.move(Application.publicPath('images/projects/'))
            console.log(project_image.filePath)
            await Database.table('projects').insert({
                project_name: project_name,
                project_description: project_description,
                project_url: project_url,
                project_image: project_image.fileName,
                project_id: v4()
            })
            response.redirect().toRoute('admin_projects')
        } catch (error) {
            console.log(error)
            session.flash('msg', "An error occurred")
            session.flash('flag', 'danger')
            response.redirect().back()
        }
    }

    public async update_project({request, response, session}: HttpContextContract) {
        try {

            await request.validate(CreateProjectValidator)
            const {project_name, project_description, project_url} = request.body()
            let imagePath = request.input('project_image_prev')
            const project_image = request.file('project_image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif'],
            })

            if (project_image) {
                console.log(project_name, project_description, project_url)
                if (!project_image) {
                    session.flash('msg', "An image is required")
                    session.flash('flag', 'danger')
                    response.redirect().back()
                    return
                }
    
                
        
                if (!project_image!.isValid) {
                    session.flash('msg', project_image!.errors)
                    session.flash('flag', 'danger')
                    response.redirect().back()
                }
                
                await project_image!.move(Application.publicPath('images/projects/'))
                console.log(project_image.filePath)
                imagePath = project_image.fileName!
            }
    
            await Database.from('projects').where({
                project_id: request.param('project_id')
            }).update({
                project_name: project_name,
                project_description: project_description,
                project_url: project_url,
                project_image: imagePath,
            })
            response.redirect().toRoute('admin_projects')
        } catch (error) {
            console.log(error)
            session.flash('msg', "An error occurred")
            session.flash('flag', 'danger')
            response.redirect().back()
        }
    }

    public async delete_project({request, response, session}: HttpContextContract) {
        try {
            await Database.from('projects').where('project_id', request.param('project_id')).delete()
            // ''
            session.flash('msg', 'Project deleted successfully')
            session.flash('flag', 'success')
            response.redirect().back()
        } catch (error) {
            session.flash('msg', error)
            session.flash('flag', 'danger')
            response.redirect().back()
        }

    }
}
