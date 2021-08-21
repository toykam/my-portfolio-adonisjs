import View from "@ioc:Adonis/Core/View";

console.log('View file preloaded')

View.global("side_menu", [
    // {
    //     'name': 'Home',
    //     'url': ''
    // },
    {
        'name': 'About',
        'url': 'about'
    },
    {
        'name': 'Skills',
        'url': 'skills'
    },
    {
        'name': 'Services',
        'url': 'services'
    },
    // {
    //     'name': 'Resume',
    //     'url': '/resume'
    // },
    {
        'name': 'Blog',
        'url': 'blog'
    },
    {
        'name': 'Portfolio',
        'url': 'portfolio'
    },
    {
        'name': 'Contact',
        'url': 'contact'
    },
])