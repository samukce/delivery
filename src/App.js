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

function App(props) {
  const { language } = props;
  const localeMessage = require(`./locales/${language}/messages.js`);
  const { enqueueSnackbar } = useSnackbar();
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState({});

  useEffect(() => {
    const onServiceWorkerUpdate = (registration) => {
      setNewVersionAvailable(true);
      setWaitingWorker(registration && registration.waiting);
    };

    const updateServiceWorker = () => {
      waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });
      setNewVersionAvailable(false);
      window.location.reload();
    };

    const refreshAction = (key) => {
      //render the snackbar button
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

    if (process.env.NODE_ENV === "production") {
      serviceWorker.register({ onUpdate: onServiceWorkerUpdate });
    }

    if (newVersionAvailable) {
      //show snackbar with refresh button
      enqueueSnackbar("Uma nova versão foi disponibilizada", {
        persist: true,
        variant: "success",
        action: refreshAction(),
      });
    }
  }, [newVersionAvailable, enqueueSnackbar, waitingWorker]);

  return (
    <I18nProvider language={language} catalogs={{ [language]: localeMessage }}>
      <CssBaseline />

      <Switch>
        <Route exact path={["/", "/checkout"]} component={CheckoutHome} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/products/add" component={EditOrAddProduct} />
        <Route path="/products/:id" component={EditOrAddProduct} />
      </Switch>

      <NotificationContainer />
    </I18nProvider>
  );
}

export default App;
