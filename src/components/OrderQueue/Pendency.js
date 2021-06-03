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
import CheckBoxOutlineBlankSharpIcon from '@material-ui/icons/CheckBoxOutlineBlankSharp';
import Input from "react-materialize/lib/Input";
import { Icon } from "react-materialize";
import { Done } from "@material-ui/icons";

const useStylesAccordion = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function Pendency({
                                   pendent,
                                   total_amount,
                                   products,
                                   handlePendingGenericNote,
                                   handlePendingPaymentValue,
                                   handleIsPendingPayment,
                                   handlePendingBottleQuantity,
                                   handleIsPendingBottle,
                                   readOnly,
                                   handlePendencyResolved,
                                 }) {
  const classesAccordion = useStylesAccordion();

  const [checkedResolved, setCheckedResolved] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(!!(pendent ?? {}).payment);
  const [pendingBottle, setPendingBottle] = useState(!!(pendent ?? {}).bottles);
  const [pendingGenericNote, setPendingGenericNote] = useState((pendent ?? {}).note);

  const [pendingPaymentValue, setPendingPaymentValue] = useState(initialPendingPaymentValue());
  const [pendingBottleQuantity, setPendingBottleQuantity] = useState(initialPendingBottleQuantity());

  function initialPendingPaymentValue() {
    const payment = (pendent ?? {}).payment;
    if (!!payment && payment.value) {
      return payment.value;
    }
    return total_amount;
  }

  function initialPendingBottleQuantity() {
    const bottles = (pendent ?? {}).bottles;
    if (!!bottles && bottles.quantity) {
      return bottles.quantity;
    }
    return _getTotalBottle();
  }

  function _getTotalBottle() {
    if (products) {
      return products.reduce((total, prod) => (total + Number(prod.quantity)), 0);
    }
  }

  const _handlePendingGenericNote = (value) => {
    setPendingGenericNote(value);
    if (handlePendingGenericNote) {
      handlePendingGenericNote(value);
    }
  }

  const _handlePendingPayment = (value) => {
    setPendingPaymentValue(value);
    if (handlePendingPaymentValue) {
      handlePendingPaymentValue(value);
    }
  }

  const _handleIsPendingPayment = (checked) => {
    setPendingPayment(checked);
    if (handleIsPendingPayment) {
      handleIsPendingPayment(checked);
    }
  }

  const _handlePendingBottleQuantity = (value) => {
    setPendingBottleQuantity(value);
    if (handlePendingBottleQuantity) {
      handlePendingBottleQuantity(value);
    }
  }

  const _handleIsPendingBottle = (checked) => {
    setPendingBottle(checked);
    if (handleIsPendingBottle) {
      handleIsPendingBottle(checked);
    }
  }

  const _handlePendencyResolved = (checked) => {
    setCheckedResolved(checked);
    handlePendencyResolved(checked);
  }

  return (
    <Card variant="outlined">
      { handlePendencyResolved ?
        <FormControlLabel
          control={ <Checkbox id="pendency_resolved"
                              name="pendency_resolved"
                              checked={ checkedResolved }
                              onChange={ (event) => _handlePendencyResolved(event.target.checked) }
                              icon={ <CheckBoxOutlineBlankSharpIcon/> }
                              checkedIcon={ <Done color="primary"/> }
          /> }
          label="Pendências Resolvidas?"
        />
        : null
      }

      <CardContent>
        <FormControl component="fieldset" className={ classesAccordion.root } disabled={ readOnly }>
          <FormLabel component="legend">Pendências</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={ <Checkbox id="pending_payment"
                                  name="pending_payment"
                                  checked={ pendingPayment }
                                  onChange={ (event) => _handleIsPendingPayment(event.target.checked) }/> }
              label="Pagamento Pendente"
            />
            { pendingPayment ?
              <Input
                id="pending_payment_value"
                type="number"
                label="Ficou devendo"
                variant="outlined"
                defaultValue={ total_amount }
                value={ pendingPaymentValue }
                onChange={ (event) => _handlePendingPayment(Number(event.target.value)) }
                min={ 0.01 }
                max={ total_amount }
                step="0.01"
                validate
                placeholder="..."
                disabled={ readOnly }
              >
                <Icon>attach_money</Icon>
              </Input> : null }

            <FormControlLabel
              control={ <Checkbox id="pending_bottle"
                                  name="pending_bottle"
                                  checked={ pendingBottle }
                                  onChange={ (event) => _handleIsPendingBottle(event.target.checked) }/> }
              label="Garrafão Emprestado"
            />
            { pendingBottle ?
              <Input
                id="pending_bottle_quantity"
                type="number"
                label="Garrafões"
                variant="outlined"
                defaultValue={ _getTotalBottle() }
                value={ pendingBottleQuantity }
                onChange={ (event) => _handlePendingBottleQuantity(Number(event.target.value)) }
                min={ 1 }
                max={ _getTotalBottle() }
                step="1"
                validate
                placeholder="..."
                disabled={ readOnly }
              >
                <Icon>invert_colors</Icon>
              </Input>
              : null }

            <Input
              id="pending_notes"
              label="Observações"
              variant="outlined"
              value={ pendingGenericNote }
              onChange={ (event) => _handlePendingGenericNote(event.target.value) }
              placeholder="..."
              disabled={ readOnly }
            />
          </FormGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
}

Pendency.defaultProps = {
  readOnly: false
}