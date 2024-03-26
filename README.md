# Petropolis

Petropolis is a full-stack ecommerce web application dedicated to providing pet owners with a convenient platform to purchase pet supplies. From food and toys to grooming products and accessories, Petropolis offers a wide range of items to cater to the needs of various pets.
Featuring a user-friendly interface and seamless navigation, Petropolis ensures a hassle-free shopping experience for customers. With secure payment processing leveraging the Stripe API, users can be confident in the safety of their payment information, as well as fast check-out should they choose to save their data with Stripe.

This full stack application consists of:

- an Express web server,
- a PostgreSQL database instance,
- and a React front-end

# Local Development

## Project Structure

```bash
├── .github/workflows
│   └── heroku-deploy.yaml
│  
├── api
│   ├── apiRouter.test.js
│   └── index.js
│
├── db
│   ├── models
│   │   ├── index.js
│   │   └── user.js
│   ├── client.js
│   ├── index.js
│   └── init_db.js
│
├── public
│   └── index.html
│
├── src
│   ├── axios-services
│   │   └── index.js
│   ├── components
│   │   ├── App.js
│   │   └── index.js
│   ├── style
│   │   ├── App.css
│   │   └── index.css
│   └── index.js
│
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

`/db` contains the `index.js` which exports the client instance and database adapter models, as well as `init_db.js` which should be run when rebuilding tables and seed data.

`/public` and `/src` are the two puzzle pieces for the React front-end. `/public` contains any static files necessary for the front-end. This can include images, a favicon, and most importantly the `index.html` that is the root of the React application.

`src/axios-services` contains the axios network request adapters. `src/components` contains the React component files.

Inside `/api` you have `index.js` which is responsible for building the `apiRouter` that is attached to the express server, and `apiRouter.test.js`. The React application and Express server use any routes built in the `/api` directory to send/receive data via JSON, for example, a `productsRouter.js` that will be required and mounted in the `apiRouter.js`.

Rounding things out, we've got the top level `index.js` that creates the Express Server. This is responsible for setting up our API, starting our server, and connecting to our database.

## Command Line Tools

In addition to `start:dev`, `client:build`, `client:dev` and `server:dev`, you have access to `db:build` which rebuilds the database, all the tables, and ensures that there is meaningful data present. (As well as less meaningful data thanks to the use of Faker, the products generated from such are often good for a laugh

# Deployment

## Setting up Heroku

Setup your heroku project by choosing a site name and provisioning a postgres database. These commands create a heroku project backed by a postgres db instance which will live at https://project-name-goes-here.herokuapp.com. You'll want to replace `project-name-goes-here` with your selected project name.

You'll only need to do this step once, at the outset of your project:

```bash
# create your project
$ heroku create project-name-goes-here
# create your database instance
$ heroku addons:create heroku-postgresql:hobby-dev
```

Next we'll configure your database instance to ignore the `ssl` configuration object our `pg` client instance expects:

```bash
# set ssl mode to no-verify
$ heroku config:set PGSSLMODE=no-verify
# confirm your environment variable has been set
$ heroku config
```

## Configuring GitHub Actions Secrets for CI/CD

We're going to leverage continuous integration and continuous development methodologies, or CI/CD, to deploy your app. To enable CI/CD you'll need to add a few environment variables to your project repo.

Under Settings, choose the Secrets option under Security. You'll see the following dialog, and you'll be able to add a secret by selecting the `New repository secret` button. Once you create a GitHub secret you can never see it again, but you can modify it! We're going to add 3 secrets to our repo:

- `HEROKU_API_KEY`: you'll find this listed in your heroku account settings
- `HEROKU_APP_NAME`: this is the project name you chose above
- `HEROKU_EMAIL`: this is the email address associated with your heroku account

![](/assets/github-actions-secrets.png)

## Deployment

In `.github/workflows` you'll find a YAML, an acronym for "YAML Ain't Markup Language", that triggers an automated deployment by watching your `main` branch: whenever a new pull request is merged to `main`, your app will automagically deploy itself on heroku.

Optionally, you can also trigger this deployment workflow by pushing to the `deploy` branch. Many companies use this pattern to enable hotfixes without going through the lengthy review process of creating a PR and merging it.

Note that this workflow does **not** seed your database. To seed your remote postgres instance, run the following command:

```bash
# this command seeds your remote postgres instance
$ heroku run npm run db:build
```
