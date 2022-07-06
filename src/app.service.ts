import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class AppService {
  async send(sender, receiver, message): Promise<any> {
    console.log('auth', process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

    try {
      const twilioClient = twilio(
        process.env.ACCOUNT_SID,
        process.env.AUTH_TOKEN,
      );
      return await twilioClient.messages.create({
        // from: `whatsapp:+${sender}`,
        // body: message,
        // to: `whatsapp:+${receiver}`,
        from: 'whatsapp:+14155238886',
        body: message,
        to: receiver,
      });
    } catch (e) {
      console.log(e);

      return e;
    }
  }
  async getNumbers(): Promise<any> {
    try {
      const twilioClient = twilio(
        process.env.ACCOUNT_SID,
        process.env.AUTH_TOKEN,
      );
      const numbers = await twilioClient.incomingPhoneNumbers.list({
        limit: 20,
      });
      console.log(numbers);

      return numbers;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
