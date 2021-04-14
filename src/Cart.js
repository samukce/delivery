import React, { Component } from "react";
import { Table, Input, Icon, Col, Button } from "react-materialize";
import AutocompleteCustom from "./components/AutocompleteCustom";
import PropTypes from "prop-types";
import ProductRepository from "./repository/ProductRepository";
import { map } from "lodash";
import { getValueFormatted } from "./utilities/ComponentUtils";
import { Trans } from "@lingui/react";
import "./styles/fixed-body-size.css";
import { Grid, Typography } from "@material-ui/core";

class Cart extends Component {
  static propTypes = {
    onProductsChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState(true);
  }

  getInitialState = (resetProduct) => {
    return {
      add_product_quantity: 1,
      product_display_description: "",
      resetProduct,
      products: [],
    };
  };

  onCartClear = () => this.setState(this.getInitialState(!this.state.resetProduct));

  onCartLoad = (products) => {
    const { onProductsChange } = this.props;
    const freshProduct = products
      .map((product) => {
        const freshProduct = ProductRepository.getById(product.product_id);
        if (!freshProduct) {
          return null;
        }

        return {
          product_id: freshProduct.id,
          description: freshProduct.description,
          cash: freshProduct.cash,
          card: freshProduct.card,
          quantity: product.quantity,
        };
      })
      .filter((product) => product != null);

    this.setState({ products: freshProduct }, () =>
      onProductsChange(freshProduct)
    );
  };

  handleOnAutocompleteProduct = (value) => {
    this.setState(
      {
        add_product: value,
        product_display_description: value ? value.description : ""
      },
      () => this.focusQuantity()
    );
  };

  focusQuantity = () => {
    if (!this.quantityInputField || !this.quantityInputField.input) return;
    this.quantityInputField.input.focus();
  };

  focusProduct = () => {
    if (!this.productInputField) return;
    this.productInputField.setFocus();
  };

  focus = () => {
    this.focusProduct();
  };

  onChangeProductDisplay = (evt, value) => {
    this.setState({
      product_display_description: value,
    });
  };

  handleKeyDownQuantity = (event) => {
    if (event.key === "Enter") {
      this.addProduct();
    }
  };

  addProduct = () => {
    if (!this.state.add_product) {
      this.focusProduct();
      return;
    }

    const { onProductsChange } = this.props;

    const product = {
      product_id: this.state.add_product.id,
      description: this.state.add_product.description,
      cash: this.state.add_product.cash,
      card: this.state.add_product.card,
      quantity:
        this.state.add_product_quantity > 0
          ? this.state.add_product_quantity
          : 1,
    };

    this.setState(
      {
        products: [...this.state.products, product],
        add_product_quantity: 1,
        product_display_description: "",
        add_product: null,
        resetProduct: !this.state.resetProduct
      },
      () => {
        onProductsChange(this.state.products);
      }
    );
  };

  onRemoveProduct = (product_to_remove) => {
    const { onProductsChange } = this.props;
    const { products } = this.state;

    this.setState(
      {
        products: products.filter(function (product) {
          return product !== product_to_remove;
        }),
      },
      () => {
        onProductsChange(this.state.products);
      }
    );
  };

  onIncreaseProductQuantityByOne = (product_to_increase) => {
    const { onProductsChange } = this.props;
    const { products } = this.state;

    this.setState(
      {
        products: products.map(function (product) {
          if (product === product_to_increase) {
            const quantity = ++product.quantity;
            return {...product, quantity}
          }
          return product;
        }),
      },
      () => {
        onProductsChange(this.state.products);
      }
    );
  }

  onDecreaseProductQuantityByOne = (product_to_decrease) => {
    const { onProductsChange } = this.props;
    const { products } = this.state;

    this.setState(
      {
        products: products.map(function (product) {
          if (product === product_to_decrease) {
            const quantity = --product_to_decrease.quantity;
            return {...product, quantity}
          }
          return product;
        }).filter((product) => product.quantity > 0),
      },
      () => {
        onProductsChange(this.state.products);
      }
    );
  }

  convertProductsToAutocompleteMap = (arr) => {
    return arr.reduce(function (map, obj) {
      const productDisplay = `${obj.description.toUpperCase()} (R$ ${
        obj.cash
      })`;
      map[productDisplay] = async () => obj;
      return map;
    }, {});
  };

  lazyProductSearch = () => {
    return this.convertProductsToAutocompleteMap(ProductRepository.all());
  };

  fillProductTable = () => {
    const { products } = this.state;

    if (products.length === 0)
      return (
        <tr>
          <th colSpan="5" onClick={this.focusProduct}>
            {<Trans id="cart.add_a_product">Add a product...</Trans>}
          </th>
        </tr>
      );

    return map(products, (product, i) => (
      <tr key={i}>
        <td>
          {product && product.description != null
            ? product.description.toUpperCase()
            : ""}
        </td>
        <td className="center-align">{getValueFormatted(product.cash)}</td>
        <td className="center-align">
          <Grid container justify="center" alignItems="center" spacing={1}>
            <Grid key={`grid-decrease-quantity-${i}`} item>
              <a
                id={`decrease-quantity-${i}`}
                href="#!"
                className="waves-effect waves-light btn-small"
                onClick={this.onDecreaseProductQuantityByOne.bind(this, product)}
              >
                <i className="small material-icons text-darken-4">
                  remove
                </i>
              </a>
            </Grid>
            <Grid key={`grid-quantity-${i}`} item>
              <Typography>{product.quantity}</Typography>
            </Grid>
            <Grid key={`grid-increase-quantity-${i}`} item>
              <a
                id={`increase-quantity-${i}`}
                href="#!"
                className="waves-effect waves-light btn-small"
                onClick={this.onIncreaseProductQuantityByOne.bind(this, product)}
              >
                <i className="small material-icons text-darken-4">
                  add
                </i>
              </a>
            </Grid>
          </Grid>
        </td>
        <td className="center-align">
          {getValueFormatted(product.quantity * product.cash)}
        </td>
        <td>
          <a
            id={`remove-product-${i}`}
            href="#!"
            className="waves-effect waves-light btn-small"
            onClick={this.onRemoveProduct.bind(this, product)}
          >
            <i className="small material-icons red-text text-darken-4">
              delete
            </i>
          </a>
        </td>
      </tr>
    ));
  };

  render() {

    return (
      <React.Fragment>
        <AutocompleteCustom
          id="product_display_description"
          title={<Trans id="cart.product">Product</Trans>}
          placeholder="..."
          className="product"
          lazyData={this.lazyProductSearch}
          expandOnFocus={true}
          onAutocomplete={this.handleOnAutocompleteProduct}
          value={this.state.product_display_description}
          ref={(el) => (this.productInputField = el)}
          onChange={this.onChangeProductDisplay}
          s={12}
          m={6}
          icon="local_grocery_store"
          iconClassName="prefix"
          reset={this.state.resetProduct}
        />

        <Input
          id="add_product_quantity"
          name="add_product_quantity"
          label={<Trans id="cart.quantity">Quantity</Trans>}
          value={this.state.add_product_quantity}
          ref={(el) => (this.quantityInputField = el)}
          s={12}
          m={3}
          type="number"
          required
          validate
          min="1"
          step="1"
          onKeyDown={this.handleKeyDownQuantity}
          onChange={(event) => this.setState({add_product_quantity: Number(event.target.value)})}
        >
          <Icon>list_alt</Icon>
        </Input>

        <Button
          id="add-product-button"
          onClick={this.addProduct}
          className="col s12 m3"
        >
          {<Trans id="cart.add">Add</Trans>}
          <Icon left>add_shopping_cart</Icon>
        </Button>

        <Col s={12} m={9}>
          <Table className="striped">
            <thead>
              <tr>
                <th data-field="description">
                  {<Trans id="cart.description">Description</Trans>}
                </th>
                <th data-field="price" className="center-align">
                  {<Trans id="cart.item_price">Item Price</Trans>}
                </th>
                <th data-field="quantity" className="center-align">
                  {<Trans id="cart.quantity">Quantity</Trans>}
                </th>
                <th data-field="total" className="center-align">
                  {<Trans id="cart.item_total">Item Total</Trans>}
                </th>
                <th></th>
              </tr>
            </thead>

            <tbody>{this.fillProductTable()}</tbody>
          </Table>
        </Col>

        <Col s={12} m={3}>
          {this.props.children}
        </Col>
      </React.Fragment>
    );
  }
}

export default Cart;
