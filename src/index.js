import React, { useState, useEffect } from 'react';
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
import { Badge, GridList } from '@material-ui/core';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

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

const useStylesAccordion = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }));

export default function OrderCard(props) {
  const classes = useStylesCard();
  const classesAccordion = useStylesAccordion();

  function _getMinutesOnQueue(utcDate) {
    var today = new Date();
    var utcDateToCompare = new Date(utcDate);
    var diffMs = (today - utcDateToCompare);

    var diffDays = Math.floor(diffMs / 86400000);
    if (diffDays >= 1) {
        return `${diffDays}d`;
    }
    
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
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
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id={`panel-header-${props.order.id}`}
            >
            <Typography className={classesAccordion.heading}>{props.order.address} {props.order.complement}</Typography>
            <Typography className={classesAccordion.title} color="textSecondary" gutterBottom>
                ({_getMinutesOnQueue(props.order.created)})
            </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Card className={classesAccordion.root} variant="outlined">
                    <CardContent>
                        <Typography className={classesAccordion.title} color="textSecondary" gutterBottom>
                            {_getLocalDate(props.order.created)}
                        </Typography>
                        <Typography variant="h7" component="h7" display="block">
                            {props.order.address} {props.order.complement}
                        </Typography>

                        {props.order.notes === '' ? null :
                        <Typography variant="overline" display="block">
                            {props.order.notes}
                        </Typography>
                        }

                        {props.order.products.map((prod) => 
                            <Typography color="textSecondary" gutterBottom>
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
            </AccordionDetails>
        </Accordion>
  );
}



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
// const App = ({ language } ) => {
    const { window, language } = props;
    const localeMessage = require(`./locales/${language}/messages.js`);
    const classes = useStyles();
    const classesAccordion = useStylesAccordion();
    const theme = useTheme();
    const open = true;
    const [value, setValue] = React.useState(0);
    const [ordersQueue, setOrdersQueue] = React.useState([]);

    const orderRepository = new OrderRepository();
    
    useEffect(() => {
        async function fetchData() {
          // You can await here
          const response = await orderRepository.allInTheQueue();
          // ...
          setOrdersQueue(response);
        }
        fetchData();
      }, []);
      

    // componentDidMount() {
    //     setOrdersQueue(orderRepository.allInTheQueue)
    //   }
    
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
                        <Tab label={
                            <Badge className={classes.badgePadding} color="secondary" badgeContent={ordersQueue.length}>
                                Fila
                            </Badge>
                            } />
                        <Tab label="Rota" />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        {ordersQueue.map((order) => <OrderCard order={order}/>)}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Em construção... ;)
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
