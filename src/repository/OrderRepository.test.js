import OrderRepository from './OrderRepository';
import DbFactory from './DbFactory';

describe('OrderRepository', () => {
  let orderRepository, dbTest, entity;
    beforeEach(() => {
      dbTest = DbFactory.dbAdapter();
      entity = 'orders';

      orderRepository = new OrderRepository(dbTest);
    });
  
    describe('search by address', () => {
      it('should return empty object if empty address', () => {
        expect(orderRepository.searchBy('')).to.be.empty;
      });

      it('should return empty object if null address', () => {
        expect(orderRepository.searchBy(null)).to.be.empty;
      });

      it('should return object started by the street name', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchBy('St Abc Cde')).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return object ended by the street name', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchBy('Agh')).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return object with the middle name', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchBy('Cde')).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return object ignoring the case', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchBy('cde')).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return the first 2 address', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St Abc AAAA' })
            .push({ id: 2, address: 'St abc BBBB' })
            .push({ id: 3, address: 'St abc CCCC' })
            .write();

        expect(orderRepository.searchBy('abc', 2)).to.be.eql({
          'St Abc AAAA': { id: 1, address: 'St Abc AAAA'},
          'St abc BBBB': { id: 2, address: 'St abc BBBB'}
        });
      });

      it('should return sortBy address', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St abc yyyyyyy' })
            .push({ id: 2, address: 'Av. Abcxxxxxx' })
            .write();

        expect(orderRepository.searchBy('abc')).to.be.eql({
          'Av. Abcxxxxxx': { id: 2, address: 'Av. Abcxxxxxx'},
          'St abc yyyyyyy': { id: 1, address: 'St abc yyyyyyy'},
        });
      });
    });

    describe('save order', () => {
      it('should save order', () => {
        orderRepository.save({ address: '101 St.'});

        expect(dbTest.get(entity).size().value()).to.be.equal(1);
      });

      it('should not save null order', () => {
        orderRepository.save(null);

        expect(dbTest.get(entity).size().value()).to.be.equal(0);
      });

      it('should set id when save order', () => {
        orderRepository.save({ address: '1022 St.'});

        const order = dbTest.get(entity).find({ address: '1022 St.' }).value();

        expect(order.id).to.not.be.empty;
      });
    });
});