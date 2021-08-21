const fs = require('fs');
require('dotenv');
const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.js';

const country_code = '54';

const number = process.env.PHONE_NUMBER;

const msg = 'Hello from the bot!!!';

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client((session = sessionData));
client.initialize();

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client rdy');
  let chat_id = country_code + number + '@c.us'; ///@c.us id for the chat
  client.sendMessage(chat_id, msg).then(response => {
    if (response.id.fromMe) {
      console.log('msg send ');
    }
  });
});

client.on('message', message => {
  console.log(message.body);
});

client.on('authenticated', session => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err => {
    if (err) {
      console.error(err);
    }
  });
});

client.on('auth_failure', msg => {
  console.log('auth fail', msg);
});

client.on('message', msg => {
  if (msg.body === 'Hello') {
    client.sendMessage(msg.from, 'hi bro!!');
  }
});
