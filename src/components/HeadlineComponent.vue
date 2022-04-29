<template>
  <div class="card-holder">
    <q-card key="first" v-show="!props.guessMade" ref="card" class="headline-card cursor-pointer flex flex-center" @click="select">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        <strong>Select this as TheOnion source</strong>
      </q-tooltip>

        <q-card-section class="section">
          <div class="text-h5">{{ props.title }}</div>
        </q-card-section>

      <q-card-section class="section" :style="{visibility: props.guessMade ? 'visible' : 'hidden'}">
          <a target="_blank" rel="noopener noreferrer" :href="props.url" class="href text-h6">{{props.url}}</a>
        </q-card-section>
    </q-card>

    <q-card key="second" v-show="props.guessMade" ref="urlCard" class="headline-url-card flex flex-center" @click="select">

      <q-card-section class="section">
        <div class="text-h5">{{ props.title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="section">
        <a target="_blank" rel="noopener noreferrer" :href="props.url" class="href text-h6">{{props.url}}</a>
      </q-card-section>

    </q-card>

    <!--  <q-card v-show="props.guessMade" ref="card-url" class="card-url flex flex-center" @click="select">-->
<!--    <q-card-section>-->
<!--      <div class="text-h5">{{props.title}}</div>-->
<!--    </q-card-section>-->
<!--    <q-card-section>-->
<!--      <a target="_blank" rel="noopener noreferrer" :href="props.url" class="href text-h6">{{props.url}}</a>-->
<!--    </q-card-section>-->
<!--  </q-card>-->
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['title', 'url', 'guessMade'])
const emit = defineEmits(['clicked']);
const card = ref(null);
const urlCard = ref(null);

function select() {
  changeColorToSelected();
  emit('clicked', props.title);
}
function changeColorToSelected() {
  card.value.$el.classList.add('bg-primary', 'text-white');
}
function changeColorToDefault() {
  card.value.$el.classList.remove('bg-primary', 'text-white');
  urlCard.value.$el.classList.remove('selected-card', 'wrong-answer');

}
function changeColorToCorrect() {
  urlCard.value.$el.classList.add('selected-card');
}

function changeColorToWrong() {
  urlCard.value.$el.classList.add('wrong-answer');
}

defineExpose({changeColorToDefault, changeColorToSelected, changeColorToCorrect, changeColorToWrong})
</script>

<style scoped>
.headline-card, .headline-url-card {
  width: 100%;
  min-height: 150pt;
  transition: all 0.2s ease-in-out;
  word-wrap:break-word;
}

.headline-card:hover {
  background-color: #006b3a;
  color: white;
  transform: scale(1.05);
}
.selected-card {
  background: #006b3a;
  color: white;
  word-wrap:break-word;
}

.selected-card > .section > a {
  color: limegreen
}

.wrong-answer {
  border: 1px solid #c2302d;
  opacity: 0.8;
}

.wrong-answer > .section > a {
  color: #000000
}

.card-holder {
  width: 100%;
}

.section {
  width: 100%;
}

</style>
