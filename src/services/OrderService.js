import React, { useContext, useEffect } from "react";
import { withFirebase } from "../components/Firebase";
import { AuthUserContext } from "../components/Session";
import OrderRepository from "../repository/OrderRepository";

function OrderService({ firebase }) {
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    OrderRepository.setOrderRepositoryFirebase(firebase, authUser);

    OrderRepository.syncOrders();
    OrderRepository.syncClientLastOrders();
  }, [firebase, authUser]);

  useEffect(() => {
    if (authUser) {
      return firebase
        .printer_settings(authUser.default_organization)
        .on("value", (snapshot) => {
          console.log(`Printer: ${snapshot.val().ip_address}`);
          // this.setState({ from_status: snapshot.val().ip_address });
        });
    }
  }, [firebase, authUser]);

  return <React.Fragment></React.Fragment>;
}

export default withFirebase(OrderService);
