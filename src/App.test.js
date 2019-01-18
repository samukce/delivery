import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { mount } from 'enzyme';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('App component', () => {
  let spySaveOrder, component, sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        spySaveOrder = sandbox.stub();

        const wrapper = mount(<App />);
        component = wrapper.find(App);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should save order', () => {
        expect(spySaveOrder).to.have.been.calledOnce;
    });
})