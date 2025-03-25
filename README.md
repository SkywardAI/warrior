# WARRIOR

This app uses VITE+REACT + Node.JS and AWS SDK JavaScript v3 performs AI chat using AWS Bedrock Models.


https://github.com/user-attachments/assets/3808850f-be1b-4967-b36b-02481ac84268


## Environment variables

Possible environment variables are listed:
### Backend

> [!NOTE]  
> Please edit your [backend/.env](backend/.env) file or create a file called `.env.local` inside `backend/` for following environment variables.  
> It is strongly recommended to have `.env.local` to store your credentials

* `PORT`: The port your application is going to listen, default `3000`.
* `HOST`: The host your application is going to use, default `0.0.0.0`.

**AWS Settings**  
* `AWS_REGION`: Specify the AWS region you are going to use, not required.
* `AWS_ACCESS_KEY_ID`: Required if you want to put credentials inside environment file.
* `AWS_SECRET_ACCESS_KEY`: Required if you want to put credentials inside environment file.
* `AWS_SESSION_TOKEN`: Not required, but some accounts would require this as well to perform a success validation.

> [!NOTE]  
> If you have AWS CLI installed, you can login use `aws sso login` and directly use this application.  
> Tutorial setting up AWS CLI can be find here: [tutorial](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)  

### Frontend

> [!NOTE]  
> Please edit your [frontend/.env](frontend/.env) file or create a file called `.env.local` inside `frontend/` for following environment variables.    
> `.env.local` will override `.env` automatically, so it is recommended to have your own `.env.local` file if you want to change configurations.  

> [!NOTE]  
> All frontend environment variables must starts with `VITE_` to make sure  the app loads them.  

* `VITE_MAX_WEBSOCKET_RETRY`: The maximum retry of websocket, default `3`, set to `-1` will allow infinite retry.
* `VITE_WEBSOCKET_RETRY_INTERVAL`: The retry interval in milliseconds, default `100`.
* `VITE_WS_DEV_ROUTE`: The route for websocket connection at development environment, default `ws://localhost:3000/api/ws`.
* `VITE_WS_PROD_ROUTE`: The route for websocket connection at production environment, default `/api/ws`.
* `VITE_DEV_BASE_ROUTE`: The base route for RESTful APIs at development environment, default `http://localhost:3000/api`.
* `VITE_PROD_BASE_ROUTE`: The base route for RESTful APIs at production environment, default `/api`.

## Develop, build and run this application

### Dependencies
Run following commands to make sure you installed depedencies:
```sh
pnpm install
```

### Develop
To start develop, run command:
```sh
pnpm dev
```
Open the frontend route (default [http://localhost:5173](http://localhost:5173) in your web browser.)

### Build & Start
To build and run this application, simply run:
```sh
pnpm build
pnpm start
```

And open the backend route (default [http://localhost:3000](http://localhost:3000) in your web browser.)

# LICENSE

Apache License Version 2.0

Copyright [2025] [SkywardAI]