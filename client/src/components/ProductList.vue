<template>
  <section id="product-cards">
    <h2>Products</h2>

    <ul id="product-list">
      <li
        v-for="product in filteredProducts"
        :key="product.productId"
        class="product-card"
        @click="selected(product.productId)"
      >
        <div class="sku">SKU: {{ product.productSku }}</div>
        <div class="price">${{ product.price.toFixed(2) }}</div>
        <div class="product-name">{{ product.name }}</div>
        <img
          :src="product.imageName"
          alt="Product image"
          class="product-image"
        />
        <div class="description">{{ product.description }}</div>
        <div v-if="isLoggedIn">
          <div class="cart">
            <i
              class="fa fa-cart-plus"
              aria-hidden="true"
              @click="addToCart(product, $event)"
            ></i>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import axios from "axios";
import { productService, searchProducts } from "../services/ProductService.js";

export default {
  computed: {
    isLoggedIn() {
      return this.$store.state.token.length > 0;
    },
    products() {
      return this.$store.state.products;
    },
    searchQuery() {
      return this.$store.state.searchQuery;
    },
    filteredProducts() {
      if (!this.searchQuery) {
        return this.products;
      }
      return this.products.filter((product) => {
        const lowerCase = this.searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(lowerCase) ||
          product.productSku.toLowerCase().includes(lowerCase)
        );
      });
    },
  },
  methods: {
    getProducts() {
      axios
        .get("/products")
        .then((response) => {
          this.$store.commit("SET_PRODUCTS", response.data);
        })
        .catch((error) => {
          console.error("Failed to get products", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    selected(productId) {
      this.$router.push({ name: "product-details", params: { id: productId } });
    },
    addToCart(product, event) {
      const item = {
        productId: product.productId,
        quantity: 1,
      };
      event.stopPropagation();
      axios
        .post('/cart/items', item)
        .then((response) => {
          this.$store.dispatch("addToCart", product);
          this.$store.dispatch(
            "setMessage",
            `${product.name} added to cart successfully.`
          );
        })
        .catch((error) => {
          console.error("Error adding product to cart.", error);
          this.$store.dispatch("setMessage", "Error adding product to cart.");
        });
    },
    clearMessage() {
      this.$store.dispatch("clearMessage");
    },
  },
  created() {
    this.getProducts();
  },
};
</script>

<style>
#product-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
}

.product-card {
  flex: 0 1 calc(33.333% - 20px);
  max-width: 300px;
  margin: 15px;
}

@media (max-width: 768px) {
  .product-card {
    flex: 0 1 calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .product-card {
    flex: 0 1 calc(100% - 20px);
  }
}
</style>