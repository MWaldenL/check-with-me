<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div>
          <button id="close-button" @click="$emit('close')">
            X
          </button>
        </div>
        <br>
        <div id="label-container">
          Create Room
        </div>

        <div class="modal-body name-container">
          <slot name="body">
            <div id="name-label">
              Room Name
            </div>
            <input id="room-name-input" v-model.trim="roomNameInput" placeholder="Enter room name">
            <b-alert show variant="danger" v-show="nameTaken" id="name-alert">Room name not available!</b-alert>
          </slot>
        </div>

        <div class="modal-body type-container">
          <slot name="body">
            <div id="type-label">
              Room Type
            </div>
            <select v-model="typeInput" id="type-select">
              <option disabled value="">Select a type...</option>
              <option value=true>Public</option>
              <option value=false>Private</option>
            </select>
          </slot>
        </div>

        <div class="modal-body time-container">
          <slot name="body">
            <div id="minutes-10" class="cursor-pointer" :class="{'box-active': timeInput === 10, 'box-inactive': timeInput !== 10}" @click="putTime(10)">10 min</div>
            <div id="minutes-5" class="cursor-pointer" :class="{'box-active': timeInput === 5, 'box-inactive': timeInput !== 5}" @click="putTime(5)">5 min</div>
            <div id="minutes-3" class="cursor-pointer" :class="{'box-active': timeInput === 3, 'box-inactive': timeInput !== 3}" @click="putTime(3)">3 min</div>
            <div id="minutes-1" class="cursor-pointer" :class="{'box-active': timeInput === 1, 'box-inactive': timeInput !== 1}" @click="putTime(1)">1 min</div>
          </slot>
        </div>

        <div class="button-container">
            <button :disabled="!valid" id="create-button"
                    v-bind:class="{'submit-button': valid, 'submit-disabled': !valid}"
                    @click="createRoom">
              {{valid ? 'Create!' : 'Missing Fields'}}
            </button>
        </div>
      </div>
    </div>
  </div>
  <!-- <b-modal v-model="this.showModal" id="modal" centered hide-footer no-close-on-backdrop no-close-on-esc hide-header>
  </b-modal> -->
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase'
import { addGameDoc, checkNameUnique, checkUserGame } from '@/resources/gameModel.js'
import { addTimerDoc, addGameToTimer } from '@/resources/timerModel.js'

export default {
  name: 'CreateRoomModal',
  //props: ['showModal'],
  data() {
    return {
      roomNameInput: "",
      typeInput: 0,
      timeInput: 0,
      nameTaken: false
    }
  },
  computed: {
    valid: function() {
      return !!this.timeInput && !!this.typeInput && !!this.roomNameInput
    }
  },
  methods: {
    async createRoom() {
      let user_key = firebase.auth().currentUser.uid
      let validUser = await checkUserGame(user_key)
      validUser = validUser === false
      if(validUser){
        if(this.valid)
        {
          let uniqueName = await checkNameUnique(this.roomNameInput);
          //console.log("uniqueName: " + uniqueName)

          if(uniqueName) {
            let timer = await addTimerDoc(this.timeInput*60)
            let game = await addGameDoc(this.roomNameInput, this.typeInput, timer.id)
            await addGameToTimer(game.id, timer.id)

            this.$router.push({ path: '/room/' + game.id })

            this.$emit('close')
          } else {
            this.nameTaken = true
            //this.roomNameInput = ""
          }
        }
      } else{
        this.$emit('badUser')
        this.$emit('close')
        
      }
    },

    putTime(time) {
      this.timeInput = time
    }
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  z-index: 9998;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 10px 10px;
  background-color:white;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: 'Raleway', Arial, Helvetica, sans-serif;
}

.modal-header {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 0px 0;
}

#label-container {
  color: black;

  text-align: center;
  font-weight: bolder;
  font-size: 1.75em;

  margin-left: 25px;
  margin-right: 0px;
}

#name-label {
  color: black;
  margin-bottom: 10px;
}
#name-alert {
  margin-top: 10px;
  margin-bottom: 0px;
  padding-top: 3px;
  padding-bottom: 3px;

}

#type-label {
  color: black;
  margin-bottom: 10px;
}
#type-select {
  background-color: #c4c4c4a6;
  height: 25px;
  width: 60%;
  outline: none;
}

#close-button {
  position: relative;
  float: right;
  background-color: #FF4949;
  border: 0px solid #FF4949;
  font-weight: bold;
  border-radius: 3px;
  color: #FFF;
}

.time-container{
  margin: 0px 0px 15px 0px;
  width:100%;
  height:50%;
  background-color:#fff;
  display:grid;
  grid-template-columns: 46% 46%;
  grid-row: auto auto;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
}
.box-active{
    background-color:#E6912C;
    padding:8px;
    border-radius:0px;
    color:#fff;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1em;
    font-weight: bold;
}
.box-inactive{
    background-color:#b37f40;
    padding:8px;
    border-radius:0px;
    color:rgb(214, 208, 208);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1em;
    font-weight: bold;
}

.submit-button {
    background-color: #6FC186;
    color: #FFF;
    font-size: 1em;
    text-align: center;
    border: 0px solid #6FC186;
    border-radius: 0px;
    height: 35px;
    width: 90%;
    margin-bottom: 20px;
}
.submit-disabled {
    background-color: #6b9778;
    color: rgb(199, 198, 198);
    font-size: 1em;
    text-align: center;
    border: 0px solid #6FC186;
    border-radius: 0px;
    height: 35px;
    width: 90%;
    margin-bottom: 20px;
    cursor: default;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>