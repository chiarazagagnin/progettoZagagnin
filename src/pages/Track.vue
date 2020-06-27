<template>
  <div >
    <div class="title">
      <div class="margin">
        <h1 class="md-title">Track: {{name}}</h1>
        <br>
      </div>
    </div>
    <md-card class="pic">
      <md-card-media-cover md-solid>
        <md-card-media md-ratio="1:1">
          <img :src="imgsrc">
        </md-card-media>
        <md-card-area>
          <md-card-actions>
            <md-button class="md-icon-button" @click="likeTrack(trackId)">
              <md-icon v-if="like">favorite</md-icon>
              <md-icon v-else>favorite_outline</md-icon>
            </md-button>
            <md-button v-if="exists" class="md-icon-button" @click="toggleAudio()">
              <md-icon v-if="play">pause</md-icon>
              <md-icon v-else>play_arrow</md-icon>
            </md-button>
          </md-card-actions>
        </md-card-area>
      </md-card-media-cover>
    </md-card>
    <br>
    <md-list>
      <md-list-item>
        <span>
          Artist:
          <b>{{artist.name}}</b>
        </span>
        <md-button
          class="md-icon-button"
          :to="'/artist/' + artist.id"
          onclick="event.stopPropagation()"
        >
          <md-icon>person_search</md-icon>
        </md-button>
      </md-list-item>
      <md-divider></md-divider>
      <md-list-item>
        <span>
          Album:
          <b>{{album.name}}</b>
        </span>
        <md-button
          class="md-icon-button"
          :to="'/album/' + album.id"
          onclick="event.stopPropagation()"
        >
          <md-icon>album</md-icon>
        </md-button>
      </md-list-item>

      <md-divider></md-divider>
      <md-list-item>
        <span>
          Duration:
          <b>{{durationMinutes(duration)}}</b>
        </span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import DataService from "../dataservice";
export default {
  data: function() {
    return {
      trackId: "",
      name: "",
      artist: [],
      album: [],
      duration: 0,
      imgsrc: "",
      audiosrc: "",
      like: false,
      dblikes: [],
      dbdocs: [],
      play: false,
      audio: null,
      exists: false
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
      this.audiosrc = "";
      this.audio = null;
      this.exists = false;
      this.trackId = this.$route.params.id;
      DataService.getToken().then(response => {
        let newToken = response.data.access_token;
        DataService.getSongInfo(this.trackId, newToken).then(data => {
          this.name = data.data.name;
          this.artist = data.data.artists[0];
          this.album = data.data.album;
          this.duration = data.data.duration_ms;
          this.imgsrc = data.data.album.images[1].url;
          this.audiosrc = data.data.preview_url;
          if (this.audiosrc != null) {
            this.audio = new Audio(this.audiosrc);
            this.exists = true;
          }
        });
      });
      DataService.getLikes("track").then(data => {
        if (data.indexOf(this.trackId) >= 0) {
          this.like = true;
        } else {
          this.like = false;
        }
      });
    },
    likeTrack(id) {
      if (this.like === false) {
        DataService.setLike("track", id);
      } else {
        DataService.getLikes("track").then(data => {
          this.dblikes = data;
          DataService.getDocs("track").then(data => {
            this.dbdocs = data;
            let index = this.dblikes.indexOf(id);
            let doc = this.dbdocs[index];
            DataService.removeLike("track", doc);
          });
        });
      }
      this.like = !this.like;
    },
    durationMinutes(duration) {
      let value = "";
      if (parseInt((duration / 1000) % 60, 10) <= 9) {
        value =
          parseInt((duration / (1000 * 60)) % 60, 10) +
          ":0" +
          parseInt((duration / 1000) % 60, 10);
      } else {
        value =
          parseInt((duration / (1000 * 60)) % 60, 10) +
          ":" +
          parseInt((duration / 1000) % 60, 10);
      }
      return value;
    },
    toggleAudio() {
      if (this.audio.paused && this.play === false) {
        this.audio.play();
        this.play = true;
      } else {
        this.audio.pause();
        this.play = false;
      }
    }
  }
};
</script>

<style>
audio {
  min-width: 400px;
  height: auto;
  object-fit: inherit;
}
.pic {
  max-width: 300px;
}
.title {
  width: 100%;
}
</style>
