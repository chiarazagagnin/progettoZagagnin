<template >
  <div id="app" class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <div class="md-toolbar-section-start">
          <md-button
            v-if="authenticated && !menuVisible && mobile"
            class="md-icon-button"
            @click="toggleMenu"
          >
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">SoundsGreat</span>
          <div class="md-toolbar-section-end">
            <md-autocomplete
              v-if="authenticated"
              class="searchbar md-layout-item md-size-60 md-medium-size-50 md-small-size-50 md-xsmall-size-40"
              md-layout="box"
              v-model="selectedItem"
              :md-options="searchOptions"
              @md-changed="searchItem"
              @md-selected="select"
            >
              <label>Search</label>
            </md-autocomplete>
            <md-menu md-direction="bottom-start">
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon>more_vert</md-icon>
              </md-button>

              <md-menu-content>
                <md-menu-item @click="logout()">Logout</md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
        </div>
      </md-app-toolbar>
      <md-app-drawer v-if="authenticated" :md-active.sync="menuVisible" md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          <md-subheader>Explore</md-subheader>

          <div class="md-toolbar-section-end">
            <md-button v-if="mobile" class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>
          <md-list-item :to="'/#'">
            <md-icon>trending_up</md-icon>
            <span class="md-list-item-text">New releases</span>
          </md-list-item>
          <md-list-item :to="'/categories'">
            <md-icon>receipt</md-icon>
            <span class="md-list-item-text">Categories</span>
          </md-list-item>
          <br>
          <div>
            <md-divider></md-divider>
          </div>
          <md-toolbar class="md-transparent" md-elevation="0">
            <md-subheader>Favorites</md-subheader>
          </md-toolbar>
          <md-list-item :to="'/favorites/track'">
            <md-icon>audiotrack</md-icon>
            <span class="md-list-item-text">Tracks</span>
          </md-list-item>
          <md-list-item :to="'/favorites/album'">
            <md-icon>album</md-icon>
            <span class="md-list-item-text">Albums</span>
          </md-list-item>
          <md-list-item :to="'/favorites/artist'">
            <md-icon>supervisor_account</md-icon>
            <span class="md-list-item-text">Artists</span>
          </md-list-item>
          <md-list-item :to="'/favorites/playlist'">
            <md-icon>playlist_play</md-icon>
            <span class="md-list-item-text">Playlist</span>
          </md-list-item>
          <br>
          <md-divider></md-divider>

          <md-toolbar class="md-transparent" md-elevation="0">
            <md-subheader>User</md-subheader>
          </md-toolbar>

          <md-list-item :to="'/user'">
            <md-icon>person</md-icon>
            <span class="md-list-item-text">Profile</span>
          </md-list-item>
          <md-list-item :to="'/social'">
            <md-icon>forum</md-icon>
            <span class="md-list-item-text">Community</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script type="text/javascript">
import DataService from "./dataservice";
export default {
  name: "App",
  components: {},
  data: function() {
    return {
      authenticated: DataService.isAuthenticated(),
      menuVisible: false,
      selectedItem: null,
      searchOptions: [],
      searchIds: [],
      mobile: false,
      web: null,
      windowWidth: window.innerWidth
    };
  },
  watch: {
    $route: function() {
      this.authenticated = DataService.isAuthenticated();
    }
  },
  created: function() {
    if (window.innerWidth > 600) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    searchItem: function(term) {
      DataService.getToken().then(response => {
        let newToken = response.data.access_token;
        DataService.search(term, newToken).then(data => {
          this.searchOptions = data.map(
            element => element.name + " - " + element.artists[0].name
          );
          this.searchIds = data.map(element => element.id);
        });
      });
    },
    select: function(selected) {
      let indexId = this.searchOptions.indexOf(selected);
      let trackId = this.searchIds[indexId];
      this.$router.push({ path: "/track/" + trackId });
    },
    logout() {
      DataService.logout();
      this.$router.push({ path: "/login" });
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth > 600) {
        this.mobile = false;
      } else {
        this.mobile = true;
      }
    });
  }
};
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme(
  "default",
  (
    primary: #000000,
    // The primary color of your application
      accent: #ba6b6c // The accent or secondary color
  )
);

@import "~vue-material/dist/theme/all"; // Apply the theme
.md-app {
  height: 100vh;
  border: 1px solid rgba(#000, 0.12);
}
.page-container {
  height: 100%;
}
.md-drawer {
  width: 250px;
  max-width: calc(100vw - 125px);
}
.searchbar {
  max-width: 200px;
}
</style>
