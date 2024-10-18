<template>
  <div v-if="isLoading">
    <loading-spinner :spin="true" />Please wait while we are pulling your cart
    information...
  </div>
  <div v-else>
    <div class="cart-page">
      <h2>My Shopping Cart</h2>
      <p v-if="!cart || cart.length === 0">Your cart is empty!</p>
      <table v-else class="cart-table">
        <thead>
          <tr>
            <th>Qty</th>
            <th>Product</th>
            <th>Price</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.productId">
            <td>{{ item.quantity }}</td>
            <td @click="goToProductDetail(item.productId)" class="product-link">
              {{ item.name }}
            </td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td>{{ formatCurrency(item.quantity * item.price) }}</td>
            <td>
              <font-awesome-icon
                icon="fa-trash-can"
                @click="removeItem(item.productId)"
                class="remove-icon"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="cart-summary">
        <p>Subtotal: {{ formatCurrency(subtotal) }}</p>
        <p>Tax: {{ formatCurrency(taxAmount) }}</p>
        <p>Total: {{ formatCurrency(totalAmount) }}</p>
        <button @click="clearCart" class="clear-cart">Clear Cart</button>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import { productService } from "../services/ProductService";

export default {
  name: "CartView",
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      isLoading: true,
      subtotal: 0,
      taxAmount: 0,
      totalAmount: 0,
    };
  },
  computed: {
    ...mapGetters(["cart"]),
    isLoggedIn() {
      return this.$store.state.token.length > 0;
    },
    cartItems() {
      return this.cart;
    },
    totalPrice() {
      let total = 0;
      for (const item of this.cartItems) {
          total += item.price * item.quantity;
        }
      return total;
    },
  },
  methods: {
    ...mapActions(["fetchCart", "clearCart"]),
    goToProductDetail(productId) {
      this.$router.push(`/products/${productId}`);
    },
    removeItem(productId) {
      this.$store
        .dispatch("removeFromCart", productId)
        .then(() => {
          console.log(`Product ${productId} removed successfully.`);
          this.calculateTotal();
        })
        .catch((error) => {
          console.error(
            `Error removing product ${productId} from cart:`,
            error
          );
        });
    },
    clearCart() {
      this.$store
        .dispatch("clearCart")
        .then(() => {
          console.log("Cart cleared.");
          return this.fetchCart();
        })
        .then(() => {
          this.calculateTotal();
        })
        .catch((error) => {
          console.error("Error clearing cart:", error);
        });
    },
    calculateTotal() {
      this.subtotal = 0;
      for (const item of this.cartItems) {
        this.subtotal += item.price * item.quantity;
      }
      this.taxAmount = this.calculateTax(this.subtotal);
      this.totalAmount = this.subtotal + this.taxAmount;
    },
    calculateTax(amount) {
      const taxRate = 0.06;
      return amount * taxRate;
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    },
  },
  created() {
    this.fetchCart()
      .then(() => {
        this.calculateTotal();
        console.log("Cart successfully pulled:", this.cart);
      })
      .catch((error) => {
        console.error("Error fetching cart", error);
      })
      .finally(() => {
        this.isLoading = false;
      });
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

.product-link {
  cursor: pointer;
  text-decoration: none;
  color: blue;
}
.product-link:hover {
  text-decoration: underline;
}
.cart-page {
  padding: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.item-details {
  display: flex;
}

.remove-icon {
  cursor: pointer;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
}

.cart-total {
  margin-top: 20px;
  font-size: 1.2em;
}

.cart-list {
  list-style-type: none;
  padding: 0;
}

.checkout-btn {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}

#spinner {
  color: green;
}

.view-icon {
  font-size: 1.2rem;
  margin-right: 7px;
  padding: 3px;
  color: #444;
  border-radius: 3px;
}

.view-icon.active {
  background-color: lightgreen;
}

.view-icon:not(.active) {
  font-size: 1.2rem;
  margin-right: 7px;
  cursor: pointer;
}

.view-icon:not(.active):hover {
  color: blue;
  background-color: rgba(255, 255, 255, 0.7);
}
</style>