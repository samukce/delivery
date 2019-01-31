const fs = require('fs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Memory = require('lowdb/adapters/Memory')


export default class DbFactory {
    static dbAdapter() {
        const db = low(
            process.env.NODE_ENV === 'test'
              ? new Memory()
              : new FileSync('db.json')
          )
          
        db.defaults({ orders: [] })
          .write()
        
        return db;
    }
}