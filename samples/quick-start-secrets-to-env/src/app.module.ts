import { Module } from '@nestjs/common';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { AWSSecretsManagerModule, AWSSecretsManagerModuleOptions, } from 'nestjs-aws-secrets-manager';

import { AppService } from './app.service';
import { AppController } from './app.controller';

const AWSSecretsManagerProps: AWSSecretsManagerModuleOptions = {
  secretsManager: new SecretsManagerClient({
    region: "ap-south-1"
  }),
  isSetToEnv: true, // set all secrets to env variables which will be available in process.env or @nest/config module
  secretsSource: "test/sm" // OR array or secrets name or ARN  [ "db/prod/config" ,"app/prod/config"],
};


@Module({
  imports: [
    AWSSecretsManagerModule.forRoot(AWSSecretsManagerProps)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
