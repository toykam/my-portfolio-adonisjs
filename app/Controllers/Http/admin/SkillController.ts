import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import { v4 } from "uuid";
import CreateSkillValidator from 'App/Validators/CreateSkillValidator';
import cloudinary from 'App/Services/CloudinaryService';


export default class SkillController {

    public async index({view}: HttpContextContract) {
        return view.render('admin/pages/skills/index', {
            skills: await Database.from('skills').select('*')
        })
    }

    public async new({view}: HttpContextContract) {
        return view.render('admin/pages/skills/new_skill')
    }

    public async edit_skill({view, request}: HttpContextContract) {

        
        return view.render('admin/pages/skills/edit_skill', {
            skill: await Database.from('skills').select('*').where('skill_id', request.param('skill_id')).then((values) => values[0])
        })
    }

    public async save_skill({request, response, session}: HttpContextContract) {
        try {

            await request.validate(CreateSkillValidator)
            const {skill_name, skill_description, learn_more_link, proficiency, position} = request.body()
            const skill_id = v4();
            const skill_image = request.file('skill_image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif'],
            })
    
            console.log(skill_name, skill_description, learn_more_link)
            if (!skill_image) {
                session.flash('msg', "An image is required")
                session.flash('flag', 'danger')
                response.redirect().withQs().back()
                return
            }

            
    
            if (!skill_image!.isValid) {
                session.flash('msg', skill_image!.errors)
                session.flash('flag', 'danger')
                response.redirect().withQs().back()
            }
            
            // await skill_image!.move(Application.publicPath('images/skills/'), {name: `${skill_id}.png`})
            const uploadRes = await cloudinary.v2.uploader.upload(skill_image!.tmpPath, {
                folder: 'skills/'+skill_id, overwrite: true
            })
            // console.log(skill_image.filePath)
            await Database.table('skills').insert({
                skill_name: skill_name,
                skill_description: skill_description,
                learn_more_link: learn_more_link,
                skill_image_url: uploadRes.secure_url,
                proficiency: proficiency,
                position: position,
                skill_id
            })
            response.redirect().toRoute('admin_skills')
        } catch (error) {
            console.log(error)
            session.flash('msg', "An error occurred")
            session.flash('flag', 'danger')
            response.redirect().withQs().back()
        }
    }

    public async update_skill({request, response, session}: HttpContextContract) {
        try {

            await request.validate(CreateSkillValidator)
            const {skill_name, skill_description, learn_more_link, proficiency, position} = request.body()
            const { skill_id } = request.params()
            let imagePath = request.input('skill_image_prev')
            const skill_image = request.file('skill_image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif'],
            })

            if (skill_image) {
                console.log(skill_name, skill_description, learn_more_link)
                if (!skill_image) {
                    session.flash('msg', "An image is required")
                    session.flash('flag', 'danger')
                    response.redirect().withQs().back()
                    return
                }
    
                if (!skill_image!.isValid) {
                    session.flash('msg', skill_image!.errors)
                    session.flash('flag', 'danger')
                    response.redirect().withQs().back()
                }
                
                // await skill_image!.move(Application.publicPath('images/skills/'))
                const uploadRes = await cloudinary.v2.uploader.upload(skill_image!.tmpPath, {
                    folder: 'skills/'+skill_id, overwrite: true
                })
                // console.log(skill_image.filePath)
                imagePath = uploadRes.secure_url!
            }
    
            await Database.from('skills').where({
                skill_id
            }).update({
                skill_name: skill_name,
                skill_description: skill_description,
                learn_more_link: learn_more_link,
                skill_image_url: imagePath,
                proficiency: proficiency,
                position: position,
            })
            response.redirect().toRoute('admin_skills')
        } catch (error) {
            console.log(error)
            session.flash('msg', "An error occurred")
            session.flash('flag', 'danger')
            response.redirect().withQs().back()
        }
    }

    public async delete_skill({request, response, session}: HttpContextContract) {
        try {
            await Database.from('skills').where('skill_id', request.param('skill_id')).delete()
            // ''
            session.flash('msg', 'Project deleted successfully')
            session.flash('flag', 'success')
            response.redirect().toRoute('admin_skills')
        } catch (error) {
            session.flash('msg', error)
            session.flash('flag', 'danger')
            response.redirect().withQs().back()
        }

    }
}
