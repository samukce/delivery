const fs = require('fs');
const { create } = require('venom-bot');
const path = require('path')

let venom_client;
let status;

const sendText = async (telephone, msg) => {
  if (!venom_client) {
    return;
  }
  return await venom_client.sendText(telephone, msg);
}

const sendImage = async (telephone, url, nameImg) => {
  if (!venom_client) {
    return;
  }
  return await venom_client.sendImage(telephone, url, nameImg);
}

const stopClient = async () => {
  if (venom_client) {
    return await venom_client.close().then(() => console.log('Cliente Desativado'))
  }
  return console.log('client ainda não criado!');
}

async function client() {
  venom_client = await create('Delivery', (base64Qr, asciiQR) => {
      console.log(asciiQR);

      let dir = path.resolve(__dirname, '..', 'public', 'images', 'tmp', 'qrCode.png')
      exportQR(base64Qr, dir);
    },
    (statusSession) => {
      status = statusSession
      console.log('Status Session: ', statusSession);
    }, {
      logQR: true,
      browserArgs: ['--no-sandbox'],
      autoClose: false,
    });

  function exportQR(qrCode, path) {
    qrCode = qrCode.replace('data:image/png;base64,', '');
    const imageBuffer = Buffer.from(qrCode, 'base64');
    fs.writeFileSync(path, imageBuffer);
  }

  await start(venom_client);
}

async function start(client) {
  console.log('Whatsapp boot started.');

  client.onStateChange((state) => {
    console.log(state);
    if (state === 'CONFLICT' || state === 'UNPAIRED' || state === 'UNLAUNCHED') {
      client.useHere();
    }
  });

  client.onMessage(async (message) => {
    console.log('**** logs begin ***')
    console.log(message.type)
    console.log(message.body)
    console.log(message.from)
    console.log(message.to)
    console.log(message.chat.contact)
    console.log(message.isGroupMsg)
    console.log('**** logs end ***')
  });
}


exports.sendImage = sendImage
exports.sendText = sendText
exports.client = client
exports.venom_client = venom_client
exports.stopClient = stopClient
exports.status = status
