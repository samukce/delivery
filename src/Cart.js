import React, { Component } from 'react';
import { Table, Input, Row, Icon, Col, Button } from 'react-materialize';
import AutocompleteCustom from './components/AutocompleteCustom';
import PropTypes from 'prop-types';
import ProductRepository from './repository/ProductRepository';
import { map } from 'lodash';
import { handleInputChangeBind, getValueFormatted } from './utilities/ComponentUtils';
import { Trans } from "@lingui/react"


class Cart extends Component {
  static propTypes = {
    productRepository: PropTypes.any.isRequired,
    onProductsChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    productRepository: ProductRepository
  }

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      add_product_quantity: 1,
      product_display_description: '',
      products: [],
    }
  }

  onCartClear = () => this.setState(this.getInitialState());

  onCartLoad = (products) => {
    const { onProductsChange } = this.props;

    this.setState({products}, () => onProductsChange(this.state.products));
  }

  productInputRefHandler = (el) => {
    this.productInputField = el;
  }

  quantityInputRefHandler = (el) => {
    this.quantityInputField = el;
  }

  handleOnAutocompleteProduct = (value) => {
    this.setState({
      add_product: value
    }, () => this.focusQuantity());
  }

  focusQuantity = () => {
    if (!this.quantityInputField || !this.quantityInputField.input) return;
    this.quantityInputField.input.focus();
  }
  
  focusProduct = () => {
    this.productInputField.setFocus();
  }

  onChangeProductDisplay = (evt, value) => {
    this.setState({
      product_display_description: value
    });
  }

  addProduct = () => {
    if (!this.state.add_product) return;

    const { onProductsChange } = this.props;

    const product = {
      product_id: this.state.add_product.id,
      description: this.state.add_product.description,
      value: this.state.add_product.value,
      quantity: this.state.add_product_quantity || 1
    };

    this.setState({
      products: [...this.state.products, product],
      add_product_quantity: 1,
      product_display_description: '',
      add_product: null
    }, () => {
      onProductsChange(this.state.products);
    });
  }

  onRemoveProduct = (product_to_remove) => {
    const { onProductsChange } = this.props;
    const { products } = this.state;

    this.setState({ products: products.filter(function(product) {
          return product !== product_to_remove
        })
      }, () => {
        onProductsChange(this.state.products);
      }
    );
  }

  convertProductsToAutocompleteMap = (arr) => {
    return arr.reduce(function(map, obj) {
      const productDisplay = `${obj.description} (R$ ${obj.value})`
      map[productDisplay] = obj;
      return map;
    }, {});
  }

  fillProductTable = () => {
    const { products } = this.state;

    if (products.length === 0 )
      return (
        <tr>
          <th colSpan='5' onClick={this.focusProduct}>{<Trans id='cart.add_a_product'>Add a product...</Trans>}</th>
        </tr>
      );

    return (
      map(products, (product, i) =>
        (
          <tr key={i}>
            <td>{product.description}</td>
            <td className='center-align'>{getValueFormatted(product.value)}</td>
            <td className='center-align'>{product.quantity}</td>
            <td className='center-align'>{getValueFormatted(product.quantity * product.value)}</td>
            <td>
              <a
                id={`remove-product-${i}`}
                href='#!'
                className='waves-effect waves-light btn-small'
                onClick={this.onRemoveProduct.bind(this, product)}>
                <i className='small material-icons red-text text-darken-4'>delete</i>
              </a>
            </td>
          </tr>
        )
      )
    )
  }

  render() {
    const products = this.convertProductsToAutocompleteMap(this.props.productRepository.all());

    return (
      <Row>
        <AutocompleteCustom
          id='product_display_description'
          title={<Trans id='cart.product'>Product</Trans>}
          className='product'
          placeholder='...'
          data={products}
          expandOnFocus={true}
          onAutocomplete={this.handleOnAutocompleteProduct}
          value={this.state.product_display_description}
          ref={this.productInputRefHandler}
          onChange={this.onChangeProductDisplay}
          s={12} m={6}
          icon='local_grocery_store'
          iconClassName='prefix' />

        <Input
          id='add_product_quantity'
          name='add_product_quantity'
          label={<Trans id='cart.quantity'>Quantity</Trans>}
          value={this.state.add_product_quantity}
          ref={this.quantityInputRefHandler}
          s={12} m={3}
          type='number'
          required
          validate
          min='1'
          step='1'
          onChange={handleInputChangeBind(this.setState.bind(this))}><Icon>list_alt</Icon></Input>
        
        <Button id='add-product-button' 
          onClick={this.addProduct}
          className='col s12 m3'>{<Trans id='cart.add'>Add</Trans>}<Icon left>add_shopping_cart</Icon></Button>

        <Col s={12} m={9}>
          <Table className='striped'>
            <thead>
              <tr>
                <th data-field='description'>{<Trans id='cart.description'>Description</Trans>}</th>
                <th data-field='price' className='center-align'>{<Trans id='cart.item_price'>Item Price</Trans>}</th>
                <th data-field='quantity' className='center-align'>{<Trans id='cart.quantity'>Quantity</Trans>}</th>
                <th data-field='total' className='center-align'>{<Trans id='cart.item_total'>Item Total</Trans>}</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {this.fillProductTable()}
            </tbody>
          </Table>
        </Col>

        <Col s={12} m={3}>
          {this.props.children}
        </Col>
      </Row>
    );
  }
}

export default Cart;
