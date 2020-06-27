<template>
  <div>
    <h1 class="md-title">Artist: {{name}}</h1>
    <div>
      <md-card class="artist">
        <md-card-media md-big>
          <img :src="img">
        </md-card-media>
        <md-card-actions>
          <md-button class="md-icon-button" @click="likeArtist(id)">
            <md-icon v-if="like">favorite</md-icon>
            <md-icon v-else>favorite_outline</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
    </div>
    <br>
    <div>
      <md-chip class="md-accent" v-for="genre in genres" :key="genre">{{genre}}</md-chip>
    </div>
    <br>
    <br>

    <md-list class="md-double-line">
      <span class="md-text">
        <b>Top tracks</b>
      </span>
      <br>
      <md-divider></md-divider>
      <div v-for="track in tracks" :key="track.id">
        <md-list-item @click="songInfo(track.id)">
          <div class="md-list-item-text">
            <span>{{track.name}}</span>
            <span>{{durationMinutes(track.duration_ms) }} minutes</span>
          </div>
          <md-button
            v-if="track.preview_url != null"
            onclick="event.stopPropagation()"
            class="md-icon-button md-list-button"
            @click="playAudio(track.preview_url)"
          >
            <md-icon v-if="url == track.preview_url">pause</md-icon>
            <md-icon v-else>play_arrow</md-icon>
          </md-button>
        </md-list-item>
        <md-divider></md-divider>
      </div>
      <md-divider></md-divider>
    </md-list>

    <br>
    <span class="md-text">
      <b>Top albums</b>
    </span>
    <br>
    <br>
    <div class="md-layout md-gutter">
      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="album in albums"
        :key="album.id"
        @click="albumInfo(album.id)"
      >
        <md-card md-with-hover>
          <md-card-header>
            <div class="md-title card-text">{{album.name}}</div>
          </md-card-header>
          <md-card-media md-big>
            <img :src="album.images[0].url">
          </md-card-media>
        </md-card>
        <br>
      </div>
    </div>
    <md-divider></md-divider>

    <br>
    <br>
    <span class="md-text">
      <b>Related Artists</b>
    </span>
    <br>
    <br>
    <div class="md-layout md-gutter">
      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="relate in related"
        :key="relate.id"
        @click="artistInfo(relate.id)"
      >
        <md-card md-with-hover>
          <md-card-media-cover md-solid>
            <md-card-media md-ratio="4:3">
              <img :src="relate.images[1].url">
            </md-card-media>

            <md-card-area>
              <md-card-header>
                <span class="md-title card-text">{{relate.name}}</span>
              </md-card-header>
            </md-card-area>
          </md-card-media-cover>
        </md-card>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../dataservice";
export default {
  data: function() {
    return {
      id: "",
      name: "",
      img: "",
      genres: [],
      albums: [],
      tracks: [],
      related: [],
      like: false,
      dblikes: [],
      dbdocs: [],
      play: false,
      audio: null,
      url: ""
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
      this.id = this.$route.params.id;
      DataService.getToken().then(response => {
        let newToken = response.data.access_token;
        DataService.getArtistInfo(this.id, newToken).then(data => {
          this.genres = data.data.genres;
          this.name = data.data.name;
          this.img = data.data.images[1].url;
        });
        DataService.getTopTracks(this.id, newToken).then(el => {
          this.tracks = el.data.tracks;
        });
        DataService.getArtistAlbums(this.id, newToken).then(al => {
          this.albums = al.data.items;
        });
        DataService.getRelatedArtists(this.id, newToken).then(data => {
          this.related = data.data.artists;
        });
      });
      DataService.getLikes("artist").then(data => {
        if (data.indexOf(this.id) >= 0) {
          this.like = true;
        } else {
          this.like = false;
        }
      });
    },
    albumInfo(id) {
      this.$router.push({ path: "/album/" + id });
    },
    songInfo(id) {
      this.$router.push({ path: "/track/" + id });
    },
    artistInfo(id) {
      this.$router.push({ path: "/artist/" + id });
    },
    likeArtist(id) {
      if (this.like === false) {
        DataService.setLike("artist", id);
      } else {
        DataService.getLikes("artist").then(data => {
          this.dblikes = data;
          DataService.getDocs("artist").then(data => {
            this.dbdocs = data;
            let index = this.dblikes.indexOf(id);
            let doc = this.dbdocs[index];
            DataService.removeLike("artist", doc);
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
    playAudio(url) {
      if (this.play === false) {
        this.url = url;
        this.audio = new Audio(url);
        this.audio.play();
        this.play = true;
      } else {
        this.url = "";
        this.audio.pause();
        this.play = false;
      }
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
.artist {
  max-width: 400px;
}
</style>
