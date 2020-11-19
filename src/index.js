import React from 'react';
import ReactDOM from 'react-dom';
import Checkout from './Checkout';
import * as serviceWorker from './serviceWorker';
import { I18nProvider, Trans } from '@lingui/react';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import OrderQueue from './OrderQueue';
import { Provider } from 'react-redux'
import store from './redux/store'
import OrderRepository from './repository/OrderRepository'


const drawerWidth = 380;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: 0,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  badgePadding: {
    padding: theme.spacing(0, 2),
  },
}));

function App(props) {
    const { language } = props;
    const localeMessage = require(`./locales/${language}/messages.js`);
    const classes = useStyles();
    const open = true;
    const orderRepository = new OrderRepository();

    return (
        <I18nProvider language={language} catalogs={{ [language]: localeMessage }}>
            <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                <Typography variant="h6" noWrap>
                    {<Trans id='checkout.title'>Checkout</Trans>}
                </Typography>
                </Toolbar>
            </AppBar>

            <OrderQueue orderRepository={orderRepository} />

            <main
                className={clsx(classes.content, {
                [classes.contentShift]: open,
                })}
            >
            <div className={classes.drawerHeader} />
                <Checkout orderRepository={orderRepository} />
            </main>
            </div>

            <NotificationContainer/>
        </I18nProvider>
    );
}

ReactDOM.render(
<Provider store={store}>
    <App language='pt-BR' />
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
