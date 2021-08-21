import Route from "@ioc:Adonis/Core/Route";

Route.get('/:username/profile', ({view, params}) => {

    // response.redirect().toRoute()

    // response.send(`<h1>You are viewing ${params.username} Profile</h1>`);

    return view.render('profile/personal', {username: params.username})

}).as('profile.personal')