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
    if (this.options.secretsSource && this.options.isSetToEnv) {
      this.setAllSecrectToEnv();
    }
  }

  async setAllSecrectToEnv() {
    try {
      const secrets = await this.getAllSecrects();

      if (!secrets) {
        this.logger.warn('There is no secrets to set in env');
        return;
      }

      Object.keys(secrets).forEach((key) => {
        process.env[key] = secrets[key];
      });

      this.logger.log(
        `All secrets from aws secrets manager(id: ${JSON.stringify(
          this.options.secretsSource,
        )}) are set to env`,
      );

      if (this.options.isDebug) {
        this.logger.log(JSON.stringify(secrets, null, 2));
      }
    } catch (err: any) {
      this.logger.error(err.message);
    }
  }

  async getAllSecrects<T>() {
    try {
      const secretsIds = Array.isArray(this.options.secretsSource)
        ? this.options.secretsSource
        : [this.options.secretsSource];

      if (!Boolean(secretsIds.length)) {
        this.logger.log('Secrets source is empty');
      }

      const commands = secretsIds.map(
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
    } catch (e: any) {
      this.logger.error(`Unable to fetch secrets(${e.message})`);
    }
  }

  async getSecretsByID<T>(secretId: string) {
    try {
      const command = new GetSecretValueCommand({
        SecretId: secretId,
      } as any);

      const secret = await this.options.secretsManager.send(command);

      return JSON.parse(secret.SecretString) as T;
    } catch (e: any) {
      this.logger.error(`Unable to fetch secrets(${e.message})`);
    }
  }
}
