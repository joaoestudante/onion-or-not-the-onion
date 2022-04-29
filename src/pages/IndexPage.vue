<template>
  <q-page padding class="flex flex-center" style="padding: 15pt">
    <q-header>
      <q-toolbar>
        <q-toolbar-title >Which headline is from The Onion?</q-toolbar-title>
        <q-btn icon="share" label="Share this combination" flat @click="doShare"></q-btn>

      </q-toolbar>
    </q-header>
      <div class="row justify-evenly items-center q-gutter-md" style="margin-top: 20pt">
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
    <div class="row flex flex-center" style="margin-top: 30pt" v-show="firstTitle">
      <q-btn label="Check" icon-right="help" v-show="!guessMade" size="1.3rem" flat :disabled="guessMade || !selected" @click="checkGuess"></q-btn>
      <q-btn label="Next" icon-right="forward" v-show="guessMade" size="1.3rem" flat @click="nextGuess"></q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue';
import { getTheOnionRandom, getNotTheOnionRandom } from '../services/reddit-api-service';
import { useQuasar, copyToClipboard } from 'quasar'

import HeadlineComponent from 'components/HeadlineComponent.vue';

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

}

function checkGuess() {
  guessMade.value = true;
  // firstTitle.value = firstUrl.value;
  // secondTitle.value = secondUrl.value;
  if (selected.value == theOnion.value) {
    dismiss = $q.notify({
      type: 'positive',
      position: 'bottom',
      message: 'Correct!',
      actions: [
        {label: 'Dismiss', color: 'white', handler: () => { /* ... */ }}
      ]
    });

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
      console.log('First title was the one chosen, but it is wrong...');
      firstHeadline.value.changeColorToWrong();
    } else if (secondTitle.value == selected.value) {
      console.log('Second title was the one chosen, but it is wrong...');
      secondHeadline.value.changeColorToWrong();
    } else {
      console.log('????');
    }
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
        message: 'Copied to clipboard!',
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
