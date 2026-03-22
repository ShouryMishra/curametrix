import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const toNumber = process.env.ALERT_PHONE_NUMBERS?.split(',')[0];

console.log('Testing with:');
console.log('SID:', accountSid);
console.log('From:', fromNumber);
console.log('To:', toNumber);

const client = twilio(accountSid, authToken);

client.messages.create({
  body: 'Curametrix Test Message',
  from: fromNumber,
  to: toNumber
})
.then(message => console.log('Success! Message SID:', message.sid))
.catch(err => console.error('\nTwilio Error:', err.message, '\nCode:', err.code, '\nMore info:', err.moreInfo));
