export default class ProductRepository {
    static all() {
        return [
            { id: 1, description: 'Water', value: 3.50 },
            { id: 2, description: 'Product', value: 4.00 },
            { id: 3, description: 'Neblina', value: 9.00 },
            { id: 4, description: 'Product 3', value: 11.20 }
        ];
    }
}
