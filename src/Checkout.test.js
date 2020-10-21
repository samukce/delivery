import React from 'react';
import Checkout from './Checkout';
import { shallow, mount } from 'enzyme';
import Cart from './Cart';
import TestUtils from 'react-dom/test-utils';
import OrderRepository from './repository/OrderRepository'


describe('Checkout component load', () => {
  it('should focus in the phonenumber field', () => {
    const output = mount(<Checkout />);

    expect(output.find('input#phonenumber').getElement().props.id)
      .to.be.equal(document.activeElement.id);
  });
})

describe('Checkout place order', () => {
  let spyPlaceOrder, wrapper, sandbox, componentRender,
    stubOrderRespositorySearchByAddress, stubSearchByPhone, stubOrderRespositorySave;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    stubOrderRespositorySearchByAddress = sandbox.stub(OrderRepository.prototype, 'searchByAddress').returns({});
    stubSearchByPhone = sandbox.stub(OrderRepository.prototype, 'searchByPhone').returns({
      phonenumber: '9988',
      complement: '101 room',
      notes: 'Fast delivery',
    });

    stubOrderRespositorySave = sandbox.stub(OrderRepository.prototype, 'save');

    wrapper = shallow(<Checkout />);
    componentRender = wrapper.instance();

    spyPlaceOrder = sandbox.spy(componentRender, 'placeOrder');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should fill the address field', () => {
    wrapper.find('#address').shallow().find('input')
      .simulate('change', { target: { name: 'address', value: '101 Street' } } );

    expect(wrapper.state('address')).to.equal('101 Street');
  });

  it('should not continue if address is empty', () => {
    wrapper.find('#place-order-button').simulate('click');

    expect(spyPlaceOrder).to.not.have.been.called;
  });

  it('should not continue if products is empty', () => {
    wrapper.find('#address').shallow().find('input')
      .simulate('change', { target: { name: 'address', value: '101 Street' } } );

    wrapper.find('#place-order-button').simulate('click');

    expect(spyPlaceOrder).to.not.have.been.called;
  });

  it('should continue if address and products filled', () => {
    wrapper.find('#address').shallow().find('input')
      .simulate('change', { target: { name: 'address', value: '101 Street' } } );

    componentRender.onProductsChange([
        { product_id: 1, description: 'Water', value: 3.50, quantity: 2 }
      ]);

    wrapper.find('#place-order-button').simulate('click');

    expect(spyPlaceOrder).to.have.been.called;
  });

  it('should disable placeOrder button if not valid', () => {
    expect(wrapper.find('#place-order-button').props().disabled).to.be.true;
  });

  it('should enable placeOrder button if has address and product', () => {
    wrapper.find('#address').shallow().find('input')
      .simulate('change', { target: { name: 'address', value: '101 Street' } } );

    componentRender.onProductsChange([
        { product_id: 1, description: 'Water', value: 3.50, quantity: 2 }
      ]);

    expect(wrapper.find('#place-order-button').props().disabled).to.be.false;
  });

  it('should fill the address complement field', () => {
    wrapper.find('#complement').simulate('change', { target: { name: 'complement', value: 'ap. 202' } } );

    expect(wrapper.state('complement')).to.equal('ap. 202');
  });

  it('should fill the note field', () => {
    wrapper.find('#notes').simulate('change', { target: { name: 'notes', value: 'good customer' } } );

    expect(wrapper.state('notes')).to.equal('good customer');
  });

  it('should fill the phonenumber field', () => {
    wrapper.find('#phonenumber').shallow().find('input')
      .simulate('change', { target: { name: 'phonenumber', value: '988776655' } } );

    expect(wrapper.state('phonenumber')).to.equal('988776655');
  });

  it('should focus change field when choose product', () => {
    const checkout = TestUtils.renderIntoDocument(<Checkout />);

    checkout.onProductsChange([
      { product_id: 1, description: 'Water', value: 3.50, quantity: 1 }
    ]);

    expect(document.activeElement.id).to.be.equal('change_to');
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

      expect(wrapper.find('#total_amount').props().title).to.equal('R$ 7.00');
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
      wrapper.find('#change_to').simulate('change', { target: { name: 'change_to', value: 'non numeric' } } );

      expect(wrapper.state('change_difference')).to.equal(null);
    });

    it('should not enable placeOrder button if less than total', () => {
      wrapper.find('#address').shallow().find('input')
        .simulate('change', { target: { name: 'address', value: '101 Street' } } );

      componentRender.onProductsChange([
        { product_id: 1, description: 'Water', value: 3.50, quantity: 1 }
      ]);

      wrapper.find('#change_to').simulate('change', { target: { name: 'change_to', value: 3.0 } } );

      expect(wrapper.find('#place-order-button').props().disabled).to.be.true;
    });
  });

  describe('clear button', () => {
    it('should address field be empty', () => {
      wrapper.find('#address').simulate('change', { target: { name: 'address', value: '101 Street' } }, '101 Street' );

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

  describe('address search', () => {
    it('should trigger lazy search', () => {
      const spyLazyAddressSearch = sandbox.spy(componentRender, 'lazyAddressSearch');
      componentRender.forceUpdate();

      wrapper.find('#address').shallow().find('input')
        .simulate('change', { target: { name: 'address', value: '101' } } );

      expect(spyLazyAddressSearch).to.have.been.calledWith('101');
    });

    it('should lazy address search using orderRepository', () => {
      wrapper.find('#address').shallow().find('input')
        .simulate('change', { target: { name: 'address', value: '101' } } );

      expect(stubOrderRespositorySearchByAddress).to.have.been.calledWith('101');
    });

    it('should fill complement fields from the last order', () => {
      wrapper.find('#address').simulate('autocomplete', { complement: '101 room' } );

      expect(wrapper.state('complement')).to.equal('101 room');
    });

    it('should fill note field from the last order', () => {
      wrapper.find('#address').simulate('autocomplete', { notes: 'Fast delivery' } );

      expect(wrapper.state('notes')).to.equal('Fast delivery');
    });

    it('should trigger refresh products in cart component', () => {
      const checkout = TestUtils.renderIntoDocument(<Checkout />);
      const cart = TestUtils.findRenderedComponentWithType(checkout, Cart);
      const spyCartLoad= sandbox.stub(cart, 'onCartLoad');

      const prouductItem = [ {product_id: 1}];
      checkout.handleOnAutocompleteLastOrderSearch({ products: [ prouductItem ] });

      expect(spyCartLoad).to.have.been.calledWith([ prouductItem ]);
    });

    it('should trigger on clean before refresh products in cart component', () => {
      const checkout = TestUtils.renderIntoDocument(<Checkout />);
      const cart = TestUtils.findRenderedComponentWithType(checkout, Cart);
      const spyCartLoad= sandbox.stub(cart, 'onCartLoad');
      const spyCartClear= sandbox.spy(cart, 'onCartClear');

      checkout.handleOnAutocompleteLastOrderSearch({ products: [] });

      expect(spyCartClear).to.have.been.called;
      expect(spyCartLoad).to.have.been.calledWith([]);
    });

    it('should focus change field when search complete', () => {
      const checkout = TestUtils.renderIntoDocument(<Checkout />);

      checkout.handleOnAutocompleteLastOrderSearch({ products: [] });

      expect(document.activeElement.id).to.be.equal('change_to');
    });
  });

  describe('phonenumber search', () => {
    it('should trigger lazy search', () => {
      const spyLazyPhoneSearch = sandbox.spy(componentRender, 'lazyPhoneSearch');
      componentRender.forceUpdate();

      wrapper.find('#phonenumber').shallow().find('input')
        .simulate('change', { target: { name: 'phonenumber', value: '9988' } } );

      expect(spyLazyPhoneSearch).to.have.been.calledWith('9988');
    });

    it('should lazy phonenumber search using orderRepository', () => {
      wrapper.find('#phonenumber').shallow().find('input')
        .simulate('change', { target: { name: 'phonenumber', value: '9988' } } );

      expect(stubSearchByPhone).to.have.been.calledWith('9988');
    });
    
    it('should not search phonenumber ...', () => {
      wrapper.find('#phonenumber').shallow().find('input')
        .simulate('change', { target: { name: 'phonenumber', value: '998' } } );

      expect(stubSearchByPhone).to.not.have.been.called;
    });

    it('should fill complement fields from the last order', () => {
      wrapper.find('#phonenumber').simulate('autocomplete', { complement: '101 room' } );

      expect(wrapper.state('complement')).to.equal('101 room');
    });

    it('should fill note field from the last order', () => {
      wrapper.find('#phonenumber').simulate('autocomplete', { notes: 'Fast delivery' } );

      expect(wrapper.state('notes')).to.equal('Fast delivery');
    });
  });

  describe('save order', () => {
    it('should save by order repository', () => {
      const order = {
        address: 'address new',
        complement: '....',
        notes: 'notes..',
        phonenumber: '998887766',
        change_to: 100,
        products: [ { product_id: 1, description: '', value: 10, quantity: 1 } ],
        total_amount: 10
      };
      wrapper.setState(order);

      wrapper.find('#place-order-button').simulate('click');

      expect(stubOrderRespositorySave).to.have.been.calledWith(order);
    });

    it('should trigger on clean after place order', () => {
      const order = {
        address: 'address new',
        products: [ { product_id: 1, description: '', value: 10, quantity: 1 } ],
      };
      wrapper.setState(order);

      const spyClearAllFields = sandbox.spy(componentRender, 'clearAllFieds');

      wrapper.find('#place-order-button').simulate('click');

      expect(spyClearAllFields).to.have.been.called;
    });

    it('should focus in the phonenumber field', () => {
      const output = mount(<Checkout />);
      const order = {
        address: 'address new',
        products: [ { product_id: 1, description: '', value: 10, quantity: 1 } ],
      };
      output.setState(order);
      output.instance().setFocusOnChargeTo();

      output.instance().buttonClickPlaceOrder();

      expect(document.activeElement.id).to.be.equal('phonenumber');
    });
  });
})
