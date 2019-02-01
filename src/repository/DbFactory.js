const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory');

let FileSync;
if (window && window.require)
    FileSync = window.require('lowdb/adapters/FileSync');


export default class DbFactory {
    static dbAdapter() {
        const db = low(
            process.env.NODE_ENV === 'test'
              ? new Memory()
              : new FileSync('db.json')
        )

        db.defaults({ orders: [] })
          .write();

        return db;
    }
}