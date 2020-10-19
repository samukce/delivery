import DbFactory from './DbFactory';

const entity = 'products';

export default class ProductRepository {
    constructor(db = DbFactory.dbAdapter()) {
        this.db = db;
    }

    all() {
        return this.db.get(entity)
        .sortBy('description')
        .value()
    }
}
