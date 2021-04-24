import React from 'react';
import renderer from 'react-test-renderer';

import OrderConfirmation from "./OrderConfirmation";

it('renders empty when no order set', () => {
  const tree = renderer.create(<OrderConfirmation/>).toJSON();
  expect(tree).toMatchSnapshot();
});