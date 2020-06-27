<template>
  <div class="md-layout md-gutter">
    <div class="title">
      <div class="margin">
        <h1 class="md-title">New Releases</h1>
        <br>
      </div>
    </div>
    <br>
    <div
      class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      v-for="album in albums"
      :key="album.id"
      @click="albumInfo(album.id)"
    >
      <md-card md-with-hover>
        <md-card-header>
          <div class="md-title card-text">{{album.name}}</div>
          <div class="md-subhead">{{album.artists[0].name}}</div>
        </md-card-header>
        <md-card-media md-big>
          <img :src="album.images[0].url">
        </md-card-media>

        <md-card-actions>
          <md-button
            class="md-icon-button"
            :to="'/artist/' + album.artists[0].id"
            onclick="event.stopPropagation()"
          >
            <md-icon>person_search</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
      <br>
    </div>
    <md-button class="md-accent md-raised" @click="loadMore()">Load more</md-button>
    <md-progress-spinner v-if="loading" :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
  </div>
</template>

<script>
import DataService from "../dataservice";

export default {
  data: function() {
    return {
      user: [localStorage.getItem("name"), localStorage.getItem("surname")],
      albums: [],
      offset: 0,
      loading: false
    };
  },
  created: function() {
    DataService.getToken().then(response => {
      let newToken = response.data.access_token;
      DataService.getNewReleases(this.offset, newToken).then(data => {
        this.albums = data.data.albums.items;
      });
    });
  },
  methods: {
    albumInfo(id) {
      this.$router.push({ path: "/album/" + id });
    },
    loadMore() {
      this.loading = true;
      this.offset += 20;
      DataService.getToken().then(response => {
        let newToken = response.data.access_token;
        DataService.getNewReleases(this.offset, newToken).then(data => {
          this.albums = this.albums.concat(data.data.albums.items);
          this.loading = false;
        });
      });
    },
    likeAlbum(id) {
      DataService.setLike("album", id);
    }
  }
};
</script>

<style>
.card-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title {
  width: 100%;
}
.margin {
  margin-left: 3%;
}
</style>