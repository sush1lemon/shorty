<template>
  <div class="flex justify-center p-8 fixed bottom-[20%] transition-opacity duration-700 ease-in opacity-0">
    <div class="flex w-64 items-center rounded-lg shadow-lg mb-4 flex bg-indigo-500 p-4 text-white">
      <div class="w-full text-center">
        <h4 class="mb-2 font-bold text-center">Success!</h4>
        <p>Copied to clipboard</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Alert"
}
</script>

<style scoped>

</style>