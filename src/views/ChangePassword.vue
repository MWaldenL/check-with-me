<template>
<div id="box">
  <Sidebar />

  <!-- Logo -->
  <h1 id="title">Change Password</h1>
  <p class="text-white">Before changing your password, please confirm your identity by entering your 
    email address and current password.</p>

  <!-- Form section -->
  <b-row id="sectionLoginForm" align-h="center">
    <div class="col-4 d-flex flex-column justify-content-center">
      <b-col id="loginErrorMessages">
        <span v-for="err in errors" :key="err">
          <p class="d-flex flex-grow-1 error-message text-error" v-if="err">
            {{ err }}
          </p>
        </span>
      </b-col>

      <b-form @submit.prevent="continueChange">
        <!-- Username -->
        <label id="labelEmail" class="sr-only" for="email">Email Address</label>
        <b-input-group>
          <b-form-input 
            id="email"
            class="form-input" style="margin: 8px"
            placeholder="email address" 
            v-model="email" />
        </b-input-group>

        <!-- Email -->
        <label id="labelPassword" class="sr-only" for="password">Password</label>
        <b-input-group>
          <b-form-input 
            id="password" 
            type="password"
            class="form-input" style="margin: 8px"
            placeholder="password" 
            v-model="password" />
        </b-input-group>

        <b-button id="btnSubmit" :disabled="!areFieldsComplete" type="submit">
          Continue
        </b-button>
        <router-link to="/profile" class="router-link">
          <h2 id="go-back">Back to Profile</h2>
        </router-link>
      </b-form>
    </div>
  </b-row>
</div>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase'
import bcrypt from 'bcryptjs'
import { mapGetters } from 'vuex'
import errorMessages from  '@/resources/errorMessages'
import Sidebar from '@/components/sidebar.vue'

export default {
  components: { 
    Sidebar 
  },

  data () {
    return {
      email: '',
      password: '',
      errors: {
        incorrectEmail: null,
        incorrectPassword: null
      }
    }
  },

  computed: {
    ...mapGetters({
      user: 'getCurrentUser'
    }),

    areFieldsComplete () {
      return this.email !== '' && this.password !== ''
    },
  },

  methods: {
    clearErrors () {
      this.errors = {
        incorrectEmail: null,
        incorrectPassword: null
      }
    },

    continueChange () {
      //check if email is correct
      this.email = this.email.toLowerCase()

      if (this.user.data.email !== this.email) {
        this.clearErrors()
        this.errors.incorrectEmail = errorMessages.changePassword.EMAIL
      } else {
        const currentUser = firebase.auth().currentUser

        const credential = firebase.auth.EmailAuthProvider.credential(
          this.email, 
          this.password
        );

        currentUser.reauthenticateWithCredential(credential)
          .then(() => {
            this.clearErrors()
            const hashedPass = bcrypt.hashSync(this.password, 10)
            
            db.collection('users')
              .doc(currentUser.uid)
              .set({ currentPassword: hashedPass }, { merge : true })

            this.$router.push('/change-password/confirm')
          })
          .catch(error => {
            if (error.code === 'auth/wrong-password') {
              this.clearErrors()
              this.errors.incorrectPassword = errorMessages.changePassword.PASSWORD
            }
          })
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&family=Jura&display=swap');

* {
  font-family: 'Raleway';
}

#box {
  position: relative;
  margin-top: 10px;
}

#title {
  padding: 2vh;
  font-family: 'Jura', monospace;
  font-size: 6vh;
  font-weight: bold;
  color: #BCFC8A;
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

#btnSubmit, #go-back { 
  margin: 2.5rem;
  margin-bottom: 0.5rem;
  background-color: transparent;
  color: #FFFFFF;
  border: none;
  outline: none;
  font-size: 2.125rem;
  font-weight: 700;
}

#go-back {
  margin-top: 0.5rem;
}

.router-link {
  text-decoration: none;
}
</style>