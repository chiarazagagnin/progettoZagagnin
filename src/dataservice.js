import axios from "axios";
import firebase from "@firebase/app";
import "@firebase/firestore";
import qs from "qs";

const firebaseConfig = {
  apiKey: "AIzaSyC_So5d6NKc6mokkomMNUSPe-A3gwQSRKM",
  authDomain: "progetto-68f3a.firebaseapp.com",
  databaseURL: "https://progetto-68f3a.firebaseio.com",
  projectId: "progetto-68f3a",
  storageBucket: "progetto-68f3a.appspot.com",
  messagingSenderId: "1063968207746",
  appId: "1:1063968207746:web:b6efee73d5bd7b67c7559b"
};

!firebase.apps.length
  ? firebase.initializeApp(firebaseConfig).firestore()
  : firebase.app().firestore();

var db = firebase.firestore();
let user = [];
export default {
  isAuthenticated() {
    return !!localStorage.getItem("name"); // !! è uguale a true, converte il valore in booleano
  },
  login(name, surname) {
    localStorage.setItem("name", name);
    localStorage.setItem("surname", surname);
    user = [localStorage.getItem("name"), localStorage.getItem("surname")];
  },
  logout() {
    localStorage.removeItem("name");
    localStorage.removeItem("surname");
    user = [];
  },

  //SPOTIFY
  getToken() {
    const headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      auth: {
        username: "6bb54f617c0241e991ed3d929c7b7a16",
        password: "740ed28a7859407cbeb0ab30af365177"
      }
    };
    const data = {
      grant_type: "client_credentials"
    };
    return axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify(data),
      headers
    );
  },
  getNewReleases(offset, token) {
    return axios.get(
      "https://api.spotify.com/v1/browse/new-releases?offset=" + offset,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }
    );
  },
  getAlbumInfo(id, token) {
    return axios.get("https://api.spotify.com/v1/albums/" + id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
  },
  getCategories(offset, token) {
    return axios.get(
      "https://api.spotify.com/v1/browse/categories?country=IT&offset=" +
        offset,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }
    );
  },
  getCategoryPlaylists(id, token) {
    return axios.get(
      "https://api.spotify.com/v1/browse/categories/" +
        id +
        "/playlists?country=IT",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }
    );
  },
  getPlaylistInfo(id, token) {
    return axios.get("https://api.spotify.com/v1/playlists/" + id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
  },
  getArtistInfo(id, token) {
    return axios.get("https://api.spotify.com/v1/artists/" + id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
  },
  getRelatedArtists(id, token) {
    return axios.get(
      "https://api.spotify.com/v1/artists/" + id + "/related-artists",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }
    );
  },
  getTopTracks(id, token) {
    return axios.get(
      "https://api.spotify.com/v1/artists/" +
        id +
        "/top-tracks?country=IT&limit=5",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }
    );
  },
  getArtistAlbums(id, token) {
    return axios.get(
      "https://api.spotify.com/v1/artists/" + id + "/albums?limit=12",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }
    );
  },
  getSongInfo(id, token) {
    return axios.get("https://api.spotify.com/v1/tracks/" + id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
  },
  search(text, token) {
    if (!text || text.length < 2) {
      return new Promise(resolve => {
        resolve([]); //se il testo è vuoto restituiamo un array vuoto
      });
    }
    return axios
      .get(
        "https://api.spotify.com/v1/search?q=" + text + "&type=track&limit=25",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }
      )
      .then(data => {
        return data.data.tracks.items;
      });
  },
  setLike(type, id) {
    return db
      .collection(type)
      .doc()
      .set({
        id: id,
        user: user
      });
  },
  getLikes(type) {
    return db
      .collection(type)
      .where("user", "==", user)
      .get()
      .then(data => {
        return data.docs.map(doc => doc.data().id);
      });
  },
  removeLike(type, doc) {
    return db
      .collection(type)
      .doc(doc)
      .delete();
  },
  getDocs(type) {
    return db
      .collection(type)
      .where("user", "==", user)
      .get()
      .then(data => {
        return data.docs.map(doc => doc.EE.key.path.segments[6]);
      });
  },
  setPost(text, img, tags) {
    return db
      .collection("post")
      .doc()
      .set({
        text: text,
        image: img,
        user: user,
        tags: tags
      });
  },
  getPosts() {
    return db
      .collection("post")
      .where("user", "==", user)
      .get()
      .then(data => {
        return data.docs.map(doc => doc.data());
      });
  },
  getAllPosts() {
    return db
      .collection("post")
      .get()
      .then(data => {
        return data.docs.map(doc => doc.data());
      });
  },
  removePost(doc) {
    return db
      .collection("post")
      .doc(doc)
      .delete();
  }
};
