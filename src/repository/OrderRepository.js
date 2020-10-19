import DbFactory from './DbFactory';

const entity = 'orders';

class OrderRepository {
    constructor(db = DbFactory.dbAdapter()) {
        this.db = db;
    }

    searchByAddress(address, takeCount = 5) {
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

    searchByPhone(phonenumber, takeCount = 5) {
        if (!phonenumber) return {};

        const orders = this.db.get(entity)
            .filter(order => {
                const index = order.phonenumber.toUpperCase().indexOf(phonenumber.toUpperCase());
                return index !== -1;
            })
            .sortBy('created')
            .sortBy('phonenumber')
            .take(takeCount)
            .value()
            .reduce(function(map, order) {
                map[order.phonenumber] = order;
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