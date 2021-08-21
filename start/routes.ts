/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database';
// import { appKey } from 'Config/app'
import './routes/my-routes';
import './routes/post-routes';
import './routes/profile-routes'

Route.get('/', async ({ view }) => {
  
  return view.render('home', {user: 'ade'})
}).as("")

Route.get('/about', async ({ view }) => {
  return view.render(`about`)
}).as('about')





Route.group(() => {

  Route.get('/', async ({ view }) => {
    return view.render(`services`, {
      services: await Database.from('services').select('*')
    })
  }).as('services')


  Route.get('/project/:serviceId', async ({ view, request }) => {
    const { serviceId } = request.params();
    const projects = await Database.from('projects').select('*').where('project_service_id', 'like', `%${serviceId}%`);
    const service = await Database.from('services').select('*').where('service_id', serviceId).limit(1);
    console.log(service)
    const pageTitle = `Services I Have Rendered In ${service[0].service_name}`
    return view.render(`portfolio`, {projects, service: service[0], isService: true, pageTitle})
  }).as('portfolio_by_service')
}).prefix('services')

Route.get('/blog', async ({ view }) => {
  return view.render(`blog`)
}).as('blog')


Route.group(() => {
  Route.get('/', async ({ view }) => {
    const projects = await Database.from('projects').select('*');
    // console.log(projects)
    const pageTitle = "Amazing Project I Have Worked On";
    return view.render(`portfolio`, {projects, skill: null, pageTitle})
  }).as('portfolio')

}).prefix('portfolio')



Route.get('/contact', async ({ view }) => {
  return view.render(`contact`)
}).as('contact')



Route.group( () => {

  Route.get('/', async ({ view }) => {
    return view.render(`skills`, {
      skills: await Database.from('skills').select('*').orderBy('position') 
    })
  }).as('skills')

  Route.get('/project/:skillId', async ({ view, request }) => {

    const { skillId } = request.params();
    const projects = await Database.from('projects').select('*').where('project_skill_id', 'like', `%${skillId}%`);
    const skill = await Database.from('skills').select('*').where('skill_id', skillId).limit(1);
    // console.log(projects)
    const pageTitle = `Amazing Projects I Have Worked On using ${skill[0].skill_name}`
    return view.render(`portfolio`, {projects, skill: skill[0], isSkill: true, pageTitle})
  }).as('portfolio_by_skill')

}).prefix('skills')

