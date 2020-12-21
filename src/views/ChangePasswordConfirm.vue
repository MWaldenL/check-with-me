<template>
<div id="box">
  <Sidebar />

  <!-- Logo -->
  <h1 id="title">Change Password</h1>

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
        <label id="labelPassword" class="sr-only" for="password">Password</label>
        <b-input-group>
          <b-form-input 
            id="password"
            type="password"
            class="form-input" style="margin: 8px"
            placeholder="password" 
            v-model="password" />
        </b-input-group>

        <!-- Email -->
        <label id="labelConf" class="sr-only" for="confirm-password">Password</label>
        <b-input-group>
          <b-form-input 
            id="confirm-password" 
            type="password"
            class="form-input" style="margin: 8px"
            placeholder="confirm password" 
            v-model="confirmPassword" />
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
import { mapGetters, mapActions } from 'vuex'
import errorMessages from  '@/resources/errorMessages'
import Sidebar from '@/components/sidebar.vue'

export default {
  components: { 
    Sidebar 
  },

  data () {
    return {
      password: '',
      confirmPassword: '',
      errors: {
        invalidPassword: null,
        confirmPassword: null
      }
    }
  },

  computed: {
    ...mapGetters ({
      user: 'getCurrentUser'
    }),

    areFieldsComplete () {
      return this.confirmPassword !== '' && this.password !== ''
    },

    isValidPassword () {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\*\.\!\@\$\%\^\&\(\)\{\}\[\]\:\;\<\>\,\.\?\/\~\_\+\-\=\|])(?=.{8,})/
      return re.test(this.password) 
    },

    arePasswordsEqual () {
      return this.password === this.confirmPassword
    },
  },

  methods: {
    ...mapActions([
      'logoutUser'
    ]),

    clearErrors () {
      this.errors = {
        incorrectPassword: null,
        confirmPassword: null
      }
    },

    async continueChange () {
      if (!this.arePasswordsEqual) {
        this.clearErrors()
        this.errors.confirmPassword = errorMessages.changePasswordConfirm.CONFIRM_PASSWORD
      } else if (!this.isValidPassword) {
        this.clearErrors()
        this.errors.invalidPassword = errorMessages.changePasswordConfirm.PASSWORD
      } else {
        db.collection('users')
        .where("username", "==", this.user.data.username)
        .get()
        .then(querySnapshot => {
          const currentPassword = querySnapshot.docs[0].data().currentPassword
          if (bcrypt.compareSync(this.password, currentPassword)) {
            this.clearErrors()
            this.errors.invalidPassword = errorMessages.changePasswordConfirm.SAME_PASSWORD
          } else {
            this.clearErrors()
            const currentUser = firebase.auth().currentUser

            db.collection('users')
              .doc(currentUser.uid)
              .update({ currentPassword : firebase.firestore.FieldValue.delete() })

            currentUser.updatePassword(this.password)
              .then(() => {
                firebase.auth().signOut()
                  .then(() => {
                    this.logoutUser()
                    this.$router.push('/login')
                  })
              })
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