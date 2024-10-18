import { createStore as _createStore } from 'vuex';
import axios from 'axios';

export function createStore(currentToken, currentUser) {
  let store = _createStore({
    state: {
      products: [],
      currentProductId: 1,
      searchQuery: '',
      cart: [],
      items: [],
      token: currentToken || '',
      user: currentUser || {},
    },
    mutations: {
      SET_CART(state, cart) {
        state.cart = cart;
      },
      SET_CURRENT_PRODUCT_ID(state, id) {
        state.currentProductId = id;
      },
      SET_PRODUCTS(state, products) {
        state.products = products;
      },
      SET_SEARCH_QUERY(state, query) {
        state.searchQuery = query;
      },
      ADD_TO_CART(state, product) {
        const item = state.cart.find(item => item.productId === product.productId);
        if (item) {
          item.quantity += 1;
        }
        else {
          state.cart.push({...product, quantity: 1});
        }
      },
      REMOVE_ITEM_FROM_CART(state, productId) {
        state.cart = state.cart.filter(item => item.productId !== productId);
      },
      SET_AUTH_TOKEN(state, token) {
        state.token = token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      },
      SET_USER(state, user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      },
      LOGOUT(state) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        state.token = '';
        state.user = {};
        axios.defaults.headers.common = {};
      }
    },
    actions: {
      fetchCart({commit}) {
        axios.get('/cart')
          .then(response => {
            commit('SET_CART', response.data);
          })
          .catch(error => {
            console.error('Error fetching cart:', error);
          });
      },
      removeFromCart({commit}, productId) {
        return axios.delete(`/cart/${productId}`)
          .then(response => {
            if (response.data === 200) {
            commit('REMOVE_ITEM_FROM_CART', productId);
            console.log(`Product ${productId} removed successfully.`);
            }
          })
          .catch(error => {
            console.error("Error removing item from cart:", error);
          });
      },
      clearCart({commit}) {
        return axios.delete('/cart')
          .then(() => {
            commit('SET_CART', []);
          })
          .catch(error => {
            console.error('Error clearing cart:', error);
          });
      }
    },
    getters: {
      cart(state) {
        return state.cart;
      }
    }

  })
  return store;
}