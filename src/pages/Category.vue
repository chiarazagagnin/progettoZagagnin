<template>
  <div class="md-layout md-gutter">
    <div class="title">
      <div class="margin">
        <h1 class="md-title">Category: {{categoryId}}</h1>
        <br>
      </div>
    </div>
    <br>
    <div
      class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      v-for="playlist in playlists"
      :key="playlist.id"
      @click="playlistInfo(playlist.id)"
    >
      <md-card md-with-hover>
        <md-card-area>
          <md-card-media>
            <img :src="playlist.images[0].url">
          </md-card-media>

          <md-card-header>
            <div class="md-title card-text">{{playlist.name}}</div>
            <div class="md-subhead card-text">{{playlist.description}}</div>
          </md-card-header>
        </md-card-area>
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
      categoryId: this.$route.params.id,
      playlists: []
    };
  },
  created: function() {
    DataService.getToken().then(response => {
      let newToken = response.data.access_token;
      DataService.getCategoryPlaylists(this.categoryId, newToken).then(data => {
        this.playlists = data.data.playlists.items;
      });
    });
  },
  methods: {
    playlistInfo(id) {
      this.$router.push({ path: "/playlist/" + id });
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
