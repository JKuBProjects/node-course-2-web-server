const express = require('express');

// hbs ie Handlebars is the package which allows us to render the html as a dynamic page so that we can easily add dynamic data to the page
// and can easily render it dynamically. It is similar or it takes html syntax with its own as well to provide and access dynamic data for the frontend
const hbs = require('hbs');
// File Handling Library
const fs = require('fs');

const port = process.env.PORT || 3000;

// Express is the framework which is helpful and mostly used for writing server side code in nodejs.
// Express has all http related req and response methods which are used for creating web application in NodeJS
var app = express();

// This is used when we have a repeated code for static pages like headers and footers. For such a part of the code this is used.
// It directs or registers to the folder where partials files are present. Partials file basically holds the repetative code of html
// which are repeatatively used in many pages like headers and footers part of the pages. Such a part of the code is written in separate file and
// is called wherever required as shown in hbs pages.(Example of footer partial is present here)
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// This is the middleware for logging out some information as shown below.
// Middlewares are responsible to add some additional functionality to the application.
app.use((req, res, next) => {
    var now = new Date().toISOString();
    var log = `${now}: ${req.method} ${req.url}`;
    
    console.log(log);
    // This will append the data(ie log) into the file, if file not present it will create file and then append the content
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server log!');
        }
    });
    // This is imp so that server can move further. If nodejs not found this function then it won't move further and results into server timeout
    next();
});

// middleware for maintainance page. Here since we havn't written next(), all the further calling and processes will stop at this instant
// And thus will display the maintainance page with its data for anything because whenever we run the application and hit any url then application will always run all the middlewares present.
/* app.use((req, res, next) => {
    res.render('maintainance.hbs');
}); */

// This is called a Middleware. A Middleware is what responsible to connect to the static pages(html, css or angular ie where frontend code is written)
// use() is the method which acts as a middleware to connect to the static pages. It takes one function argument express.static() as shown below.
// This static() method takes one argument which is the full path of the static pages. To avoid writing full path manually '__dirname' is helpful.
// '__dirname' defines the path till the project folder. We just have to write the path after the project folder.
app.use(express.static(__dirname + '/public'));

// Helper is another function or feature provided by Handlebars(hbs) which allow us to add the dynamic data or any code that is not the part of database transaction
// into the hbs code. For example, current year is a dynamic data but not related to any db transaction. In such a scenario we can use this Helper function to get that data
// and use that in the hbs frontend code.
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// These are called Routes.
app.get('/', (req, res) => {
    // Here we can write the response msg in html form because express automatically sets the content-type of the response to 'text/html'
    // res.send('<h1>Hello Express!</h1>');
    // Similar to above if we send json object as a response as follows, express looks over the response sent and then decides its content-type accordingly
    /* res.send({
        name: 'Catseye',
        likes: [
            'Software Development',
            'Web Applications'
        ]
    }); */

    res.render('home.hbs', {
        pageTitle: 'Home Page',
        name: 'Catseye'
    });
});

app.get('/about', (req, res) => {
    // res.send('About Page!');
    // With following we are directly rendering the page easily so that when this url or route is called in the browser this page will get loaded or rendered
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/projects', (req, res) => {
    // res.send('About Page!');
    // With following we are directly rendering the page easily so that when this url or route is called in the browser this page will get loaded or rendered
    res.render('projects.hbs', {
        pageTitle: 'Projects Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to process the request!'
    });
});

// This will tell the app ie express to listen to port 3000 and response according to the url requested.
// It also has an optional second argument which is a function that runs while server is starting.
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});