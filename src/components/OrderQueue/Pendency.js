import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@material-ui/core";
import Input from "react-materialize/lib/Input";
import { Icon } from "react-materialize";

const useStylesAccordion = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function Pendency(props) {
  const classesAccordion = useStylesAccordion();
  const [pendingPayment, isPendingPayment] = useState(false);
  const [pendingBottle, isPendingBottle] = useState(false);
  const [pendingPaymentValue, setPendingPaymentValue] = useState(props.order.total_amount);
  const [pendingBottleQuantity, setPendingBottleQuantity] = useState(_getTotalBottle());
  const [pendingGenericNote, setPendingGenericNote] = useState(null);

  function _getTotalBottle() {
    return props.order.products.reduce((total, prod) => (total + Number(prod.quantity)), 0);
  }

  const handlePendingGenericNote = (value) => {
    setPendingGenericNote(value);
    props.handlePendingGenericNote(value);
  }

  const handlePendingPayment = (value) => {
    setPendingPaymentValue(value);
    if (props.handlePendingPaymentValue) {
      props.handlePendingPaymentValue(value);
    }
  }

  const handleIsPendingPayment = (checked) => {
    isPendingPayment(checked);
    if (props.handleIsPendingPayment) {
      props.handleIsPendingPayment(checked);
    }
  }

  const handlePendingBottleQuantity = (value) => {
    setPendingBottleQuantity(value);
    if (props.handlePendingBottleQuantity) {
      props.handlePendingBottleQuantity(value);
    }
  }

  const handleIsPendingBottle = (checked) => {
    isPendingBottle(checked);
    if (props.handleIsPendingBottle) {
      props.handleIsPendingBottle(checked);
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <FormControl component="fieldset" className={ classesAccordion.root }>
          <FormLabel component="legend">Pendências</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={ <Checkbox id="pending_payment"
                                  name="pending_payment"
                                  checked={ pendingPayment }
                                  onChange={ (event) => handleIsPendingPayment(event.target.checked) }/> }
              label="Pagamento Pendente"
            />
            { pendingPayment ?
              <Input
                id="pending_payment_value"
                type="number"
                label="Ficou devendo"
                variant="outlined"
                defaultValue={ props.order.total_amount }
                value={ pendingPaymentValue }
                onChange={ (event) => handlePendingPayment(Number(event.target.value)) }
                min={ 0.01 }
                max={ props.order.total_amount }
                step="0.01"
                validate
                placeholder="...">
                <Icon>attach_money</Icon>
              </Input> : undefined }

            <FormControlLabel
              control={ <Checkbox id="pending_bottle"
                                  name="pending_bottle"
                                  checked={ pendingBottle }
                                  onChange={ (event) => handleIsPendingBottle(event.target.checked) }/> }
              label="Garrafão Emprestado"
            />
            { pendingBottle ?
              <FormGroup>
                <Input
                  id="pending_bottle_quantity"
                  type="number"
                  label="Garrafões"
                  variant="outlined"
                  defaultValue={ _getTotalBottle() }
                  value={ pendingBottleQuantity }
                  onChange={ (event) => handlePendingBottleQuantity(Number(event.target.value)) }
                  min={ 1 }
                  max={ _getTotalBottle() }
                  step="1"
                  validate
                  placeholder="...">
                  <Icon>invert_colors</Icon>
                </Input>
              </FormGroup> : undefined }

            <Input
              id="pending_notes"
              label="Observações"
              variant="outlined"
              value={ pendingGenericNote }
              onChange={ (event) => handlePendingGenericNote(event.target.value) }
              placeholder="..."/>
          </FormGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
}
