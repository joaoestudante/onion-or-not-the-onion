<template>
  <q-page padding class="flex" style="padding: 15pt">
    <q-dialog v-model="icon">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h4"><strong>Statistics</strong></div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row justify-evenly q-gutter-y-lg">
            <div class="col-6 flex flex-center">
              <div class="row flex flex-center">
                <q-icon name="sports_score" size="4em"></q-icon>
              </div>
              <div class="row flex flex-center">
                {{totalGuesses}} total guesses
              </div>
            </div>
            <div class="col-6 flex flex-center">
              <div class="row flex flex-center">
                <q-icon name="done" size="4em" color="primary"></q-icon>
              </div>
              <div class="row flex flex-center">
                {{correctGuesses}} correct guesses
              </div>
            </div>
            <div class="col-6 flex flex-center">
              <div class="row flex flex-center">
                <q-icon name="local_fire_department" size="4em" color="red-10"></q-icon>
              </div>
              <div class="row flex flex-center">
                {{largestStreak}} guesses was your largest streak!
              </div>
            </div>
            <div class="col-6 flex flex-center">
              <div class="row flex flex-center">
                <q-icon name="whatshot" size="4em" color="orange"></q-icon>
              </div>
              <div class="row flex flex-center">
                You're on a {{currentStreak}} guesses streak!
              </div>
            </div>
          </div>
          <div class="row flex flex-center" style="margin-top: 30pt">
            <q-btn icon="clear" icon-right="clear" color="red" label="Reset" @click="resetStatistics"></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-header>

      <q-toolbar>
        <q-toolbar-title>Which is from The Onion?</q-toolbar-title>
        <q-btn icon="share" label="" flat @click="doShare"></q-btn>
        <q-btn icon="leaderboard" label="" flat @click="icon = true" />
      </q-toolbar>

    </q-header>
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
import { getTheOnionRandom, getNotTheOnionRandom } from '../services/reddit-api-service';
import { useQuasar, copyToClipboard } from 'quasar'

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
let icon = ref(false);
let correctGuesses = ref(0);
let totalGuesses = ref(0);
let largestStreak = ref(0);
let currentStreak = ref(0);
let previousGuessIsCorrect = true;

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

function updateCorrectGuesses() {
  try {
    if (correctGuesses.value != null) {
      correctGuesses.value += 1;
      $q.localStorage.set('correctGuesses', correctGuesses.value);
    }
    else {
      correctGuesses.value = 1;
      $q.localStorage.set('correctGuesses', 1);
    }
  }
  catch (e) {
    console.log('Error interfacing with local storage.');
  }
}

function updateTotalGuesses() {
  try {
    if (totalGuesses.value != null) {
      totalGuesses.value += 1;
      $q.localStorage.set('totalGuesses', totalGuesses.value);
    }
    else {
      totalGuesses.value = 1;
      $q.localStorage.set('totalGuesses', 1);
    }

  } catch (e) {
    console.log('Error interfacing with local storage.');
  }
}

function updateStreak() {
  if (currentStreak.value != null)
    currentStreak.value += 1;
  else
    currentStreak.value = 1;

  if (largestStreak.value != null) {
    if (currentStreak.value > largestStreak.value) {
      largestStreak.value = currentStreak.value;
      $q.localStorage.set('largestStreak', currentStreak.value);
    }
  } else {
    largestStreak.value = currentStreak.value;
    $q.localStorage.set('largestStreak', currentStreak.value);
  }
  $q.localStorage.set('currentStreak', currentStreak.value);
}

function breakStreak() {
  currentStreak.value = 0;
  $q.localStorage.set('currentStreak', currentStreak.value);
}

function checkGuess() {
  guessMade.value = true;
  if (selected.value == theOnion.value) {
    if (previousGuessIsCorrect)
      updateStreak();
    updateCorrectGuesses();
    previousGuessIsCorrect = true;
  } else {
    if (firstTitle.value == selected.value) {
      firstHeadline.value.changeColorToWrong();
    } else if (secondTitle.value == selected.value) {
      secondHeadline.value.changeColorToWrong();
    }
    previousGuessIsCorrect = false;
    breakStreak();
  }
  updateTotalGuesses();
  if (firstTitle.value == theOnion.value) {
    firstHeadline.value.changeColorToCorrect();
  } else if (secondTitle.value == theOnion.value) {
    secondHeadline.value.changeColorToCorrect();
  }

}

function nextGuess() {
  guessMade.value = false;
  cleanupCards();
  populateTitles();
  // dismiss();
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
      console.log('error');
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

function resetStatistics() {
  totalGuesses.value = 0;
  correctGuesses.value = 0;
  largestStreak.value = 0;
  currentStreak.value = 0;
  $q.localStorage.set('totalGuesses', 0);
  $q.localStorage.set('correctGuesses', 0);
  $q.localStorage.set('largestStreak', 0);
  $q.localStorage.set('currentStreak', 0);
}

function loadSetValue(key: string) {
  let loadedValue;
  if ($q.localStorage.has(key)) {
    loadedValue = $q.localStorage.getItem(key);
    if (loadedValue != null) {
      return loadedValue as number;
    }
  }
  $q.localStorage.set(key, 0);
  return 0;
}

function initStatisticsFromStorage() {
  totalGuesses.value = loadSetValue('totalGuesses');
  correctGuesses.value = loadSetValue('correctGuesses');
  largestStreak.value = loadSetValue('largestStreak');
  currentStreak.value = loadSetValue('currentStreak');
}

onBeforeMount(() => {
  populateTitles();
  initStatisticsFromStorage();
})

</script>

<style>
.row {
  width: 100%;
}

</style>
