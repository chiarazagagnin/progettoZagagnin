import Vue from "vue";
import App from "./App.vue";
import VueMaterial from "vue-material";
import VueRouter from "vue-router";

import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/black-green-light.css";

import DataService from "./dataservice";
import Login from "./pages/Login";
import NewReleases from "./pages/NewReleases";
import Artist from "./pages/Artist";
import Album from "./pages/Album";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Playlist from "./pages/Playlist";
import Track from "./pages/Track";
import Favorites from "./pages/Favorites";
import User from "./pages/User";
import Social from "./pages/Social";

Vue.use(VueMaterial);
Vue.use(VueRouter);

Vue.config.productionTip = false;

const router = new VueRouter({
  mode: "history",
  routes: [
    { name: "Login", path: "/login", component: Login },
    { name: "NewReleases", path: "/", component: NewReleases },
    { name: "Artist", path: "/artist/:id", component: Artist },
    { name: "Album", path: "/album/:id", component: Album },
    { name: "Categories", path: "/categories", component: Categories },
    { name: "Category", path: "/category/:id", component: Category },
    { name: "Playlist", path: "/playlist/:id", component: Playlist },
    { name: "Track", path: "/track/:id", component: Track },
    { name: "Favorites", path: "/favorites/:name", component: Favorites },
    { name: "User", path: "/user", component: User },
    { name: "Social", path: "/social", component: Social }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.name !== "Login" && !DataService.isAuthenticated()) {
    next({ name: "Login" });
  } else {
    next();
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
