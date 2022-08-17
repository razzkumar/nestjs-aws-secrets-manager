import { Module } from '@nestjs/common';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import { AWSSecretsManagerModule, AWSSecretsManagerModuleOptions, } from 'nestjs-aws-secrets-manager';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AWSDBCredentialsService } from './aws-secrets.service';

const AWSSecretsManagerProps: AWSSecretsManagerModuleOptions = {
  secretsManager: new SecretsManagerClient({
    region: "ap-south-1"
  }),
};


@Module({
  imports: [
    AWSSecretsManagerModule.forRoot(AWSSecretsManagerProps),
    AWSDBCredentialsService
  ],
  controllers: [AppController],
  providers: [AppService, AWSDBCredentialsService],
})
export class AppModule { }
