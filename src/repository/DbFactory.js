import Migration_v1 from "./migrations/Migration_v1";

const low = require("lowdb");
const Memory = require("lowdb/adapters/Memory");
const LocalStorage = require("lowdb/adapters/LocalStorage");
const shortid = require("shortid");
const lodashId = require("lodash-id");

let ProdOrDevDatabase;
if (process.env.NODE_ENV === "test") {
  ProdOrDevDatabase = new Memory();
} else if (window && window.require) {
  let FileSync = window.require("lowdb/adapters/FileSync");
  let remote = window.require("electron").remote;
  ProdOrDevDatabase = new FileSync(remote.getGlobal("settings").database_path);
} else {
  ProdOrDevDatabase = new LocalStorage("db.json");
}

const db = low(ProdOrDevDatabase);
db._.mixin(lodashId);

db.defaults({
  products: [],
  orders: [],
  client_last_orders: [],
  version: 0,
  default_organization: "",
  last_data_by_organization: {},
}).write();

const current_version = db.get("version").value();
const update_if_success = (migration_version) =>
  db.set("version", migration_version).write();
Migration_v1.apply(db, current_version, update_if_success);

export default class DbFactory {
  static dbAdapter() {
    return db;
  }

  static getNewId() {
    return shortid.generate();
  }

  static setLastOrganization(default_organization) {
    const last_default_organization = db.get("default_organization").value();
    if (
      last_default_organization !== "" &&
      last_default_organization !== default_organization
    ) {
      const current_data_by_organization = db
        .get("last_data_by_organization")
        .value();
      current_data_by_organization[last_default_organization] = {
        products: db.get("products").value(),
        orders: db.get("orders").value(),
        client_last_orders: db.get("client_last_orders").value(),
      };
      db.set("last_data_by_organization", current_data_by_organization).write();

      const current_organization =
        current_data_by_organization[default_organization];
      db.set(
        "products",
        current_organization && current_organization["products"]
          ? current_organization["products"]
          : []
      ).write();
      db.set(
        "orders",
        current_organization && current_organization["orders"]
          ? current_organization["orders"]
          : []
      ).write();
      db.set(
        "client_last_orders",
        current_organization && current_organization["client_last_orders"]
          ? current_organization["client_last_orders"]
          : []
      ).write();
    }

    db.set("default_organization", default_organization).write();
  }
}
