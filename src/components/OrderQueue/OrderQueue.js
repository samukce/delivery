import React, { Component } from "react";
import OrderRepository from "../../repository/OrderRepository";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Badge from "@material-ui/core/Badge";
import ListIcon from "@material-ui/icons/List";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import Hidden from "@material-ui/core/Hidden";
import Fab from "@material-ui/core/Fab";
import Pagination from "@material-ui/lab/Pagination";
import {
  isWidthDown,
  withWidth
} from "@material-ui/core";
import { compose } from "recompose";
import OrderCard from "./OrderCard";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={ value !== index }
      id={ `scrollable-auto-tabpanel-${ index }` }
      aria-labelledby={ `scrollable-auto-tab-${ index }` }
      { ...other }
    >
      { value === index && (
        <Box p={ 3 }>
          <Typography>{ children }</Typography>
        </Box>
      ) }
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const drawerWidth = 380;

const useStyles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${ drawerWidth }px)`,
    marginRight: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: theme.spacing(2),
  },
  marginFloatButton: {
    position: "fixed",
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  marginFloatCloseTabButton: {
    position: "fixed",
    top: theme.spacing(1),
    right: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: 0,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  badgePadding: {
    padding: theme.spacing(0, 2),
  },
  pagination: {
    background: "#ffffff",
  },
});

const ordersPerPage = 25;
const orderQueueTab = 0;
const orderShippedTab = 1;

class OrderQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordersQueue: [],
      ordersQueueSize: 0,
      ordersShipped: [],
      ordersShippedSize: 0,
      value: 0,
      open: false,
      ordersQueuePage: 1,
      ordersShippedPage: 1,
    };
    this.window = this.props.window;
    this.container =
      this.window !== undefined ? () => this.window.document.body : undefined;
  }

  componentDidMount() {
    const isMobile = isWidthDown("xs", this.props.width);
    this.setState({ open: !isMobile }, () => this.fetchOrdersInQueue());

    //REMOVE TIMER AND APPLY REDUX
    this.timer = setInterval(() => this.fetchOrdersInQueue(), 2000);
  }

  fetchOrdersInQueue = () => {
    if (!this.state.open) {
      return;
    }

    const ordersQueueSize = OrderRepository.allInTheQueueSize();
    const ordersShippedSize = OrderRepository.allShippedSize();
    this.setState({ ordersQueueSize, ordersShippedSize });

    if (this.state.value === orderQueueTab) {
      this.fetchQueue();
    } else if (this.state.value === orderShippedTab) {
      this.fetchShipped();
    }
  };

  handleQueuePageChange = (event, value) => {
    this.setState({ ordersQueuePage: value }, () => this.fetchQueue());
  };

  handleShippedPageChange = (event, value) => {
    this.setState({ ordersShippedPage: value }, () => this.fetchShipped());
  };

  fetchQueue = () => {
    const ordersQueue = OrderRepository.allInTheQueue(
      this.state.ordersQueuePage,
      ordersPerPage
    );
    this.setState({ ordersQueue });
  };

  fetchShipped = () => {
    const ordersShipped = OrderRepository.allShipped(
      this.state.ordersShippedPage,
      ordersPerPage
    );
    this.setState({ ordersShipped });
  };

  handleShippedOrder = (orderId) => {
    OrderRepository.markAsShipped(orderId);
    this.removeOrderQueueFromState(orderId);
  };

  handleCancelOrder = (orderId) => {
    OrderRepository.markAsCanceled(orderId);
    this.removeOrderQueueFromState(orderId);
    this.removeOrderShippedFromState(orderId);
  };

  handleDeliveredOrder = (orderId, pendencies, pendenciesResolved) => {
    OrderRepository.markAsDelivered(orderId, pendencies, pendenciesResolved);
    this.removeOrderShippedFromState(orderId);
  };

  handleChange = (event, newValue) => {
    this.setState({ value: newValue }, () => this.fetchOrdersInQueue());
  };

  removeOrderQueueFromState(orderId) {
    this.setState({
      ordersQueue: this.state.ordersQueue.filter(
        (order) => order.id !== orderId
      ),
    });
  }

  removeOrderShippedFromState(orderId) {
    this.setState({
      ordersShipped: this.state.ordersShipped.filter(
        (order) => order.id !== orderId
      ),
    });
  }

  render() {
    const { classes } = this.props;
    const drawer = (
      <div>
        <Paper square>
          <Tabs
            value={ this.state.value }
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            onChange={ this.handleChange }
          >
            <Tab
              label={
                <Badge
                  className={ classes.badgePadding }
                  color="primary"
                  badgeContent={ this.state.ordersQueueSize }
                  max={ 999 }
                >
                  Fila
                </Badge>
              }
            />
            <Tab
              label={
                <Badge
                  className={ classes.badgePadding }
                  color="primary"
                  badgeContent={ this.state.ordersShippedSize }
                  max={ 999 }
                >
                  Rota
                </Badge>
              }
            />
          </Tabs>
          <TabPanel value={ this.state.value } index={ orderQueueTab }>
            { this.state.ordersQueue.map((order) => (
              <OrderCard
                key={ `order-${ order.id }` }
                order={ order }
                handleCancelOrder={ this.handleCancelOrder }
                handleShippedOrder={ this.handleShippedOrder }
              />
            )) }
            <Box hidden={ this.state.ordersQueueSize < ordersPerPage }>
              <Pagination
                count={ Math.ceil(this.state.ordersQueueSize / ordersPerPage) }
                size="small"
                className={ classes.pagination }
                page={ this.state.ordersQueuePage }
                onChange={ this.handleQueuePageChange }
              />
            </Box>
          </TabPanel>
          <TabPanel value={ this.state.value } index={ orderShippedTab }>
            { this.state.ordersShipped.map((order) => (
              <OrderCard
                key={ `order-${ order.id }` }
                order={ order }
                handleCancelOrder={ this.handleCancelOrder }
                handleDeliveredOrder={ this.handleDeliveredOrder }
              />
            )) }
            <Box hidden={ this.state.ordersShippedSize < ordersPerPage }>
              <Pagination
                count={ Math.ceil(this.state.ordersShippedSize / ordersPerPage) }
                size="small"
                className={ classes.pagination }
                page={ this.state.ordersShippedPage }
                onChange={ this.handleShippedPageChange }
              />
            </Box>
          </TabPanel>
        </Paper>
      </div>
    );

    return (
      <React.Fragment>
        <Hidden xsDown implementation="css">
          <Drawer
            id="drawer-regular-size"
            container={ this.container }
            className={ classes.drawer }
            variant="persistent"
            anchor="right"
            open={ this.state.open }
            classes={ {
              paper: classes.drawerPaper,
            } }
            ModalProps={ {
              keepMounted: true, // Better open performance on mobile.
            } }
          >
            { drawer }
          </Drawer>
        </Hidden>
        <Hidden mdUp>
          <Box zIndex="modal">
            <Fab
              size="small"
              color="primary"
              aria-label="list"
              className={ classes.marginFloatButton }
              onClick={ () => this.setState({ open: true }) }
            >
              <ListIcon/>
            </Fab>
          </Box>

          <Drawer
            id="drawer-small-size"
            container={ this.container }
            className={ classes.drawer }
            variant="variant"
            anchor="right"
            open={ this.state.open }
            classes={ {
              paper: classes.drawerPaper,
            } }
            ModalProps={ {
              keepMounted: true, // Better open performance on mobile.
            } }
          >
            { drawer }

            <Fab
              size="small"
              aria-label="close"
              className={ classes.marginFloatCloseTabButton }
              onClick={ () => this.setState({ open: false }) }
            >
              <CloseOutlinedIcon/>
            </Fab>
          </Drawer>
        </Hidden>
      </React.Fragment>
    );
  }
}

export default compose(withStyles(useStyles), withWidth())(OrderQueue);
