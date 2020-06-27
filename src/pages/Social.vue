<template>
  <div class="md-layout md-gutter">
    <div
      class="md-layout-item md-size-33 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      v-for="post in posts"
      :key="post.id"
    >
      <md-card>
        <md-card-header>
          <div class="md-title card-text">{{post.user[0]}} {{post.user[1]}}</div>
          <br>
          <div>
            <md-chip class="md-accent" v-for="tag in post.tags" :key="tag">{{tag}}</md-chip>
          </div>
          <br>
          <div class="md-subhead">{{post.text}}</div>
          <br>
        </md-card-header>
        <md-card-media>
          <div class="post">
            <img style="height:150px" :src="post.image">
          </div>
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
      posts: []
    };
  },
  created: function() {
    DataService.getAllPosts().then(data => {
      this.posts = data;
    });
  },
  methods: {}
};
</script>

<style>
.dialog {
  margin: 3%;
}
.inputImg button {
  color: grey;
}
img {
  width: 200px;
  height: 100px;
}
</style>
