import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import OrderConfirmation from "./OrderConfirmation";
import { shallow } from "enzyme";

configure({ adapter: new Adapter() });

const setup = propOverrides => {
  const props = Object.assign({
    modalOpen: true,
    order: {},
    handleFinish: jest.fn(),
    handleCloseExternal: jest.fn(),
  }, propOverrides)

  const wrapper = shallow(<OrderConfirmation { ...props } />)

  return {
    props,
    wrapper,
    back: wrapper.find('#back'),
    finish: wrapper.find('#finish'),
    address: wrapper.find('#address'),
    notes: wrapper.find('#notes'),
    phonenumber: wrapper.find('#phonenumber'),
    total_amount: wrapper.find('#total_amount'),
    payment_type: wrapper.find('#payment_type'),
    change_to: wrapper.find('#change_to'),
    change_difference: wrapper.find('#change_difference'),
    products: wrapper.find('#products'),
  }
}

describe('render order', () => {
  it('phonenumber', () => {
    const { phonenumber } = setup({ order: { phonenumber: "998887766" } });
    expect(phonenumber.text()).toEqual("998887766");
  });

  it('address in upper case', () => {
    const { address } = setup({ order: { address: "St. Some, 123" } });
    expect(address.text()).toEqual("ST. SOME, 123");
  });

  it('address with complement in upper case', () => {
    const { address } = setup({ order: { address: "St. Some, 123", complement: "apt. 123" } });
    expect(address.text()).toEqual("ST. SOME, 123 APT. 123");
  });

  it('notes in upper case', () => {
    const { notes } = setup({ order: { notes: "some notes here" } });
    expect(notes.text()).toEqual("SOME NOTES HERE");
  });

  it('change_to', () => {
    const { change_to } = setup({ order: { change_to: 100 } });
    expect(change_to.text()).toEqual("100");
  });

  it('change_difference', () => {
    const { change_difference } = setup({ order: { change_difference: 50 } });
    expect(change_difference.text()).toEqual("50");
  });

  it('total_amount', () => {
    const { total_amount } = setup({ order: { total_amount: 50 } });
    expect(total_amount.text()).toEqual("R$ 50.00");
  });

  it('payment type as card', () => {
    const { payment_type } = setup({ order: { credit_card_payment: true } });
    expect(payment_type.text()).toEqual("Cartão");
  });

  it('payment type as cash', () => {
    const { payment_type } = setup({ order: { credit_card_payment: false } });
    expect(payment_type.text()).toEqual("Dinheiro");
  });

  describe('product', () => {
    it('description', () => {
      const { products } = setup({
        order: {
          products: [{ product_id: "1", quantity: 1, description: "Product 1" }]
        }
      });
      expect(products.at(0).find(".description").props().primary)
        .toEqual("Product 1");
    });

    it('quantity and card value', () => {
      const { products } = setup({
        order: {
          credit_card_payment: true,
          products: [{ product_id: "1", quantity: 1, card: 10 }]
        }
      });
      expect(products.at(0).find(".product_value").text())
        .toEqual("1 x R$ 10.00");
    });

    it('quantity and cash value', () => {
      const { products } = setup({
        order: {
          credit_card_payment: false,
          products: [{ product_id: "1", quantity: 2, cash: 15 }]
        }
      });
      expect(products.at(0).find(".product_value").text())
        .toEqual("2 x R$ 15.00");
    });
  });
});

describe('back button', () => {
  it('on click calls handleCloseExternal', () => {
    const { back, props } = setup();
    back.simulate('click');
    expect(props.handleCloseExternal).toBeCalledWith();
  });
});

describe('finish button', () => {
  it('on click calls handleFinishOrder', () => {
    const { finish, props } = setup();
    finish.simulate('click');
    expect(props.handleFinish).toBeCalledWith();
  });
});
