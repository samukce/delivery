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
            { id: 1, description: 'Naturágua', value: 11.00 },
            { id: 2, description: 'Indaiá', value: 11.00 },
            { id: 3, description: 'Neblina', value: 10.00 },
            { id: 4, description: 'Pacoty', value: 9.00 },
            { id: 5, description: 'Clareza', value: 5.00 },
            { id: 6, description: 'Fortágua', value: 5.00 },
            { id: 7, description: 'Serra Grande', value: 10.00 },
            { id: 8, description: 'Acácia', value: 10.00 },
        ]
    }
}