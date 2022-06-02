import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post()
  async getInfoMesagge(@Body() data): Promise<any> {
    const message_data = data;
    await this.appService.send(
      message_data.To,
      message_data.From,
      'Hola ' +
        message_data.ProfileName +
        ' como estas\n dijiste:' +
        message_data.Body,
    );
    console.log(message_data);

    return 1375339116267912;
  }

  @Get()
  hello(@Query() query): any {
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
