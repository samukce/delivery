import DbFactory from './DbFactory';

class OrderRepository {
    constructor(db = DbFactory.dbAdapter()) {
        this.db = db;
    }

    searchBy(address) {
        if (!address) return {};

        const orders = this.db.get('orders')
            .filter(order => {
                const index = order.address.toUpperCase().indexOf(address.toUpperCase());
                return index !== -1;
            })
            .value()
            .reduce(function(map, order) {
                map[order.address] = order;
                return map;
            }, {});

        return orders;
    }
}

export default OrderRepository;