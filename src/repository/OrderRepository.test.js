import OrderRepository from './OrderRepository';
import DbFactory from './DbFactory';

describe('OrderRepository', () => {
  let orderRepository;
    beforeEach(() => {
      const dbTest = DbFactory.dbAdapter();

      dbTest.get('orders')
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write()

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
        expect(orderRepository.searchBy("St Abc")).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });
    });
});