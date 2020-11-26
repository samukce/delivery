import React from "react";
import { Route, Switch } from "react-router-dom";
import CheckoutHome from "./CheckoutHome";
import { I18nProvider } from "@lingui/react";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import CssBaseline from "@material-ui/core/CssBaseline";
import Products from "./components/products/ProductList";
import EditOrAddProduct from "./components/products/EditOrAddProduct";

function App(props) {
  const { language } = props;
  const localeMessage = require(`./locales/${language}/messages.js`);

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
