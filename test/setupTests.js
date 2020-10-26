import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

require('chai/register-assert');  // Using Assert style
require('chai/register-expect');  // Using Expect style
require('chai/register-should');  // Using Should style

import sinon from 'sinon';
global.sinon = sinon;
