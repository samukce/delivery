import DbFactory from './DbFactory';

const entity = 'orders';

class OrderRepository {
    constructor(db = DbFactory.dbAdapter()) {
        this.db = db;
    }

    searchBy(address, takeCount = 25) {
        if (!address) return {};

        const orders = this.db.get(entity)
            .filter(order => {
                const index = order.address.toUpperCase().indexOf(address.toUpperCase());
                return index !== -1;
            })
            .sortBy('created')
            .sortBy('address')
            .take(takeCount)
            .value()
            .reduce(function(map, order) {
                map[order.address] = order;
                return map;
            }, {});

        return orders;
    }

    save(order) {
        if (!order) return;

        order.id = DbFactory.getNewId();
        order.created = new Date().toJSON();
        this.db.get(entity)
            .push(order)
            .write();
    }
}

export default OrderRepository;