<template>
  <div>
    <form @submit="login" action="">
      <label for="email" style="color: #FFF">Email</label>
      <input id="email" type="email" v-model="email" />
      <label for="password" style="color: #FFF">Password</label>
      <input id="password" type="password" v-model="password" />
      <input type="submit" />
    </form>
  </div>
</template>
<script>
import firebase from 'firebase'
import { db } from '@/firebase'
export default {
  data () {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          this.$router.push('/')
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    }
  }
}
</script>