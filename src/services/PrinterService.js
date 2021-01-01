import React, { useContext, useEffect, useState } from "react";
import { withFirebase } from "../components/Firebase";
import { AuthUserContext } from "../components/Session";
import axios from "axios";

function PrinterService({ firebase, printOrder }) {
  const authUser = useContext(AuthUserContext);
  const [printerDestiny, setPrinterDestiny] = useState(null);

  useEffect(() => {
    if (authUser) {
      return firebase
        .printer_settings(authUser.default_organization)
        .on("value", (snapshot) => {
          setPrinterDestiny(snapshot.val().ip_address);
        });
    }
  }, [firebase, authUser, setPrinterDestiny]);

  useEffect(() => {
    if (printOrder && printerDestiny) {
      printOrder((order) => {
        axios
          .post(`http://${printerDestiny}:8080/print`, order)
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  }, [printOrder, printerDestiny]);

  return <React.Fragment></React.Fragment>;
}

export default withFirebase(PrinterService);
