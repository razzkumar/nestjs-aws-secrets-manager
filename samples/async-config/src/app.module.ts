import { Module } from '@nestjs/common';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { AWSSecretsManagerModule } from 'nestjs-aws-secrets-manager';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AWSSecretsManagerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        secretsManager: new SecretsManagerClient({
          region: configService.get('AWS_REGION')
        }),
        isSetToEnv: true, // set all secrets to env variables which will be available in process.env or @nest/config module
        secretsSource: { 
          secret1: configService.get('AWS_SECRET_ID') // name or array of secret names
        },
        isDebug: configService.get('NODE_ENV') === 'development'
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
