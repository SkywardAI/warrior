# WARRIOR

This app uses VITE+REACT + Node.JS and AWS SDK JavaScript v3 performs AI chat using AWS Bedrock Models.  =


https://github.com/user-attachments/assets/3808850f-be1b-4967-b36b-02481ac84268


## Environment variables
To use this application, an AWS Account is required. Please use your own account and have `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN` ready.  
Create a file called `.env.local` at root level:
```dotenv
AWS_ACCESS_KEY_ID=EXAMPLEACCESSKEYID
AWS_SECRET_ACCESS_KEY=EXAMPLESECRETKEY
AWS_SESSION_TOKEN=EXAMPLETOKEN
```

If you have AWS CLI installed, you can login use sso session and directly use this application. Make sure your account has access to Bedrock models.

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