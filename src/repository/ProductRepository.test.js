import ProductRepository from "./ProductRepository";

describe("ProductRepository", () => {
  describe("list all", () => {
    it("should return order by description", () => {
      expect(ProductRepository.all()).to.be.eql([
        { id: 8, description: "ACÁCIA", cash: 10.0, card: 10.5 },
        { id: 5, description: "CLAREZA", cash: 5.0, card: 5.5 },
        { id: 6, description: "FORTÁGUA", cash: 5.0, card: 5.5 },
        { id: 2, description: "INDAIÁ", cash: 11.0, card: 11.5 },
        { id: 1, description: "NATURÁGUA", cash: 11.0, card: 11.5 },
        { id: 3, description: "NEBLINA", cash: 10.0, card: 10.5 },
        { id: 4, description: "PACOTY", cash: 9.0, card: 9.5 },
        { id: 7, description: "SERRA GRANDE", cash: 10.0, card: 10.5 },
      ]);
    });
  });
});
