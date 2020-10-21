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
          { id: 8, description: 'Acácia', value: 10.00 },
          { id: 5, description: 'Clareza', value: 5.00 },
          { id: 6, description: 'Fortágua', value: 5.00 },
          { id: 2, description: 'Indaiá', value: 11.00 },
          { id: 1, description: 'Naturágua', value: 11.00 },
          { id: 3, description: 'Neblina', value: 10.00 },
          { id: 4, description: 'Pacoty', value: 9.00 },
          { id: 7, description: 'Serra Grande', value: 10.00 },
        ]);
      });
    });

});
