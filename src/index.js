import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import "react-notifications/lib/notifications.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App language="pt-BR" />
    </Provider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
