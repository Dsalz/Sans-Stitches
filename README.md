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

[Here](https://damola.cf/Sans-Stitches/UI) is where the user interface is hosted


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

[Click here for the Apiary documentation](https://sansstitches.docs.apiary.io)

### User

#### Sign Up 
Signs User Up and returns token which is required for modifying record store

* **URL**
  ##### Online 
  https://sans-stitches.herokuapp.com/api/v1/auth/signup

  ##### Locally
  http://localhost:4000/api/v1/auth/signup

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
        url: "https://sans-stitches.herokuapp.com/api/v1/auth/signup",
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
  https://sans-stitches.herokuapp.com/api/v1/auth/login

  ##### Locally
  http://localhost:4000/api/v1/auth/login

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
        url: "https://sans-stitches.herokuapp.com/api/v1/auth/login",
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



#### Update Comment of Red Flag Record
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
    
    - `"You do not have permissions to update the comment of this record"`
    
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

    - `"You do not have permissions to update the location of this record"`

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



#### Update Status of Red Flag Record
Updates the status of an existing Red Flag record

* **URL**
  ##### Online 
    https://sans-stitches.herokuapp.com/api/v1/red-flags/:red-flag-id/status

  ##### Locally
    http://localhost:4000/api/v1/red-flags/:red-flag-id/status

* **Method:**

  `PATCH`
  
* **Headers Required**

  `Authorization= "Bearer " + token`

* **URL Params**

    **Required:**
    
    `red-flag-id=[integer]`

* **Data Params**

    **Required:**
    
    `status=[string]`
    
    **Not Required:**
    
    `feedback=[string]`    

* **Success Response:**

  * **status:** 200
  
  * **data:** `[ {`
  
    `id: <Id of updated record>`, 
    
    `message : "Updated intervention record’s status to " + <status-passed>`, 
    
    `updatedRecord: {<Udpated Record>}`
    
    `} ]`

* **Error Responses:**

  * **status:** 400 BAD REQUEST
  
  * **error:** `[`
  
    (One of)
    
    - `{ status: "Status is Required" } `
    
    - `{ status: "Invalid Status" }`

    - `{ feedback: "Invalid Feedback" }`
    
    `]`
    
   OR

  * **status:** 403 FORBIDDEN

  * **error:** 

    (One of)

    - `"You do not have permissions to update the status of this record"`

    - `"Request has no Token, Please Login or SignUp"`

 OR

  * **status:** 404 NOT FOUND

  * **error:** `"Record does not exist"`

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/red-flags/3/status",
        method: "PATCH",
        headers: {
            "authorization": "Bearer " + token;
        },
        data: {
            status: "resolved",
            feedback: "Thanks to you the senator will not be embezzling public funds anymore",
        }
    }).done(() => {
        //Do something with data
       });
  ```

### Intervention

#### Get all Intervention Records
Returns all intervention records

* **URL**
  ##### Online 
  https://sans-stitches.herokuapp.com/api/v1/interventions

  ##### Locally
  http://localhost:4000/api/v1/interventions

* **Method:**

  `GET`

* **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **status:** 200 
  
  * **data:** `[ <Intervention-record-objects> ]`

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/interventions",
        method: "GET",
    }).done(() => {
        //Do something with data
       });
  ```


#### Get Specific Intervention Record
Returns an existing intervention record

* **URL**
  ##### Online 
  https://sans-stitches.herokuapp.com/api/v1/interventions/:intervention-id

  ##### Locally
  http://localhost:4000/api/v1/interventions/:intervention-id

* **Method:**

  `GET`

* **URL Params**

    **Required:**
    
    `intervention-id=[integer]`

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
        url: "https://sans-stitches.herokuapp.com/api/v1/interventions/3",
        method: "GET",
    }).done(() => {
        //Do something with data
       });
  ```

#### Create Intervention Record
Creates a new intervention record

* **URL**
  ##### Online 
    https://sans-stitches.herokuapp.com/api/v1/interventions

  ##### Locally
    http://localhost:4000/api/v1/interventions

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
  
  `message : "Created intervention record"` , 
  
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
        url: "https://sans-stitches.herokuapp.com/api/v1/interventions",
        method: "POST",
        headers: {
            "authorization": "Bearer " + token;
        }
        data: {
            comment: 'Bad roads in surulere',
            latitude: '3.444488',
            longitude: '-30.44',
            description: "It is causing accidents almost every day",
            images: ["https://filehostingplatform.com/abcd.jpg", "https://filehostingplatform.com/abcd.jpg"],
            video: "https://filehostingplatform.com/abcd.jpg",
        },
    }).done(() => {
        //Do something with data
       });
  ```

#### Delete Intervention Record

Deletes an existing intervention record

* **URL**

  ##### Online 

    https://sans-stitches.herokuapp.com/api/v1/interventions/:intervention-id

  ##### Locally

    http://localhost:4000/api/v1/interventions/:intervention-id

* **Method:**

  `DELETE`
  
* **Headers Required**

  `Authorization = "Bearer " + token`

* **URL Params**

    **Required:**
   
    `intervention-id=[integer]`

* **Data Params**

    None

* **Success Response:**

  * **status:** 200   
  * **data:** `[ {`

     `id: <Id of deleted record>`, 

     `message : "intervention record has been deleted"`,

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
        url: "https://sans-stitches.herokuapp.com/api/v1/interventions/3",
        method: "DELETE",
        headers: {
            "authorization": "Bearer " + token;
        },
    }).done(() => {
        //Do something with data
       });
  ```



#### Update Comment of Intervention Record
Updates the comment of an existing Intervention record

* **URL**
  ##### Online 
    https://sans-stitches.herokuapp.com/api/v1/interventions/:intervention-id/comment

  ##### Locally
    http://localhost:4000/api/v1/interventions/:intervention-id/comment

* **Method:**

  `PATCH`
  
* **Headers Required**

  `Authorization= "Bearer " + token`

* **URL Params**

    **Required:**
   
    `intervention-id=[integer]`

* **Data Params**

    **Required:**
    
    `comment=[string]`

    **Not Required:**
    
    None

* **Success Response:**

  * **status:** 200
  
  * **data:** `[ {`
  
    `id: <Id of updated record>`, 
    
    `message : "Updated intervention record’s comment"`,
    
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
    
    - `"You do not have permissions to update the comment of this record"`
    
    - `"Request has no Token, Please Login or SignUp"`
    
  OR
  
  * **status:** 404 NOT FOUND
  
  * **error:** `"Record does not exist"`

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/interventions/3/comment",
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

#### Update Location of Intervention Record
Updates the location of an existing Intervention record

* **URL**
  ##### Online 
    https://sans-stitches.herokuapp.com/api/v1/interventions/:intervention-id/location

  ##### Locally
    http://localhost:4000/api/v1/interventions/:intervention-id/location

* **Method:**

  `PATCH`
  
* **Headers Required**

  `Authorization= "Bearer " + token`

* **URL Params**

    **Required:**
    
    `intervention-id=[integer]`

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
    
    `message : "Updated intervention record’s location"`, 
    
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

    - `"You do not have permissions to update the location of this record"`

    - `"Request has no Token, Please Login or SignUp"`

 OR

  * **status:** 404 NOT FOUND

  * **error:** `"Record does not exist"`

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/interventions/3/location",
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



#### Update Status of Intervention Record
Updates the status of an existing Intervention record

* **URL**
  ##### Online 
    https://sans-stitches.herokuapp.com/api/v1/interventions/:intervention-id/status

  ##### Locally
    http://localhost:4000/api/v1/interventions/:intervention-id/status

* **Method:**

  `PATCH`
  
* **Headers Required**

  `Authorization= "Bearer " + token`

* **URL Params**

    **Required:**
    
    `intervention-id=[integer]`

* **Data Params**

    **Required:**
    
    `status=[string]`
    
    **Not Required:**
    
    `feedback=[string]`    

* **Success Response:**

  * **status:** 200
  
  * **data:** `[ {`
  
    `id: <Id of updated record>`, 
    
    `message : "Updated intervention record’s status to " + <status-passed>`, 
    
    `updatedRecord: {<Udpated Record>}`
    
    `} ]`

* **Error Responses:**

  * **status:** 400 BAD REQUEST
  
  * **error:** `[`
  
    (One of)
    
    - `{ status: "Status is Required" } `
    
    - `{ status: "Invalid Status" }`

    - `{ feedback: "Invalid Feedback" }`
    
    `]`
    
   OR

  * **status:** 403 FORBIDDEN

  * **error:** 

    (One of)

    - `"You do not have permissions to update the status of this record"`

    - `"Request has no Token, Please Login or SignUp"`

 OR

  * **status:** 404 NOT FOUND

  * **error:** `"Record does not exist"`

* **Sample Call:**
  ```javascript
    $.ajax({
        url: "https://sans-stitches.herokuapp.com/api/v1/interventions/3/status",
        method: "PATCH",
        headers: {
            "authorization": "Bearer " + token;
        },
        data: {
            status: "rejected",
            feedback: "Weak supporting evidence",
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

