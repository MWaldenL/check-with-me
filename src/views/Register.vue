<template>
<div id="registration" class="container">
  <b-form @submit="register">
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
      <b-form-input id="inline-form-input-username" placeholder="Username" />
    </b-input-group>

    <!-- Email -->
    <label class="sr-only" for="email">Email</label>
    <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
      <b-form-input id="inline-form-input-username" placeholder="Email" />
    </b-input-group>

    <!-- Passwords -->
    <b-form inline>
      <label class="sr-only" for="password">Password</label>
      <b-form-input
        id="password"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="Password" 
        v-model="password" />

      <label class="sr-only" for="confirmPass">Confirm Password</label>
      <b-form-input
        id="lastName"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="Confirm Password" 
        v-model="confirmPassword" />
    </b-form>

    <b-button variant="primary" type="submit">Register</b-button>
  </b-form>
</div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  
  computed: {
    isValidFirstName () {
      return /^[a-z]+$/i.test(this.firstName)
    },

    isValidLastName () {
      return /^[a-z]+$/i.test(this.lastName)
    },

    isValidEmail () {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    },

    isValidPassword () {
      const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      return regex.test(this.password) 
    }
  },

  methods: {
    register() {
      return this.isValidFirstName  && 
            this.isValidLastName    && 
            this.isValidEmail       &&
            this.isValidPassword    && 
            this.password === this.confirmPassword
    }
  }
}
</script>

<style scoped>
.text-white {
  color: #FFFFFF
}
</style>
