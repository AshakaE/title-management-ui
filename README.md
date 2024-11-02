## Title Maangement

## Getting Started

Clone the API for this project @ [title-management-api](https://github.com/AshakaE/title-management-api) and follow the Readme instructions

Installation

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Tests

```bash
yarn test
```

## Endpoints
To use the backend API, follow these steps: ...

## Authentication
Provide the `Authorization` header with a Bearer token for `/api/v1/auth/login` and `/api/v1/titles`

### [POST] /api/v1/auth/register

**Method**: `POST`
**URL**: `https://api.example.com/api/v1/auth/register

### Body
```json
{
  "username": "username",
  "email": "username@email.com",
  "password": "username123"
}
```

### Response
```json
{
  "user": {
    "username": "username",
    "email": "username@email.com",
    "password": "$2a$08$kKdhs4z7vrz682wmQzrh1u2r08VJOrpy.W5wcCK.LpLfJRXNhGMX6",
    "updatedAt": "2024-11-02T10:48:27.369Z",
    "createdAt": "2024-11-02T10:48:27.369Z",
    "deletedAt": null,
    "uuid": "f6a813b1-04bd-4a2e-8767-3d1ff905dbec"
  }
}
```

### [POST] /api/v1/auth/login

**Method**: `POST`
**URL**: `https://api.example.com/api/v1/auth/login`
**Headers**:
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Body
```json
{
  "username": "value1",
  "password": "value2"
}
```

### Response
```json
{
  "token": "Bearer eyJhbGciOiJIUzI1...........9BMx2Cb2Xs7_Jn6Y4eAgHCjEheYGafeOuuyjW6GszS0"
}
```

### [POST] /api/v1/title

**Method**: `POST`
**URL**: `https://api.example.com/api/v1/title`
**Headers**:
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Body
```json
{
  "title": "title value",
  "subject": "subject value"
}
```

### Response
```json
{
  "title": "title value",
  "subject": "subject value",
  "userId": {
    "createdAt": "2024-10-31T15:47:25.598Z",
    "updatedAt": "2024-10-31T15:47:25.598Z",
    "deletedAt": null,
    "uuid": "35863c7c-55c4-4c78-80e0-0e6ae45286ce",
    "username": "test4",
    "email": "test4@email.com",
    "password": "$2a$08$oFW6W5iAs/QU.u1qROMPtuWyQXT069HBZlgiXV8/qD/KsdVmgPh0C"
  },
  "updatedAt": "2024-11-02T10:51:33.761Z",
  "createdAt": "2024-11-02T10:51:33.761Z",
  "deletedAt": null,
  "uuid": "62482912-1a9d-4f45-b5e4-48af3b378bda"
}
```

### [DELETE] /api/v1/title/:uuid

**Method**: `DELETE`
**URL**: `https://api.example.com/api/v1/title/:uuid`
**Headers**:
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Response
```json
status code 204, no content
```

## Change Log

- Updated `loginHandler` to return proper error messages instead of null.
- Updated `TitleEntity` with a column for subject.
- Added `deleteTitleHandler` for deleting titles.
- Disabled `validateIp`function in routeMiddleware, because `req-bans` module is not functional.
- Added sort order descending by 'createdAt` for presenting last added title at the top of result
