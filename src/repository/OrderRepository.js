import DbFactory from './DbFactory';


export default class OrderRepository {
    constructor(db = DbFactory.dbAdapter()) {
        this.order_collection = db.defaults({ orders: [] }).get('orders');
        this.client_last_order_collection = db.defaults({ client_last_orders: [] })
            .get('client_last_orders');
    }

    searchByAddress(address, takeCount = 5) {
        if (!address) return {};

        const order_collection = this.order_collection;
        const orders = this.client_last_order_collection
            .filter(last_order => {
                const index = last_order.address.toUpperCase().indexOf(address.toUpperCase());
                return index !== -1;
            })
            .sortBy('created')
            .sortBy('address')
            .take(takeCount)
            .value()
            .reduce(function(map, last_order) {
                map[last_order.address] = order_collection.getById(last_order.last_order_id).value();
                return map;
            }, {});

        return orders;
    }

    searchByPhone(phonenumber, takeCount = 5) {
        if (!phonenumber) return {};

        const order_collection = this.order_collection;
        const orders = this.client_last_order_collection
            .filter(last_order => {
                const index = last_order.phonenumber.toUpperCase().indexOf(phonenumber.toUpperCase());
                return index !== -1;
            })
            .sortBy('created')
            .sortBy('phonenumber')
            .take(takeCount)
            .value()
            .reduce(function(map, last_order) {
                map[`${last_order.phonenumber} / ${last_order.address}`] = 
                    order_collection.getById(last_order.last_order_id).value();
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
        const last_orders_by_address_and_phonenumber =
            this.client_last_order_collection
                .updateWhere(
                    { address: order.address, phonenumber: order.phonenumber }, 
                    { last_order_id: order.id, updated: new Date().toJSON() })
                .write();

        if ((!last_orders_by_address_and_phonenumber || last_orders_by_address_and_phonenumber.length === 0)) {
            this.client_last_order_collection
                .push({
                    id: DbFactory.getNewId(),
                    last_order_id: order.id,
                    address: order.address,
                    phonenumber: order.phonenumber,
                    created: new Date().toJSON()
                })
                .write();
        }
    }

    allInTheQueue() {
        const orders = this.order_collection
            .filter(order => {
                return order.status == null || order.status === 'QUEUE';
            })
            .sortBy('created')
            .reverse()
            .value();

        return orders;
    }
}
