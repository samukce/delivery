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

  it('should save order', () => {
    wrapperShallow.find('#place-order-button').simulate('click');
    expect(spySaveOrder).to.have.been.calledOnce;
  });
})