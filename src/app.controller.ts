import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('SAMPLE_SERVICE') private readonly client: ClientProxy,
  ) {}
  async onApplicationBootstrap() {
    try {
      await this.client.connect();
      console.log('rabbitmq conectado');
    } catch (error) {
      console.log('error', error);
    }
  }

  @Post()
  async getInfoMesagge(@Body() data): Promise<any> {
    const messageData = data;
    // await this.appService.send(
    //   messageData.To,
    //   messageData.From,
    //   'Hola ' +
    //     messageData.ProfileName +
    //     ' como estas\n' +
    //     messageData.Body,
    // );

    this.client.emit<any>('whatsapp_message_received', messageData);
    console.log(data.Body);

    return true;
  }

  @Get()
  auth(@Query() query): any {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    // Parse params from the webhook verification request
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Respond with 200 OK and challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        console.log(challenge);

        return challenge;
      } else {
        throw new HttpException(
          {
            data: [],
            success: false,
            message: 'Token is invalid',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }
}
