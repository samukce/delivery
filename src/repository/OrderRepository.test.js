import OrderRepository from './OrderRepository';
import DbFactory from './DbFactory';

describe('OrderRepository', () => {
  let orderRepository, dbTest, entity, entityClientLastOrder;
    beforeEach(() => {
      dbTest = DbFactory.dbAdapter();
      dbTest.defaults({ orders: [] }).write();

      entity = 'orders';
      entityClientLastOrder = 'client_last_orders';

      orderRepository = new OrderRepository(dbTest);
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

      it('should set created date when save order', () => {
        orderRepository.save({ address: '1022 St.'});

        const order = dbTest.get(entity).find({ address: '1022 St.' }).value();

        expect(order.created).to.not.be.empty;
      });

      describe('save client index', () => {
        it('should save order', () => {
          orderRepository.save({ address: '101 St.'});

          expect(dbTest.get(entityClientLastOrder).size().value()).to.be.equal(1);
        });

        it('should not save null order', () => {
          orderRepository.save(null);

          expect(dbTest.get(entityClientLastOrder).size().value()).to.be.equal(0);
        });

        it('should save last order reference', () => {
          orderRepository.save({ address: '1022 St.'});

          const clientLastOrder = dbTest.get(entityClientLastOrder).find({ address: '1022 St.' }).value();
          const order = dbTest.get(entity).find({ id: clientLastOrder.last_order_id }).value();

          expect(clientLastOrder.address).to.be.equal('1022 St.');
          expect(order.address).to.be.equal('1022 St.');
        });

        it('should update last order if address exist', () => {
          orderRepository.save({ address: '1022 St.', notes: 'order 1'});
          orderRepository.save({ address: '1022 St.', notes: 'order 2'});

          const clientLastOrder = dbTest.get(entityClientLastOrder).find({ address: '1022 St.' }).value();
          const order = dbTest.get(entity).find({ id: clientLastOrder.last_order_id }).value();

          expect(dbTest.get(entityClientLastOrder).size().value()).to.be.equal(1);
          expect(order.notes).to.be.equal('order 2');
        });
      });
    });
  
    describe('search by address', () => {
      it('should return empty object if empty address', () => {
        expect(orderRepository.searchByAddress('')).to.be.empty;
      });

      it('should return empty object if null address', () => {
        expect(orderRepository.searchByAddress(null)).to.be.empty;
      });

      it('should return object started by the street name', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchByAddress('St Abc Cde')).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return object ended by the street name', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchByAddress('Agh')).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return object with the middle name', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchByAddress('Cde')).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return object ignoring the case', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St Abc Cde Agh' })
            .write();

        expect(orderRepository.searchByAddress('cde')).to.be.eql({
          'St Abc Cde Agh': { id: 1, address: 'St Abc Cde Agh'}
        });
      });

      it('should return the first 2 address', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St Abc AAAA' })
            .push({ id: 2, address: 'St abc BBBB' })
            .push({ id: 3, address: 'St abc CCCC' })
            .write();

        expect(orderRepository.searchByAddress('abc', 2)).to.be.eql({
          'St Abc AAAA': { id: 1, address: 'St Abc AAAA'},
          'St abc BBBB': { id: 2, address: 'St abc BBBB'}
        });
      });

      it('should return sortBy address', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'St abc yyyyyyy' })
            .push({ id: 2, address: 'Av. Abcxxxxxx' })
            .push({ id: 3, address: 'Bv. Abcxxxxxx' })
            .write();

        expect(orderRepository.searchByAddress('abc')).to.be.eql({
          'Av. Abcxxxxxx': { id: 2, address: 'Av. Abcxxxxxx'},
          'Bv. Abcxxxxxx': { id: 3, address: 'Bv. Abcxxxxxx'},
          'St abc yyyyyyy': { id: 1, address: 'St abc yyyyyyy'},
        });
      });

      it('should group By created date desc', () => {
        dbTest.get(entity)
            .push({ id: 1, address: 'Abc St.', created: '2019-02-23T23:59:26.919Z' })
            .push({ id: 2, address: 'Abc St.', created: '2019-02-23T23:50:26.919Z' })
            .write();

        expect(orderRepository.searchByAddress('abc')).to.be.eql({
          'Abc St.': { id: 1, address: 'Abc St.', created: '2019-02-23T23:59:26.919Z'},
        });
      });
    });

    describe('search by phone number', () => {
      it('should return empty object if empty number', () => {
        expect(orderRepository.searchByPhone('')).to.be.empty;
      });

      it('should return empty object if null address', () => {
        expect(orderRepository.searchByPhone(null)).to.be.empty;
      });

      it('should return object started by the number', () => {
        dbTest.get(entity)
            .push({ id: 1, phonenumber: '99887766', address: '101 Abc St.' })
            .write();

        expect(orderRepository.searchByPhone('9988')).to.be.eql({
          '99887766 / 101 Abc St.': { id: 1, phonenumber: '99887766', address: '101 Abc St.'}
        });
      });

      it('should return object ended by the number', () => {
        dbTest.get(entity)
            .push({ id: 1, phonenumber: '99887766', address: '101 Abc St.'})
            .write();

        expect(orderRepository.searchByPhone('7766')).to.be.eql({
          '99887766 / 101 Abc St.': { id: 1, phonenumber: '99887766', address: '101 Abc St.'}
        });
      });

      it('should return object with the middle number', () => {
        dbTest.get(entity)
            .push({ id: 1, phonenumber: '99887766', address: '101 Abc St.' })
            .write();

        expect(orderRepository.searchByPhone('8877')).to.be.eql({
          '99887766 / 101 Abc St.': { id: 1, phonenumber: '99887766', address: '101 Abc St.'}
        });
      });

      it('should return the first 2 numbers', () => {
        dbTest.get(entity)
            .push({ id: 1, phonenumber: '99887766', address: '101 Abc St.' })
            .push({ id: 2, phonenumber: '88776699', address: '101 Abc St.' })
            .push({ id: 3, phonenumber: '11221122', address: '101 Abc St.' })
            .write();

        expect(orderRepository.searchByPhone('7766', 2)).to.be.eql({
          '99887766 / 101 Abc St.': { id: 1, phonenumber: '99887766', address: '101 Abc St.'},
          '88776699 / 101 Abc St.': { id: 2, phonenumber: '88776699', address: '101 Abc St.'}
        });
      });

      it('should return sortBy phonenumber', () => {
        dbTest.get(entity)
            .push({ id: 1, phonenumber: '99887766', address: '101 Abc St.' })
            .push({ id: 2, phonenumber: '88776699', address: '101 Abc St.' })
            .push({ id: 3, phonenumber: '11887722', address: '101 Abc St.' })
            .write();

        expect(orderRepository.searchByPhone('8877')).to.be.eql({
          '11887722 / 101 Abc St.': { id: 3, phonenumber: '11887722', address: '101 Abc St.'},
          '88776699 / 101 Abc St.': { id: 2, phonenumber: '88776699', address: '101 Abc St.'},
          '99887766 / 101 Abc St.': { id: 1, phonenumber: '99887766', address: '101 Abc St.'}
        });
      });

      it('should group By phonenuymber and address', () => {
        dbTest.get(entity)
            .push({ id: 1, phonenumber: '99887766', address: '101 Abc St.', created: '2019-02-23T23:59:26.919Z' })
            .push({ id: 2, phonenumber: '99887766', address: '200 Def St.', created: '2019-02-23T23:50:26.919Z' })
            .write();

        expect(orderRepository.searchByPhone('998877')).to.be.eql({
          '99887766 / 101 Abc St.': { id: 1, phonenumber: '99887766', address: '101 Abc St.', created: '2019-02-23T23:59:26.919Z'},
          '99887766 / 200 Def St.': { id: 2, phonenumber: '99887766', address: '200 Def St.', created: '2019-02-23T23:50:26.919Z'},
        });
      });

      it('should group By phonenumber and address and take the lastest', () => {
        dbTest.get(entity)
            .push({ id: 1, phonenumber: '99887766', address: '101 Abc St.', created: '2019-02-23T23:59:26.919Z' })
            .push({ id: 2, phonenumber: '99887766', address: '101 Abc St.', created: '2019-02-23T23:50:26.919Z' })
            .write();

        expect(orderRepository.searchByPhone('998877')).to.be.eql({
          '99887766 / 101 Abc St.': { id: 1, phonenumber: '99887766', address: '101 Abc St.', created: '2019-02-23T23:59:26.919Z'},
        });
      });
    });
});
