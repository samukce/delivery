import React, { Component } from 'react';
import { Input, Row, Icon, Button, Card } from 'react-materialize';
import Cart from './Cart'
import { handleInputChangeBind, getValueFormatted } from './utilities/ComponentUtils'


class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      address: '',
      complement: '',
      notes: '',
      change_to: '',
      product_display_description: '',
      products: [],
      total_amount: 0,
    }
  }

  buttonClickPlaceOrder = () => {
    if (!this.isValid()) return;
    this.placeOrder();
  }

  clearAllFieds = () => {
    this.setState(this.getInitialState(), () => this.triggerCartClear());
  }

  triggerCartClear = () => {
    if (!this.cartComponent) return;
    this.cartComponent.onCartClear();
  }

  cartRefHandler = (el) => {
    this.cartComponent = el;
  }

  placeOrder = () => {}

  isValid = () => {
    return this.state.address.length !== 0
  }

  onProductsChange = (products) => {
    this.setState({ products });

    this.calculateTotalAmount(products);
  }

  calculateTotalAmount = (products) => {
    const total_amount = products.reduce((total, prod) => total +  (prod.value * prod.quantity), 0);

    this.setState({ total_amount });
  }

  updateChangeDifference = () => {
    const { total_amount, change_to } = this.state;
    const change_difference = change_to - total_amount;

    this.setState( { change_difference: change_difference > 0 ? change_difference : null });
  }

  render() {
    return (
      <div>
        <Input
          id='address'
          name='address'
          label='Address'
          autoFocus
          required
          validate
          value={this.state.address}
          s={12}
          onChange={handleInputChangeBind(this.setState.bind(this))}><Icon>home</Icon>
        </Input>

        <Input
          id='complement'
          name='complement'
          s={12}
          label='Complement'
          value={this.state.complement}
          onChange={handleInputChangeBind(this.setState.bind(this))}><Icon>rate_review</Icon>
        </Input>

        <Cart onProductsChange={this.onProductsChange} ref={this.cartRefHandler}>
          <Card
            id='total_amount'
            className='blue-grey darken-1 z-depth-3'
            textClassName='white-text'
            title={getValueFormatted(this.state.total_amount)}>
            Total
          </Card>
          <Input
            id='change_to'
            name='change_to'
            label='Change to'
            s={12}
            type='number'
            value={this.state.change_to}
            min={this.state.total_amount + 0.01}
            step='0.01'
            validate
            onChange={handleInputChangeBind(this.setState.bind(this), this.updateChangeDifference)}><Icon>attach_money</Icon></Input>
        </Cart>

        <Input
          id='notes'
          s={12}
          name='notes'
          label='Notes'
          value={this.state.notes}
          onChange={handleInputChangeBind(this.setState.bind(this))}><Icon>speaker_notes</Icon></Input>

        <Row>
          <Button
            id='clear-button'
            onClick={this.clearAllFieds}
            className='col s12 m2 offset-m6 grey clear-button'>Clean<Icon left>clear_all</Icon>
          </Button>
          <Button
            id='place-order-button'
            onClick={this.buttonClickPlaceOrder}
            className='col s12 m3 offset-m1'>Place Order<Icon left>motorcycle</Icon>
          </Button>
        </Row>
      </div>
    );
  }
}

export default Checkout;
