import React from "react";
import Cart from "./Cart";
import { shallow, mount } from "enzyme";
import ProductRepository from "./repository/ProductRepository";

describe("Cart", () => {
  let spyAddProduct,
    wrapper,
    sandbox,
    stubProductRepositoryAll,
    stubProductRepositoryGetById,
    componentRender,
    spyOnProductChange;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    stubProductRepositoryAll = sandbox.stub(ProductRepository, "all").returns([
      { id: 1, description: "Product 1", cash: 3.5, card: 4.0 },
      { id: 2, description: "Product 2", cash: 2.5, card: 3.0 },
    ]);
    stubProductRepositoryGetById = sandbox.stub(ProductRepository, "getById");
    stubProductRepositoryGetById.withArgs(1).returns({
      id: 1,
      description: "Product 1",
      cash: 4.0,
      card: 4.5,
    });
    stubProductRepositoryGetById.withArgs("user", "type").returns(null);

    spyOnProductChange = sandbox.spy();

    wrapper = shallow(<Cart onProductsChange={spyOnProductChange} />);
    componentRender = wrapper.instance();

    spyAddProduct = sandbox.spy(componentRender, "addProduct");
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("add product", () => {
    it("should load products from repository", () => {
      expect(stubProductRepositoryAll).to.have.been.called;
    });

    it("should not add if no product selected", () => {
      wrapper.find("#add-product-button").simulate("click");

      expect(wrapper.state("products")).to.eql([]);
    });

    it("should focus product field if not selected product", () => {
      const output = mount(<Cart />);

      output.instance().addProduct();

      expect(document.activeElement.id).to.be.equal(
        "product_display_description"
      );
    });

    it("should go with product and quantity selected", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });
      wrapper.find("#add_product_quantity").simulate("change", {
        target: { name: "add_product_quantity", value: 2 },
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(spyAddProduct).to.have.been.calledOnce;
      expect(wrapper.state("products")).to.eql([
        {
          product_id: 1,
          description: "Product 1",
          cash: 3.5,
          card: 4.0,
          quantity: 2,
        },
      ]);
    });

    it("should reset product selected after added", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(wrapper.state("add_product")).to.be.null;
    });

    it("should add product selected by Enter", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });

      componentRender.handleKeyDownQuantity({ key: "Enter" });

      expect(wrapper.state("add_product")).to.be.null;
    });

    it("should return quantity product after added to be 1", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });
      wrapper.find("#add_product_quantity").simulate("change", {
        target: { name: "add_product_quantity", value: 2 },
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(wrapper.state("add_product_quantity")).to.be.equal(1);
    });

    it("should quantity be 1 if the user delete value", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });
      wrapper.find("#add_product_quantity").simulate("change", {
        target: { name: "add_product_quantity", value: "" },
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(wrapper.state("products")).to.eql([
        {
          product_id: 1,
          description: "Product 1",
          cash: 3.5,
          card: 4.0,
          quantity: 1,
        },
      ]);
    });

    it("should quantity be 1 if the user set 0 value", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });
      wrapper.find("#add_product_quantity").simulate("change", {
        target: { name: "add_product_quantity", value: "0" },
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(wrapper.state("products")).to.eql([
        {
          product_id: 1,
          description: "Product 1",
          cash: 3.5,
          card: 4.0,
          quantity: 1,
        },
      ]);
    });

    it("should focus the quantity field after choose the product", () => {
      const focusQuantity = sandbox.stub(componentRender, "focusQuantity");

      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });

      expect(focusQuantity).to.have.have.calledOnce;
    });

    it("should clear product field after added the product", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(
        wrapper
          .find("AutocompleteCustom.product")
          .shallow()
          .find("input")
          .props().value
      ).to.be.equal("");
    });

    it("should have add the product message when empty", () => {
      expect(
        wrapper.find("Table").find("tbody").props().children.props.children
          .props.children.props.children
      ).to.be.equal("Add a product...");
    });

    it("should add the product on the table", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });
      wrapper.find("#add-product-button").simulate("click");

      componentRender.handleOnAutocompleteProduct({
        id: 2,
        description: "Product 2",
        cash: 4.0,
        card: 4.5,
      });
      wrapper.find("#add-product-button").simulate("click");

      expect(
        wrapper.find("Table").find("tbody").props().children.length
      ).to.be.equal(2);
    });

    it("should add the description of product on the table in uppercase", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(
        wrapper.find("Table").find("tbody").props().children[0].props
          .children[0].props.children
      ).to.be.equal("PRODUCT 1");
    });

    it("should add the item price of product on the table", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(
        wrapper.find("Table").find("tbody").props().children[0].props
          .children[1].props.children
      ).to.be.equal("R$ 3.50");
    });

    it("should add the quantity of product on the table", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(
        wrapper.find("Table").find("tbody").props().children[0].props
          .children[2].props.children
      ).to.be.equal(1);
    });

    it("should calculate the total amount of the product on the table", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });
      wrapper.find("#add_product_quantity").simulate("change", {
        target: { name: "add_product_quantity", value: 2 },
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(
        wrapper.find("Table").find("tbody").props().children[0].props
          .children[3].props.children
      ).to.be.equal("R$ 7.00");
    });

    it("should fire on change product when add a product", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });
      wrapper.find("#add_product_quantity").simulate("change", {
        target: { name: "add_product_quantity", value: 2 },
      });

      wrapper.find("#add-product-button").simulate("click");

      expect(spyOnProductChange).to.have.been.calledOnce;
    });
  });

  describe("remove product", () => {
    it("should be empty after performed", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });
      wrapper.find("#add_product_quantity").simulate("change", {
        target: { name: "add_product_quantity", value: 2 },
      });

      wrapper.find("#add-product-button").simulate("click");
      wrapper.find("#remove-product-0").simulate("click");

      expect(wrapper.state("products")).to.eql([]);
    });

    it("should fire on change product when remove a product", () => {
      const products = [
        {
          description: "Product 1",
          product_id: 1,
          quantity: 2,
          cash: 3.5,
          card: 4.0,
        },
      ];
      wrapper.setState({ products });

      wrapper.find("#remove-product-0").simulate("click");

      expect(spyOnProductChange).to.have.been.calledOnce;
    });
  });

  describe("clear component", () => {
    it("should clear product description field", () => {
      wrapper
        .find("#product_display_description")
        .shallow()
        .find("input")
        .simulate("change", {
          target: { name: "product_display_description", value: "Water 1" },
        });

      componentRender.onCartClear();

      expect(wrapper.state("product_display_description")).to.be.empty;
      expect(
        wrapper
          .find("#product_display_description")
          .shallow()
          .find("input")
          .props().value
      ).to.be.empty;
    });

    it("should reset quantity field to initial value 1", () => {
      wrapper.find("#add_product_quantity").simulate("change", {
        target: { name: "add_product_quantity", value: 2 },
      });

      componentRender.onCartClear();

      expect(wrapper.state("add_product_quantity")).to.be.equal(1);
      expect(
        wrapper.find("#add_product_quantity").shallow().find("input").props()
          .value
      ).to.be.equal(1);
    });

    it("should reset product table to empty", () => {
      componentRender.handleOnAutocompleteProduct({
        id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
      });
      wrapper.find("#add_product_quantity").simulate("change", {
        target: { name: "add_product_quantity", value: 2 },
      });

      wrapper.find("#add-product-button").simulate("click");

      componentRender.onCartClear();

      expect(
        wrapper.find("Table").find("tbody").props().children.props.children
          .props.children.props.children
      ).to.be.equal("Add a product...");
    });
  });

  describe("load products", () => {
    it("should update the products state with latest product", () => {
      const productAdded = {
        product_id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
        quantity: 2,
      };

      componentRender.onCartLoad([productAdded]);

      const productLatest = {
        product_id: 1,
        description: "Product 1",
        cash: 4.0,
        card: 4.5,
        quantity: 2,
      };

      expect(wrapper.state("products")).to.eql([productLatest]);
    });

    it("should fire on change product when add a product", () => {
      const productAdded = {
        product_id: 1,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
        quantity: 1,
      };

      componentRender.onCartLoad([productAdded]);

      const productLatest = {
        product_id: 1,
        description: "Product 1",
        cash: 4.0,
        card: 4.5,
        quantity: 1,
      };

      expect(spyOnProductChange).to.have.been.calledWith([productLatest]);
    });

    it("should ignore if the product not exist", () => {
      const productAdded = {
        product_id: 99999,
        description: "Product 1",
        cash: 3.5,
        card: 4.0,
        quantity: 1,
      };

      componentRender.onCartLoad([productAdded]);

      expect(spyOnProductChange).to.have.been.calledWith([]);
    });
  });
});
