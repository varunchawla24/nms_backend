import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
require('dotenv').config();
const client = require('./database');
const PORT = process.env.PORT || 3001;
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api/v1");

  app.use(cors());

  //create custom headers to solve cors isssue 
  const customHeaders = (req, res, next) => {
    res.header("Accept", "application/json, text/plain,*/*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.set("Access-Control-Allow-Private-Network", "true")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept ,Authorization ,Access-Control-Allow-Origin ,Access-Control-Allow-Methods ,access-token ,lang");
    next();
  }

  client.getConnection(function(err, connection) {
    if(err){
      console.log('database not connected');
      throw err
    } else{
       console.log('connected');
    }
});
  app.use(customHeaders);

  app.useGlobalPipes(new ValidationPipe())
  process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node.js docs)
  })

  await app.listen(PORT);
  console.log(`server listening on PORT : ${PORT}`)

}
bootstrap();

