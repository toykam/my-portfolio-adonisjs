import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import { v4 } from "uuid";
import CreateBlogValidator from 'App/Validators/CreateBlogValidator';
import cloudinary from 'App/Services/CloudinaryService';


export default class BlogController {

    public async index({view}: HttpContextContract) {
        return view.render('admin/pages/blogs/index', {
            blogs: await Database.from('blogs').select('*')
        })
    }

    public async new({view}: HttpContextContract) {
        return view.render('admin/pages/blogs/new_blog')
    }

    public async edit_blog({view, request}: HttpContextContract) {

        
        return view.render('admin/pages/blogs/edit_blog', {
            blog: await Database.from('blogs').select('*').where('blog_id', request.param('blog_id')).then((values) => values[0])
        })
    }

    public async save_blog({request, response, session}: HttpContextContract) {
        try {

            await request.validate(CreateBlogValidator)
            const {title, content,} = request.body()
            const blog_id = v4();
            const blog_image = request.file('blog_image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif'],
            })
    
            console.log(title, content,)
            if (!blog_image) {
                session.flash('msg', "An image is required")
                session.flash('flag', 'danger')
                response.redirect().back()
                return
            }

            
    
            if (!blog_image!.isValid) {
                session.flash('msg', blog_image!.errors)
                session.flash('flag', 'danger')
                response.redirect().back()
            }
            
            // await blog_image!.move(Application.publicPath('images/blogs/'), {name: `${blog_id}.png`})
            // console.log(blog_image.filePath)
            const uploadRes = await cloudinary.v2.uploader.upload(blog_image!.tmpPath, {
                folder: 'blogs', overwrite: true
            })
            await Database.table('blogs').insert({
                title: title,
                content: content,
                blog_image: uploadRes.secure_url,
                blog_id
            })
            response.redirect().toRoute('admin_blogs')
        } catch (error) {
            console.log(error)
            session.flash('msg', "An error occurred")
            session.flash('flag', 'danger')
            response.redirect().back()
        }
    }

    public async update_blog({request, response, session}: HttpContextContract) {
        try {

            // await request.validate(CreateBlogValidator)
            const {title, content,} = request.body()
            let imagePath = request.input('blog_image_prev')
            const blog_image = request.file('blog_image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif'],
            })

            if (blog_image) {
                console.log(title, content,)
                if (!blog_image) {
                    session.flash('msg', "An image is required")
                    session.flash('flag', 'danger')
                    response.redirect().back()
                    return
                }
    
                if (!blog_image!.isValid) {
                    session.flash('msg', blog_image!.errors)
                    session.flash('flag', 'danger')
                    response.redirect().back()
                }
                
                // await blog_image!.move(Application.publicPath('images/blogs/'))
                const uploadRes = await cloudinary.v2.uploader.upload(blog_image!.tmpPath, {
                    folder: 'blogs', overwrite: true
                })
                // console.log(blog_image.filePath)
                imagePath = uploadRes.secure_url
            }
    
            await Database.from('blogs').where({
                blog_id: request.param('blog_id')
            }).update({
                title: title,
                content: content,
                blog_image: imagePath,
            })
            response.redirect().toRoute('admin_blogs')
        } catch (error) {
            console.log(error)
            session.flash('msg', "An error occurred")
            session.flash('flag', 'danger')
            response.redirect().back()
        }
    }

    public async delete_blog({request, response, session}: HttpContextContract) {
        try {
            await Database.from('blogs').where('blog_id', request.param('blog_id')).delete()
            // ''
            session.flash('msg', 'Project deleted successfully')
            session.flash('flag', 'success')
            response.redirect().toRoute('admin_blogs')
        } catch (error) {
            session.flash('msg', error)
            session.flash('flag', 'danger')
            response.redirect().back()
        }

    }
}
