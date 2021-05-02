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

export default function Pendency({
                                   total_amount,
                                   products,
                                   handlePendingGenericNote,
                                   handlePendingPaymentValue,
                                   handleIsPendingPayment,
                                   handlePendingBottleQuantity,
                                   handleIsPendingBottle,
                                 }) {
  const classesAccordion = useStylesAccordion();
  const [pendingPayment, isPendingPayment] = useState(false);
  const [pendingBottle, isPendingBottle] = useState(false);
  const [pendingPaymentValue, setPendingPaymentValue] = useState(total_amount);
  const [pendingBottleQuantity, setPendingBottleQuantity] = useState(_getTotalBottle());
  const [pendingGenericNote, setPendingGenericNote] = useState(null);

  function _getTotalBottle() {
    if (products) {
      return products.reduce((total, prod) => (total + Number(prod.quantity)), 0);
    }
  }

  const _handlePendingGenericNote = (value) => {
    setPendingGenericNote(value);
    handlePendingGenericNote(value);
  }

  const _handlePendingPayment = (value) => {
    setPendingPaymentValue(value);
    if (handlePendingPaymentValue) {
      handlePendingPaymentValue(value);
    }
  }

  const _handleIsPendingPayment = (checked) => {
    isPendingPayment(checked);
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
    isPendingBottle(checked);
    if (handleIsPendingBottle) {
      handleIsPendingBottle(checked);
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
                placeholder="...">
                <Icon>attach_money</Icon>
              </Input> : undefined }

            <FormControlLabel
              control={ <Checkbox id="pending_bottle"
                                  name="pending_bottle"
                                  checked={ pendingBottle }
                                  onChange={ (event) => _handleIsPendingBottle(event.target.checked) }/> }
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
                  onChange={ (event) => _handlePendingBottleQuantity(Number(event.target.value)) }
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
              onChange={ (event) => _handlePendingGenericNote(event.target.value) }
              placeholder="..."/>
          </FormGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
}
