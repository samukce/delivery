import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, mount } from 'enzyme';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('App component load', () => {
  it('should focus in the address field', () => {
    const output = mount(<App />);

    expect(output.find('input#address').getElement().props.id)
      .to.be.equal(document.activeElement.id);
  });
})

describe('App place order', () => {
  let spyPlaceOrder, wrapper, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    wrapper = shallow(<App />);
    const componentRender = wrapper.instance();

    spyPlaceOrder = sandbox.stub(componentRender, 'placeOrder');
    componentRender.forceUpdate()
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should go if address filled', () => {
    wrapper.find('#address').simulate('change', { target: { name: 'address', value: '101 Street' } } );

    wrapper.find('#place-order-button').simulate('click');

    expect(wrapper.state('address')).to.equal('101 Street');
    expect(spyPlaceOrder).to.have.been.calledOnce;
  });

  it('should not continue if address is empty', () => {
    wrapper.find('#place-order-button').simulate('click');

    expect(spyPlaceOrder).to.not.have.been.called;
  });
})

describe('App add product', () => {
  let spyAddProduct, wrapper, sandbox, stubProductRepository, componentRender;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    stubProductRepository = createStubProductRepository(sandbox);

    wrapper = shallow(<App productRepository={stubProductRepository}/>);
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