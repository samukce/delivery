import React, { useState, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GridList, List } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid'
import { makeStyles } from "@material-ui/core/styles";
import { getValueFormatted } from "../../utilities/ComponentUtils";
import withWidth from '@material-ui/core/withWidth';
import Pendency from "../OrderQueue/Pendency";

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

export function OrderConfirmation({ modalOpen, order, handleFinish, handleCloseExternal }) {
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

  function previous_pendencies() {
    return order.previous_pendencies ?? [];
  }

  const gridSizeCurrentOrder = () => {
    if (previous_pendencies().length) {
      return { xs: 12, sm: 8 }
    }

    return { xs: 12, sm: 12 }
  }

  const gridSizePendencies = () => {
    if (previous_pendencies().length) {
      return { xs: 12, sm: 4 }
    }

    return { xs: 12, sm: 12 }
  }

  return (
    <div>
      <Dialog
        open={ open }
        onClose={ handleClose }
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="md"
        fullWidth={ true }
      >
        <DialogTitle id="scroll-dialog-title">Resumo do pedido</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            ref={ descriptionElementRef }
            tabIndex={ -1 }
          >
            <Grid container spacing={ 2 }>
              <Grid item { ...gridSizeCurrentOrder() }>
                <List id="products" disablePadding>
                  { (order.products ?? []).map((product) => (
                    <ListItem className={ classes.listItem } key={ product.product_id }>
                      <ListItemText className="description" primary={ product.description }/>
                      <Typography className="product_value" variant="body2">
                        { product.quantity } x { getValueFormatted(order.credit_card_payment ? product.card : product.cash) }
                      </Typography>
                    </ListItem>
                  )) }
                  <ListItem className={ classes.listItem }>
                    <ListItemText primary="Total"/>
                    <Typography id="total_amount" variant="subtitle1" className={ classes.total }>
                      { getValueFormatted(order.total_amount) }
                    </Typography>
                  </ListItem>
                </List>
                <Grid container spacing={ 2 }>
                  <Grid item xs={ 12 } sm={ 6 }>
                    <Typography variant="h6" gutterBottom className={ classes.title }>
                      Dados para Entrega
                    </Typography>
                    <Typography id="phonenumber" gutterBottom>{ order.phonenumber }</Typography>
                    <Typography id="address"
                                gutterBottom>{ (order.address + " " + (order.complement ?? "")).trim().toUpperCase() }</Typography>
                    <Typography id="notes" gutterBottom>{ order.notes?.toUpperCase() }</Typography>
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
                        <Typography id="payment_type" gutterBottom>{ order.credit_card_payment
                          ? "Cartão"
                          : "Dinheiro" }</Typography>
                      </Grid>
                      { order.change_to === "" ? null :
                        <React.Fragment>
                          <Grid item xs={ 6 }>
                            <Typography gutterBottom>Troco para</Typography>
                          </Grid>
                          <Grid item xs={ 6 }>
                            <Typography id="change_to" gutterBottom>{ order.change_to }</Typography>
                          </Grid>
                          <Grid item xs={ 6 }>
                            <Typography gutterBottom>Levar</Typography>
                          </Grid>
                          <Grid item xs={ 6 }>
                            <Typography id="change_difference" gutterBottom>{ order.change_difference }</Typography>
                          </Grid>
                        </React.Fragment>
                      }
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              { previous_pendencies().length ?
                <Grid id="previous_pendencies" item { ...gridSizePendencies() }>
                  { previous_pendencies().map(p =>
                    <Pendency key={ p.order_id } pendent={ p.pendent } readOnly={ true }/>) }
                </Grid> : undefined
              }
            </Grid>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="back" onClick={ handleClose } color="primary">
            VOLTAR
          </Button>
          <Button id="finish" onClick={ handleFinishOrder } color="primary" variant="contained">
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

export default withWidth()(OrderConfirmation);