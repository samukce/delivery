import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Row, Icon, Button, Card } from 'react-materialize';
import Cart from './Cart'
import { handleInputChangeBind, getValueFormatted } from './utilities/ComponentUtils'
import AutocompleteCustom from './components/AutocompleteCustom'
import OrderRepository from './repository/OrderRepository'
import { Trans } from "@lingui/react"


class Checkout extends Component {
  static propTypes = {
    orderRepository: PropTypes.any.isRequired
  };

  static defaultProps = {
    orderRepository: new OrderRepository()
  }

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      phonenumber: '',
      address: '',
      complement: '',
      notes: '',
      change_to: '',
      product_display_description: '',
      products: [],
      total_amount: 0,
      credit_card_payment: false,
    }
  }

  buttonClickPlaceOrder = () => {
    this.placeOrder();
  }

  clearAllFieds = () => this.setState(this.getInitialState(), () => {
    this.triggerCartClear();
    this.setFocusOnPhonenumber();
  });

  buttonClickCashPayment = () => {
    this.setState({credit_card_payment: false},
      () => {
        this.calculateTotalAmount(this.state.products);
        this.setFocusOnChargeTo();
      });
  }

  buttonClickCreditCardPayment = () => {
    this.setState({credit_card_payment: true},
      () => {
        this.calculateTotalAmount(this.state.products);
        this.setFocusOnNotes();
      });
  }

  triggerCartClear = () => {
    if (!this.cartComponent) return;
    this.cartComponent.onCartClear();
  }

  triggerCartLoad = ({ products }) => {
    if (!this.cartComponent) return;

    this.triggerCartClear();
    this.cartComponent.onCartLoad(products);
    this.setFocusNextField();
  }

  placeOrder = () => {
    if (!this.isValid()) return;
    this.saveOrder();
    this.clearAllFieds();
  }

  saveOrder = () => {
    const { phonenumber, address, complement, notes, change_to, products, total_amount, credit_card_payment } = this.state;
    const order = {
      phonenumber, address, complement, notes, change_to, products, total_amount, credit_card_payment
    }

    this.props.orderRepository.save(order);
  }

  isValid = () => {
    const { address, products, total_amount, change_to } = this.state;
    const validChange = !change_to || (change_to > total_amount)

    return address.length !== 0 && products.length !== 0 && validChange
  }

  onProductsChange = (products) => {
    this.setState({ products }, () => {
      this.calculateTotalAmount(products);
      this.setFocusNextField();
    });
  }

  onChangeAddress = (evt, value) => {
    this.setState({
      address: value
    });
  }

  onChangePhonenumber = (evt, value) => {
    this.setState({
      phonenumber: value
    });
  }

  onKeyPressOnlyNumber = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const onlyNumbers = /^\d+$/;
    if (!onlyNumbers.test(keyValue)){
      event.preventDefault();
    }
  }

  calculateTotalAmount = (products) => {
    let total_amount = 0;

    if (this.state.credit_card_payment) {
      total_amount = products.reduce((total, prod) => total +  (prod.card * prod.quantity), 0);
    } else {
      total_amount = products.reduce((total, prod) => total +  (prod.cash * prod.quantity), 0);
    }
    this.setState({ total_amount });
  }

  updateChangeDifference = () => {
    const { total_amount, change_to } = this.state;
    const change_difference = change_to - total_amount;

    this.setState( { change_difference: change_difference > 0 ? change_difference : null });
  }

  lazyAddressSearch = (address) => {
    return this.props.orderRepository.searchByAddress(address);
  }

  lazyPhoneSearch = (phonenumber) => {
    if (!phonenumber) {
        return [];
    }
    
    const phone_only_digits = phonenumber.replace(/^\D+/g, '').replace(/\s/g, '');
    return this.props.orderRepository.searchByPhone(phone_only_digits);
  }

  handleOnAutocompleteLastOrderSearch = (order) => {
    this.setState(order, () => this.triggerCartLoad(order));
  }

  handleKeyDownChange = (event) => {
    if (event.key === 'Enter') {
      this.setFocusOnNotes();
    }
  }

  handleKeyDownNotes = (event) => {
    if (event.key === 'Enter') {
      this.placeOrder();
    }
  }

  setFocusNextField = () => {
    if (this.state.credit_card_payment) {
      this.setFocusOnNotes();
    } else {
      this.setFocusOnChargeTo();
    }
  }

  setFocusOnChargeTo = () => {
    if (!this.inputChargeTo) {
      return;
    }
    this.inputChargeTo.input.focus();
  }

  setFocusOnPhonenumber = () => {
    if (!this.inputPhonenumber) return;
    this.inputPhonenumber.setFocus();
  }

  setFocusOnNotes = () => {
    if (!this.inputNotes) return;
    this.inputNotes.input.focus();
  }

  render() {
    return (
      <div className='section'>
        <Row>
          <AutocompleteCustom
            id='phonenumber'
            title={<Trans id='checkout.phonenumber'>Phone number</Trans>}
            placeholder='...'
            autoFocus
            className='phonenumber'
            lazyData={this.lazyPhoneSearch}
            onAutocomplete={this.handleOnAutocompleteLastOrderSearch}
            value={this.state.phonenumber}
            onChange={this.onChangePhonenumber}
            propertyField='phonenumber'
            s={12}
            icon='phone'
            ref={(el) => this.inputPhonenumber = el}
            iconClassName='prefix'
            onKeyPressCustom={this.onKeyPressOnlyNumber}
            />

          <AutocompleteCustom
            id='address'
            title={<Trans id='checkout.address'>Address</Trans>}
            placeholder='...'
            className='address'
            required
            validate
            lazyData={this.lazyAddressSearch}
            onAutocomplete={this.handleOnAutocompleteLastOrderSearch}
            value={this.state.address}
            onChange={this.onChangeAddress}
            s={12}
            m={7}
            icon='home'
            ref={(el) => this.inputAddress = el}
            iconClassName='prefix' />

          <Input
            id='complement'
            name='complement'
            placeholder='...'
            s={12}
            m={5}
            label={<Trans id='checkout.complement'>Complement</Trans>}
            value={this.state.complement}
            onChange={handleInputChangeBind(this.setState.bind(this))}><Icon>rate_review</Icon>
          </Input>
        </Row>

        <Cart onProductsChange={this.onProductsChange} ref={(el) => this.cartComponent = el}>
          <Card
            id='total_amount'
            actions={[
              <Row>
                <Button
                  id='cash-payment-button'
                  onClick={this.buttonClickCashPayment}
                  disabled={!this.state.credit_card_payment}
                  className='col s12 m6 blue'>
                  <Icon>attach_money</Icon>
                </Button>
                <Button
                  id='card-payment-button'
                  onClick={this.buttonClickCreditCardPayment}
                  disabled={this.state.credit_card_payment}
                  className='col s12 m6 blue'>
                  <Icon>credit_card</Icon>
                </Button>
              </Row>
            ]}
            title={getValueFormatted(this.state.total_amount)}>
            {<Trans id={this.state.credit_card_payment ? 'checkout.card' : 'checkout.cash'}>Total</Trans>}
          </Card>

          { !this.state.credit_card_payment ? 
            <Input
              id='change_to'
              name='change_to'
              label={<Trans id='checkout.change_to'>Change to</Trans>}
              placeholder='...'
              s={12}
              type='number'
              value={this.state.change_to}
              min={this.state.total_amount + 0.01}
              step='0.01'
              validate
              ref={(el) => this.inputChargeTo = el}
              disabled={this.state.credit_card_payment}
              onKeyDown={this.handleKeyDownChange}
              onChange={handleInputChangeBind(this.setState.bind(this), this.updateChangeDifference)}>
              <Icon>attach_money</Icon>
            </Input>
          : null
          }
        </Cart>

        <Input
          id='notes'
          s={12}
          name='notes'
          label={<Trans id='checkout.notes'>Notes</Trans>}
          placeholder='...'
          value={this.state.notes}
          ref={(el) => this.inputNotes = el}
          onKeyDown={this.handleKeyDownNotes}
          onChange={handleInputChangeBind(this.setState.bind(this))}><Icon>speaker_notes</Icon></Input>

        <Row>
          <Button
            id='clear-button'
            onClick={this.clearAllFieds}
            className='col s12 m2 grey clear-button'>{<Trans id='checkout.clean'>Clean</Trans>}<Icon left>clear_all</Icon>
          </Button>
          <Button
            id='place-order-button'
            onClick={this.buttonClickPlaceOrder}
            disabled={!this.isValid()}
            className='col s12 m3 offset-m7'>{<Trans id='checkout.place_order'>Place Order</Trans>}<Icon left>motorcycle</Icon>
          </Button>
        </Row>
      </div>
    );
  }
}

export default Checkout;
