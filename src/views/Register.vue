<template>
<b-container id="pageRegistration">
  <img id="imgLogo" class="logo" src="../../public/assets/logo.png">
  <b-row id="sectionForm" align-h="center">
    <div class="col-7 d-flex flex-column justify-content-center">
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
        <label id="labelUsername" class="sr-only" for="username">Username</label>
        <b-input-group>
          <b-form-input 
            id="username"
            class="form-input" style="margin: 8px"
            placeholder="Username" 
            v-model="username" />
        </b-input-group>

        <!-- Email -->
        <label id="labelEmail" class="sr-only" for="email">Email</label>
        <b-input-group>
          <b-form-input 
            id="username" 
            class="form-input" style="margin: 8px"
            placeholder="Email" 
            v-model="email" />
        </b-input-group>

        <!-- Passwords -->
        <b-form inline>
          <label class="sr-only" for="password">Password</label>
          <b-form-input
            id="password"
            class="form-input flex-grow-1"
            type="password"
            placeholder="Password" 
            v-model="password" />

          <label class="sr-only" for="confirmPass">Confirm Password</label>
          <b-form-input
            id="lastName"
            class="form-input flex-grow-1"
            type="password"
            placeholder="Confirm Password" 
            v-model="confirmPassword" />
        </b-form>

        <b-button id="btnSubmit" type="submit">Register</b-button>
      </b-form>
    </div>
  </b-row>
  <b-row id="sectionRouteLogin" align-h="center">
    <h4 id="textAccountExists" class="text-white">Already have an account?</h4>
    <router-link to="/login" class="routerLink">
      <h4 id="linkLogin" class="text-white">Login here</h4>
    </router-link>
  </b-row>
</b-container>
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
      confirmPassword: 'p@ssworD1',
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
    },

    isValidRegistration () {
      return this.isValidName(this.firstName) && 
            this.isValidName(this.lastName) &&
            this.isValidEmail &&
            this.isValidPassword && 
            this.arePasswordsEqual
    }
  },

  methods: {
    isValidName (name) {
      return /^[a-z]+$/i.test(name)
    },

    async register () {
      if (this.isValidRegistration) {
        console.log('Registering')
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(res => {
            // Fetch the users doc
            const userRef = db.collection('users').doc(res.user.uid)
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
* {
  font-family: 'Raleway';
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

.margin-8 {
  margin: 8px
}

.text-white {
  color: #FFFFFF
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
