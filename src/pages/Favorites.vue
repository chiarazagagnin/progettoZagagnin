<template>
  <div class="md-layout md-gutter">
    <md-empty-state v-if="likes == 0" md-rounded md-icon="favorite" md-label="No items found">
      <br>
      <md-button class="md-raised md-primary" :to="'/'">Explore</md-button>
    </md-empty-state>
    <div class="title">
      <div class="margin" v-if="likes != 0">
        <h1 class="md-title">Favorite {{type}}s</h1>
        <br>
      </div>
    </div>
    <br>
    <div
      class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      v-for="like in likes"
      :key="like.id"
      @click="getInfos(like.id)"
    >
      <!--nei methods devi farne uno che cambia a seconda del type -->
      <md-card md-with-hover>
        <md-card-header>
          <div class="md-title card-text">{{like.name}}</div>
          <div v-if="type == 'album'" class="md-subhead">{{like.artists[0].name}}</div>
          <div v-if="type == 'track'" class="md-subhead">{{like.album.artists[0].name}}</div>
        </md-card-header>
        <md-card-media md-big>
          <img v-if="type == 'album'" :src="like.images[0].url">
          <img v-if="type == 'playlist'" :src="like.images[0].url">
          <img v-if="type == 'track'" :src="like.album.images[0].url">
          <img v-if="type == 'artist'" :src="like.images[0].url">
        </md-card-media>
      </md-card>
      <br>
    </div>
  </div>
</template>

<script>
import DataService from "../dataservice";
export default {
  data: function() {
    return {
      type: "",
      ids: [],
      likes: []
    };
  },
  watch: {
    $route: function() {
      this.load();
    }
  },
  created: function() {
    this.load();
  },
  methods: {
    load() {
      this.type = this.$route.params.name;
      this.likes = [];
      DataService.getLikes(this.type).then(data => {
        this.ids = data;
        DataService.getToken().then(response => {
          let newToken = response.data.access_token;
          if (this.type === "album") {
            this.ids.forEach(element =>
              DataService.getAlbumInfo(element, newToken).then(data => {
                this.likes.push(data.data);
              })
            );
          } else if (this.type === "track") {
            this.ids.forEach(element =>
              DataService.getSongInfo(element, newToken).then(data => {
                this.likes.push(data.data);
              })
            );
          } else if (this.type === "playlist") {
            this.ids.forEach(element =>
              DataService.getPlaylistInfo(element, newToken).then(data => {
                this.likes.push(data.data);
              })
            );
          } else if (this.type === "artist") {
            this.ids.forEach(element =>
              DataService.getArtistInfo(element, newToken).then(data => {
                this.likes.push(data.data);
              })
            );
          }
        });
      });
    },
    getInfos(id) {
      this.$router.push({ path: "/" + this.type + "/" + id });
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
