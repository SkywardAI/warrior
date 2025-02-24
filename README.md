# WARRIOR

This app uses VITE+REACT and AWS SDK JavaScript v3 performs AI chat using AWS Bedrock Models.  
Current models are hard-coded in `src/utils/types.js`, edit it to edit the model options.  



https://github.com/user-attachments/assets/3808850f-be1b-4967-b36b-02481ac84268



## Environment Variables
To use this application, an AWS Account is required. Please use your own account and have `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN` ready.  
Create a file `.env.local` and place your credentials in there, have `VITE_` before:
```dotenv
VITE_AWS_ACCESS_KEY_ID=EXAMPLEACCESSKEYID
VITE_AWS_SECRET_ACCESS_KEY=EXAMPLESECRETKEY
VITE_AWS_SESSION_TOKEN=EXAMPLETOKEN
```

## Run application
Run following commands to make sure you installed depedencies
```sh
npm install -g pnpm
pnpm intall
```
> **NOTE**  
> The depedencies are managed by `pnpm`, if you already have `pnpm` installed, you can skip the first line. If you want to use other package manager, also feel free to do so.  
___
Run following command to start the application in development mode:
```sh
pnpm run dev
```
And open the link it shows in your browser.  
___
You can also run following command to build and start the application:
```sh
pnpm run build
cd dist
serve
```
> **NOTE**  
> `serve` is a npm package you might also want to install to serve it locally. To install it, simply run `pnpm install -g serve`. You can use any other applications you are familiar with to host the application.
