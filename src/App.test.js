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

    expect(spyPlaceOrder).to.not.have.been.calledOnce;
  });
})

describe('App add product', () => {
  let spyAddProduct, wrapper, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    wrapper = shallow(<App />);
    const componentRender = wrapper.instance();

    spyAddProduct = sandbox.spy(componentRender, 'addProduct');
    componentRender.forceUpdate()
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should go if product and quantity selected', () => {
    wrapper.find('#product').simulate('change', { target: { name: 'product', value: 'Product 1' } } );
    wrapper.find('#quantity').simulate('change', { target: { name: 'quantity', value: '2' } } );

    wrapper.find('#add-product-button').simulate('click');

    expect(spyAddProduct).to.have.been.calledOnce;
    expect(wrapper.state('products'))
      .to.deep.equal([ { product_id: 1, description: 'Product 1', value: 3.50, quantity: 2 } ]);
  });
})