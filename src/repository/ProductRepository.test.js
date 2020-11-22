import ProductRepository from './ProductRepository';
import DbFactory from './DbFactory';

describe('ProductRepository', () => {
  let productRepository, dbTest;
    beforeEach(() => {
      dbTest = DbFactory.dbAdapter();

      productRepository = new ProductRepository(dbTest);
    });
  
    describe('list all', () => {
      it('should return order by description', () => {
        expect(productRepository.all()).to.be.eql([
          { id: 8, description: 'ACÁCIA', cash: 10.00, card: 10.50 },
          { id: 5, description: 'CLAREZA', cash: 5.00,  card: 5.50 },
          { id: 6, description: 'FORTÁGUA', cash: 5.00,  card: 5.50 },
          { id: 2, description: 'INDAIÁ', cash: 11.00, card: 11.50 },
          { id: 1, description: 'NATURÁGUA', cash: 11.00, card: 11.50 },
          { id: 3, description: 'NEBLINA', cash: 10.00, card: 10.50 },
          { id: 4, description: 'PACOTY', cash: 9.00,  card: 9.50 },
          { id: 7, description: 'SERRA GRANDE', cash: 10.00, card: 10.50 },
        ]);
      });
    });

});
