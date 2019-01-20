import React, { Component } from 'react';
import {Table, Input, Row, Icon, Col, Button, Autocomplete} from 'react-materialize';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      quantity: 1,
      products: []
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
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

  addProduct = () => {
    const product = { 
      product_id: this.state.product_id, 
      description: this.state.product_description,
      value: this.state.product_value,
      quantity: this.state.quantity
    };

    this.setState({
      products: [...this.state.products, product]
    });

    console.log(this.state.products);
  }

  render() {
    return (
      <Row>
        <Input id='address'
              name='address'
              label='Address'
              autoFocus
              required
              validate
              s={12}
              onChange={this.handleInputChange}><Icon>home</Icon></Input>

        <Input s={12} label='Complement'><Icon>rate_review</Icon></Input>

        <Autocomplete
          title='Product'
          data={{
            'Apple': null,
            'Microsoft': null,
            'Google': null
          }}
          s={12} m={6}
          icon='local_grocery_store'
          iconClassName='prefix' />

        {/* <Input id='product'
              name='product'
              label='Product' 
              s={12} m={6}
              onChange={this.handleInputChange}><Icon>local_grocery_store</Icon></Input> */}
        <Input id='quantity'
              name='quantity'
              label='Quantity'
              s={12} m={4}
              onChange={this.handleInputChange}><Icon>list_alt</Icon></Input>
        <Button id='add-product-button' 
              onClick={this.addProduct}
              className='col s12 m2'>Add<Icon left>add_shopping_cart</Icon></Button>

        <Col s={12}>
          <Table>
            <thead>
              <tr>
                <th data-field='description'>Description</th>
                <th data-field='price'>Item Price</th>
                <th data-field='quantity'>Quantity</th>
                <th data-field='total'>Item Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Alvin</td>
                <td>1</td>
                <td>$0.87</td>
                <td>$0.87</td>
              </tr>
              <tr>
                <td>Alan</td>
                <td>2</td>
                <td>$3.76</td>
                <td>$7.52</td>
              </tr>
              <tr>
                <td>Jonathan</td>
                <td>3</td>
                <td>$7.00</td>
                <td>$21.00</td>
              </tr>
            </tbody>
          </Table>
        </Col>

        <Input s={12} label='Notes'><Icon>speaker_notes</Icon></Input>

        <Button className='col s12 m2 offset-m6 grey'>Clean<Icon left>clear_all</Icon></Button>
        <Button
          id='place-order-button'
          onClick={this.buttonClickPlaceOrder}
          className='col s12 m3 offset-m1'>Place Order<Icon left>motorcycle</Icon>
        </Button>
      </Row>
    );
  }
}

export default App;
