import DbFactory from "./DbFactory";
import { PRODUCTS } from "../constants/entities";

const minDate = new Date(-8640000000000000);

class ProductRepository {
  constructor(db = DbFactory.dbAdapter(), firebase, authUser) {
    this.db = db;
    this.product_collection = db.get(PRODUCTS);
    this.firebase = firebase;
    this.authUser = authUser;
  }

  setOrderRepositoryFirebase(firebase, authUser) {
    this.firebase = firebase;
    this.authUser = authUser;
  }

  all() {
    return this.product_collection.sortBy("description").value();
  }

  getById(productId) {
    if (!productId) return {};
    return this.product_collection.getById(productId).value();
  }

  _saveProductOnFireBase(entity, date_last_sync, successCallBack) {
    if (!this.authUser) {
      return;
    }

    entity.user_id = this.authUser.uid;
    entity.last_sync = date_last_sync;

    this.firebase
      .product(this.authUser.default_organization, entity.id)
      .set(entity)
      .then(() => {
        if (successCallBack) {
          successCallBack(entity);
        }
      })
      .catch(() => {
        delete entity.user_id;
        delete entity.last_sync;
      });
  }

  _updateProduct(product) {
    this.product_collection.getById(product.id).assign(product).write();
  }

  _sendAndUpadateProduct(product, date_sync) {
    this._saveProductOnFireBase(product, date_sync, (newProduct) =>
      this._updateProduct(newProduct)
    );
  }

  save(product) {
    if (!product) return;
    const current_date = new Date().toJSON();
    product.updated = current_date;

    if (product.id) {
      this._updateProduct(product);
    } else {
      product.id = DbFactory.getNewId();
      product.created = current_date;

      this.product_collection.push(product).write();
    }

    this._sendAndUpadateProduct(product, current_date);

    return product.id;
  }

  delete(productId) {
    const product = this.product_collection.getById(productId).value();
    if (product.last_sync) {
      if (this.authUser) {
        this.firebase
          .product(this.authUser.default_organization, productId)
          .set(null)
          .then(() =>
            this.product_collection.remove({ id: productId }).write()
          );
        //return promise to ui decide what to do if success/error
      }
    } else {
      this.product_collection.remove({ id: productId }).write();
    }
  }

  syncProducts() {
    if (!this.authUser) return;

    const current_date = new Date().toJSON();

    this.product_collection
      .filter((product) => {
        return (
          new Date(product.updated) > new Date(product.last_sync || minDate)
        );
      })
      .value()
      .forEach((product) => this._sendAndUpadateProduct(product, current_date));

    this.firebase
      .products(this.authUser.default_organization)
      .once("value")
      .then((snapshot) => {
        const products = snapshot.val();

        for (var id in products) {
          const product = products[id];
          const productLocal = this.product_collection
            .getById(product.id)
            .value();

          if (!productLocal) {
            this.product_collection.push(product).write();
          } else if (
            new Date(product.updated) > new Date(productLocal.updated)
          ) {
            this.product_collection.getById(product.id).assign(product).write();
          }
        }
      });
  }
}

export default new ProductRepository();
