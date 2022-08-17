import { DynamicModule, Global, Module } from '@nestjs/common';

import { AWS_SECRETS_ARN, AWS_SECRETS_MANAGER_TOKEN, AWS_SECRETS_SET_ENV } from './contstants';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { AWSSecretsService } from './aws-secrets-manager.service';

export interface AWSSecretsManagerModuleOptions {
  secretsManager: SecretsManagerClient;
  isSetToEnv: boolean;
  secretsArn: string[];
}

@Global()
@Module({})
export class AWSSecretsManagerModule {
  static forRoot({
    secretsManager,
    isSetToEnv = true,
    secretsArn,
  }: AWSSecretsManagerModuleOptions): DynamicModule {
    return {
      module: AWSSecretsManagerModule,
      providers: [
        AWSSecretsService,
        {
          provide: AWS_SECRETS_MANAGER_TOKEN,
          useValue: secretsManager,
        },
        {
          provide: AWS_SECRETS_SET_ENV,
          useValue: isSetToEnv,
        },
        {
          provide: AWS_SECRETS_ARN,
          useValue: secretsArn,
        }
      ],
      exports: [AWSSecretsService],
    };
  }
}
