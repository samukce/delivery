import React from 'react';
import Checkout from './Checkout';
import { shallow, mount } from 'enzyme';
import Cart from './Cart';
import TestUtils from 'react-dom/test-utils';


describe('Checkout component load', () => {
  it('should focus in the address field', () => {
    const output = mount(<Checkout />);

    expect(output.find('input#address').getElement().props.id)
      .to.be.equal(document.activeElement.id);
  });
})

describe('Checkout place order', () => {
  let spyPlaceOrder, wrapper, sandbox, componentRender;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    wrapper = shallow(<Checkout />);
    componentRender = wrapper.instance();

    spyPlaceOrder = sandbox.stub(componentRender, 'placeOrder');
    componentRender.forceUpdate()
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should fill the address field', () => {
    wrapper.find('#address').simulate('change', { target: { name: 'address', value: '101 Street' } } );

    wrapper.find('#place-order-button').simulate('click');

    expect(wrapper.state('address')).to.equal('101 Street');
  });

  it('should not continue if address is empty', () => {
    wrapper.find('#place-order-button').simulate('click');

    expect(spyPlaceOrder).to.not.have.been.called;
  });

  it('should fill the address complement field', () => {
    wrapper.find('#complement').simulate('change', { target: { name: 'complement', value: 'ap. 202' } } );

    expect(wrapper.state('complement')).to.equal('ap. 202');
  });

  it('should fill the note field', () => {
    wrapper.find('#notes').simulate('change', { target: { name: 'notes', value: 'good customer' } } );

    expect(wrapper.state('notes')).to.equal('good customer');
  });

  describe('calculate total order amount', () => {
    it('should calculate', () => {
      componentRender.onProductsChange([
        { product_id: 1, description: 'Water', value: 3.50, quantity: 2 },
        { product_id: 2, description: 'Product', value: 4.00, quantity: 3 }
      ]);

      expect(wrapper.state('total_amount')).to.equal(19);
    });

    it('should format', () => {
      componentRender.onProductsChange([
        { product_id: 1, description: 'Water', value: 3.5, quantity: 2 },
      ]);

      expect(wrapper.find('#total_amount').props().title).to.equal('$7.00');
    });
  });

  describe('calculate change to value', () => {
    it('should calculate', () => {
      componentRender.onProductsChange([
        { product_id: 1, description: 'Water', value: 3.5, quantity: 2 },
      ]);
      wrapper.find('#change_to').simulate('change', { target: { name: 'change_to', value: 20 } } );

      expect(wrapper.state('change_difference')).to.equal(13.00);
    });

    it('should be empty if less then total amount', () => {
      componentRender.onProductsChange([
        { product_id: 1, description: 'Water', value: 3.5, quantity: 2 },
      ]);
      wrapper.find('#change_to').simulate('change', { target: { name: 'change_to', value: 6.0 } } );

      expect(wrapper.state('change_difference')).to.equal(null);
    });

    it('should be empty if equal to the total amount', () => {
      componentRender.onProductsChange([
        { product_id: 1, description: 'Water', value: 3.5, quantity: 2 },
      ]);
      wrapper.find('#change_to').simulate('change', { target: { name: 'change_to', value: 7.0 } } );

      expect(wrapper.state('change_difference')).to.equal(null);
    });

    it('should be empty if non numeric', () => {
      componentRender.onProductsChange([
        { product_id: 1, description: 'Water', value: 3.5, quantity: 2 },
      ]);
      wrapper.find('#change_to').simulate('change', { target: { name: 'change_to', value: "non numeric" } } );

      expect(wrapper.state('change_difference')).to.equal(null);
    });
  });

  describe('clear button', () => {
    it('should address field be empty', () => {
      wrapper.find('#address').simulate('change', { target: { name: 'address', value: '101 Street' } } );

      wrapper.find('#clear-button').simulate('click');

      expect(wrapper.find('#address').shallow().find('input').props().value).to.be.empty;
      expect(wrapper.state('address')).to.be.empty;
    });

    it('should complement field be empty', () => {
      wrapper.find('#complement').simulate('change', { target: { name: 'complement', value: 'ap. 202' } } );

      wrapper.find('#clear-button').simulate('click');

      expect(wrapper.state('complement')).to.be.empty;
      expect(wrapper.find('#complement').shallow().find('input').props().value).to.be.empty;
    });

    it('should notes field be empty', () => {
      wrapper.find('#notes').simulate('change', { target: { name: 'notes', value: 'Missing house number' } } );

      wrapper.find('#clear-button').simulate('click');

      expect(wrapper.state('notes')).to.be.empty;
      expect(wrapper.find('#notes').shallow().find('input').props().value).to.be.empty;
    });

    it('should change_to field be null', () => {
      wrapper.find('#change_to').simulate('change', { target: { name: 'change_to', value: '100' } } );

      wrapper.find('#clear-button').simulate('click');

      expect(wrapper.state('change_to')).to.be.empty;
      expect(wrapper.find('#change_to').shallow().find('input').props().value).to.be.empty;
    });

    it('should trigger clear action on cart component', () => {
      const checkout = TestUtils.renderIntoDocument(<Checkout />);
      const cart = TestUtils.findRenderedComponentWithType(checkout, Cart);

      const spyCartClear= sandbox.spy(cart, 'onCartClear');

      let clearButton = TestUtils.findRenderedDOMComponentWithClass(checkout, 'clear-button');
      TestUtils.Simulate.click(clearButton);

      expect(spyCartClear).to.have.been.called;
    });
  });
})
