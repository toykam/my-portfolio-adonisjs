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
            Route.get('/', ({view}) => {
                return view.render('admin/pages/projects/index')
            }).as('admin_project_home_page')
        }).prefix('projects')


    }).middleware('adminAuth')
    
    Route.group(() => {
        Route.get('/login', `${CONTROLLER_PATH}AuthController.login`).as('admin_login_page')
        
        Route.post('/login', `${CONTROLLER_PATH}AuthController.login_post`).as('admin_login')
    }).prefix('auth')

    

}).prefix('admin')