
import Route from "@ioc:Adonis/Core/Route";

// Route.resource('/posts', 'PostsController').except(['edit'])
// Route.resource('/posts', 'PostsController').except(['edit'])
Route.resource('posts', 'PostsController').apiOnly()
Route.shallowResource('posts.comments', 'CommentsController').apiOnly()