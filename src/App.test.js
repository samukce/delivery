import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('App component', () => {
  let spySaveOrder, wrapperShallow, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    wrapperShallow = shallow(<App />);
    const componentRender = wrapperShallow.instance();

    spySaveOrder = sandbox.stub(componentRender, 'placeOrder');
    componentRender.forceUpdate()
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should save order with required fields', () => {
    wrapperShallow.find('#address').simulate('change', { target: { name: 'address', value: '101 Street' } } );
    wrapperShallow.find('#place-order-button').simulate('click');

    expect(wrapperShallow.state('address')).to.equal('101 Street');
    expect(spySaveOrder).to.have.been.calledOnce;
  });

  it('should not save order if address is empty', () => {
    wrapperShallow.find('#place-order-button').simulate('click');

    expect(spySaveOrder).to.not.have.been.calledOnce;
  });
})