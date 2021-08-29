import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from "@ioc:Adonis/Core/Application";
import Database from '@ioc:Adonis/Lucid/Database';
import { v4 } from "uuid";
import CreateServiceValidator from 'App/Validators/CreateServiceValidator';
import cloudinary from 'App/Services/CloudinaryService';


export default class ServiceController {

    public async index({view}: HttpContextContract) {
        return view.render('admin/pages/services/index', {
            services: await Database.from('services').select('*')
        })
    }

    public async new({view}: HttpContextContract) {
        return view.render('admin/pages/services/new_service')
    }

    public async edit_service({view, request}: HttpContextContract) {

        
        return view.render('admin/pages/services/edit_service', {
            service: await Database.from('services').select('*').where('service_id', request.param('service_id')).then((values) => values[0])
        })
    }

    public async save_service({request, response, session}: HttpContextContract) {
        try {

            await request.validate(CreateServiceValidator)
            const {service_name, service_description,} = request.body()
            const service_id = v4();
            const service_image = request.file('service_image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif'],
            })
    
            console.log(service_name, service_description,)
            if (!service_image) {
                session.flash('msg', "An image is required")
                session.flash('flag', 'danger')
                response.redirect().withQs().back()
                return
            }

            
    
            if (!service_image!.isValid) {
                session.flash('msg', service_image!.errors)
                session.flash('flag', 'danger')
                response.redirect().withQs().back()
            }
            
            // await service_image!.move(Application.publicPath('images/services/'), {name: `${service_id}.png`})
            // console.log(service_image.filePath)
            const uploadRes = await cloudinary.v2.uploader.upload(service_image!.tmpPath, {
                folder: 'services/'+service_id, overwrite: true
            })
            await Database.table('services').insert({
                service_name: service_name,
                service_description: service_description,
                service_image: uploadRes.secure_url,
                service_id
            })
            response.redirect().toRoute('admin_services')
        } catch (error) {
            console.log(error)
            session.flash('msg', "An error occurred")
            session.flash('flag', 'danger')
            response.redirect().withQs().back()
        }
    }

    public async update_service({request, response, session}: HttpContextContract) {
        try {

            await request.validate(CreateServiceValidator)
            const {service_name, service_description,} = request.body()
            const {service_id} = request.params()
            let imagePath = request.input('service_image_prev')
            const service_image = request.file('service_image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif'],
            })

            if (service_image) {
                console.log(service_name, service_description,)
                if (!service_image) {
                    session.flash('msg', "An image is required")
                    session.flash('flag', 'danger')
                    response.redirect().withQs().back()
                    return
                }
    
                if (!service_image!.isValid) {
                    session.flash('msg', service_image!.errors)
                    session.flash('flag', 'danger')
                    response.redirect().withQs().back()
                }
                
                // await service_image!.move(Application.publicPath('images/services/'))
                // console.log(service_image.filePath)
                const uploadRes = await cloudinary.v2.uploader.upload(service_image!.tmpPath, {
                    folder: 'services/'+service_id, overwrite: true
                })
                imagePath = uploadRes.secure_url
            }
    
            await Database.from('services').where({
                service_id
            }).update({
                service_name: service_name,
                service_description: service_description,
                service_image: imagePath,
            })
            response.redirect().toRoute('admin_services')
        } catch (error) {
            console.log(error)
            session.flash('msg', "An error occurred")
            session.flash('flag', 'danger')
            response.redirect().withQs().back()
        }
    }

    public async delete_service({request, response, session}: HttpContextContract) {
        try {
            await Database.from('services').where('service_id', request.param('service_id')).delete()
            // ''
            session.flash('msg', 'Project deleted successfully')
            session.flash('flag', 'success')
            response.redirect().toRoute('admin_services')
        } catch (error) {
            session.flash('msg', error)
            session.flash('flag', 'danger')
            response.redirect().withQs().back()
        }

    }
}
