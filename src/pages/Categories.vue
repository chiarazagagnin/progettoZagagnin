<template>
  <div class="md-layout md-gutter titolo">
    <div class="title">
      <div class="margin">
        <h1 class="md-title">Categories</h1>
        <br>
      </div>
    </div>
    <div
      class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      v-for="category in categories"
      :key="category.id"
      @click="categoryPlaylists(category.id)"
    >
      <md-card md-with-hover>
        <md-card-media-cover md-solid>
          <md-card-media md-ratio="1:1">
            <img :src="category.icons[0].url">
          </md-card-media>
          <md-card-area>
            <md-card-header>
              <div class="md-title card-text">{{category.name}}</div>
            </md-card-header>
          </md-card-area>
        </md-card-media-cover>
      </md-card>
      <br>
    </div>
    <div class="title">
      <md-button class="md-accent md-raised" @click="loadMore()">Load more</md-button>
      <md-progress-spinner v-if="loading" :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
    </div>
  </div>
</template>

<script>
import DataService from "../dataservice";
export default {
  data: function() {
    return {
      categories: [],
      offset: 0,
      loading: false
    };
  },
  created: function() {
    DataService.getToken().then(response => {
      let newToken = response.data.access_token;
      DataService.getCategories(this.offset, newToken).then(data => {
        this.categories = data.data.categories.items;
      });
    });
  },
  methods: {
    categoryPlaylists(id) {
      this.$router.push({ path: "/category/" + id });
    },
    loadMore() {
      this.loading = true;
      this.offset += 20;
      DataService.getToken().then(response => {
        let newToken = response.data.access_token;
        DataService.getCategories(this.offset, newToken).then(data => {
          this.loading = false;
          this.categories = this.categories.concat(data.data.categories.items);
        });
      });
    }
  }
};
</script>

<style>
.title {
  width: 100%;
}
.margin {
  margin-left: 3%;
}
</style>
