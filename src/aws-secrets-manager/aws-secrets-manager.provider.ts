import { Provider, Type } from '@nestjs/common';

import {
  AWSSecretsManagerModuleOptions,
  AWSSecretsManagerModuleAsyncOptions,
  AWSSecretsManagerModuleOptionsFactory,
} from './aws-secrets-manager.interface';
import { AWSSecretsService } from './aws-secrets-manager.service';
import { AWS_SECRETS_MANAGER_MODULE_OPTIONS } from './contstants';

export function createAWSSecretsManagerProviders(
  options: AWSSecretsManagerModuleOptions,
): Provider[] {
  return [
    AWSSecretsService,
    {
      provide: AWS_SECRETS_MANAGER_MODULE_OPTIONS,
      useValue: options,
    },
  ];
}

export function createAWSSecretsManagerAsyncProviders(
  options: AWSSecretsManagerModuleAsyncOptions,
): Provider[] {
  const providers: Provider[] = [AWSSecretsService];
  if (options.useClass) {
    const useClass =
      options.useClass as Type<AWSSecretsManagerModuleOptionsFactory>;
    providers.push(
      ...[
        {
          provide: AWS_SECRETS_MANAGER_MODULE_OPTIONS,
          useFactory: async (
            optionsFactory: AWSSecretsManagerModuleOptionsFactory,
          ) => await optionsFactory.createAWSSecrectsManagerModuleOptions(),
          inject: [useClass],
        },
        {
          provide: useClass,
          useClass,
        },
      ],
    );
  }

  if (options.useFactory) {
    providers.push({
      provide: AWS_SECRETS_MANAGER_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    });
  }

  return providers;
}
