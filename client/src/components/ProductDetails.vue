<template>
  <div>
    <nav>
      <div v-if="message" @click="clearMessage" class="cart-message">
        {{ message }}
      </div>
    </nav>

    <div v-if="isLoading">
      <loading-spinner :spin="true" />Please wait while we pull the product
      details...
    </div>
    <div v-else-if="product">
      <h2>{{ product.name }}</h2>
      <p>{{ product.description }}</p>
      <p>Price: ${{ product.price }}</p>
      <img :src="product.imageName" alt="Product image" />
      <div v-if="isLoggedIn">
        <button @click="addToCart(product)">Add to Cart</button>
      </div>
    </div>
    <div v-else>
      <p>Product not found.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import App from "../App.vue";
import LoadingSpinner from "./LoadingSpinner.vue";
import { productService, searchProducts } from "../services/ProductService.js";
import AuthService from "../services/AuthService";

export default {
  components: { LoadingSpinner },
  data() {
    return {
      isLoading: true,
      product: null,
      productId: this.$route.params.id,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.token.length > 0;
    },
    message() {
      return this.$store.state.message;
    },
    cartItemCount() {
      let total = 0;
      for (const item of this.cart) {
        total += item.quantity;
      }
      return total;
    },
  },
  created() {
    this.fetchProduct();
  },
  methods: {
    fetchProduct() {
      axios
        .get(`/products/${this.productId}`)
        .then((response) => {
          this.product = response.data;
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    addToCart(product) {
      const item = {
        productId: product.productId,
        quantity: 1,
      };
      axios
        .post('/cart/items', item)
        .then(response => {
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
};
</script>

<style scoped>
main {
  grid-area: main;
  background-color: #f0f0f0;
  overflow: auto;
  margin-top: 270px;
}
nav {
  margin-top: 220px;
}
</style>