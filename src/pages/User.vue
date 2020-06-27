<template>
  <div class="md-layout md-gutter">
    <md-dialog :md-active.sync="active" class="dialog">
      <md-dialog-title>New post</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>Add text</label>
          <md-input v-model="text"></md-input>
        </md-field>
        <md-chips class="md-accent" v-model="tags" md-placeholder="Add tags"></md-chips>
        <md-field>
          <label>Add image url</label>
          <md-input v-model="image"></md-input>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="active = false">Close</md-button>
        <md-button class="md-primary" @click="active = false, addPost()">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-empty-state v-if="posts == 0" md-rounded md-icon="post_add" md-label="No posts found">
      <br>
      <md-button class="md-raised md-primary" @click="active = true">Add post</md-button>
    </md-empty-state>
    <div v-if="posts != 0">
      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="post in posts"
        :key="post.id"
      >
        <!--nei methods devi farne uno che cambia a seconda del type -->
        <md-card>
          <md-card-header>
            <div class="md-title card-text">{{post.text}}</div>

            <br>
            <div>
              <md-chip class="md-accent" v-for="tag in post.tags" :key="tag">{{tag}}</md-chip>
            </div>
            <br>
          </md-card-header>
          <md-card-media>
            <img style="height:150px" :src="post.image">
          </md-card-media>
          <md-card-actions>
            <md-button class="md-icon-button" @click="active2=true">
              <md-icon>delete</md-icon>
            </md-button>
          </md-card-actions>
        </md-card>
        <md-dialog-confirm
          :md-active.sync="active2"
          md-title="Are you sure you want to delete this post?"
          md-confirm-text="Confirm"
          md-cancel-text="Cancel"
          @md-cancel="active2=false"
          @md-confirm="deletePost(post)"
        />
        <br>
      </div>

      <md-button class="md-fab md-fab-bottom-right md-primary" @click="active=true">
        <md-icon>add</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import DataService from "../dataservice";
export default {
  data: function() {
    return {
      text: "",
      active: false,
      tags: [],
      image: "",
      posts: [],
      active2: false
    };
  },
  created: function() {
    this.load();
  },
  methods: {
    load() {
      DataService.getPosts().then(data => {
        this.posts = data;
      });
    },
    addPost() {
      DataService.setPost(this.text, this.image, this.tags);
      this.load();
    },
    deletePost(docum) {
      DataService.getPosts().then(data => {
        DataService.getDocs("post").then(data => {
          this.dbdocs = data;
          let index = this.posts.indexOf(docum);
          let doc = this.dbdocs[index];
          DataService.removePost(doc);
          this.load();
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.md-dialog /deep/.md-dialog-container {
  width: 768px;
  margin: 4%;
}
.inputImg button {
  color: grey;
}
</style>
