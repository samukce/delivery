const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory');

let remote;
let FileSync;
if (window && window.require){
    FileSync = window.require('lowdb/adapters/FileSync');
    remote = window.require('electron').remote;
}

export default class DbFactory {
    static dbAdapter() {
        const db = low(
            process.env.NODE_ENV === 'test'
              ? new Memory()
              : new FileSync(remote.getGlobal('settings').database_path)
        )

        db.defaults({ orders: [] })
          .write();

        return db;
    }
}