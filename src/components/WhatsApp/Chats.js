import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Box, Grid, Input, Paper, Typography } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';

let ipcRenderer;
if (window && window.require) {
  ipcRenderer = window.require('electron').ipcRenderer;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

function Chat({ chat, img, selectedChatId, handleChatClick }) {
  const classes = useStyles();
  const [urlPicture, setUrlPicture] = useState(img);
  const [lastMessage, setLastMessage] = useState("");
  const [markAsUnread, setMarkAsUnread] = useState(false);
  const chatId = chat.id._serialized;

  useEffect(() => {
    const messageListener = `whatsapp-message-${ chatId }`;
    console.log("Chat.register:", messageListener);
    ipcRenderer.on(messageListener, updateWhatsAppMessage);

    return () => {
      console.log("Chat.removeAllListeners:", messageListener);
      ipcRenderer.removeAllListeners([messageListener]);
    }
  }, [chatId]);

  useEffect(() => {
    if (img) return;
    const setProfileListener = `whatsappBot-setProfilePicFromServer-${ chatId }`;
    ipcRenderer.on(setProfileListener, updatePicProfile);
    ipcRenderer.send('whatsappBot-getProfilePicFromServer', chatId);

    return () => {
      ipcRenderer.removeAllListeners([setProfileListener]);
    }
  }, [chatId, img]);

  const updatePicProfile = (event, url) => {
    setUrlPicture(url);
  }

  const updateWhatsAppMessage = (event, message) => {
    setLastMessage(message.body);
    setMarkAsUnread(true);
  }

  const isSelected = () => {
    return selectedChatId === chatId;
  }

  return (
    <ListItem alignItems="flex-start"
              button
              selected={ isSelected() }
              onClick={ (event) => handleChatClick(event, chatId) }
    >
      <ListItemAvatar>
        <Avatar alt={ chat.name } src={ urlPicture }/>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            component="span"
            variant="body1"
            className={ classes.inline }
            color="textPrimary"
          >
            <Box fontWeight={ markAsUnread || isSelected() ? "fontWeightBold" : "" } m={ 1 }>
              { chat.contact.name ?? chat.contact.pushname ?? chat.contact.formattedName }
            </Box>
          </Typography>
        }
        secondary={
          <React.Fragment>
            { lastMessage }
          </React.Fragment>
        }
      />
    </ListItem>
  )
}


const chatTextStyles = makeStyles((theme) => ({
  root: {
    margin: '8px',
    height: 'calc(100% - 80px)',
  },
  chatInputPaper: {
    height: 'calc(100% - 64px)'
  },
  chatInput: {
    overflowY: 'scroll',
    height: '100%',
    padding: '16px',
  },
  composeInputPaper: {
    marginTop: '16px'
  },
  composeInput: {
    padding: '16px'
  },
  sendIcon: {
    color: '#2196f3'
  },
  chatRoomMessage: {
    display: 'flex',
    marginBottom: '8px'
  },
  messageText: {
    padding: '8px 0px 0px 16px'
  },
  divider: {
    marginBottom: '8px'
  },
  searchIcon: {
    color: '#FFF',
    marginTop: '3px'
  }
}));

function ChatText({ chatId }) {
  const classes = chatTextStyles();
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    ipcRenderer.send('whatsappBot-sendMessage', { telephone: chatId, msg: textMessage });
    setTextMessage("");
  }

  useEffect(() => {
    if (!chatId) return;
    const messageListener = `whatsapp-message-${ chatId }`;
    const messageSenderListener = `whatsappBot-sendMessage-response-${ chatId }`;
    console.log("ChatText.register:", messageListener);

    ipcRenderer.on(messageListener, (event, message) => setMessages([...messages, message]));
    ipcRenderer.on(messageSenderListener, (event, message) => {
      setMessages([...messages, { body: message.text, fromMe: true }])
    });

    return () => {
      console.log("ChatText.removeAllListeners:", messageListener);
      ipcRenderer.removeAllListeners([messageListener, messageSenderListener]);
    };
  }, [chatId, messages])

  return (
    <section className={ classes.root }>
      <Paper className={ classes.chatInputPaper } elevation={ 4 }>
        <div className={ classes.chatInput }>

          { messages.map((message, index) => {
            return (
              <React.Fragment key={ `${ chatId }-${ index }` }>
                <div className={ classes.chatRoomMessage }>
                  <Avatar alt='' src=''/>
                  <div className={ classes.messageText }>
                    { message.body }
                  </div>
                </div>
                <Divider className={ classes.divider } key={ index }/>
              </React.Fragment>
            );
          }) }

        </div>
      </Paper>
      <Paper className={ classes.composeInputPaper } elevation={ 4 }>
        <Input classes={ { root: classes.composeInput } } multiline={ true } fullWidth={ true }
               disableUnderline={ true } placeholder={ "Send a message!" }
               value={ textMessage }
               onChange={ (event) => setTextMessage(event.target.value) }
               endAdornment={ <SendIcon onClick={ sendMessage }/> }
        />
      </Paper>
    </section>
  );
}


const useStylesChats = makeStyles((theme) => ({
  root: {
    margin: '16px',
    height: 'calc(100vh - 32px)'
  },
  paper: {
    height: '100%'
  },
  gridContainer: {
    height: 'inherit'
  },
  gridItem: {
    height: '100%',
    overflowY: 'scroll',
  },
  '@global': {
    'body': {
      fontFamily: '"Roboto"'
    }
  }
}));


export default function Chats({ chats }) {
  const classes = useStylesChats();
  const [selectedChatId, setSelectedChatId] = useState("");

  const handleChatClick = (event, chatId) => {
    setSelectedChatId(chatId);
  }

  return (
    <div className={ classes.root }>
      <Paper className={ classes.paper } elevation={ 2 }>
        <Grid container spacing={ 0 } className={ classes.gridContainer }>
          <Grid item md={ 2 } className={ classes.gridItem }>
            <List className={ classes.root }>
              { chats.map((chat) =>
                <React.Fragment key={ chat.id._serialized }>
                  <Chat chat={ chat }
                        img={ chat.contact.profilePicThumbObj.eurl }
                        selectedChatId={ selectedChatId }
                        handleChatClick={ handleChatClick }
                  />
                  <Divider variant="inset" component="li"/>
                </React.Fragment>
              )
              }
            </List>
          </Grid>
          <Grid item xs={ 12 } md={ 10 } className={ classes.gridItem }>
            <ChatText chatId={ selectedChatId }/>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
