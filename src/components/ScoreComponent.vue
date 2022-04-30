<template>
<p class="text-h6">Correctly identified: {{Math.round(correctGuesses*100/totalGuesses)}} % </p>
</template>

<script setup>
const props = defineProps(['correctGuesses', 'totalGuesses']);

</script>

<style scoped>

</style>
