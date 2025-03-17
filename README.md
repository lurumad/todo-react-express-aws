# Todo's fullstack project

## Description

This project is a fullstack project that allows users to create, read, update and delete todo's. The project is built with React, Node.js, Express and AWS. The reason for this project is to learn how to build a fullstack project and to learn how to deploy a fullstack project to AWS using AWS CDK (Cloud Development Kit) as infrastructure as code.

The project is built with TypeScript and uses Tailwind CSS for styling. The frontend is built with React and the backend is built with Node.js and Express. The database is AWS DynamoDB. The project is deployed to AWS using AWS CDK and Github Actions.

The project has been built using NPM Workspaces to manage the frontend and backend in the same repository.

## Table of contents

- [Todo's fullstack project](#todos-fullstack-project)
  - [Description](#description)
  - [Table of contents](#table-of-contents)
  - [Technologies](#technologies)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Infrastructure](#infrastructure)

## Technologies

- Frontend:

  - TypeScript
  - React
  - Tailwind CSS
  - Tanstack React Query
  - Vite
  - Vitest
  - React Testing Library
  - Jest

- Backend:
  - Node.js
  - Express
  - Problem Details for HTTP APIs
  - Vite
  - Vitest
  - Docker
- Database:
  - AWS DynamoDB
- Deployment:
  - AWS CDK
  - Github Actions

## Prerequisites

I recommend having the following tools installed on your machine:

- Git (https://git-scm.com)
- Visual Studio Code (https://code.visualstudio.com)
- Node.js > 20 (https://nodejs.org/en) or NVM (https://github.com/nvm-sh/nvm)
- Docker (https://www.docker.com)
- AWS Account (https://aws.amazon.com) if you want to deploy the project to AWS.

## Setup

1. Clone the repository

```bash
git clone git@github.com:lurumad/todo-react-express-aws.git
```

2. Install dependencies

```bash
npm install
```

3. Create an OAuth Client in your [Google Cloud Console](https://console.cloud.google.com/auth/clients?inv=1&invt=Abr73A&project=todo-449811) following the instructions [here](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred)

4. Set the Client ID as environment variable by copying `env.template` to `.env.local` file in the `frontend` directory. Setting the `VITE_GOOGLE_CLIENT_ID` variable to the Client ID you created in the Google Cloud Console:

```bash
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
```

5. Start the DynamoDB local server

You can do this by running the following command:

```bash
docker-compose up -d
```

This will start the DynamoDB local server on port 8000 and create a table called `Todos`. If you want to connect to the DynamoDB local server, you can use NoSQL Workbench or the AWS CLI.

6. Start the projects

Then, you can start the frontend and backend by running the following command in the root directory:

```bash
npm run dev
```

This will start the frontend on port 3000 and the backend on port 3001.

## Infrastructure

To deploy the project I have used AWS CDK (Cloud Development Kit) as infrastructure as code. The infrastructure is defined in the `infra` directory. It leverages on Github Actions to deploy the project to AWS.

![image](docs/Fullstack%20AWS.jpg)
