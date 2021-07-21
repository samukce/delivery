import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import OrderRepository from "../../repository/OrderRepository";
import { Button } from "@material-ui/core";
import Chats from "./Chats";
import { withAuthorization } from "../Session";

let ipcRenderer;
if (window && window.require) {
  ipcRenderer = window.require('electron').ipcRenderer;
}

class WhatsAppSales extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.bindWhatsAppEvents();
    this.startWhatsAppBot();
  }

  startWhatsAppBot() {
    if (!ipcRenderer) return;
    ipcRenderer.send('whatsappBot-start');
  }

  loadChats = () => {
    ipcRenderer.send('whatsappBot-getAllChats');
  }

  bindWhatsAppEvents() {
    if (!ipcRenderer) return;

    ipcRenderer.on('whatsappBot-qrCode', this.updateWhatsAppQrCode);
    ipcRenderer.on('whatsappBot-status', this.updateWhatsAppStatus);
    ipcRenderer.on('whatsapp-statusClient', this.updateWhatsAppStatusClient);
    ipcRenderer.on('whatsapp-message', this.updateWhatsAppMessage);
    ipcRenderer.on('whatsappBot-setAllChats', this.updateWhatsAppAllChats);
  }

  componentWillUnmount() {
    if (!ipcRenderer) return;

    ipcRenderer.removeAllListeners([
      'whatsappBot-qrCode',
      'whatsappBot-status',
      'whatsapp-statusClient',
      'whatsapp-message',
      'whatsappBot-setAllChats',
    ]);
  }

  getInitialState = () => {
    return {
      whatsapp_qrCode: "",
      whatsapp_status: "",
      whatsapp_status_client: "",
      whatsapp_message: "",
      whatsapp_allChats: []
    };
  };

  updateWhatsAppQrCode = (event, qrCode) => {
    this.setState({ whatsapp_qrCode: qrCode })
  }

  updateWhatsAppStatus = (event, status) => {
    this.setState({ whatsapp_status: status }, () => {
      if (status === "chatsAvailable") {
        this.loadChats();
      }
    })
  }

  updateWhatsAppStatusClient = (event, status) => {
    this.setState({ whatsapp_status_client: status }, () => {
      if (status === "CONNECTED") {
        this.loadChats();
      }
    })
  }

  updateWhatsAppAllChats = (event, chats) => {
    if (!chats) {
      return;
    }
    const onlyClients = chats.filter(chat => !chat.isGroup).sort((a, b) => b.t - a.t);
    onlyClients.forEach((message) => console.log(message));

    this.setState({ whatsapp_allChats: onlyClients })
  }

  updateWhatsAppMessage = (event, message) => {
    if (message.isGroupMsg) return;
    this.setState({ whatsapp_message: message.body });

    const phoneNumber = message.from;
    const phoneNumberParts = phoneNumber.split("@");
    if (!phoneNumberParts.length) return;

    const rawNumber = phoneNumberParts[0].substr(-8);
    const searchByPhone = OrderRepository.searchByPhone(rawNumber);
    if (Object.keys(searchByPhone).length > 0) {
      const orderPromise = Object.values(searchByPhone)[0];

      Promise.resolve(orderPromise()).then((lastOrder) => {
        const products = lastOrder.products.reduce(
          (full_list, prod) => `${ full_list } (${ prod.quantity })${ prod.description }`,
          ""
        );

        let messageBack =
          `Olá! Seu último pedido foi ${ products }, entregue no endereço ${ lastOrder.address }${ lastOrder.complement }. Gostaria de repetir o pedido?`;

        // ipcRenderer.send('whatsappBot-sendMessage', { telephone: phoneNumber, msg: messageBack });
      }).catch((erro) => {
        console.error('Error when sending: ', erro);
      });
    }
  }

  render() {
    if (!ipcRenderer) return null;

    return (
      <div ref={ (el) => (this.checkoutSection = el) }>
        <Typography variant="caption" display="block"
                    gutterBottom>WhatsApp Status: { this.state.whatsapp_status }</Typography>
        <Typography variant="caption" display="block"
                    gutterBottom>WhatsApp Message: { this.state.whatsapp_message }</Typography>
        { this.state.whatsapp_status === "notLogged"
          ? <img src={ this.state.whatsapp_qrCode } alt="WhatsApp QrCode"/>
          : null }

        <Button onClick={ () => this.loadChats() } value="Load Chats">Load Chats</Button>
        <Chats chats={ this.state.whatsapp_allChats }/>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(WhatsAppSales);
