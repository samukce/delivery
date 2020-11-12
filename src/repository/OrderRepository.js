import DbFactory from './DbFactory';


export default class OrderRepository {
    constructor(db = DbFactory.dbAdapter()) {
        this.order_collection = db.defaults({ orders: [] }).get('orders');
        this.client_last_order_collection = db.defaults({ client_last_orders: [] })
            .get('client_last_orders');
    }

    searchByAddress(address, takeCount = 5) {
        if (!address) return {};

        const orders = this.order_collection
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

        const orders = this.order_collection
            .filter(order => {
                const index = order.phonenumber.toUpperCase().indexOf(phonenumber.toUpperCase());
                return index !== -1;
            })
            .sortBy('created')
            .sortBy('phonenumber')
            .take(takeCount)
            .value()
            .reduce(function(map, order) {
                map[`${order.phonenumber} / ${order.address}`] = order;
                return map;
            }, {});

        return orders;
    }

    save(order) {
        if (!order) return;

        order.id = DbFactory.getNewId();
        order.created = new Date().toJSON();
        this.order_collection
            .push(order)
            .write();

        this._saveClientLastOrder(order);
    }

    _saveClientLastOrder(order) {
        const last_orders =
            this.client_last_order_collection
                .updateWhere({ address: order.address }, { last_order_id: order.id })
                .write();

        if (!last_orders || last_orders.length === 0) {
            this.client_last_order_collection
                .push({
                    id: DbFactory.getNewId(),
                    last_order_id: order.id,
                    address: order.address
                })
                .write();
        }
    }
}
