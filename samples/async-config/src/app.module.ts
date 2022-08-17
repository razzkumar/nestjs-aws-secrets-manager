import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Module } from '@nestjs/common';
import { AWSSecretsManagerModule } from 'nestjs-aws-secrets-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
        secretsSource: [
          configService.get('AWS_SECRET_ID')
        ],
        isDebug: configService.get('NODE_ENV') === 'development'
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
