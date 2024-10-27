<template>
  <div id="UsersBoard" class="usersboard col-1 col-md-3">
   
  </div>
  <div id="TalkBoard" class="talkboard col">
    <div class="card d-flex flex-column h-100">
      <div class="card-header"></div>
      <div
        class="card-body overflow-auto flex-grow-1"
        ref="scrollContainer"
        :model="nowtalk"
      >
        <div
          class="messagebar d-flex mb-2"
          v-bind:class="
            text.talkid == connectionid ? 'flex-row-reverse' : ' flex-row'
          "
          v-for="text in nowtalk"
        >
          <img
            class="userimg img-thumbnail border-1"
            src="https://fakeimg.pl/50/"
          />

          <p
            class="talkboard-body border-1 rounded-2 p-1 mx-2 my-auto text-wrap text-start flex-md-column align-self-center"
            v-bind:class="
              text.talkid == connectionid ? 'messageself' : 'messageorther'
            "
          >
            {{ text.message }}
          </p>
        </div>
      </div>
      <div
        class="card-footer d-flex justify-content-center align-items-center mt-auto"
      >
        <input
          class="form-control flex-grow-1"
          type="text"
          @@keydown.enter.native="sendmessage"
          autocomplete="off"
          v-model="keyonmessage"
          v-bind:disabled="!nowtalkid"
        />
        <button
          class="sendmsgbtn btn btn-primary"
          type="button"
          @click="sendmessage"
          v-bind:disabled="!nowtalkid"
        >
          送出
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
