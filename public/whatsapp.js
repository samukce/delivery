const { create } = require('venom-bot');

let venom_client;
let status;

const sendText = async (telephone, msg) => {
  if (!venom_client) {
    return;
  }
  return await venom_client.sendText(telephone, msg);
}

const getAllChats = async () => {
  if (!venom_client) {
    return;
  }
  return await venom_client.getAllChats();
}

const getProfilePicFromServer = async (chatId) => {
  if (!venom_client) {
    return;
  }
  return await venom_client.getProfilePicFromServer(chatId);
}

const sendImage = async (telephone, url, nameImg) => {
  if (!venom_client) {
    return;
  }
  return await venom_client.sendImage(telephone, url, nameImg);
}

const stopClient = async () => {
  if (venom_client) {
    return await venom_client.close().then(() => console.log('WhatsApp Client deactivated'))
  }
  return console.log('WhatsApp Client not created!');
}

async function client(qrCodeUpdate, statusSessionUpdate, statusClientUpdate, messageReceived) {
  venom_client = await create('Delivery', (base64Qr, asciiQR) => {
      qrCodeUpdate(base64Qr);
    },
    (statusSession) => {
      status = statusSession
      console.log('Status Session: ', statusSession);
      statusSessionUpdate(statusSession);
    }, {
      browserArgs: ['--no-sandbox'],
      autoClose: 0,
    });

  await start(venom_client, statusClientUpdate, messageReceived);
}

async function start(client, statusClientUpdate, messageReceived) {
  console.log('Whatsapp boot started.');

  client.onStateChange((state) => {
    statusClientUpdate(state);
    if (state === 'CONFLICT' || state === 'UNPAIRED' || state === 'UNLAUNCHED') {
      client.useHere();
    }
  });

  client.onMessage(async (message) => {
    messageReceived(message);
  });
}


exports.sendImage = sendImage
exports.sendText = sendText
exports.getAllChats = getAllChats
exports.getProfilePicFromServer = getProfilePicFromServer
exports.client = client
exports.venom_client = venom_client
exports.stopClient = stopClient
exports.status = status
