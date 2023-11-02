<template>
  <q-layout view="lHh Lpr lFf">
    <q-header flat class="tabColor">
      <q-toolbar justify-between style="min-height: 60px">
        <q-btn
          icon="img:statics/icons/Hub_36x36.png"
          class=""
          outline
          style="color: #fff"
          label="Utility Hub"
          @click="redirect()"
        />
        <q-toolbar-title></q-toolbar-title>
        <q-space />
        <span v-if="loggedIn"
          ><q-btn-dropdown
            color="secondary"
            icon="settings"
            content-class="buttonStyle"
          >
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-xs">Settings</div>
                <q-btn
                  label="Change Password"
                  size="sm"
                  outline
                  class="full-width q-mb-sm"
                />
                <q-btn
                  label="Logout"
                  @click="logout"
                  size="sm"
                  color="primary"
                  class="full-width"
                />
              </div>

              <q-separator vertical inset class="q-mx-md" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="statics/avatarImage.png" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">
                  @{{ counterStore.username }}
                </div>
              </div>
            </div>
          </q-btn-dropdown>
        </span>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="fixed-bottom">
      <footer-bar></footer-bar>
    </q-footer>
  </q-layout>
</template>

<script>
import FooterBar from "./FooterBar.vue";
import { openURL } from "quasar";
import { useCounterStore } from "src/stores/examplestore.js";
const counterStore = useCounterStore();
export default {
  name: "AppLayout",
  components: {
    FooterBar,
  },
  data() {
    return {
      counterStore,
    };
  },
  computed: {
    loggedIn: function () {
      return this.counterStore.loggedIn;
    },
  },
  methods: {
    openURL,
    logout: function () {
      this.counterStore.logoutUser();
      this.$router.push("/login");
    },
    redirect: function () {
      if (this.counterStore.loggedIn == true) {
        this.$router.push("/theHub").catch((error) => {
          if (error.name != "NavigationDuplicated") {
            throw error;
          }
        });
      }
    },
  },
  mounted() {},
};
</script>
<style>
.buttonStyle {
  z-index: 8000;
}
</style>
