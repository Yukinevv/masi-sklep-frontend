export class Product {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public price: number,
        public category: string,
        public quantity: number,
        public imageUrl?: string
    ) { }
}