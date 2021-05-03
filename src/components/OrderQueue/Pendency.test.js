import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Pendency from "./Pendency";
import { mount } from "enzyme";

configure({ adapter: new Adapter() });

const setup = propOverrides => {
  const props = Object.assign({
    handleIsPendingPayment: jest.fn(),
    handlePendingPaymentValue: jest.fn(),
    handleIsPendingBottle: jest.fn(),
    handlePendingBottleQuantity: jest.fn(),
    handlePendingGenericNote: jest.fn(),
  }, propOverrides)

  const wrapper = mount(<Pendency { ...props } />)

  return {
    props,
    wrapper,
    pending_payment: wrapper.find('#pending_payment').find('input'),
    pending_payment_value: wrapper.find('#pending_payment_value').find('input'),
    pending_bottle: wrapper.find('#pending_bottle').find('input'),
    pending_bottle_quantity: wrapper.find('#pending_bottle_quantity').find('input'),
    pending_notes: wrapper.find('#pending_notes').find('input'),
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

  it('pending note handler', () => {
    const { pending_notes, props } = setup();
    pending_notes.simulate('change', { target: { value: "foo" } });
    expect(props.handlePendingGenericNote).toBeCalledWith("foo");
  });
});

describe('default value', () => {
  it('pending payment as total amount', () => {
    const { pending_payment, wrapper } = setup({
      total_amount: 100
    });
    pending_payment.simulate('change', { target: { checked: true } });
    expect(wrapper.find('#pending_payment_value').find('input').props().value)
      .toBe(100);
  });

  it('pending bottle as total quantity', () => {
    const { pending_bottle, wrapper } = setup({
      products: [{ quantity: 1 }, { quantity: 2 }]
    });
    pending_bottle.simulate('change', { target: { checked: true } });
    expect(wrapper.find('#pending_bottle_quantity').find('input').props().value)
      .toBe(3);
  });
});

describe('load pendent', () => {
  it('pending payment checked', () => {
    const { pending_payment } = setup({
      pendent: { payment: { value: 50 } }
    });

    expect(pending_payment.props().checked).toBe(true);
  });

  it('pending payment value', () => {
    const { pending_payment_value } = setup({
      pendent: { payment: { value: 50 } }
    });

    expect(pending_payment_value.props().value).toBe(50);
  });

  it('pending bottle checked', () => {
    const { pending_bottle } = setup({
      pendent: { bottles: { quantity: 1 } }
    });

    expect(pending_bottle.props().checked).toBe(true);
  });

  it('pending bottle quantity', () => {
    const { pending_bottle_quantity } = setup({
      pendent: { bottles: { quantity: 2 } }
    });

    expect(pending_bottle_quantity.props().value).toBe(2);
  });

  it('pending generic note', () => {
    const { pending_notes } = setup({
      pendent: { note: "foo" }
    });

    expect(pending_notes.props().value).toBe("foo");
  });
});

describe('load read only', () => {
  it('pending payment disabled', () => {
    const { pending_payment } = setup({
      readOnly: true
    });

    expect(pending_payment.props().disabled).toBe(true);
  });

  it('pending payment value disabled', () => {
    const { pending_payment_value } = setup({
      readOnly: true,
      pendent: { payment: { value: 50 } }
    });

    expect(pending_payment_value.props().disabled).toBe(true);
  });

  it('pending bottle checked', () => {
    const { pending_bottle } = setup({
      readOnly: true
    });

    expect(pending_bottle.props().disabled).toBe(true);
  });

  it('pending bottle quantity', () => {
    const { pending_bottle_quantity } = setup({
      readOnly: true,
      pendent: { bottles: { quantity: 2 } }
    });

    expect(pending_bottle_quantity.props().disabled).toBe(true);
  });

  it('pending generic note', () => {
    const { pending_notes } = setup({
      readOnly: true,
    });

    expect(pending_notes.props().disabled).toBe(true);
  });
});

describe('load not read only', () => {
  it('pending payment disabled', () => {
    const { pending_payment } = setup();

    expect(pending_payment.props().disabled).toBe(false);
  });

  it('pending payment value disabled', () => {
    const { pending_payment_value } = setup({
      pendent: { payment: { value: 50 } }
    });

    expect(pending_payment_value.props().disabled).toBe(false);
  });

  it('pending bottle checked', () => {
    const { pending_bottle } = setup();
    expect(pending_bottle.props().disabled).toBe(false);
  });

  it('pending bottle quantity', () => {
    const { pending_bottle_quantity } = setup({
      pendent: { bottles: { quantity: 2 } }
    });

    expect(pending_bottle_quantity.props().disabled).toBe(false);
  });

  it('pending generic note', () => {
    const { pending_notes } = setup();

    expect(pending_notes.props().disabled).toBe(false);
  });
});
