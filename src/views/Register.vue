<template>
<b-container id="pageRegistration">
  <!-- Logo -->
  <img id="imgLogo" class="logo" src="../../public/assets/logo.png">

  <!-- Form section -->
  <b-row id="sectionRegForm" align-h="center">
    <div class="col-7 d-flex flex-column justify-content-center">
      <!-- Error Messages -->
      <b-col id="registerError"> 
        <span v-for="err in errors" :key="err">
          <p class="d-flex flex-grow-1 error-message text-error" v-if="err">
            {{ err }}
          </p>
        </span>
      </b-col>

      <b-form @submit.prevent="register">
        <!-- First and Last Name -->
        <b-form id="firstLastName" class="d-flex justify-content-between" inline>
          <label id="labelFirstName" class="sr-only" for="firstName">First Name</label>
          <b-form-input
            id="firstName"
            class="form-input flex-grow-1"
            placeholder="First Name" 
            v-model="firstName" />


          <label id="labelLastName" class="sr-only" for="lastName">Last Name</label>
          <b-form-input
            id="lastName"
            class="form-input flex-grow-1"
            placeholder="Last Name" 
            v-model="lastName" />
        </b-form>
        
        <!-- Username -->
        <label id="labelRegUsername" class="sr-only" for="regUsername">Username</label>
        <b-input-group>
          <b-form-input 
            id="regUsername"
            class="form-input" style="margin: 8px"
            placeholder="Username" 
            v-model="username" />
        </b-input-group>

        <!-- Email -->
        <label id="labelEmail" class="sr-only" for="email">Email</label>
        <b-input-group>
          <b-form-input 
            id="email" 
            class="form-input" style="margin: 8px"
            placeholder="Email" 
            v-model="email" />
        </b-input-group>

        <!-- Passwords -->
        <b-form inline>
          <label id="labelRegPassword" class="sr-only" for="password">Password</label>
          <b-form-input
            id="password"
            class="form-input flex-grow-1"
            type="password"
            placeholder="Password" 
            v-model="password" />

          <label id="labelConfirmPassword" class="sr-only" for="confirmPass">Confirm Password</label>
          <b-form-input
            id="confirmPassword"
            class="form-input flex-grow-1"
            type="password"
            placeholder="Confirm Password" 
            v-model="confirmPassword" />
        </b-form>

        <b-button id="btnSubmit" :disabled="!areFieldsComplete" type="submit">
          Register
        </b-button>
      </b-form>
    </div>
  </b-row>

  <!-- Already logged in? -->
  <b-row id="sectionRouteLogin" align-h="center">
    <h5 id="textAccountExists" class="text-grey">Already have an account?</h5>
    <router-link to="/login" class="routerLink">
      <h5 id="linkLogin" class="text-white">Login here</h5>
    </router-link>
  </b-row>
</b-container>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase'
import errorMessages from  '@/resources/errorMessages'

export default {
  name: 'Register',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',

      errorTitle: null,
      errors: {
        name: null,
        username: null,
        password: null,
        confirmPassword: null,
        usernameExists: null,
        emailExists: null
      }
    }
  },
  
  computed: {
    isValidUsername () {
      return this.username.length >= 8 && 
            this.username.length <= 20 &&
            /^[a-z0-9]+$/i.test(this.username)
    },

    isValidEmail () {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return this.email.length > 0 && 
             re.test(String(this.email).toLowerCase());
    },

    isValidPassword () {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\*\.\!\@\$\%\^\&\(\)\{\}\[\]\:\;\<\>\,\.\?\/\~\_\+\-\=\|])(?=.{8,})/
      return re.test(this.password) 
    },

    arePasswordsEqual () {
      return this.password === this.confirmPassword
    },

    areFieldsComplete () {
      return this.firstName !== '' &&
            this.lastName !== '' &&
            this.username !== '' &&
            this.email !== '' &&
            this.password !== '' &&
            this.confirmPassword !== ''
    },

    isValidRegistration () {
      return this.isValidName(this.firstName) && 
            this.isValidName(this.lastName) &&
            this.isValidUsername && 
            this.isValidEmail &&
            this.isValidPassword && 
            this.arePasswordsEqual
    }
  },

  methods: {
    isValidName (name) {
      return /^[a-zA-Z_]+( [a-zA-Z_]+)*$/i.test(name)
    },

    clearErrors () {
      this.errors = {
        firstName: null,
        lastName: null,
        username: null,
        password: null,
        confirmPassword: null,
        usernameExists: null,
        emailExists: null
      }
    },

    async register () {
      if (this.isValidRegistration) {
        console.log('Registering')
        this.handleDBUserRegistration()
      } else {
        console.log('Invalid fields')
        this.clearErrors()
        this.handleInvalidFields()
      }
    },

    handleDBUserRegistration () {
      // Search for the username in the db
      db.collection('users')
        .where('username', '==', this.username)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {  // If no records have been found with that username
            firebase  
              .auth()
              .createUserWithEmailAndPassword(this.email, this.password)
              .then(res => {
                const newUserRef = db.collection('users').doc(res.user.uid)
                
                // Add the user to the database
                newUserRef.set({
                  first_name: this.firstName,
                  last_name: this.lastName,
                  username: this.username,
                  email: this.email.toLowerCase(),
                  points: 0,
                  loss_white: 0,
                  loss_black: 0,
                  wins_white: 0,
                  wins_black: 0,
                  draw_white: 0,
                  draw_black: 0
                })

                this.$router.push('/')
              })
              .catch(error => {
                // Handle duplicate emails
                if (error.code === 'auth/email-already-in-use') {
                  console.log('Email already in use')
                  this.clearErrors()
                  this.errors.emailExists = errorMessages.register.EMAIL_EXISTS
                } 
                console.log(error)
              })
          } else { // That username is in use
            console.log('Username already in use')
            this.clearErrors()
            this.errors.usernameExists = errorMessages.register.USERNAME_EXISTS
          }
        })
        .catch(e => console.log(e))
    },

    handleInvalidFields () {
      if (!this.isValidName(this.firstName) || !this.isValidName(this.lastName)) {
        this.errors.name = errorMessages.register.NAME
      } 
      
      if (!this.isValidUsername) {
        this.errors.username = errorMessages.register.USERNAME
      } 

      if (!this.isValidEmail) {
        this.errors.email = errorMessages.register.EMAIL
      } 

      if (!this.arePasswordsEqual) {
        this.errors.confirmPassword = errorMessages.register.CONFIRM_PASSWORD
        return
      } else if (!this.isValidPassword) {
        this.errors.password = errorMessages.register.PASSWORD
      } 
    }
  }
}
</script>

<style scoped>
* {
  font-family: 'Raleway';
}


.error-message {
  text-align: left;
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

.logo {
  width: 50%; 
  margin: 3rem
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

#textAccountExists {
  color: #969696
}

#linkLogin {
  margin-left: 10px;
}

.routerLink {
  text-decoration: none;
  border-bottom: 0
}
</style>
