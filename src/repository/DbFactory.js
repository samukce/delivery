const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory');
const LocalStorage = require('lowdb/adapters/LocalStorage');
const shortid = require('shortid');

let ProdOrDevDatabase;
if (window && window.require){
    let FileSync = window.require('lowdb/adapters/FileSync');
    let remote = window.require('electron').remote;
    ProdOrDevDatabase = new FileSync(remote.getGlobal('settings').database_path)
} else {
    ProdOrDevDatabase = new LocalStorage('db.json')
}

export default class DbFactory {
    static dbAdapter() {
        const db = low(
            process.env.NODE_ENV === 'test'
              ? new Memory()
              : ProdOrDevDatabase
        )

        db.defaults({ orders: [], products: DbFactory.initialProductsBeta() })
          .write();

        return db;
    }

    static getNewId() {
        return shortid.generate();
    }

    static initialProductsBeta() { //TODO: initial load sync from server
        return [
            { id: 1, description: 'Naturágua', cash: 11.00, card: 11.50 },
            { id: 2, description: 'Indaiá', cash: 11.00, card: 11.50 },
            { id: 3, description: 'Neblina', cash: 10.00, card: 10.50 },
            { id: 4, description: 'Pacoty', cash: 9.00, card: 9.50 },
            { id: 5, description: 'Clareza', cash: 5.00, card: 5.50 },
            { id: 6, description: 'Fortágua', cash: 5.00, card: 5.50 },
            { id: 7, description: 'Serra Grande', cash: 10.00, card: 10.50 },
            { id: 8, description: 'Acácia', cash: 10.00, card: 10.50 },
        ]
    }
}