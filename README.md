# Mongoose - EJS - Express

Basic boilerplate for web applications, built on Express.js using the Model–View–Controller architectural pattern.

The views are created with the Embedded JavaScript templating (EJS) view engine.

A MongoDB database is used for data storage, with object modeling provided by Mongoose.

## initial

* Initialize the app.
* Install nodemon globally and set the app start to "nodemon app.js".
* Install Express
```
 $ npm install express --save
```
* Configure a basic server in app.js.
* Organize the routes with Express Router, add a `get` route for `/` to `mainController.getMain` in main.js.
* Add the controllers folder, configure `getMain` in main.js.
* Use the mainRoutes in app as middleware.
* Set a final use after the routes, to display a 404 message for the unhandled requests.

## ejs engine, views and static content

* Install EJS
```
$ npm install ejs --save
```
* Set the view engine and folder in app.js.
* Add the views folder, configure `main.ejs`.
* Use `express.static` to serve static files and add some styling in `public/css/main.css`.
* Configure the ejs files for the top and bottom of each page in the `includes` folder.
* Refactor the page-not-found functionality using the `404.ejs` view and the `error.js` controller.

## mongoose, models, saving data to the db

* Install Mongoose
```
$ npm install mongoose --save
```
* Use environment variables and configure the db connection string in a private file.
* Configure app.js in order to start the server after connecting to the db.
* Add the models folder, configure the `user` and `comment` models.
* Configure app.js to use form posted and url encoded data with `express.json` and `express.urlencoded`.
* Add the `comment` view folder and the `add-comment.ejs` view.
* Add the `comment` controller and configure the get and post methods for adding comments.
* Add the routes for `comment` and use it in app.js.
* Add a link to `/add-comment` in the main page.

## display, edit and delete data from the db

* Add the `comments.ejs` view in the `comment` view folder.
* Add the `getComments` method to the `comment` controller.
* Add the route for `/display-comments` in the `comment` routes.
* Redirect to `/display-comments` after successfully creating a comment in `postAddComment`.
* Add a link to `/display-comments` in the main page.
* Add the `comments.ejs` view in the `comment` view folder.
* Update the `comment` schema to include `editDate`.
* Add the `edit-comment.ejs` view in the `comment` view folder.
* Add the `getEditComment` and `postEditComment` methods to the `comment` controller.
* Add the get and post routes for editing comments in the `comment` routes.
* Add the `postDeleteComment` method to the `comment` controller.
* Add the route for `/delete-comment` in the `comment` routes.

## use session store to log in and out
 
* Configure `navigation.ejs` in the `includes` folder and use it in the rest of the views.
* Install express-session and configure app.js in order to use sessions.
```
$ npm install express-session --save
```
* Install connect-mongodb-session and use it in order to save sessions to MongoDB instead of the memory.
```
$ npm install connect-mongodb-session --save
```
* Configure `app.js` in order to use the session store.
* Configure the `auth` views for signing up and logging in.
* Configure the `auth` controller method placeholders for signing up and logging in.
* Configure the `auth` routes in auth.js and use them in app.js.
* In the `postLogIn` method of the `auth` controller, configure dummy log-in functionality by setting an arbitrary key to the request session object, `req.session.isLoggedin`, to true.
* Configure `app.js` to set the value of `res.locals.isAuthenticated` equal to the value of `req.session.isLoggedin`, so that a logged-in user will be considered an authenticated user.
* In `navigation.ejs` set the `add-comment` and `log-out` routes to be displayed only after `isAuthenticated` is set to true while the `log-in` and `sign-up` routes to be displayed in the opposite.
* Configure the `auth` controller post method for logging out, which destroys the server session.
* Configure the `auth` route for logging out.

## sign up users

* Install the `bcryptjs` package in order to encrypt the user passwords in the db.
```
$ npm install bcryptjs --save
```
* Configure a SendGrid account and install the `nodemailer` and `nodemailer-sendgrid-transport` packages in order to be able to send a confirmation email message for every successful sign-up.
```
npm install nodemailer nodemailer-sendgrid-transport --save
```
* In `controllers/auth.js` require the above packages and configure the  controller post method for signing up users. Implement the creation of encrypted user passwords in the db and the the functionality for posting an email confirmation per each successful sign-up. The matching between password and re-entered password remains to be implemented when validation is introduced.
* Configure the post route in `auth` routes for `/sign-up`. 
* Install the `connect-flash` package and use it in app.js in order to display flash messages.
```
$ npm install connect-flash --save
```
* Configure an `req.flash` error message in `postSignUp` method and pass it to the `signup` view from the render in the `getSignUp` method. Adjust accordingly the `getLogIn` method so that its render also passes the error message to the `login` view.
* Adjust the `signup` and `login` views in order to display the flash messages in case of error.
* Install the `csurf` package and use it in app.js to initialize the `csrfProtection` middleware which is then used in order to generate a CSRF-token for every rendered page. 
```
$ npm install csurf --save
```
* In app.js, in the middleware that makes use of the `locals` field, set `res.locals.csrfToken = req.csrfToken()` so that the token does not need to be passed individually to each of the controller methods that render the pages.
* In every view, in all forms, add a hidden input which has the dictated-by-the-package-name `"_csrf"` and the value of the CSRF token.



## user authentication and authorization

* Configure the `auth` controller `postLogIn` method. After succesfully logging in, set the `isLoggedIn` and `user` keys of the `req.session` object.
```
req.session.isLoggedIn = true;
req.session.user = user;
```
* Add a middleware to app.js, where the db is searched for the `req.session.user`, the user in the current session object upon logging in. Thus, on successful log-in, the `user` key of the request object `req.user` is set to the model user we get from mongoose.
```
User.findById(req.session.user._id).then(user => { req.user = user; next(); })
```
* A logged-in user is now an authenticated user. In the model `commentSchema`, set `userId` to required. Configure the `postAddComment` method so that the current `userId` is provided to the new comment. Now unlogged users cannot add comments because a mongoose validation error prevents it, even though the `add-comment` route can still be accessed by typing the uri. 
* Add a `middleware` folder and configure `is-auth.js`, which redirects  to the `/log-in` route if the `isLoggedIn` key of the `req.session` object is not defined (which means that the user is not authenticated). Use the `is-auth` middleware as an argument in the `comment` routes in order to protect them, so that requests made to the `add`, `edit` or `delete` routes in the absence of an authenticated user, are not routed to the appropriate controller actions, but are instead redirected by the middleware to the `log-in` page.   
* Configure the `comment/comments` view, which is used by the unprotected `/display-comments` route, in order to display the edit and delete links only to logged users.
* Only the creator of the comment should be able to edit or delete it. Therefore, in the `getComments` method, define the `currentUser` as the `req.user` and pass the parameter to the `comment/comments` view. Authorize the access to the edit and delete links only if the current user is the user that created the comment by adding another condition to the view in order to display the related divs.
```
<% if (isAuthenticated && comment.userId._id.toString() === currentUser._id.toString()) { %>
```
* Extend the prevention of anauthorized edits or deletes by configuring the related post actions in the `comments` controller. 
In `postEditComment`:
```
if (comment.userId.toString() !== req.user._id.toString()) {
    return res.redirect('/');
}
```
In `postDeleteComment`:
```
Comment.deleteOne({ _id: commentId, userId: req.user._id })
```


## resetting passwords

* Configure the `auth/reset` view for resetting passwords and edit the `log-in` view in order to provide a link to the `reset` view.
* Configure the `auth` controller `getReset` and `postReset` methods.
* Use the Node.js built-in `crypto` library to generate the token which will be included in the password-reset-link. 
* Add the `resetToken` and `resetTokenExpiration` fields to the `User` model.
* If a user is found with the email that was entered, store the created token to the user object in the db. Then create the password-reset-link and send the email message that contains it.
* Configure the `auth/new-password` view. Include hidden inputs for the `userId` and the `passwordToken`.
* Configure the `auth` controller `getNewPassword` and `postNewPassword` methods.
* Configure the related `auth` routes.
```
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
```

## server side validation

* Install express-validator.
```
$ npm install express-validator --save
```
* Configure the `sign-up` post route so that it includes middleware which performs validation.
* Use the express-validator's `check API` methods to validate the email and password fields.
* Perform async validation in order to check the user objects in the db. Checking for existing email is now done in the the `sign-up` post route, so it can be removed from the `postSignUp` action in the `auth` controller.
* Check for the equality of the `password` and `confirmPassword` fields.
* Pass the validation errors from the middleware to `postSignUp` by use of the `validationResult` object.
* Adjust the `getSignup` action so that the user will not have to re-enter all input field values in case of validation error.
* Adjust accordingly the `signup` view in order to be able to display the `oldInput` values and style the invalid fields.
* Configure the `log-in` post route for field validation as well.
* Adjust the `postLogin` and `getLogIn` actions.
* Adjust the `login` view.


## error handling

* Edit `app.js`in order to handle possible errors more efficiently.
* Create the `500.ejs` view.
* Add the `get500` action in the `error` controller.
* Add the `/500` route in `app.js`. 
* Use the Express.js error handling middleware in `app.js`, after all other middlewares. It renders the `500` view directly instead of redirecting, so that infinite loops are avoided. 
* In the controllers, add the`handleError` function, which passes error objects to `next` calls (returns `next(error)`) and eventually leads to the `500` error page. Make use of it to replace all the instances of unhandled errors in catch blocks. 


## pagination

* Add a section containing the pagination links in `views/includes/pagination.ejs`. Use it in the `comments` view.
* Add the pagination logic to the fetching of the `comments` in the `getComments` action. The render parameters include the pagination object which is defined by use of the `paginator` helper function.
* Configure the styling for the pagination links in `main.css`.


## secure headers

*Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help!*
* Install the `helmet` package and use it in `app.js` in order to include security headers in the responses.
```
$ npm install helmet --save
```

## use compression

* Install the `compression` package and use it in `app.js` in order to compress the assets over the wire.
```
$ npm install compression --save
```