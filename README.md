# naija-tour

A tour management website created with nodeJS, pug, and mongoDB.

<details>
  <summary>Demo User</summary>

> | Email Address        | Password | Access      |
> | -------------------- | -------- | ----------- |
> | `ayinla@example.com` | holla123 | User access |

You can also create fully interactive user accounts

Stripe payment is in test mode, use 4242 4242 4242 4242 as card number, other fields may be filled randomly.

</details>

## Technologies Used

- [NodeJS](https://nodejs.org/en/download/)
- [ExpressJS](https://expressjs.com/)
- [Mongo Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose](https://mongoosejs.com/)
- [Pug](https://pugjs.org/)

## Project Pipeline

- [UI](https://naijatours.herokuapp.com)
- [Hosted API](https://naijatours.herokuapp.com/api/v1)
- [API Docs](https://documenter.getpostman.com/view/9950313/SWTABJjh?version=latest)

### Installing/Run locally

- Make sure you have `nodejs` installed.

- Clone or fork repo🤷‍♂

  ```bash
    - git clone https://github.com/supercede/naija-tour.git
    - cd naija-tour
    - npm install
  ```

- Create/configure `.env` environment with your credentials

- Run `npm run dev` to start the server and watch for changes.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- [NodeJS](https://nodejs.org/en/download/)
- [Mongo Compass](https://www.mongodb.com/products/compass), Not neccessary but could be useful for visualizing documents.

## HTTP Requests

All API requests are made by sending a secure HTTPS request using one of the following methods, depending on the action being taken:

- `POST` Create a resource
- `GET` Get a resource or list of resources
- `PATCH` Update a resource
- `DELETE` Delete a resource

For `POST` and `PATCH` requests, the body of your request may include a JSON payload.

### HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- `200` `OK` The request was successful
- `201` `Created` Successful request, A new resource has been created
- `204` `No Content` Request was successful but there's no request returned (Used in Delete requests)
- `400` `Bad Request` There was a problem with the request (security, malformed)
- `401` `Unauthorized` The supplied API credentials are invalid
- `403` `Forbidden` The credentials provided do not have permissions to access the requested resource
- `404` `Not Found` An attempt was made to access a resource that does not exist in the API
- `500` `Server Error` An error on the server occurred

## Documentation

Check Documentation on [Postman](https://documenter.getpostman.com/view/9950313/SWTABJjh?version=latest)
