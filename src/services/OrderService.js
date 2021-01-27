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

  return <React.Fragment />;
}

export default withFirebase(OrderService);
