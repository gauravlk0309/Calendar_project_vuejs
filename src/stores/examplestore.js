import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
    username: "ftintern",
    password: "w1tchP@ssw0rd",
    loggedIn: false,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
    loginUser () {
      console.log("user logged in")
      this.loggedIn = true
    },
    logoutUser () {
      this.loggedIn = false
    }
  },
});
