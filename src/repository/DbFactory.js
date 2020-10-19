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

        db.defaults({ orders: [] })
          .write();

        return db;
    }

    static getNewId() {
        return shortid.generate();
    }
}