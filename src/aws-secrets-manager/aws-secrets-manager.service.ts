import { Inject, Injectable, Logger } from '@nestjs/common';

import { GetSecretValueCommand, SecretsManager } from '@aws-sdk/client-secrets-manager';

import { AWS_SECRETS_MANAGER_TOKEN, AWS_SECRETS_ARN, AWS_SECRETS_SET_ENV, AWS_SECRETS_DEBUG } from './contstants';

@Injectable()
export class AWSSecretsService {

  private readonly logger = new Logger(AWSSecretsService.name);

  constructor(
    @Inject(AWS_SECRETS_MANAGER_TOKEN)
    private readonly secretsManager: SecretsManager,

    @Inject(AWS_SECRETS_SET_ENV)
    private readonly isSetToEnv: boolean,

    @Inject(AWS_SECRETS_ARN)
    private readonly secretsArns: string[],

    @Inject(AWS_SECRETS_DEBUG)
    private readonly isDebug: Boolean
  ) {
    this.setAllSecrectToEnv();
  }

  async setAllSecrectToEnv() {
    const secrets = await this.getAllSecrects();

    if (this.isSetToEnv) {
      Object.keys(secrets).forEach(key => {
        process.env[key] = secrets[key];
      }
      );
    }
    if (this.isDebug) {
      this.logger.log(JSON.stringify(secrets, null, 2));
    }
  }

  async getAllSecrects<T>() {

    const commands = this.secretsArns.map(secretId => new GetSecretValueCommand({
      SecretId: secretId,
    }));

    const resp = commands.map(command => this.secretsManager.send(command));

    const secrets = await Promise.all(resp);

    const response = secrets.reduce((acc, secret) => {
      const sec = JSON.parse(secret.SecretString);

      const allSecrets = {
        ...acc,
        ...sec,
      }
      return allSecrets;
    }
      , {});

    return response as T;

  }

  async getSecrets<T>(secretId: string) {
    const command = new GetSecretValueCommand({
      SecretId: secretId,
    } as any);

    const secret = await this.secretsManager.send(command);

    return JSON.parse(secret.SecretString) as T
  }

}
