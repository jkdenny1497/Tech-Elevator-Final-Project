<template>
  <div id="cart-app">
    <header>
      <img src="https://via.placeholder.com/700x200.jpg" alt="SSGeek Logo" />
    </header>

    <nav>
      <div class="nav-left">
        <router-link v-bind:to="{ name: 'products' }">
          <button>Home</button>
        </router-link>

        <router-link v-bind:to="{ name: 'cart' }">
          <button>
            <i class="fa fa-shopping-cart" aria-hidden="true"></i>Cart ({{
              cartItemCount
            }})
          </button>
        </router-link>
      </div>

      <div v-if="message" @click="clearMessage" class="cart-message">
        {{ message }}
      </div>

      <div class="nav-right">
        <div class="search-container">
          <i class="fas fa-search"></i>
          <input
            type="text"
            id="search"
            placeholder="Search for products..."
            v-model="searchQuery"
          />
        </div>

        <router-link v-bind:to="{ name: 'logout' }" v-if="$store.state.token">
          <button>Logout</button>
        </router-link>
        <router-link v-bind:to="{ name: 'login' }" v-else>
          <button>Login</button>
        </router-link>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
    <footer>&copy; 2024 Solar System Geek E-Commerce</footer>
  </div>
</template>

<script>
import ProductList from "./components/ProductList.vue";
import { mapGetters } from "vuex";
import CartView from "./views/CartView.vue";

export default {
  name: "App",

  computed: {
    searchQuery: {
      get() {
        return this.$store.state.searchQuery;
      },
      set(value) {
        this.$store.commit("SET_SEARCH_QUERY", value);
      },
    },
    message() {
      return this.$store.state.message;
    },

    ...mapGetters(["cart"]),
    cartItemCount() {
      let total = 0;
      for (const item of this.cart) {
        total += item.quantity;
      }
      return total;
    },
  },
  methods: {
    clearMessage() {
      this.$store.dispatch("clearMessage");
    },
  },
};
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  background-color: #fff;
  padding: 20px 0;
  z-index: 1;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 220px;
  width: 100%;
  background-color: #f0f0f0;
  padding: 10px;
  z-index: 2;
}

.nav-left {
  display: flex;
  gap: 15px;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

nav a {
  text-decoration: none;
  margin: 0 15px;
  color: #000;
}

main {
  grid-area: main;
  background-color: #f0f0f0;
  overflow: auto;
  margin-top: 300px;
}
.cart-message {
  display: block;
  position: fixed;
  top: 220px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  margin: 10px 0;
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 3;
  width: auto;
}
</style>