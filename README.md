# Sans-Stitches


[![Build Status](https://travis-ci.org/Dsalz/Sans-Stitches.svg?branch=develop)](https://travis-ci.org/Dsalz/Sans-Stitches) [![Coverage Status](https://coveralls.io/repos/github/Dsalz/Sans-Stitches/badge.svg?branch=develop)](https://coveralls.io/github/Dsalz/Sans-Stitches?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/a2be4e794a38513bcbc0/maintainability)](https://codeclimate.com/github/Dsalz/Sans-Stitches/maintainability) 

## Table of Contents

* [About](#about)
* [Getting Started](#gettingstarted)
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

## Endpoints

### User

#### Sign Up 
Signs User Up and returns token which is required for modifying record store

* **URL**
  ##### Online 
  https://sans-stitches.herokuapp.com/api/v1/user/signup

  ##### Locally
  http://localhost:4000/api/v1/user/signup

* **Method:**

  `POST`
  
* **URL Params**

    None

* **Data Params**

    **Required:**
    
    `name=[string]`
    
    `email=[string]`
    
    `phoneNumber=[string]`
    
    `password=[string]`
    
    `confirmPassword=[string]`
    
    **Not Required:**
    
    None


* **Success Response:**

  * **status:** 200 
  
  * **data:** `[ {`
    
    `user: {<User record saved>}`,

    `token : "<Token assigned to user>"`,

    `message: "Succesful Sign Up"`,

    `} ]`

* **Error Responses:**

  * **status:** 400 BAD REQUEST
  
  *  **error:** `[`
  
      (One or more of)
      
    - `{ name: "Name is Required" } `
    
    - `{ name: "Invalid Name" }`
    
    - `{ email: "Email is Required" }`
    
    - `{ email: "Invalid Email" }`
    
    - `{ phoneNumber: "Phone Number is Required" }`
    
    - `{ phoneNumber: "Invalid Phone Number" }`
    
    - `{ password: "Password is Required" }`
    
    - `{ password: "Invalid Password" }`
    
    - `{ password: "Password and Confirm Password do not match" }`
    
     `]`

     OR
     
  * **status:** 409 CONFLICT
  
  * **error:** `"Email already Exists"` 
  

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/user/signup",
        method: "POST",
        data: {
            name: 'xyz',
            email: 'xyz@yahoo.com',
            phoneNumber: '08123456789',
            password: '1234abcd',
            confirmPassword: '1234abcd',
        },
    }).done(() => {
        //Do something with data
       });
  ```

### Login 
Logs user in and returns token which is required for modifying record store

* **URL**
  ##### Online 
  https://sans-stitches.herokuapp.com/api/v1/user/login

  ##### Locally
  http://localhost:4000/api/v1/user/login

* **Method:**

  `POST`
  
* **URL Params**

  None

* **Data Params**

    **Required:**
    
    `email=[string]`
    
    `password=[string]`

    **Not Required:**
    
     None

* **Success Response:**

  * **status:** 200 
 
  * **data:** `[ {` 
  
    `user: {<User record corresponding to credentials provided>}`,

	`token : "<Token assigned to user>"`,

	`message: "Succesful Login"`,

	`} ]`
         
* **Error Responses:**

  * **status:** 400 BAD REQUEST 
  
  * **error:** `[`
  
    (One or more of) 
    
    - `{ email: "Email is Required" }`
    
    - `{ email: "Invalid Email" }`
    
    - `{ password: "Password is Required" }`
    
    - `{ password: "Invalid Password" }`
    
    `]`
    
   OR
  
  * **status:** 404 NOT FOUND
    
  * **error:** `"User Not Found"` 
  

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/user/login",
        method: "POST",
        data: {
            email: 'xyz@yahoo.com',
            password: '1234abcd',
        },
    }).done(() => {
        //Do something with data
       });
  ```



### Red-Flag

#### Get all Red Flag Records
Returns all red flag records

* **URL**
  ##### Online 
  https://sans-stitches.herokuapp.com/api/v1/red-flags

  ##### Locally
  http://localhost:4000/api/v1/red-flags

* **Method:**

  `GET`

* **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **status:** 200 
  
  * **data:** `[ <Red-flag-record-objects> ]`

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/red-flags",
        method: "GET",
    }).done(() => {
        //Do something with data
       });
  ```


#### Get Specific Red Flag Record
Returns an existing red flag record

* **URL**
  ##### Online 
  https://sans-stitches.herokuapp.com/api/v1/red-flags/:red-flag-id

  ##### Locally
  http://localhost:4000/api/v1/red-flags/:red-flag-id

* **Method:**

  `GET`

* **URL Params**

    **Required:**
    
    `red-flag-id=[integer]`

* **Data Params**

    None

* **Success Response:**

  * **status:** 200
   
  * **data:** `[{ <Requested Record>}]`

* **Error Response:**

  * **status:** 404 NOT FOUND
  
  * **error:** `"Record does not exist"`

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/red-flags/3",
        method: "GET",
    }).done(() => {
        //Do something with data
       });
  ```

#### Create Red Flag Record
Creates a new red flag record

* **URL**
  ##### Online 
    https://sans-stitches.herokuapp.com/api/v1/red-flags

  ##### Locally
    http://localhost:4000/api/v1/red-flags

* **Method:**

  `POST`
  
* **Headers Required**

  `Authorization= "Bearer " + token`

* **URL Params**

  None

* **Data Params**

    **Required:**
  
    `comment=[string]`

    **Not Required:**
    
    `latitude=[string]`
    
    `longitude=[string]`
    
    `description=[string]`
    
    `images=[string, string]`
    
    `video=[string]`

* **Success Response:**

  * **status:** 200
  
  * **data:** `[ {`
  
  `id: <Id of newly created record>` ,
  
  `message : "Created red-flag record"` , 
  
  `newRecord: {<Newly Created Record>}`
  
  `} ]`

* **Error Responses:**

  * **status:** 400 BAD REQUEST
  
  * **error:** `[` 
  
    (One or more of)  
    
    - `{ comment: "Comment is Required" } `
    
    - `{ comment: "Invalid Comment" }`
    
    - `{ geolocation: "Invalid Geolocation Data" }`
    
    - `{ description: "Invalid Description" }`
   
    `]`
    
  OR

  * **status:** 401 UNAUTHORIZED 
    **error:** 
  
    (One of)  
    
    - `"Invalid Token, Please Login or SignUp"`
   
    - `"Request has no Token, Please Login or SignUp"`
  

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/red-flags",
        method: "POST",
        headers: {
            "authorization": "Bearer " + token;
        }
        data: {
            comment: 'Looting happening at House of Reps',
            latitude: '3.444488',
            longitude: '-30.44',
            description: "It happenen in my front and i've attached images and a video link as evidence",
            images: ["https://filehostingplatform.com/abcd.jpg", "https://filehostingplatform.com/abcd.jpg"],
            video: "https://filehostingplatform.com/abcd.jpg",
        },
    }).done(() => {
        //Do something with data
       });
  ```

#### Delete Red Flag Record

Deletes an existing red flag record

* **URL**

  ##### Online 

    https://sans-stitches.herokuapp.com/api/v1/red-flags/:red-flag-id

  ##### Locally

    http://localhost:4000/api/v1/red-flags/:red-flag-id

* **Method:**

  `DELETE`
  
* **Headers Required**

  `Authorization = "Bearer " + token`

* **URL Params**

    **Required:**
   
    `red-flag-id=[integer]`

* **Data Params**

    None

* **Success Response:**

  * **status:** 200   
  * **data:** `[ {`

     `id: <Id of deleted record>`, 

     `message : "red-flag record has been deleted"`,

     `deletedRecord: {<Deleted Record>}`,

     `} ]`

* **Error Responses:**

  * **status:** 400 BAD REQUEST
  
  * **error:** `[`
   
    (One or more of)  
    
    - `{ comment: "Comment is Required" }`
    
    - `{ comment: "Invalid Comment" }`
    
    - `{ geolocation: "Invalid Geolocation Data" }`
    
    - `{ description: "Invalid Description" }`
    
    `]`
    
   OR

  * **status:** 403 FORBIDDEN 
  
  * **error:** 
  
    (One of)  
    
    - `"You do not have permissions to delete this record"`
    - `"Request has no Token, Please Login or SignUp"`
 
  OR
  
  * **status:** 404 NOT FOUND
  * **error:** `"Record does not exist"`

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/red-flags/3",
        method: "DELETE",
        headers: {
            "authorization": "Bearer " + token;
        },
    }).done(() => {
        //Do something with data
       });
  ```



#### Update Comment Red Flag Record
Updates the comment of an existing red flag record

* **URL**
  ##### Online 
    https://sans-stitches.herokuapp.com/api/v1/red-flags/:red-flag-id/comment

  ##### Locally
    http://localhost:4000/api/v1/red-flags/:red-flag-id/comment

* **Method:**

  `PATCH`
  
* **Headers Required**

  `Authorization= "Bearer " + token`

* **URL Params**

    **Required:**
   
    `red-flag-id=[integer]`

* **Data Params**

    **Required:**
    
    `comment=[string]`

    **Not Required:**
    
    None

* **Success Response:**

  * **status:** 200
  
  * **data:** `[ {`
  
    `id: <Id of updated record>`, 
    
    `message : "Updated red-flag record’s comment"`,
    
    `updatedRecord: {<Udpated Record>}`,
    
    `} ]`

* **Error Responses:**

  * **status:** 400 BAD REQUEST
  
  * **error:** `[` 
  
    (One or more of)
    
    - `{ comment: "Comment is Required" } `
    
    - `{ comment: "Invalid Comment" }`
    
    `]`
    
  OR
  
  * **status:** 403 FORBIDDEN
  
  * **error:** 
  
    (One of)  
    
    - `"You do not have permissions to delete this record"`
    
    - `"Request has no Token, Please Login or SignUp"`
    
  OR
  
  * **status:** 404 NOT FOUND
  
  * **error:** `"Record does not exist"`

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/red-flags/3/comment",
        method: "PATCH",
        headers: {
            "authorization": "Bearer " + token;
        },
        data: {
            comment: "Senators looting in Gbagada"
        }
    }).done(() => {
        //Do something with data
       });
  ```

#### Update Location of Red Flag Record
Updates the location of an existing red flag record

* **URL**
  ##### Online 
    https://sans-stitches.herokuapp.com/api/v1/red-flags/:red-flag-id/location

  ##### Locally
    http://localhost:4000/api/v1/red-flags/:red-flag-id/location

* **Method:**

  `PATCH`
  
* **Headers Required**

  `Authorization= "Bearer " + token`

* **URL Params**

    **Required:**
    
    `red-flag-id=[integer]`

* **Data Params**

    **Required:**
    
    `longitude=[string]`
    
    `latitude=[string]`

    **Not Required:**
    
    None

* **Success Response:**

  * **status:** 200
  
  * **data:** `[ {`
  
    `id: <Id of updated record>`, 
    
    `message : "Updated red-flag record’s location"`, 
    
    `updatedRecord: {<Udpated Record>}`
    
    `} ]`

* **Error Responses:**

  * **status:** 400 BAD REQUEST
  
  * **error:** `[`
  
    (One of)
    
    - `{ geolocation: "Geolocation Data is Required" } `
    
    - `{ geolocation: "Invalid Geolocation Data" }`
    
    `]`
    
   OR

    * **status:** 403 FORBIDDEN

    * **error:** 

      (One of)

      - `"You do not have permissions to delete this record"`

      - `"Request has no Token, Please Login or SignUp"`

    OR

    * **status:** 404 NOT FOUND

    * **error:** `"Record does not exist"`

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/red-flags/3/location",
        method: "PATCH",
        headers: {
            "authorization": "Bearer " + token;
        },
        data: {
            latitude: "3.4433",
            longitude: "14.2",
        }
    }).done(() => {
        //Do something with data
       });
  ```

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

