import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';


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
  // const [lastMessage, setLastMessage] = useState(message);

  useEffect(() => {
    if (img) return;
    ipcRenderer.on(`whatsappBot-setProfilePicFromServer-${ chat.id._serialized }`, updatePicProfile);
  }, [chat]);

  useEffect(() => {
    if (img) return;
    ipcRenderer.send('whatsappBot-getProfilePicFromServer', chat.id);
  }, [chat, img]);

  const updatePicProfile = (event, chatId, url) => {
    setUrlPicture(url);
  }

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={ chat.name } src={ urlPicture }/>
      </ListItemAvatar>
      <ListItemText
        primary={ `${ chat.contact.name ?? chat.contact.pushname ?? chat.contact.formattedName }` }
        secondary={
          <React.Fragment>
            {/*<Typography*/ }
            {/*  component="span"*/ }
            {/*  variant="body2"*/ }
            {/*  className={ classes.inline }*/ }
            {/*  color="textPrimary"*/ }
            {/*>*/ }
            {/*  Ali Connors*/ }
            {/*</Typography>*/ }
            {/*{ lastMessage }*/ }
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