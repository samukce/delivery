import React, { Component } from 'react';
import {Input, Row, Icon, Button} from 'react-materialize';
import Cart from './Cart'
import { handleInputChangeBind } from './utilities/ComponentUtils'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      product_display_description: '',
      products: [],
    };
  }

  handleOnAutocompleteProduct = (value) => {
    this.setState({
      add_product: value
    });
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
    this.setState({products});
  }

  render() {
    return (
      <div>
        <Input id='address'
              name='address'
              label='Address'
              autoFocus
              required
              validate
              s={12}
              onChange={handleInputChangeBind(this.setState.bind(this))}><Icon>home</Icon></Input>

        <Input s={12} label='Complement'><Icon>rate_review</Icon></Input>

        <Cart onProductsChange={this.onProductsChange}/>

        <Input s={12} label='Notes'><Icon>speaker_notes</Icon></Input>
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
