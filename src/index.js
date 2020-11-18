import React from 'react';
import ReactDOM from 'react-dom';
import Checkout from './Checkout';
import OrderRepository from './repository/OrderRepository';
import * as serviceWorker from './serviceWorker';
import { I18nProvider, Trans } from '@lingui/react';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { getValueFormatted } from './utilities/ComponentUtils'


import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import { GridList } from '@material-ui/core';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };


const useStylesCard = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard(props) {
  const classes = useStylesCard();

  function _getMinutesOnQueue(utcDate) {
    var today = new Date();
    var utcDateToCompare = new Date(utcDate);
    var diffMs = (today - utcDateToCompare); // milliseconds

    var diffDays = Math.floor(diffMs / 86400000); // days
    if (diffDays >= 1) {
        return `${diffDays}dia(s)`;
    }
    
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if (diffHrs >= 1) {
        return `${diffHrs}h ${diffMins}min`;
    }

    return `${diffMins}min`;
  }

  function _getLocalDate(utcDate){
    var localDate = new Date(utcDate)
    return localDate.toLocaleString();
  }

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
            {_getLocalDate(props.order.created)} ({_getMinutesOnQueue(props.order.created)})
        </Typography>
        <Typography variant="h7" component="h7">
            {props.order.address} {props.order.complement}
        </Typography>
        {props.order.products.map((prod) => 
            <Typography color="textSecondary">
                {prod.quantity} {prod.description}
            </Typography>)}

        <Typography variant="body2" component="p">
          Total em {<Trans id={props.order.credit_card_payment ? 'checkout.card' : 'checkout.cash'}>Total</Trans>}: {getValueFormatted(props.order.total_amount)}
        </Typography>

        {props.order.change_difference == null ? null :
        <Typography variant="body2" component="p">
            Levar troco de {getValueFormatted(props.order.change_difference)}
        </Typography>
        }
      </CardContent>
      <CardActions>
        <Button size="small" ariant="outlined">Cancelar</Button>
        <Button size="small" color="primary" variant="outlined">Entregar</Button>
      </CardActions>
    </Card>
  );
}



const drawerWidth = 350;

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
}));

function App(props) {
// const App = ({ language } ) => {
    const { window, language } = props;
    const localeMessage = require(`./locales/${language}/messages.js`);
    const classes = useStyles();
    const theme = useTheme();
    const open = true;
    const [value, setValue] = React.useState(0);

    const orderRepository = new OrderRepository()
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    const container = window !== undefined ? () => window().document.body : undefined;

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

            <Drawer
                container={container}
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                >
                
                <Paper square>
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        onChange={handleChange}
                    >
                        <Tab label="Fila" />
                        <Tab label="Rota" />
                        <Tab label="Entregue" />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        {orderRepository.allInTheQueue().map((order) => <SimpleCard order={order}/>)}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <SimpleCard />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <SimpleCard />
                        <SimpleCard />
                        <SimpleCard />
                    </TabPanel>
                </Paper>
            </Drawer>

            <main
                className={clsx(classes.content, {
                [classes.contentShift]: open,
                })}
            >
            <div className={classes.drawerHeader} />
                <Checkout />
            </main>
            </div>

            <NotificationContainer/>
        </I18nProvider>
    );
}

ReactDOM.render(<App language='pt-BR' />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
