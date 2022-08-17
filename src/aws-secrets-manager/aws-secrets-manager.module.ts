import { DynamicModule, Global, Module } from '@nestjs/common';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import { AWSSecretsService } from './aws-secrets-manager.service';
import { AWS_SECRETS_ARN, AWS_SECRETS_DEBUG, AWS_SECRETS_MANAGER_TOKEN, AWS_SECRETS_SET_ENV } from './contstants';

export interface AWSSecretsManagerModuleOptions {
  secretsManager: SecretsManagerClient;
  isSetToEnv?: boolean;
  secretsArn: string[];
  isDebug?: boolean;
}

@Global()
@Module({})
export class AWSSecretsManagerModule {
  static forRoot({
    secretsManager,
    isSetToEnv = true,
    secretsArn,
    isDebug = false,
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
        },
        {
          provide: AWS_SECRETS_DEBUG,
          useValue: isDebug
        }
      ],
      exports: [AWSSecretsService],
    };
  }
}
