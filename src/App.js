import React, { Component } from 'react';
import { Input, Row, Icon, Button, Col, Card } from 'react-materialize';
import Cart from './Cart'
import { handleInputChangeBind, getValueFormatted } from './utilities/ComponentUtils'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      product_display_description: '',
      products: [],
      total_amount: 0,
    };
  }

  buttonClickPlaceOrder = () => {
    if (!this.isValid()) return;
    this.placeOrder();
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
          s={12}
          onChange={handleInputChangeBind(this.setState.bind(this))}><Icon>home</Icon>
        </Input>

        <Input
          id='complement'
          name='complement'
          s={12}
          label='Complement'
          onChange={handleInputChangeBind(this.setState.bind(this))}><Icon>rate_review</Icon>
        </Input>

        <Cart onProductsChange={this.onProductsChange}/>

        <Row>
          <Col m={2} offset='m10' s={12}>
              <Card
                id='total_amount'
                className='blue-grey darken-1'
                textClassName='white-text'
                title={getValueFormatted(this.state.total_amount)}>
                Total
              </Card>
          </Col>
        </Row>

        <Input
          id='notes'
          s={12}
          name='notes'
          label='Notes'
          onChange={handleInputChangeBind(this.setState.bind(this))}><Icon>speaker_notes</Icon></Input>

        <Row>
          <Button className='col s12 m2 offset-m6 grey'>Clean<Icon left>clear_all</Icon></Button>
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

export default App;
