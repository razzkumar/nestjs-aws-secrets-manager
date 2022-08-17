import { Inject, Injectable, Logger } from '@nestjs/common';

import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

import { AWS_SECRETS_MANAGER_MODULE_OPTIONS } from './contstants';
import { AWSSecretsManagerModuleOptions } from './aws-secrets-manager.interface';

@Injectable()
export class AWSSecretsService {
  private readonly logger = new Logger(AWSSecretsService.name);

  constructor(
    @Inject(AWS_SECRETS_MANAGER_MODULE_OPTIONS)
    private readonly options: AWSSecretsManagerModuleOptions,
  ) {
    this.setAllSecrectToEnv();
  }

  async setAllSecrectToEnv() {
    const secrets = await this.getAllSecrects();

    if (this.options.isSetToEnv) {
      Object.keys(secrets).forEach((key) => {
        process.env[key] = secrets[key];
      });
    }
    if (this.options.isDebug) {
      this.logger.log(JSON.stringify(secrets, null, 2));
    }
  }

  async getAllSecrects<T>() {
    const commands = this.options.secretsArn.map(
      (secretId) =>
        new GetSecretValueCommand({
          SecretId: secretId,
        }),
    );

    const resp = commands.map((command) =>
      this.options.secretsManager.send(command),
    );

    const secrets = await Promise.all(resp);

    const response = secrets.reduce((acc, secret) => {
      const sec = JSON.parse(secret.SecretString);

      const allSecrets = {
        ...acc,
        ...sec,
      };
      return allSecrets;
    }, {});

    return response as T;
  }

  async getSecrets<T>(secretId: string) {
    const command = new GetSecretValueCommand({
      SecretId: secretId,
    } as any);

    const secret = await this.options.secretsManager.send(command);

    return JSON.parse(secret.SecretString) as T;
  }
}
