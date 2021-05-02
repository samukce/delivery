import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Pendency from "./Pendency";
import { mount } from "enzyme";

configure({ adapter: new Adapter() });

const setup = propOverrides => {
  const props = Object.assign({
    order: { products: [] },
    handleIsPendingPayment: jest.fn(),
    handlePendingPaymentValue: jest.fn(),
    handleIsPendingBottle: jest.fn(),
    handlePendingBottleQuantity: jest.fn(),
  }, propOverrides)

  const wrapper = mount(<Pendency { ...props } />)

  return {
    props,
    wrapper,
    pending_payment: wrapper.find('#pending_payment').find('input'),
    pending_payment_value: wrapper.find('#pending_payment_value'),
    pending_bottle: wrapper.find('#pending_bottle').find('input'),
    pending_notes: wrapper.find('#pending_notes'),
  }
}

describe('render checkbox for pendencies', () => {
  it('pending payment checkbox', () => {
    const { pending_payment } = setup();
    expect(pending_payment.exists()).toBe(true);
  });

  it('pending bottle checkbox', () => {
    const { pending_bottle } = setup();
    expect(pending_bottle.exists()).toBe(true);
  });

  it('pending notes input', () => {
    const { pending_notes } = setup();
    expect(pending_notes.exists()).toBe(true);
  });
});

describe('when checkbox change render', () => {
  it('pending value not visible', () => {
    const { pending_payment, wrapper } = setup();
    pending_payment.simulate('change', { target: { checked: false } });
    expect(wrapper.find('#pending_payment_value').exists()).toBe(false);
  });

  it('pending value visible', () => {
    const { pending_payment, wrapper } = setup();
    pending_payment.simulate('change', { target: { checked: true } });
    expect(wrapper.find('#pending_payment_value').exists()).toBe(true);
  });

  it('pending bottle not visible', () => {
    const { pending_bottle, wrapper } = setup();
    pending_bottle.simulate('change', { target: { checked: false } });
    expect(wrapper.find('#pending_bottle_quantity').exists()).toBe(false);
  });

  it('pending bottle visible', () => {
    const { pending_bottle, wrapper } = setup();
    pending_bottle.simulate('change', { target: { checked: true } });
    expect(wrapper.find('#pending_bottle_quantity').exists()).toBe(true);
  });
});

describe('when value change trigger', () => {
  it('pending payment handler', () => {
    const { pending_payment, props } = setup();
    pending_payment.simulate('change', { target: { checked: true } });
    expect(props.handleIsPendingPayment).toBeCalledWith(true);
  });

  it('pending bottle handler', () => {
    const { pending_bottle, props } = setup();
    pending_bottle.simulate('change', { target: { checked: true } });
    expect(props.handleIsPendingBottle).toBeCalledWith(true);
  });

  it('pending payment value handler', () => {
    const { pending_payment, wrapper, props } = setup();
    pending_payment.simulate('change', { target: { checked: true } });
    wrapper.find('#pending_payment_value').find('input')
      .simulate('change', { target: { value: 10 } });
    expect(props.handlePendingPaymentValue).toBeCalledWith(10);
  });

  it('pending bottle quantity handler', () => {
    const { pending_bottle, wrapper, props } = setup();
    pending_bottle.simulate('change', { target: { checked: true } });
    wrapper.find('#pending_bottle_quantity').find('input')
      .simulate('change', { target: { value: 2 } });
    expect(props.handlePendingBottleQuantity).toBeCalledWith(2);
  });
});
