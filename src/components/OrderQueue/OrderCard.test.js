import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { shallow, mount } from "enzyme";
import OrderCard from "./OrderCard";
import Pendency from "./Pendency";

configure({ adapter: new Adapter() });

const setup = (propOverrides, wrapperType = shallow) => {
  const props = Object.assign({
    modalOpen: true,
    order: {},
    handleDeliveredOrder: jest.fn(),
    handleCancelOrder: jest.fn(),
    handleShippedOrder: jest.fn(),
  }, propOverrides)

  const wrapper = wrapperType(<OrderCard { ...props } />)

  return {
    props,
    wrapper,
    cancel: wrapper.find('#cancel'),
    shipped: wrapper.find('#shipped'),
    delivered: wrapper.find('#delivered'),
    address: wrapper.find('#address'),
    notes: wrapper.find('#notes'),
    phonenumber: wrapper.find('#phonenumber'),
    total_amount: wrapper.find('#total_amount'),
    payment_type: wrapper.find('#payment_type'),
    change_to: wrapper.find('#change_to'),
    change_difference: wrapper.find('#change_difference'),
    products: wrapper.find('.product-description'),
    previous_pendencies: wrapper.find('#previous_pendencies'),
  }
}

describe('render order', () => {
  describe('phonenumber', () => {
    it('not render when empty', () => {
      const { phonenumber } = setup({ order: { phonenumber: "" } });
      expect(phonenumber.exists()).toBe(false);
    });

    it('not render when null', () => {
      const { phonenumber } = setup({ order: { phonenumber: null } });
      expect(phonenumber.exists()).toBe(false);
    });

    it('show number', () => {
      const { phonenumber } = setup({ order: { phonenumber: "998887766" } });
      expect(phonenumber.text()).toEqual("TEL.: 998887766");
    });
  });

  it('address only', () => {
    const { address } = setup({ order: { address: "St. Some, 123" } });
    expect(address.text()).toEqual("St. Some, 123 ");
  });

  it('address with complement', () => {
    const { address } = setup({ order: { address: "St. Some, 123", complement: "apt. 123" } });
    expect(address.text()).toEqual("St. Some, 123 apt. 123");
  });

  describe('notes', () => {
    it('show value', () => {
      const { notes } = setup({ order: { notes: "some notes here" } });
      expect(notes.text()).toEqual("OBS.: some notes here");
    });

    it('not render when empty', () => {
      const { notes } = setup({ order: { notes: "" } });
      expect(notes.exists()).toBe(false);
    });

    it('not render when null', () => {
      const { notes } = setup({ order: { notes: null } });
      expect(notes.exists()).toBe(false);
    });
  });

  describe('change_difference', () => {
    it('show value', () => {
      const { change_difference } = setup({ order: { change_difference: 50 } });
      expect(change_difference.text()).toEqual("Levar troco de R$ 50.00");
    });

    it('not render when null', () => {
      const { change_difference } = setup({ order: { change_difference: null } });
      expect(change_difference.exists()).toBe(false);
    });
  });

  describe('total_amount', () => {
    it('cash', () => {
      const { total_amount } = setup({ order: { total_amount: 50, credit_card_payment: false } });
      expect(total_amount.text()).toEqual("Total em Dinheiro: R$ 50.00");
    });

    it('cash', () => {
      const { total_amount } = setup({ order: { total_amount: 50, credit_card_payment: true } });
      expect(total_amount.text()).toEqual("Total em Cartão: R$ 50.00");
    });
  });

  describe('product', () => {
    it('quantity and description', () => {
      const { products } = setup({
        order: {
          products: [{ product_id: "1", quantity: 1, description: "Product 1" }]
        }
      });

      expect(products.length).toEqual(1);
      expect(products.at(0).text())
        .toEqual("1 Product 1");
    });

    it('multiple products', () => {
      const { products } = setup({
        order: {
          products: [
            { product_id: "1", quantity: 1, description: "Product 1" },
            { product_id: "2", quantity: 3, description: "Product 2" }
          ]
        }
      });
      expect(products.length).toEqual(2);
      expect(products.at(0).text())
        .toEqual("1 Product 1");
      expect(products.at(1).text())
        .toEqual("3 Product 2");
    });
  });

  describe('product', () => {
    it('quantity and description', () => {
      const { products } = setup({
        order: {
          products: [{ product_id: "1", quantity: 1, description: "Product 1" }]
        }
      });

      expect(products.length).toEqual(1);
      expect(products.at(0).text())
        .toEqual("1 Product 1");
    });

    it('multiple products', () => {
      const { products } = setup({
        order: {
          products: [
            { product_id: "1", quantity: 1, description: "Product 1" },
            { product_id: "2", quantity: 3, description: "Product 2" }
          ]
        }
      });
      expect(products.length).toEqual(2);
      expect(products.at(0).text())
        .toEqual("1 Product 1");
      expect(products.at(1).text())
        .toEqual("3 Product 2");
    });
  });

  describe('shipped order button', () => {
    it('hide when has not handle event', () => {
      const { shipped } = setup({ handleShippedOrder: null });

      expect(shipped.exists()).toBe(false);
    });

    it('show when has handle event', () => {
      const { shipped } = setup({
        handleShippedOrder: jest.fn()
      });

      expect(shipped.exists()).toBe(true);
    });
  });

  describe('delivered order button', () => {
    it('hide when has not handle event', () => {
      const { delivered } = setup({ handleDeliveredOrder: null });

      expect(delivered.exists()).toBe(false);
    });

    it('show when has handle event', () => {
      const { delivered } = setup({
        handleDeliveredOrder: jest.fn()
      });

      expect(delivered.exists()).toBe(true);
    });
  });

  describe('pendencies', () => {
    it('exist for current order when delivery Order', () => {
      const { wrapper } = setup({ order: { id: 1 } });

      expect(wrapper.find(Pendency).exists()).toBe(true);
      expect(wrapper.find(Pendency).length).toBe(1);
    });

    it('not exist for current order when not delivery Order', () => {
      const { wrapper } = setup({
        handleDeliveredOrder: null,
        order: { id: 1 }
      });

      expect(wrapper.find(Pendency).exists()).toBe(false);
    });

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
          previous_pendencies: [{ order_id: "pend_1" }, { order_id: "pend_2" }]
        }
      });

      expect(previous_pendencies.find(Pendency).length).toBe(2);
      expect(previous_pendencies.findWhere(node => node.key() === 'pend_1').length).toEqual(1);
      expect(previous_pendencies.findWhere(node => node.key() === 'pend_2').length).toEqual(1);
    });

    it('multiple', () => {
      const { previous_pendencies } = setup({
        order: {
          previous_pendencies: [{ order_id: "pend_1" }, { order_id: "pend_2" }]
        }
      });

      expect(previous_pendencies.find(Pendency).length).toBe(2);
      expect(previous_pendencies.findWhere(node => node.key() === 'pend_1').length).toEqual(1);
      expect(previous_pendencies.findWhere(node => node.key() === 'pend_2').length).toEqual(1);
    });

    it('readOnly', () => {
      const { previous_pendencies } = setup({
        order: {
          previous_pendencies: [{ order_id: "pend_1" }]
        }
      });

      expect(previous_pendencies.find(Pendency).props().readOnly).toBe(true);
    });

    it('set pendency item', () => {
      let pendentBottle = { bottles: { quantity: 2 } };
      const { previous_pendencies } = setup({
        order: {
          previous_pendencies: [{ order_id: "pend_1", pendent: pendentBottle }]
        }
      });

      expect(previous_pendencies.find(Pendency).props().pendent).toBe(pendentBottle);
    });
  });
});

describe('cancel button', () => {
  it('on click calls handleCancelOrder', () => {
    const { cancel, props } = setup({ order: { id: 1 } });
    cancel.simulate('click');
    expect(props.handleCancelOrder).toBeCalledWith(1);
  });
});

describe('delivery button', () => {
  it('on click calls handleDeliveredOrder', () => {
    const { delivered, props } = setup({ order: { id: 1 } });
    delivered.simulate('click');

    expect(props.handleDeliveredOrder).toBeCalledWith(1, {
      pending_payment: null,
      pending_bottles: null,
      pending_generic_note: null
    });
  });

  describe('pendency', () => {
    it('delivery order with a pendency note', () => {
      const { delivered, props, wrapper } = setup({ order: { id: 1 } }, mount);

      let currentPendency = wrapper.find('Pendency');

      currentPendency.find("#pending_notes").hostNodes()
        .simulate('change', { target: { name: 'pending_notes', value: "something here" } });

      delivered.hostNodes().simulate('click');

      expect(props.handleDeliveredOrder).toBeCalledWith(1, {
        pending_payment: null,
        pending_bottles: null,
        pending_generic_note: "something here"
      });
    })

    it('delivery order with a pendency bottle', () => {
      const { delivered, props, wrapper } = setup({ order: { id: 1 } }, mount);

      let pendingBottle = wrapper.find('Pendency').find("#pending_bottle").hostNodes();
      pendingBottle.simulate('change', { target: { checked: true } });

      let pendingBottleQuantity = wrapper.find('Pendency').find("#pending_bottle_quantity").hostNodes();
      pendingBottleQuantity.simulate('change', { target: { value: "2" } });

      delivered.hostNodes().simulate('click');

      expect(props.handleDeliveredOrder).toBeCalledWith(1, {
        pending_payment: null,
        pending_bottles: 2,
        pending_generic_note: null
      });
    })

    it('delivery order with a pendency payment', () => {
      const { delivered, props, wrapper } = setup({ order: { id: 1 } }, mount);

      let pendingBottle = wrapper.find('Pendency').find("#pending_payment").hostNodes();
      pendingBottle.simulate('change', { target: { checked: true } });

      let pendingBottleQuantity = wrapper.find('Pendency').find("#pending_payment_value").hostNodes();
      pendingBottleQuantity.simulate('change', { target: { value: "20" } });

      delivered.hostNodes().simulate('click');

      expect(props.handleDeliveredOrder).toBeCalledWith(1, {
        pending_payment: 20,
        pending_bottles: null,
        pending_generic_note: null
      });
    })
  });
});
