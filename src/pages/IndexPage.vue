<template>
  <q-page padding class="flex" style="padding: 15pt">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Which one is from The Onion?</q-toolbar-title>
        <q-btn icon="share" label="" flat @click="doShare"></q-btn>

      </q-toolbar>
    </q-header>
    <div class="row">
      <ScoreComponent :totalGuesses="totalGuesses" :correctGuesses="correctGuesses"></ScoreComponent>
    </div>
      <div class="row justify-evenly items-center q-gutter-md">
        <div class="col-11 col-md-5 items-center flex flex-center">
            <HeadlineComponent v-show="firstTitle" ref="firstHeadline" class="headline" id="first" :title="firstTitle" :url="firstUrl" :guessMade="guessMade" @clicked="selectComponent($event)"></HeadlineComponent>
        </div>
        <div class="col-11 col-md-5 flex flex-center">
            <HeadlineComponent v-show="secondTitle" ref="secondHeadline" class="headline" id="second" :title="secondTitle" :url="secondUrl" :guessMade="guessMade" @clicked="selectComponent($event)"></HeadlineComponent>
        </div>
        <div class="col-11 col-md-5 flex flex-center">
        <q-circular-progress
          indeterminate
          v-show="!firstTitle"
          color="primary"
          size="150pt"
        />
        </div>
      </div>
    <div class="row flex flex-center" style="margin-top: 30pt" :style="{visibility: guessMade ? 'visible' : 'hidden'}">
      <q-btn label="Next" icon-right="forward" size="1.3rem" flat @click="nextGuess"></q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue';
import type { Ref } from 'vue'
import { getTheOnionRandom, getNotTheOnionRandom } from '../services/reddit-api-service';
import { useQuasar, copyToClipboard, LocalStorage } from 'quasar'

import HeadlineComponent from 'components/HeadlineComponent.vue';
import ScoreComponent from 'components/ScoreComponent.vue';

let firstTitle = ref('');
let secondTitle = ref('');
let firstUrl = ref('');
let secondUrl = ref('');
let theOnion = ref('');
let selected = ref('');
const firstHeadline = ref(null);
const secondHeadline = ref(null);
const guessMade = ref(false);
const $q = useQuasar();
let correctGuesses = ref($q.localStorage.getItem('correctGuesses')) as Ref<number | null> ;
let totalGuesses = ref($q.localStorage.getItem('totalGuesses')) as Ref<number | null>;
let dismiss;

function selectComponent(title: string) {
  if (selected.value != '') { // Have to change the color of what is selected
    if (selected.value != title) {
      if (firstTitle.value == title) {
        console.log('clicked first one');
        if (secondHeadline.value != null) {
          secondHeadline.value.changeColorToDefault();
        }

      } else {
        console.log('clicked second one');
        if (firstHeadline.value != null) {
          firstHeadline.value.changeColorToDefault();
        }
      }
    }
  }
  selected.value = title;
  checkGuess();

}

function checkGuess() {
  guessMade.value = true;
  // firstTitle.value = firstUrl.value;
  // secondTitle.value = secondUrl.value;
  if (selected.value == theOnion.value) {
    dismiss = $q.notify({
      type: 'positive',
      position: 'bottom',
      color: 'primary',
      message: 'Correct!',
      actions: [
        {label: 'Dismiss', color: 'white', handler: () => { /* ... */ }}
      ]
    });
    try {
      if (correctGuesses.value != null) {
        correctGuesses.value += 1;
        $q.localStorage.set('correctGuesses', correctGuesses);
      }
      else {
        correctGuesses.value = 1;
        $q.localStorage.set('correctGuesses', 1);
      }
    }
    catch (e) {
      console.log('Error interfacing with local storage.');
    }

  } else {
    dismiss = $q.notify({
      type: 'negative',
      position: 'bottom',
      message: 'Wrong!',
      actions: [
        {label: 'Dismiss', color: 'white', handler: () => { /* ... */ }}
      ]
    });
    if (firstTitle.value == selected.value) {
      firstHeadline.value.changeColorToWrong();
    } else if (secondTitle.value == selected.value) {
      secondHeadline.value.changeColorToWrong();
    } else {
      console.log('????');
    }
  }
  try {
    if (totalGuesses.value != null) {
      totalGuesses.value += 1;
      $q.localStorage.set('totalGuesses', totalGuesses);
    }
    else {
      totalGuesses.value = 1;
      $q.localStorage.set('totalGuesses', 1);
    }
  } catch (e) {
    console.log('Error interfacing with local storage.');
  }
  // secondHeadline.value.changeColorToDefault();
  // firstHeadline.value.changeColorToDefault();
  if (firstTitle.value == theOnion.value) { // Highlight the first card, because it's the correct one
    firstHeadline.value.changeColorToCorrect();
  } else if (secondTitle.value == theOnion.value) {
    secondHeadline.value.changeColorToCorrect();
  }


}

function nextGuess() {
  guessMade.value = false;
  cleanupCards();
  populateTitles();
  dismiss();
}

function cleanupCards() {
  selected.value = '';
  firstTitle.value = '';
  secondTitle.value = '';
  secondHeadline.value.changeColorToDefault();
  firstHeadline.value.changeColorToDefault();
}

function doShare() {
  const textToShare = 'Which headline is from The Onion? \n⚫️ ' + firstTitle.value + '\n⚫ ' + secondTitle.value;
  //navigator.clipboard.writeText(textToShare);
  copyToClipboard(textToShare).then( () => {
      $q.notify({
        message: 'Copied headlines to clipboard!',
        timeout: 800
      });
    }).catch(() => {
      console.log("error");
  })
}

function populateTitles() {

  Promise.all([getTheOnionRandom(), getNotTheOnionRandom()]).then((values) => {
    if (Math.round(Math.random()) == 0) {
      firstTitle.value = values[0].title;
      firstUrl.value = values[0].url
      secondTitle.value = values[1].title;
      secondUrl.value = values[1].url;

    } else {
      secondTitle.value = values[0].title;
      secondUrl.value = values[0].url
      firstTitle.value = values[1].title;
      firstUrl.value = values[1].url;
    }
    theOnion.value = values[0].title;

    guessMade.value = false;

  });

}

onBeforeMount(() => {
  populateTitles();
})

</script>

<style>
.row {
  width: 100%;
}

</style>
