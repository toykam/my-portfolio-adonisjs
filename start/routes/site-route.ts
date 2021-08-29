import Mail from '@ioc:Adonis/Addons/Mail';
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database';
import Ws from 'App/Services/Ws';
import { v4 } from 'uuid'

Route.get('/', async ({ view }) => {
  
    return view.render('site/home', {user: 'ade'})
  }).as("")
  
  Route.get('/about', async ({ view }) => {
    return view.render(`site/about`)
  }).as('about')
  
  
  Route.group(() => {
  
    Route.get('/', async ({ view }) => {
      return view.render(`site/services`, {
        services: await Database.from('services').select('*')
      })
    }).as('services')
  
  
    Route.get('/project/:serviceId', async ({ view, request }) => {
      const { serviceId } = request.params();
      const projects = await Database.from('projects').select('*').where('service_id', 'like', `%${serviceId}%`);
      const service = await Database.from('services').select('*').where('service_id', serviceId).limit(1);
      console.log(service)
      const pageTitle = `Services I Have Rendered In ${service[0].service_name}`
      return view.render(`site/portfolio`, {projects, service: service[0], isService: true, pageTitle})
    }).as('portfolio_by_service')
  }).prefix('services')
  
  Route.get('/blog', async ({ view }) => {
    return view.render(`site/blog`)
  }).as('blog')
  
  
  Route.group(() => {
    Route.get('/', async ({ view }) => {
      const projects = await Database.from('projects').select('*');
      // console.log(projects)
      const pageTitle = "Amazing Project I Have Worked On";
      return view.render(`site/portfolio`, {projects, skill: null, pageTitle})
    }).as('portfolio')
  
  }).prefix('portfolio')
  
  
  Route.group(() => {

    Route.get('/', async ({ view, session }) => {

      // session.clear()

      console.log(session.get('chatMessages', []))

      return view.render(`site/contact`, {chats: session.get('chatMessages', [{
        message: 'hello', 'sender': 'bot'
      }]), currentUser: session.get('userName', null)})
    }).as('contact')

    Route.post('/', async ({ request, response, session }) => {

      const {userName} = request.only(['userName'])
      console.log(userName)
      session.put('userName', userName)
      // return view.render(`site/contact`, {chats: [], currentUser: null})

      response.redirect().toRoute('contact')
    }).as('init-contact')

    Route.post('/save', async ({ request, response, session }) => {

      try {
        const data = request.only(['full_name', 'email', 'phone_number', 'message'])
        const { full_name, email } = data
        data['message_id'] = v4()
        
        await Mail.send((message) => {
          message
            .from('kabirtoyyib19@gmail.com', 'Abdulkabir Toyyib Inuolaji')
            .to(email, full_name)
            .subject("Thank You")
            .htmlView('emails/welcome', {
              user: { fullName: full_name },
              url: 'https://your-app.com/verification-url',
            })
        }).then(async _ => {
          await Database.table('messages').returning('id').insert(data)
        })
        session.flash('msg', 'Your message have been sent successfully')
        session.flash('flag', 'success')
        response.redirect().toRoute('contact')
      } catch(error) {
        console.log(error)
        session.flash('msg', `Error: An error occurred`)
        // session.flash('msg', `Error: ${error}`)
        session.flash('flag', 'danger')
        response.redirect().back()
      }
    }).as('send-message')

    Route.post('/save-chat', async ({ request, response, session }) => {

      const {message} = request.only(['message'])
      console.log(request.all())
      const messages = session.get('chatMessages', [])
    
      const msg = {
        message, sender: session.get('userName', null)
      }

      messages.push(msg)


      session.put('chatMessages', messages)
      // return view.render(`site/contact`, {chats: [], currentUser: null})

      Ws.io.emit('reply', {
          message: 'This is a reply', sender: 'bot'
      })

      return response.ok({'status': true})
    }).as('save-chat')
  }).prefix('contact')
  
  
  
  Route.group( () => {
  
    Route.get('/', async ({ view }) => {
      return view.render(`site/skills`, {
        skills: await Database.from('skills').select('*').orderBy('position') 
      })
    }).as('skills')
  
    Route.get('/project/:skillId', async ({ view, request }) => {
  
      const { skillId } = request.params();
      const projects = await Database.from('projects').select('*').where('skill_ids', 'like', `%${skillId}%`);
      const skill = await Database.from('skills').select('*').where('skill_id', skillId).limit(1);
      // console.log(projects)
      const pageTitle = `Amazing Projects I Have Worked On using ${skill[0].skill_name}`
      return view.render(`site/portfolio`, {projects, skill: skill[0], isSkill: true, pageTitle})
    }).as('portfolio_by_skill')
  
  }).prefix('skills')