<template>
  <div v-if="isLoading">
    <loading-spinner id="spinner" :spin="true" />Please hold while we pull our products...
  </div>
  <div id="main-div" v-else>
    <ProductList id="products" />
  </div>
</template>

<script>
import ProductList from "../components/ProductList.vue";
import { productService, searchProducts } from "../services/ProductService.js";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import axios from "axios";

export default {
  components: { ProductList, LoadingSpinner },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    
  },
  created() {
    this.isLoading = true;

    Promise.all([productService.getProducts()])
      .then(([productResponse]) => {
        this.$store.commit("SET_PRODUCTS", productResponse.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  },
  methods: {
    fetchProduct() {
      const productId = this.$route.params.id;
      axios.get(`../products/${productId}`)
      .then((response) => {
        this.productDetails = response.data;
      })
      .catch((error) => {
        console.error('Error fetching product details', error);
      });
    },
  },
};
</script>

<style>
main {
  margin-top: 260px;
  overflow-y: auto;
  padding-bottom: 60px;
}

</style>