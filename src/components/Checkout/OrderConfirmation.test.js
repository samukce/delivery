import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { OrderConfirmation } from "./OrderConfirmation";
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
    previous_pendencies: wrapper.find('#previous_pendencies'),
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
      expect(products.find(".description").props().primary)
        .toEqual("Product 1");
    });

    it('multiple products', () => {
      const { products } = setup({
        order: {
          products: [
            { product_id: "1", quantity: 1, description: "Product 1" },
            { product_id: "2", quantity: 1, description: "Product 2" }
          ]
        }
      });
      expect(products.find(".description").length).toEqual(2);
      expect(products.find(".description").at(0).props().primary)
        .toEqual("Product 1");
      expect(products.find(".description").at(1).props().primary)
        .toEqual("Product 2");
    });

    it('quantity and card value', () => {
      const { products } = setup({
        order: {
          credit_card_payment: true,
          products: [{ product_id: "1", quantity: 1, card: 10 }]
        }
      });
      expect(products.find(".product_value").text())
        .toEqual("1 x R$ 10.00");
    });

    it('quantity and cash value', () => {
      const { products } = setup({
        order: {
          credit_card_payment: false,
          products: [{ product_id: "1", quantity: 2, cash: 15 }]
        }
      });
      expect(products.find(".product_value").text())
        .toEqual("2 x R$ 15.00");
    });
  });

  describe('pendencies', () => {
    it('not exist when null list', () => {
      const { previous_pendencies } = setup({
        order: {
          previous_pendencies: null
        }
      });
      expect(previous_pendencies.exists()).toBe(false);
    });

    it('not exist when empty list', () => {
      const { previous_pendencies } = setup({
        order: {
          previous_pendencies: []
        }
      });
      expect(previous_pendencies.exists()).toBe(false);
    });

    it('exist when any in the list', () => {
      const { previous_pendencies } = setup({
        order: {
          previous_pendencies: [{ order_id: "1" }]
        }
      });
      expect(previous_pendencies.exists()).toBe(true);
    });

    it('multiple', () => {
      const { previous_pendencies } = setup({
        order: {
          previous_pendencies: [{ order_id: "1" }, { order_id: "2" }]
        }
      });
      expect(previous_pendencies.find(".order_id").length).toEqual(2);
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
