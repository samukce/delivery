import OrderRepository from './OrderRepository';
import DbFactory from './DbFactory';

describe('OrderRepository', () => {
  let orderRepository, dbTest;
    beforeEach(() => {
      dbTest = DbFactory.dbAdapter();

      orderRepository = new OrderRepository(dbTest);
    });
  
    describe('search by address', () => {
      it('should return empty object if empty address', () => {
        expect(orderRepository.searchBy("")).to.be.empty;
      });

      it('should return empty object if null address', () => {
        expect(orderRepository.searchBy(null)).to.be.empty;
      });

      it('should return object started by the street name', () => {
        dbTest.get('orders')
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchBy("St Abc Cde")).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return object ended by the street name', () => {
        dbTest.get('orders')
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchBy("Agh")).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return object with the middle name', () => {
        dbTest.get('orders')
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchBy("Cde")).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return object ignoring the case', () => {
        dbTest.get('orders')
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchBy("cde")).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return the first 2 address', () => {
        dbTest.get('orders')
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .push({ id: 2, address: 'St abc yyyyyyy' })
            .push({ id: 3, address: 'St abc ppppppp' })
            .write();

        expect(orderRepository.searchBy("abc", 2)).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'},
          'St abc yyyyyyy': { id: 2, address: 'St abc yyyyyyy'}
        });
      });
    });
});