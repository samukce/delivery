import React, { useState, useEffect, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import CheckoutHome from "./CheckoutHome";
import { I18nProvider } from "@lingui/react";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import CssBaseline from "@material-ui/core/CssBaseline";
import Products from "./components/products/ProductList";
import EditOrAddProduct from "./components/products/EditOrAddProduct";
import { useSnackbar } from "notistack";
import * as serviceWorker from "./serviceWorker";
import { Button } from "@material-ui/core";
import * as ROUTES from "./constants/routes";
import SignUpPage from "./components/SignUp";
import SignInPage from "./components/SignIn";
import PasswordForgetPage from "./components/PasswordForget";
import AccountPage from "./components/Account";
import { withAuthentication } from "./components/Session";
import WhatsAppSales from "./components/WhatsApp/WhatsAppSales";
import { Checkout } from "./components/Checkout/Checkout";

function App(props) {
  const { language } = props;
  const localeMessage = require(`./locales/${language}/messages.js`);
  const { enqueueSnackbar } = useSnackbar();
  const [
    newVersionAvailableAndWorker,
    setNewVersionAvailableAndWorker,
  ] = useState({
    newVersionAvailable: false,
    waitingWorker: {},
  });

  useEffect(() => {
    const onServiceWorkerUpdate = (registration) => {
      setNewVersionAvailableAndWorker({
        newVersionAvailable: true,
        waitingWorker: registration && registration.waiting,
      });
    };

    const updateServiceWorker = () => {
      const { waitingWorker } = newVersionAvailableAndWorker;
      waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });

      setNewVersionAvailableAndWorker({
        newVersionAvailable: false,
      });
      window.location.reload();
    };

    const refreshAction = (key) => {
      return (
        <Fragment>
          <Button
            className="snackbar-button"
            size="small"
            color="primary"
            variant="contained"
            onClick={updateServiceWorker}
          >
            {"Atualizar"}
          </Button>
        </Fragment>
      );
    };

    const { newVersionAvailable } = newVersionAvailableAndWorker;
    if (process.env.NODE_ENV === "production") {
      serviceWorker.register({ onUpdate: onServiceWorkerUpdate });
    }

    if (newVersionAvailable) {
      enqueueSnackbar("Uma nova versão foi disponibilizada", {
        persist: true,
        variant: "success",
        action: refreshAction(),
      });
    }
  }, [newVersionAvailableAndWorker, enqueueSnackbar]);

  const DefaultFirstPage = () => {
    if (window && window.require) {
      return <CheckoutHome><WhatsAppSales /></CheckoutHome>
    }
    return <CheckoutHome><Checkout /></CheckoutHome>
  }

  return (
    <I18nProvider language={language} catalogs={{ [language]: localeMessage }}>
      <CssBaseline />

      <Switch>
        <Route exact path="/" component={DefaultFirstPage} />
        <Route exact path="/checkout" component={CheckoutHome} />
        <Route exact path="/whatsapp" component={WhatsAppSales} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/products/add" component={EditOrAddProduct} />
        <Route path="/products/:id" component={EditOrAddProduct} />

        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route
          path={[
            ROUTES.SIGN_IN_ARG,
            ROUTES.SIGN_IN_ARG_PT,
            ROUTES.SIGN_IN,
            ROUTES.SIGN_IN_PT,
          ]}
          component={SignInPage}
        />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route
          path={[ROUTES.ACCOUNT, ROUTES.ACCOUNT_PT]}
          component={AccountPage}
        />
      </Switch>

      <NotificationContainer />
    </I18nProvider>
  );
}

export default withAuthentication(App);
