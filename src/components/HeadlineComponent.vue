<template>
  <div class="card-holder-f">
    <q-card key="first" ref="card" class="headline-card headline-card-hover cursor-pointer flex flex-center" @click="select">
        <q-card-section class="section">
          <div class="text-h5">{{ props.title }}</div>
        </q-card-section>

        <q-card-actions class="section link" align="center" >
          <q-btn flat target="_blank" rel="noopener noreferrer" :disable="!props.guessMade" :href="props.url" class="href text-h6">
            <span v-show="props.guessMade">{{urlDomain()}}</span>
            <span v-show="!props.guessMade">Hidden source</span>
          </q-btn>
        </q-card-actions>
    </q-card>



<!--    <q-card key="second" v-show="props.guessMade" ref="urlCard" class="headline-url-card flex flex-center" @click="select">-->

<!--      <q-card-section class="section">-->
<!--        <div class="text-h5">{{ props.title }}</div>-->
<!--      </q-card-section>-->

<!--      <q-separator />-->

<!--      <q-card-section class="section">-->
<!--        <a target="_blank" rel="noopener noreferrer" :href="props.url" class="href text-h6">{{props.url}}</a>-->
<!--      </q-card-section>-->

<!--    </q-card>-->

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
import { ref, watch } from 'vue';

const props = defineProps(['title', 'url', 'guessMade'])
const emit = defineEmits(['clicked']);
const card = ref(null);

watch(() => props.guessMade, (guess, prevGuess) => {
  if (guess) {
    card.value.$el.classList.remove('headline-card-hover', 'cursor-pointer');
  } else {
    card.value.$el.classList.add('headline-card-hover', 'cursor-pointer');
  }
});

function select() {
  if (!props.guessMade)
    emit('clicked', props.title);
}

function changeColorToDefault() {
  card.value.$el.classList.remove('correct-answer', 'wrong-answer');
}
function changeColorToCorrect() {
  card.value.$el.classList.add('correct-answer');
}
function changeColorToWrong() {
  card.value.$el.classList.add('wrong-answer');
}

function urlDomain() {
  if (props.url === '') {
    setTimeout(urlDomain, 200);
    return;
  }
  return (new URL(props.url)).hostname.replace('www.', '');
}


defineExpose({changeColorToDefault, changeColorToCorrect, changeColorToWrong})
</script>

<style scoped>
.headline-card {
  width: 100%;
  height: 100%;
  transition: all 0.2s ease-in-out;
  word-wrap:break-word;
}

.headline-card-hover:hover {
  border: 2px solid #006b3a;
}

.correct-answer {
  border: 2px solid #006b3a;
  word-wrap:break-word;
  transform: scale(1.07)
}

.correct-answer > .link {
  color: #006b3a;
}

.wrong-answer {
  border: 2px solid #c2302d;
  animation: shake 0.32s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
}

.card-holder-f {
  width: 100%;
}

.section {
  width: 100%;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

</style>
