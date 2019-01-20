import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, mount } from 'enzyme';


it('renders without crashing', () => {
  const sandbox = sinon.sandbox.create();

  const div = document.createElement('div');
  ReactDOM.render(<App productRepository={createStubProductRepository(sandbox)} />, div);
  ReactDOM.unmountComponentAtNode(div);

  sandbox.restore();
});

describe('App component load', () => {
  it('should focus in the address field', () => {
    const sandbox = sinon.sandbox.create();

    const output = mount(<App productRepository={createStubProductRepository(sandbox)}/>);

    expect(output.find('input#address').getElement().props.id)
      .to.be.equal(document.activeElement.id);

    sandbox.restore();
  });
})

describe('App place order', () => {
  let spyPlaceOrder, wrapper, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    wrapper = shallow(<App productRepository={createStubProductRepository(sandbox)}/>);
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

    expect(spyPlaceOrder).to.not.have.been.calledOnce;
  });
})

describe('App add product', () => {
  let spyAddProduct, wrapper, sandbox, stubProductRepository;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    stubProductRepository = createStubProductRepository(sandbox);

    wrapper = shallow(<App productRepository={stubProductRepository}/>);
    const componentRender = wrapper.instance();

    spyAddProduct = sandbox.spy(componentRender, 'addProduct');
    componentRender.forceUpdate()
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should load products from repository', () => {
    expect(stubProductRepository.all).to.have.been.called;
  });

  it('should go with product and quantity selected', () => {
    wrapper.find('.product').simulate('change', { target: { name: 'product', value: 'Product 1' } } );
    wrapper.find('#quantity').simulate('change', { target: { name: 'quantity', value: '2' } } );

    wrapper.find('#add-product-button').simulate('click');

    expect(spyAddProduct).to.have.been.calledOnce;
    expect(wrapper.state('products'))
      .to.deep.equal([ { product_id: 1, description: 'Product 1', value: 3.50, quantity: 2 } ]);
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