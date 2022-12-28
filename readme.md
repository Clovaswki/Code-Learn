## Web application of Blog 

#### Code Learn

This project is a blog application for posting publications related to the world of development. This web system contain a cookie based authentication flow, besides of complete CRUD system with mongoDB database. The system was built on an monolithic architecture, where the Api is integrated into the web server.

## Technologies

The web server was built with **ExpressJS** framework, the frontend was built with **handlebars** template, styling was done with **bootstrap** framework and **pure CSS**.

## Settings

the main dependencies needed in the project are specified below:

    express => 4.17.2
    express-handlebars => 6.0.2
    handlebars => 4.7.7
    @handlebars/allow-prototype-access => 1.0.5
    passport => 0.5.2
    passport-local => 1.0.0

 - the passport library was used for to create the flow authentication.

## start

    npm start - start the app for production
    npm run dev - start the app from development

## execution