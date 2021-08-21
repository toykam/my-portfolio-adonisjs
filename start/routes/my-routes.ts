import Route from "@ioc:Adonis/Core/Route";

Route.get('/my/about', ({response}) => {
    response.send('<h1>This is the about Page</h1>')
})