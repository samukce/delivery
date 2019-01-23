import React from 'react';
import Cart from './Cart';
import { shallow } from 'enzyme';


describe('Cart add product', () => {
  let spyAddProduct, wrapper, sandbox, stubProductRepository, componentRender;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    stubProductRepository = createStubProductRepository(sandbox);

    wrapper = shallow(<Cart productRepository={stubProductRepository} onProductsChange={sandbox.stub()} />);
    componentRender = wrapper.instance();

    spyAddProduct = sandbox.spy(componentRender, 'addProduct');

    componentRender.forceUpdate()
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should load products from repository', () => {
    expect(stubProductRepository.all).to.have.been.called;
  });

  it('should not add if no product selected', () => {
    wrapper.find('#add-product-button').simulate('click');

    expect(wrapper.state('products')).to.eql([]);
  });

  it('should go with product and quantity selected', () => {
    componentRender.handleOnAutocompleteProduct({ id: 1, description: 'Product 1', value: 3.5 });
    wrapper.find('#quantity').simulate('change', { target: { name: 'add_product_quantity', value: 2 } } );

    wrapper.find('#add-product-button').simulate('click');

    expect(spyAddProduct).to.have.been.calledOnce;
    expect(wrapper.state('products'))
      .to.eql([ { product_id: 1, description: 'Product 1', value: 3.5, quantity: 2 } ]);
  });

  it('should reset product selected after added', () => {
    componentRender.handleOnAutocompleteProduct({ id: 1, description: 'Product 1', value: 3.5 });

    wrapper.find('#add-product-button').simulate('click');

    expect(wrapper.state('add_product')).to.be.null;
  });

  it('should return quantity product after added to be 1', () => {
    componentRender.handleOnAutocompleteProduct({ id: 1, description: 'Product 1', value: 3.5 });
    wrapper.find('#quantity').simulate('change', { target: { name: 'add_product_quantity', value: 2 } } );

    wrapper.find('#add-product-button').simulate('click');

    expect(wrapper.state('add_product_quantity')).to.be.equal(1);
  });

  it('should clear product field', () => {
    componentRender.handleOnAutocompleteProduct({ id: 1, description: 'Product 1', value: 3.5 });
    wrapper.setState({ product_display_description: 'Product 1'});

    wrapper.find('#add-product-button').simulate('click');

    expect(wrapper.find('AutocompleteCustom.product').shallow().find('input').props().value)
      .to.be.equal('');
  });
})

function createStubProductRepository(sandbox) {
  const all = sandbox.stub().returns([
    { id: 1, description: 'Product 1', value: 3.50 },
    { id: 2, description: 'Product 2', value: 2.50 }
  ]);
  return {
    all: all
  };
}