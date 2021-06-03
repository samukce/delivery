import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { getValueFormatted } from "../../utilities/ComponentUtils";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Grid, List, } from "@material-ui/core";
import Pendency from "./Pendency";
import { _getLocalDate, _getMinutesOnQueue } from "../../utilities/DateUtil"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={ value !== index }
      id={ `scrollable-auto-tabpanel-${ index }` }
      aria-labelledby={ `scrollable-auto-tab-${ index }` }
      { ...other }
    >
      { value === index && (
        <Box p={ 3 }>
          <Typography>{ children }</Typography>
        </Box>
      ) }
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStylesAccordion = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function OrderCard(props) {
  const classesAccordion = useStylesAccordion();
  const [pendingPayment, isPendingPayment] = useState(false);
  const [pendingBottle, isPendingBottle] = useState(false);
  const [pendingPaymentValue, setPendingPaymentValue] = useState(props.order.total_amount);
  const [pendingBottleQuantity, setPendingBottleQuantity] = useState(_getTotalBottle());
  const [pendingGenericNote, setPendingGenericNote] = useState(null);
  const [pendenciesResolved, setPendenciesResolved] = useState([]);
  const handleCancelOrder = props.handleCancelOrder;
  const handleShippedOrder = props.handleShippedOrder;
  const handleDeliveredOrder = props.handleDeliveredOrder;

  function _getTotalBottle() {
    return (props.order.products ?? [])
      .reduce((total, prod) => (total + Number(prod.quantity)), 0);
  }

  function _handlePendencyResolved(order_id, checked) {
    if (checked) {
      setPendenciesResolved([...pendenciesResolved, order_id]);
    } else {
      setPendenciesResolved(pendenciesResolved.filter((id) => id !== order_id));
    }
  }

  function handleCancelClick() {
    handleCancelOrder(props.order.id);
  }

  function handleShippedClick() {
    handleShippedOrder(props.order.id);
  }

  function handleDeliveredClick() {
    handleDeliveredOrder(props.order.id, {
      pending_payment: pendingPayment ? pendingPaymentValue : null,
      pending_bottles: pendingBottle ? pendingBottleQuantity : null,
      pending_generic_note: pendingGenericNote
    }, pendenciesResolved);
  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={ <ExpandMoreIcon/> }
        aria-controls="panel1a-content"
        id={ `panel-header-${ props.order.id }` }
      >
        <Typography className={ classesAccordion.heading }>
          { props.order.address } { props.order.complement }
        </Typography>
        <Typography
          className={ classesAccordion.title }
          color="textSecondary"
          gutterBottom
        >
          ({ _getMinutesOnQueue(props.order.created) })
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Card className={ classesAccordion.root } variant="outlined">
          <CardContent>
            <Typography
              className={ classesAccordion.title }
              color="textSecondary"
              gutterBottom
            >
              { _getLocalDate(props.order.created) }
            </Typography>
            <Typography id="address" variant="h7" component="h7" display="block">
              { props.order.address } { props.order.complement }
            </Typography>

            { props.order.phonenumber ? (
              <Typography id="phonenumber" variant="overline" display="block">
                TEL.: { props.order.phonenumber }
              </Typography>
            ) : null }

            { props.order.notes ? (
              <Typography id="notes" variant="overline" display="block">
                OBS.: { props.order.notes }
              </Typography>
            ) : null }

            { (props.order.products ?? []).map((prod) => (
              <Typography key={ prod.product_id } className="product-description" color="textSecondary" gutterBottom>
                { prod.quantity } { prod.description }
              </Typography>
            )) }

            <Typography id="total_amount" variant="body2" component="p">
              Total em{ " " }
              {
                props.order.credit_card_payment
                  ? "Cartão"
                  : "Dinheiro"
              }
              : { getValueFormatted(props.order.total_amount) }
            </Typography>

            { props.order.change_difference ? (
              <Typography id="change_difference" variant="body2" component="p">
                Levar troco de{ " " }
                { getValueFormatted(props.order.change_difference) }
              </Typography>
            ) : null }

            { handleDeliveredOrder ? (
              <React.Fragment>
                <Pendency key={ props.order.id }
                          total_amount={ props.order.total_amount }
                          products={ props.order.products }
                          handlePendingGenericNote={ setPendingGenericNote }
                          handleIsPendingBottle={ isPendingBottle }
                          handlePendingBottleQuantity={ setPendingBottleQuantity }
                          handleIsPendingPayment={ isPendingPayment }
                          handlePendingPaymentValue={ setPendingPaymentValue }
                />

                { (props.order.previous_pendencies ?? []).length ?
                  <List id="previous_pendencies" disablePadding>
                    { (props.order.previous_pendencies ?? []).map(orderPendency =>
                      <Pendency key={ orderPendency.order_id }
                                readOnly={ true }
                                pendent={ orderPendency.pendent }
                                handlePendencyResolved={ (value) => {
                                  _handlePendencyResolved(orderPendency.order_id, value)
                                } }
                      />
                    ) }
                  </List>
                  : null
                }
              </React.Fragment>
            ) : null
            }
          </CardContent>
          <CardActions>
            <Grid container spacing={ 1 }>
              <Grid item xs={ 6 }>
                <Button
                  id="cancel"
                  size="small"
                  variant="outlined"
                  onClick={ handleCancelClick }
                  fullWidth
                >
                  Cancelar
                </Button>
              </Grid>

              <Grid item xs={ 6 }>
                { handleShippedOrder == null ? null : (
                  <Button
                    id="shipped"
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={ handleShippedClick }
                    fullWidth
                  >
                    Entregar
                  </Button>
                ) }
                { handleDeliveredOrder == null ? null : (
                  <Button
                    id="delivered"
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={ handleDeliveredClick }
                    fullWidth
                  >
                    Entregue
                  </Button>
                ) }
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
}
