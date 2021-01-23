<template>
<b-container id="pageLogin">
  <!-- Logo -->
  <img id="imgLogo" class="logo" src="../../public/assets/logo.png">

  <!-- Form section -->
  <b-row id="sectionLoginForm" align-h="center">
    <div class="col-4 d-flex flex-column justify-content-center">
      <b-col id="loginErrorMessages">
        <span v-for="err in errors" :key="err">
          <p id="errFirstName" class="d-flex flex-grow-1 error-message text-error" v-if="err">
            {{ err }}
          </p>
        </span>
      </b-col>

      <b-form @submit.prevent="login">
        <!-- Username -->
        <label id="labelLoginUsername" class="sr-only" for="username">Username</label>
        <b-input-group>
          <b-form-input 
            id="loginUsername"
            class="form-input" style="margin: 8px"
            placeholder="username" 
            v-model="username" />
        </b-input-group>

        <!-- Email -->
        <label id="labelLoginPassword" class="sr-only" for="loginPassword">Password</label>
        <b-input-group>
          <b-form-input 
            id="loginPassword" 
            type="password"
            class="form-input" style="margin: 8px"
            placeholder="password" 
            v-model="password" />
        </b-input-group>

        <b-button id="btnSubmit" :disabled="!areFieldsComplete" type="submit">
          Log In
        </b-button>
      </b-form>
    </div>
  </b-row>

  <!-- Already logged in? -->
  <b-row id="sectionRouteLogin" align-h="center">
    <h5 id="textNoAccount" class="text-grey">Don't have an account?</h5>
    <router-link to="/register" class="routerLink">
      <h5 id="linkRegister" class="text-white">Register now</h5>
    </router-link>
  </b-row>
  <b-row id="sectionMakeAnAcct" align-h="center">
    <h5 id="textMakeAnAccount" class="text-grey">
      Make an account to access <br> our website’s exclusive features!
    </h5>
  </b-row>
</b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase from 'firebase'
import { db } from '@/firebase'
import errorMessages from  '@/resources/errorMessages'

export default {
  data () {
    return {
      username: '',
      password: '',
      errors: {
        usernameDoesNotExist: null,
        invalidPassword: null
      }
    }
  },

  computed: {
    ...mapGetters({
      currentGameID: 'getCurrentGame'
    }),

    areFieldsComplete () {
      return this.username !== '' && this.password !== ''
    }
  },

  methods: {
    clearErrors () {
      this.errors = {
        usernameDoesNotExist: null,
        invalidPassword: null
      }
    },

    async login() {
      // Check if the username does not exist in db
      db.collection('users')
        .where('username', '==', this.username)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) { // The username doesn't exist
            this.clearErrors()
            this.errors.usernameDoesNotExist = errorMessages.login.USERNAME
          } else {
            // Retrieve user email from uid from username
            const email = querySnapshot.docs[0].data().email
            firebase
              .auth()
              .signInWithEmailAndPassword(email, this.password)
              .then(user => {
                // Proceed to the main page
                if (this.currentGameID === '') {
                  this.$router.push('/')
                } else {
                  // If coming from a private room link invite
                  const privateRoomLink = `/room/${this.currentGameID}`
                  console.log(privateRoomLink)
                  this.$router.push(privateRoomLink)
                }
              })
              .catch(error => {
                if (error.code === 'auth/wrong-password') {
                  this.clearErrors()
                  this.errors.invalidPassword = errorMessages.login.PASSWORD
                }
              })
          }
        })

    }
  }
}
</script>

<style scoped>
* {
  font-family: 'Raleway';
}

.error-message {
  margin: 0.5rem 0.5rem;
}

.form-input {
  height: 50px;
  margin: 0.5rem 0.5rem;
  border: none;
  border-radius: 0;
  background-color: #c4c4c4
}

.form-input:focus {
  background-color: #C4C4C4
}

.error-message {
  margin: 0.5rem 0.5rem;
}

.logo {
  width: 50%; 
  margin: 3rem
}

.margin-8 {
  margin: 8px
}

.text-error {
  color: #F5545F
}

.text-white {
  color: #FFFFFF
}

.text-grey {
  color: #969696
}

#btnSubmit { 
  margin: 2.5rem;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 2.125rem;
  font-weight: 700;
}

#textNoAccount {
  color: #969696
}

#linkRegister {
  margin-left: 10px;
}

.routerLink {
  text-decoration: none;
  border-bottom: 0
}
</style>