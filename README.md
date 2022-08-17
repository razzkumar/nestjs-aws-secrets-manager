<p align="center">
  <a href="http://nestjs.com"><img alt="Nest Logo" src="https://nestjs.com/img/logo-small.svg" width="120" /></a>
</p>

<p align="center">
  A <a href="https://github.com/nestjs/nest">Nest</a> module wrapper for <a href="https://aws.amazon.com/secrets-manager/">aws secrets manager</a> 
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/nestjs-aws-secrets-manager"><img alt="NPM version" src="https://img.shields.io/npm/v/nestjs-aws-secrets-manager.svg" /></a>
  <a href="https://www.npmjs.com/package/nestjs-aws-secrets-manager"><img alt="NPM downloads" src="https://img.shields.io/npm/dw/nestjs-aws-secrets-manager.svg" /></a>
  <a href="https://github.com/gremo/nestjs-aws-secrets-manager/pulse"><img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/gremo/nestjs-aws-secrets-manager"></a>
  <a href="https://github.com/gremo/nestjs-aws-secrets-manager/graphs/contributors" alt="Contributors"><img src="https://img.shields.io/github/contributors/gremo/nestjs-aws-secrets-manager" /></a>
  <!-- <a href="https://paypal.me/razzkumar" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a> -->
</p>


## Installation

```bash
npm install --save nestjs-aws-secrets-manager @aws-sdk/client-secrets-manager
```

Having troubles configuring `nestjs-aws-secrets-manager`? Clone this repository and `cd` in a sample:

```bash
cd samples/quick-start
npm install
npm run start:dev
```

## Quick start

Import `AWSSecretsManagerModule` into the root `AppModule` and use the `forRoot()` method to configure it. This method accepts the object as `AWSSecretsManagerModuleOptions`, you also can full example code

```typescript
import { Module } from '@nestjs/common';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import { AWSSecretsManagerModule, AWSSecretsManagerModuleOptions } from 'nestjs-aws-secrets-manager';

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

```

### Create the Secrets Manager Service

```typescript
import { Injectable } from '@nestjs/common';
import { AWSSecretsService } from 'nestjs-aws-secrets-manager';

interface DBCredentials {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

@Injectable()
export class AWSDBCredentialsService {
  constructor(private readonly secretsRetrieverService: AWSSecretsService) { }

  async getDBCredentials(): Promise<DBCredentials> {
    return await this.secretsRetrieverService.getSecretsByID<DBCredentials>('db-credentials'); // where db-credentials is the secret id
  }
}

```

### set env varialbes from aws secrets manager

```typescript
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

```

Afterward, Aws secrets from provided `secretsSource` can be access via `process.env` for `@nestjs/config` module

## Async configuration

> **Caveats**: because the way Nest works, you can't inject dependencies exported from the root module itself (using `exports`). If you use `forRootAsync()` and need to inject a service, that service must be either imported using the `imports` options or exported from a [global module](https://docs.nestjs.com/modules#global-modules).
Maybe you need to asynchronously pass your module options, for example when you need a configuration service. In such case, use the `forRootAsync()` method, returning an options object from the `useFactory` method:

```typescript

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
        secretsSource: [
          configService.get('AWS_SECRET_ID') // name or array of secret names
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
```

The factory might be async, can inject dependencies with `inject` option and import other modules using the `imports` option.


### Options

Configuration options parameter `AWSSecretsManagerModuleOptions`

```typescript
export interface AWSSecretsManagerModuleOptions {
  secretsManager: SecretsManagerClient;
  isSetToEnv?: boolean;
  secretsArn?: string | string[];
  isDebug?: boolean;
}
```

## Contributing

New features and bugfixes are always welcome! In order to contribute to this project, follow a few easy steps:

<!-- <p align="center"> -->
<!--   <a href="https://paypal.me/marcopolichetti" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a> -->
<!-- </p> -->

1. [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) this repository and clone it on your machine
2. Open the local repository with [Visual Studio Code](https://code.visualstudio.com/) with the remote development feature enabled (install the [Remote Development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack))
3. Create a branch `my-awesome-feature` and commit to it
4. Run `npm run lint`, `npm run format` and `npm run build` and verify that they complete without errors
5. Push `my-awesome-feature` branch to GitHub and open a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)

## Stay in touch

- Author - [razzkumar](mailto::razzkumar.dev@gmail.com)

## License

nestjs-aws-secrets-manager is [MIT licensed](LICENSE).
