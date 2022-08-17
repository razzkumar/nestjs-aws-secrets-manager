import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(private readonly configService: ConfigService) { }

  getHello(): string {
    return JSON.stringify({
      RANDOM: this.configService.get('RANDOM'), // check if the environment variable is set or not by nestjs-aws-secrets-manager module
    });
  }
}
