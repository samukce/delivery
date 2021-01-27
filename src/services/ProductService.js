import React, { useContext, useEffect } from "react";
import { withFirebase } from "../components/Firebase";
import { AuthUserContext } from "../components/Session";
import ProductRepository from "../repository/ProductRepository";

function ProductService({ firebase }) {
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    ProductRepository.setOrderRepositoryFirebase(firebase, authUser);

    ProductRepository.syncProducts();
  }, [firebase, authUser]);

  return <React.Fragment />;
}

export default withFirebase(ProductService);
