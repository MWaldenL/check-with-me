<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">
            default header
            <button class="modal-default-button" @click="$emit('close')">
              X
            </button>
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            Give Room Name
            <input type="text" name="" id="" value="MichikoGomi">
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            Give Room Type
            <input type="checkbox" name="" id="" value="public">
            Public
            <input type="checkbox" name="" id="" value="private">
            Private
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            Gimme Time
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="createRoom">
              Submit
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase'
import {
} from '@/resources/gameModel.js'

export default {
  name: 'CreateRoomModal',
  methods: {
    createRoom() {
      alert("Labyu")

      this.$emit('close')
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
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: pink;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: center;
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