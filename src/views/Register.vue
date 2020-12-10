<template>
<div id="registration" class="container">
<div class="col-8">
  <h1 id="titleRegister" class="text-white">Register</h1>
  <b-form @submit.prevent="register">
    <!-- First and Last Name -->
    <b-form inline>
      <label class="sr-only" for="firstName">First Name</label>
      <b-form-input
        id="firstName"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="First Name" 
        v-model="firstName" />

      <label class="sr-only" for="lastName">Last Name</label>
      <b-form-input
        id="lastName"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="Last Name" 
        v-model="lastName" />
    </b-form>
    
    <!-- Username -->
    <label class="sr-only" for="username">Username</label>
    <b-input-group prepend="@" class="mb-2 mr-sm-2 mb-sm-0">
      <b-form-input 
        id="inline-form-input-username" 
        placeholder="Username" 
        v-model="username" />
    </b-input-group>

    <!-- Email -->
    <label class="sr-only" for="email">Email</label>
    <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
      <b-form-input 
        id="inline-form-input-username" 
        placeholder="Email" 
        v-model="email" />
    </b-input-group>

    <!-- Passwords -->
    <b-form inline>
      <label class="sr-only" for="password">Password</label>
      <b-form-input
        id="password"
        class="mb-2 mr-sm-2 mb-sm-0"
        type="password"
        placeholder="Password" 
        v-model="password" />

      <label class="sr-only" for="confirmPass">Confirm Password</label>
      <b-form-input
        id="lastName"
        class="mb-2 mr-sm-2 mb-sm-0"
        type="password"
        placeholder="Confirm Password" 
        v-model="confirmPassword" />
    </b-form>

    <b-button variant="primary" type="submit">Register</b-button>
  </b-form>
</div>
</div>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase'

export default {
  name: 'Register',
  data() {
    return {
      firstName: 'Prinz',
      lastName: 'Eugen',
      username: 'prnz_eugn',
      email: 'prnz_eugen@gmail.com',
      password: 'p@ssworD1',
      confirmPassword: 'p@ssworD1'
    }
  },
  
  computed: {
    isValidUsername () {
      return /^[a-z0-9]+$/i.test(this.username)
    },

    isValidEmail () {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return this.email.length > 0 && re.test(String(this.email).toLowerCase());
    },

    isValidPassword () {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      return re.test(this.password) 
    },

    arePasswordsEqual () {
      return this.password === this.confirmPassword
    }
  },

  methods: {
    isValidName (name) {
      return /^[a-z]+$/i.test(name)
    },

    isValidRegistration () {
      return this.isValidName(this.firstName) && 
            this.isValidName(this.lastName) &&
            this.isValidEmail &&
            this.isValidPassword && 
            this.arePasswordsEqual
    },

    async register () {
      if (this.isValidRegistration()) {
        console.log('Registering')
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            // Fetch the users doc
            const userRef = db.collection('users').doc(user.user.uid)
            userRef.set({
              first_name: this.firstName,
              last_name: this.lastName,
              username: this.username,
              points: 0,
              loss_white: 0,
              loss_black: 0,
              wins_white: 0,
              wins_black: 0,
              draw_white: 0,
              draw_black: 0
            })
          })
          .catch((error) => {
            console.log('Error')
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error)
          });
      }
    }
  }
}
</script>

<style scoped>
.text-white {
  color: #FFFFFF
}
</style>
