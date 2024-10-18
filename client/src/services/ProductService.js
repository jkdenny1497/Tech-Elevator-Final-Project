import axios from 'axios'

const productService = {
  getProducts() {
    return axios.get('/products');
  },
  getCart() {
    return axios.get('/cart');
  }
};

function searchProducts(searchTerm) {
  return axios.get('/products').filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
}

export { productService, searchProducts };

// {
//   productId: 1,
//   productSku: "MUG-023",
//   name: "Solar Geeks coffee mug",
//   description: "Start your day off right!",
//   price: 14.99,
//   imageName: "src/assets/Solar Mug Image.jpg",
// },
// {
//   productId: 2,
//   productSku: "YET-001",
//   name: "Solar Geeks Yeti",
//   description: "Keep cool all day long.",
//   price: 21.99,
//   imageName: "src/assets/Solar Yeti Image.jpg",
// },
// {
//   productId: 3,
//   productSku: "ART-256",
//   name: "Galactic poster",
//   description: "Beautiful view of a galaxy",
//   price: 9.59,
//   imageName: "src/assets/Solar Poster Image.jpg",
// },
// {
//   productId: 4,
//   productSku: "TOY-978",
//   name: "Toy rocket",
//   description: "To infinite imagination",
//   price: 39.99,
//   imageName: "src/assets/Solar Toy Rocket Image.jpg",
// },
// {
//   productId: 5,
//   productSku: "EAT-235",
//   name: "Astronaut ice cream",
//   description: "As cold as space",
//   price: 5.79,
//   imageName: "src/assets/Solar Astronaut Ice Cream Image.jpg",
// },
// {
//   productId: 6,
//   productSku: "HAT-928",
//   name: "Solar Geeks baseball cap",
//   description: "Look stylish with our logo",
//   price: 16.89,
//   imageName: "src/assets/Solar Baseball Cap Image.jpg",
// },
// {
//   productId: 7,
//   productSku: "LIT-612",
//   name: "Intro to Astrophysics",
//   description: "Learn about astrophysics",
//   price: 7.99,
//   imageName: "src/assets/Solar Intro to Astrophysics Image.jpg",
// },
// ];