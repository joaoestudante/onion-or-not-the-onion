<template>
<p class="text-h6">Correctly identified: {{Math.round(props.correctGuesses*100/props.totalGuesses)}} % </p>
</template>

<script setup>
const props = defineProps(['correctGuesses', 'totalGuesses']);

</script>

<style scoped>

</style>
