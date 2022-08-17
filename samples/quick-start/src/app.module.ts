import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Module } from '@nestjs/common';
import { AWSSecretsManagerModule, AWSSecretsManagerModuleOptions, } from 'nestjs-aws-secrets-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const AWSSecretsManagerProps: AWSSecretsManagerModuleOptions = {
  secretsManager: new SecretsManagerClient({
    region: "ap-south-1"
  }),
  isSetToEnv: true,
  secretsArn: [
    "arn:aws:secretsmanager:ap-south-1:226134266737:secret:test/sm-lkcVqD"
  ]
};


@Module({
  imports: [
    AWSSecretsManagerModule.forRoot(AWSSecretsManagerProps)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
