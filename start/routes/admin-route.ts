import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    // Authentication route
    const CONTROLLER_PATH = '/App/Controllers/Http/admin/';

    Route.group(() => {

        // Admin Index Page
        Route.get('/', ({view}) => {
            return view.render('admin/pages/index')
        }).as('admin_home_page')

        // Admin Project Page

        Route.group(() => {

            // Project Index Page
            Route.get('/', `${CONTROLLER_PATH}ProjectController.index`).as('admin_projects')

            Route.get('/new', `${CONTROLLER_PATH}ProjectController.new`).as('admin_new_project')

            Route.post('/new', `${CONTROLLER_PATH}ProjectController.save_project`).as('admin_save_project')
            Route.get('/edit/:project_id', `${CONTROLLER_PATH}ProjectController.edit_project`).as('admin_edit_project')
            Route.post('/update/:project_id', `${CONTROLLER_PATH}ProjectController.update_project`).as('admin_update_project')
            Route.get('/delete/:project_id', `${CONTROLLER_PATH}ProjectController.delete_project`).as('admin_delete_project')
        }).prefix('projects')

        Route.group(() => {

            // Project Index Page
            Route.get('/', `${CONTROLLER_PATH}SkillController.index`).as('admin_skills')

            Route.get('/new', `${CONTROLLER_PATH}SkillController.new`).as('admin_new_skill')

            Route.post('/new', `${CONTROLLER_PATH}SkillController.save_skill`).as('admin_save_skill')
            Route.get('/edit/:skill_id', `${CONTROLLER_PATH}SkillController.edit_skill`).as('admin_edit_skill')
            Route.post('/update/:skill_id', `${CONTROLLER_PATH}SkillController.update_skill`).as('admin_update_skill')
            Route.get('/delete/:skill_id', `${CONTROLLER_PATH}SkillController.delete_skill`).as('admin_delete_skill')
        }).prefix('skills')


    }).middleware('adminAuth')
    
    Route.group(() => {
        Route.get('/login', `${CONTROLLER_PATH}AuthController.login`).as('admin_login_page')
        
        Route.post('/login', `${CONTROLLER_PATH}AuthController.login_post`).as('admin_login')
        Route.get('/logout', `${CONTROLLER_PATH}AuthController.logout`).as('admin_logout')
    }).prefix('auth')

    

}).prefix('admin')