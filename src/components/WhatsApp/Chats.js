import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Box, Typography } from "@material-ui/core";


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
    ipcRenderer.on(`whatsapp-message-${ chatId }`, updateWhatsAppMessage);
  }, [chat]);

  useEffect(() => {
    if (img) return;
    ipcRenderer.on(`whatsappBot-setProfilePicFromServer-${ chatId }`, updatePicProfile);
    ipcRenderer.send('whatsappBot-getProfilePicFromServer', chatId);
  }, [chat, img]);

  const updatePicProfile = (event, chatId, url) => {
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

export default function Chats({ chats }) {
  const classes = useStyles();
  const [selectedChatId, setSelectedChatId] = useState("");

  const handleChatClick = (event, chatId) => {
    setSelectedChatId(chatId);
  }

  return (
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
  );
}
