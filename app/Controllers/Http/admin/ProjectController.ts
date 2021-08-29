import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from "@ioc:Adonis/Core/Application";
import CreateProjectValidator from 'App/Validators/CreateProjectValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import { v4 } from "uuid";
import cloudinary from 'App/Services/CloudinaryService';


export default class ProjectController {

    public async index({view}: HttpContextContract) {
        return view.render('admin/pages/projects/index', {
            projects: await Database.from('projects').select('*')
        })
    }

    public async new({view}: HttpContextContract) {
        return view.render('admin/pages/projects/new_project', {
            skills: await Database.from('skills').select('*'),
            services: await Database.from('services').select('*')
        })
    }

    public async edit_project({view, request}: HttpContextContract) {

        
        return view.render('admin/pages/projects/edit_project', {
            project: await Database.from('projects').select('*').where('project_id', request.param('project_id')).then((values) => values[0]),
            skills: await Database.from('skills').select('*'),
            services: await Database.from('services').select('*')
        })
    }

    public async save_project({request, response, session}: HttpContextContract) {
        try {

            await request.validate(CreateProjectValidator)
            const {project_name, project_description, project_url, service_id, skill_ids} = request.body()

            console.log(skill_ids)

            // return

            
            const project_image = request.file('project_image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif'],
            })
            

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

            const uploadRes = await cloudinary.v2.uploader.upload(project_image!.tmpPath, {
                folder: 'projects', overwrite: true
            })
            
            // await project_image!.move(Application.publicPath('images/projects/'))
            // console.log(project_image.filePath)
            await Database.table('projects').insert({
                project_name: project_name,
                project_description: project_description,
                project_url: project_url,
                project_image: uploadRes.secure_url,
                project_id: v4(),
                skill_ids: Array.isArray(skill_ids) ? skill_ids.join(',') : skill_ids+',',
                service_id: service_id
            })
            session.flash('msg', "Project created successfully")
            session.flash('flag', 'success')
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
            const {project_name, project_description, project_url, service_id, skill_ids} = request.body()
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
                
                // await project_image!.move(Application.publicPath('images/projects/'))
                const cloudinaryRes = await cloudinary.v2.uploader.upload(project_image.tmpPath, {
                    folder: 'projects', overwrite: true
                })
                // console.log(project_image.filePath)
                imagePath = cloudinaryRes.secure_url
            }
    
            await Database.from('projects').where({
                project_id: request.param('project_id')
            }).update({
                project_name: project_name,
                project_description: project_description,
                project_url: project_url,
                project_image: imagePath,
                skill_ids: Array.isArray(skill_ids) ? skill_ids.join(',') : skill_ids+',',
                service_id: service_id
            })
            session.flash('msg', "Project updated successfully")
            session.flash('flag', 'success')
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
