<template>
  <section class="product-card" @click="viewDetails">
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <p>Price: {{ product.price }}</p>
      <img :src="product.imageName" alt="Product image" />
    </div>
  </section>
</template>
  
  <script>
export default {
  
  methods: {
    viewDetails() {
      this.$router.push({
        name: "product-details",
        params: { id: this.product.productId },
      });
    },
  },
};
</script>
  
  <style>

</style>