import { Injectable } from '@nestjs/common';
import { AWSDBCredentialsService } from './aws-secrets.service';

@Injectable()
export class AppService {
  constructor(private readonly awsDbsecretService: AWSDBCredentialsService) { } // just for demo we can use this for db connets

  async getHello() {

    const dbCredentials = await this.awsDbsecretService.getDBCredentials();

    console.log(dbCredentials);

    return JSON.stringify(dbCredentials);
  }
}
