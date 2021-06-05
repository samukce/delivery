import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";

let ipcRenderer;
if (window && window.require) {
  ipcRenderer = window.require('electron').ipcRenderer;
  ipcRenderer.send('whatsappBot-start', 'bloh...');
}

class WhatsAppSales extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.bindWhatspEvents();
  }

  bindWhatspEvents() {
    if (!ipcRenderer) return;

    ipcRenderer.on('whatsappBot-qrCode', this.updateWhatsAppQrCode);
    ipcRenderer.on('whatsappBot-status', this.updateWhatsAppStatus);
    ipcRenderer.on('whatsapp-message', this.updateWhatsAppMessage);
  }

  componentWillUnmount() {
    if (!ipcRenderer) return;

    ipcRenderer.removeAllListeners(['whatsappBot-qrCode', 'whatsappBot-status', 'whatsapp-message']);
  }

  getInitialState = () => {
    return {
      whatsapp_qrCode: "",
      whatsapp_status: "",
      whatsapp_message: ""
    };
  };

  updateWhatsAppQrCode = (event, qrCode) => {
    console.log(qrCode);
    this.setState({ whatsapp_qrCode: qrCode })
  }

  updateWhatsAppStatus = (event, status) => {
    console.log(status);
    this.setState({ whatsapp_status: status })
  }

  updateWhatsAppMessage = (event, message) => {
    console.log(message);
    this.setState({ whatsapp_message: message })
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
      </div>
    );
  }

}

export default WhatsAppSales;
