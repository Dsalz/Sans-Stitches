# Sans-Stitches

[![Build Status](https://travis-ci.org/Dsalz/Sans-Stitches.svg?branch=develop)](https://travis-ci.org/Dsalz/Sans-Stitches) [![Coverage Status](https://coveralls.io/repos/github/Dsalz/Sans-Stitches/badge.svg?branch=develop)](https://coveralls.io/github/Dsalz/Sans-Stitches?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/a2be4e794a38513bcbc0/maintainability)](https://codeclimate.com/github/Dsalz/Sans-Stitches/maintainability) 

## Table of Contents

* [About](#about)
* [Getting Started](#gettingstarted)
* [Specifications](#specificatons)
* [Endpoints](#endpoints)
* [Testing](#testing)
* [Dependencies](#dependencies)

## About
A Reporting platform used to curb corruption and point out deficits to the government.

The popular saying "Snitches get stitches" is one which has discouraged reporting of evil deeds and so this platform is named "Sans Stitches" which means "No stitches" because this platform aims to encourage "snitching".

[Here](https://www.pivotaltracker.com/n/projects/2226638) is the link to the platform's pivotal tracker board.

[Here](http://damola.cf/Sans-Stitches/UI) is where the user interface is hosted


## Getting Started

### Online
- Submit login form with "admin@yahoo.com" to access admin dashboard
- Leave empty or fill anything else to access the user dashboard

### Locally
- Clone repository to system
- Run ```npm install``` to install dependencies
- Run ```npm run build``` to transpile server files into a folder called build
- Run ```npm start``` to start the server and listen to port 4000
- Open index.html file in browser


## Specifications

### Record
- comment: String (required)
- description: String
- longitude: String
- latitude: String

### User
(Signing Up)
- name: String (required)
- email: String (required)
- phoneNumber : String (required)
- password : String (required)
- confirmPassword : String (required)

(Logging in)
- email: String (required)
- password: String (required)


## Endpoints
The heroku api endpoints are

### Red Flag
- https://sans-stitches.herokuapp.com/api/v1/red-flags (GET , get all red flag records)

- https://sans-stitches.herokuapp.com/api/v1/red-flags/:id (GET, get a specific red flag record)

- https://sans-stitches.herokuapp.com/api/v1/red-flags/{red-flag-record} (POST , post/create a new red flag record)

- https://sans-stitches.herokuapp.com/api/v1/red-flags/:id/comment (PATCH, update a red flag record's comment)

- https://sans-stitches.herokuapp.com/api/v1/red-flags/:id/location (PATCH, update a red flag record's location)

- https://sans-stitches.herokuapp.com/api/v1/red-flags/:id (DELETE, delete a red flag record)

### User
- https://sans-stitches.herokuapp.com/api/v1/user/signup (POST , sign a user up)

- https://sans-stitches.herokuapp.com/api/v1/user/login (POST , log a user in)


Note: You need a token to access all bar the GET endpoints so you'll first need to sign up to get a token then attach the token in your request header. E.g 

```fetch('https://sans-stitches.herokuapp.com/api/v1/red-flags/4', { method: "DELETE" , headers :{ authorization: 'Bearer ' + token }}).then(() => //Do Something Cool )```

Please refer to the user specifications above for required fields for signing up


## Testing
Mocha is the test framework used for this platform.

To run tests run ```npm run test```.


## Dependencies
You need to have Node installed on your computer to run locally

The platform currently has the following dependencies
- Express
- Jsonwebtoken
- Nyc
- Babel
- Mocha & Chai
- ChaiHttp
