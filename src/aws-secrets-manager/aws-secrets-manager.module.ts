import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  AWSSecretsManagerModuleAsyncOptions,
  AWSSecretsManagerModuleOptions,
} from './aws-secrets-manager.interface';
import {
  createAWSSecretsManagerAsyncProviders,
  createAWSSecretsManagerProviders,
} from './aws-secrets-manager.provider';

import { AWSSecretsService } from './aws-secrets-manager.service';

@Global()
@Module({})
export class AWSSecretsManagerModule {
  static forRoot(options: AWSSecretsManagerModuleOptions): DynamicModule {
    const providers = createAWSSecretsManagerProviders(options);
    return {
      module: AWSSecretsManagerModule,
      providers,
      exports: [AWSSecretsService],
    };
  }

  public static forRootAsync(
    options: AWSSecretsManagerModuleAsyncOptions,
  ): DynamicModule {
    const providers = createAWSSecretsManagerAsyncProviders(options);

    return {
      module: AWSSecretsManagerModule,
      imports: options.imports,
      providers: providers,
      exports: providers,
    } as DynamicModule;
  }
}
