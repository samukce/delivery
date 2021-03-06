import React, { useContext, useEffect } from "react";
import Checkout from "./components/Checkout/Checkout";
import "react-notifications/lib/notifications.css";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import OrderQueue from "./components/OrderQueue/OrderQueue";
import { withFirebase } from "./components/Firebase";
import NetworkLockedIcon from "@material-ui/icons/NetworkLocked";
import { AuthUserContext } from "./components/Session";
import { Box } from "@material-ui/core";
import OrderRepository from "./repository/OrderRepository";
import ProductRepository from "./repository/ProductRepository";

const drawerWidth = 380;

const useStyles = makeStyles((theme) => ({
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
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: theme.spacing(2),
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
    [theme.breakpoints.up("sm")]: {
      marginRight: drawerWidth,
    },
  },
  badgePadding: {
    padding: theme.spacing(0, 2),
  },
  marginFloatButton: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function CheckoutHome({ firebase }) {
  const classes = useStyles();
  const open = true;
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    ProductRepository.setOrderRepositoryFirebase(firebase, authUser);
    OrderRepository.setOrderRepositoryFirebase(firebase, authUser);

    ProductRepository.syncProducts();
    OrderRepository.syncOrders();
    OrderRepository.syncClientLastOrders();
  }, [firebase, authUser]);

  const connectedSymbol = () => {
    return (
      <Box zIndex="tooltip">
        <NetworkLockedIcon
          size="small"
          style={{ color: `${authUser ? "green" : "gray"}` }}
          className={classes.marginFloatButton}
        />
      </Box>
    );
  };

  return (
    <div className={classes.root}>
      {connectedSymbol()}

      <OrderQueue />

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Checkout />
      </main>
    </div>
  );
}

export default withFirebase(CheckoutHome);
