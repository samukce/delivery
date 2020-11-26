import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "react-notifications/lib/notifications.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import { SnackbarProvider } from "notistack";

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <SnackbarProvider>
        <App language="pt-BR" />
      </SnackbarProvider>
    </Provider>
  </Router>,
  document.getElementById("root")
);
