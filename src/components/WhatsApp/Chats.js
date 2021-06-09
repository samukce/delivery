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

function Chat({ chat, img }) {
  const classes = useStyles();
  const [urlPicture, setUrlPicture] = useState(img);
  const [lastMessage, setLastMessage] = useState("");
  const [markAsUnread, setMarkAsUnread] = useState(false);

  useEffect(() => {
    ipcRenderer.on(`whatsapp-message-${ chat.id._serialized }`, updateWhatsAppMessage);
  }, [chat]);

  useEffect(() => {
    if (img) return;
    ipcRenderer.on(`whatsappBot-setProfilePicFromServer-${ chat.id._serialized }`, updatePicProfile);
    ipcRenderer.send('whatsappBot-getProfilePicFromServer', chat.id);
  }, [chat, img]);

  const updatePicProfile = (event, chatId, url) => {
    setUrlPicture(url);
  }

  const updateWhatsAppMessage = (event, message) => {
    setLastMessage(message.body);
    setMarkAsUnread(true);
  }

  return (
    <ListItem alignItems="flex-start">
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
            <Box fontWeight={ markAsUnread ? "fontWeightBold" : "" } m={ 1 }>
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

  return (
    <List className={ classes.root }>
      { chats.map((chat) =>
        <React.Fragment key={ chat.id._serialized }>
          <Chat chat={ chat } img={ chat.contact.profilePicThumbObj.eurl }/>
          <Divider variant="inset" component="li"/>
        </React.Fragment>
      )
      }
    </List>
  );
}
