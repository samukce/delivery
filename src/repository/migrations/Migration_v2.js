import { ORDERS, CLIENT_LAST_ORDERS } from "../../constants/entities";
const migration_version = 2;

export default class Migration_v2 {
  static apply(db, current_version, success) {
    if (current_version + 1 !== migration_version) {
      return;
    }

    console.log(`Migrating to ${migration_version}`);
    const current_date = new Date().toJSON();

    this._adjustPhoneNumbers(db, current_date, ORDERS);
    this._adjustPhoneNumbers(db, current_date, CLIENT_LAST_ORDERS);

    success(migration_version);
  }

  static _adjustPhoneNumbers(db, current_date, entity) {
    const onlyNumbers = /^[0-9]+$/;
    //add updated to orders if not exist
    db.get(entity)
      .filter((order) => !onlyNumbers.test(order.phonenumber))
      .each((order) => {
        order.updated = current_date;
        order.phonenumber = order.phonenumber
          .replace(/[^0-9]/g, "")
          .replace(/\s/g, "");
      })
      .write();
  }
}
