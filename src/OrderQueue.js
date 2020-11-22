import React, { Component } from 'react';
import OrderRepository from './repository/OrderRepository';
import { Trans } from '@lingui/react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
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
import Badge from '@material-ui/core/Badge';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ListIcon from '@material-ui/icons/List';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import Hidden from '@material-ui/core/Hidden';
import Fab from '@material-ui/core/Fab';

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

const useStylesAccordion = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }));

function OrderCard(props) {
  const classesAccordion = useStylesAccordion();
  const orderRepository = props.orderRepository;

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

  function handleCancelClick() {
    orderRepository.markAsCanceled(props.order);
  }

  function handleShippedClick() {
    orderRepository.markAsShipped(props.order);
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

                        {props.order.phonenumber === '' ? null :
                        <Typography variant="overline" display="block">
                            TEL.: {props.order.phonenumber}
                        </Typography>
                        }

                        {props.order.notes === '' ? null :
                        <Typography variant="overline" display="block">
                            OBS.: {props.order.notes}
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
                        <Button size="small" variant="outlined" onClick={handleCancelClick}>Cancelar</Button>
                        <Button size="small" color="primary" variant="outlined"onClick={handleShippedClick}>Entregar</Button>
                    </CardActions>
                </Card>
            </AccordionDetails>
        </Accordion>
  );
}

const drawerWidth = 380;

const useStyles = theme => ({
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
  marginFloatButton: {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  marginFloatCloseTabButton: {
    position: 'fixed',
    top: theme.spacing(1),
    right: theme.spacing(2),
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
});

class OrderQueue extends Component {
    static defaultProps = {
      orderRepository: new OrderRepository()
    }

    constructor(props) {
      super(props);
      this.state = { ordersQueue: [], value: 0, open: false };
      this.window = this.props.window;
      this.container = this.window !== undefined ? () => this.window.document.body : undefined;
      this.orderRepository = this.props.orderRepository;
    }

    componentDidMount() {
      this.fetchOrdersInQueue();
      //REMOVE TIMER AND APPLY REDUX
      this.timer = setInterval(() => this.fetchOrdersInQueue(), 5000);
    } 

    fetchOrdersInQueue = () => {
      const orders = this.orderRepository.allInTheQueue();
      this.setState({ ordersQueue: orders}, () => console.log(orders.length))
    }
    
    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
      };

    render() {
      const { classes } = this.props;
      const drawer = (
        <div>
          <Paper square>
              <Tabs
                  value={this.state.value}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  onChange={this.handleChange}
              >
                  <Tab label={
                      <Badge className={classes.badgePadding} color="secondary" badgeContent={this.state.ordersQueue.length}>
                          Fila
                      </Badge>
                      } />
                  <Tab label="Rota" />
              </Tabs>
              <TabPanel value={this.state.value} index={0}>
                  {this.state.ordersQueue.map((order) => 
                    <OrderCard key={`order-${order.id}`} order={order} orderRepository={this.orderRepository}/>)
                    }
              </TabPanel>
              <TabPanel value={this.state.value} index={1}>
                  Em construção... ;)
              </TabPanel>
          </Paper>
        </div>
      );
      
    return (
      <React.Fragment>
        <Hidden xsDown implementation="css">
          <Drawer
              id="drawer-regular-size"
              container={this.container}
              className={classes.drawer}
              variant="persistent"
              anchor="right"
              open={true}
              classes={{
                  paper: classes.drawerPaper,
              }}
              ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
          </Drawer>
        </Hidden>
        <Hidden mdUp>
          <div>
            <Fab size="small" color="primary" aria-label="list" className={classes.marginFloatButton}
              onClick={() => this.setState({ open: true })}>
              <ListIcon />
            </Fab>
          </div>

          <Drawer
              id="drawer-small-size"
              container={this.container}
              className={classes.drawer}
              variant="variant"
              anchor="right"
              open={this.state.open}
              classes={{
                  paper: classes.drawerPaper,
              }}
              ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}

              <Fab size="small" aria-label="close" className={classes.marginFloatCloseTabButton}
                onClick={() => this.setState({ open: false })}>
                <CloseOutlinedIcon />
              </Fab>
          </Drawer>
        </Hidden>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(OrderQueue);
