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
