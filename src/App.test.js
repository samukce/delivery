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
