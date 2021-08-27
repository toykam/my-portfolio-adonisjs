import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database';

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
  
  
  
  Route.get('/contact', async ({ view }) => {
    return view.render(`site/contact`)
  }).as('contact')
  
  
  
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