import React, { Component } from 'react';
import {Table, Input, Row, Icon, Col, Button} from 'react-materialize';
import AutocompleteCustom from './components/AutocompleteCustom';
import PropTypes from 'prop-types';
import ProductRepository from './repository/ProductRepository';

class App extends Component {
  static propTypes = {
    productRepository: PropTypes.any.isRequired
  };

  static defaultProps = {
    productRepository: ProductRepository
  }

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      add_product_quantity: 1,
      product_display_description: '',
      products: [],
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

  handleOnAutocompleteProduct = (value) => {
    this.setState({
      add_product: value
    });
  }

  onChangeProductDisplay = (evt, value) => {
    this.setState({
      product_display_description: value
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
    if (!this.state.add_product) return;

    const product = {
      product_id: this.state.add_product.id,
      description: this.state.add_product.description,
      value: this.state.add_product.value,
      quantity: this.state.add_product_quantity
    };

    this.setState({
      products: [...this.state.products, product],
      add_product_quantity: 1,
      product_display_description: '',
      add_product: null
    });
  }

  convertProductsToAutocompleteMap = (arr) => {
    return arr.reduce(function(map, obj) {
      const productDisplay = `${obj.description} (R$ ${obj.value})`
      map[productDisplay] = obj;
      return map;
    }, {});
  }

  render() {
    const products = this.convertProductsToAutocompleteMap(this.props.productRepository.all());

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

        <AutocompleteCustom
          title='Product'
          className='product'
          placeholder='Water...'
          data={products}
          expandOnFocus={true}
          onAutocomplete={this.handleOnAutocompleteProduct}
          value={this.state.product_display_description}
          itemSelected={this.state.product_display_description !== ''}
          onChange={this.onChangeProductDisplay}
          s={12} m={6}
          icon='local_grocery_store'
          iconClassName='prefix' />

        <Input id='quantity'
              name='add_product_quantity'
              label='Quantity'
              value={this.state.add_product_quantity}
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
