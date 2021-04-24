import React, { useState, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { List } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid'
import { makeStyles } from "@material-ui/core/styles";
import { getValueFormatted } from "../../utilities/ComponentUtils";

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

export default function OrderConfirmation({ modalOpen, order, handleFinish, handleCloseExternal }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    handleCloseExternal();
  };

  const handleFinishOrder = () => {
    handleFinish();
    handleClose();
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    setOpen(modalOpen)
  }, [modalOpen]);

  return (
    <div>
      <Dialog
        open={ open }
        onClose={ handleClose }
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Resumo do pedido</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            ref={ descriptionElementRef }
            tabIndex={ -1 }
          >
            <List disablePadding>
              { (order.products ?? []).map((product) => (
                <ListItem className={ classes.listItem } key={ product.product_id }>
                  <ListItemText primary={ product.description }/>
                  <Typography variant="body2">
                    { product.quantity } x { getValueFormatted(order.credit_card_payment ? product.card : product.cash) }
                  </Typography>
                </ListItem>
              )) }
              <ListItem className={ classes.listItem }>
                <ListItemText primary="Total"/>
                <Typography variant="subtitle1" className={ classes.total }>
                  { getValueFormatted(order.total_amount) }
                </Typography>
              </ListItem>
            </List>
            <Grid container spacing={ 2 }>
              <Grid item xs={ 12 } sm={ 6 }>
                <Typography variant="h6" gutterBottom className={ classes.title }>
                  Dados para Entrega
                </Typography>
                <Typography gutterBottom>{ order.phonenumber }</Typography>
                <Typography gutterBottom>{ (order.address + " " + order.complement).toUpperCase() }</Typography>
                <Typography gutterBottom>{ order.notes?.toUpperCase() }</Typography>
              </Grid>
              <Grid item container direction="column" xs={ 12 } sm={ 6 }>
                <Typography variant="h6" gutterBottom className={ classes.title }>
                  Detalhes do Pagamento
                </Typography>
                <Grid container>
                  <Grid item xs={ 6 }>
                    <Typography gutterBottom>Pagar com</Typography>
                  </Grid>
                  <Grid item xs={ 6 }>
                    <Typography gutterBottom>{ order.credit_card_payment
                      ? "Cartão"
                      : "Dinheiro" }</Typography>
                  </Grid>
                  { order.change_to === "" ? null :
                    <React.Fragment>
                      <Grid item xs={ 6 }>
                        <Typography gutterBottom>Troco para</Typography>
                      </Grid>
                      <Grid item xs={ 6 }>
                        <Typography gutterBottom>{ order.change_to }</Typography>
                      </Grid>
                      <Grid item xs={ 6 }>
                        <Typography gutterBottom>Levar</Typography>
                      </Grid>
                      <Grid item xs={ 6 }>
                        <Typography gutterBottom>{ order.change_difference }</Typography>
                      </Grid>
                    </React.Fragment>
                  }
                </Grid>
              </Grid>
            </Grid>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleClose } color="primary">
            VOLTAR
          </Button>
          <Button onClick={ handleFinishOrder } color="primary" variant="contained">
            FINALIZAR
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

OrderConfirmation.defaultProps = {
  order: {}
}