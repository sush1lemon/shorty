<template>
  <div class="w-full h-screen flex flex-col gap-4 justify-center items-center bg-gray-900 px-10 text-white">

    <div class="w-full flex flex-col items-center gap-1 mt-[-22rem]">
      <h1 class="text-4xl font-bold">SHORTY</h1>
      <h3 class="uppercase">A URL Shortener living on the Edge.</h3>
    </div>

    <div class="w-full flex justify-center mt-4">
      <div class="flex gap-4 basis-full sm:basis-[90%] md:basis-[80%] lg:basis-[70%] xl:basis-[60%] 2xl:basis-[50%]">
        <div class="relative w-full">
          <div
              class="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <input class="relative w-full px-4 py-2 rounded text-black" v-model="url" :disabled="loading">
        </div>
        <div class="relative">
          <div
              class="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <button class="bg-cyan-500 px-4 py-2 cursor-pointer rounded relative flex justify-center" @click="generate()" :disabled="loading">
            <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" v-if="loading">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <img class="w-6 h-6 text-white" src="./assets/cut.svg" v-else>
          </button>
        </div>
      </div>
    </div>
    <div class="text-center">
      <h2 class="text-md text-red-300 font-bold uppercase" v-if="!validUrl">Not a valid url</h2>
      <h2 class="text-md text-green-300 font-bold uppercase transition-opacity duration-1000 ease-in opacity-0" :class="showSuccess ? 'animate-fade' : ''">Success</h2>
    </div>
    <div class="w-full flex justify-center">
      <div class=" bg-gray-800 px-4 py-2 rounded text-center cursor-pointer group flex relative" v-if="short" @click="copy(short)">
        <a class="underline text-blue-500">{{ short }}</a>
        <span class="group-hover:opacity-100 transition-opacity bg-gray-800 px-2 text-sm text-gray-100 rounded-md absolute left-1/2 -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">
          Click to Copy
        </span>
      </div>
    </div>

    <alert :class="showAlert ? 'animate-fade' : ''"></alert>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import useGenerateShort from "./composables/useGenerateShort";
import Alert from "./components/Alert.vue";

const url = ref('');
const short = ref('');
const showAlert = ref(false);
const loading = ref(false);
const validUrl = ref(true);
const showSuccess = ref(false);

const generate = async () => {
  if (!validUrl.value) return;
  showAlert.value = false;
  loading.value = true;
  showSuccess.value = false;
  const data = await useGenerateShort(url.value);
  if (data) {
    short.value = data?.shorty;
    showSuccess.value = true;
  }
  loading.value = false;
}

const copy = (short: string) => {
  showAlert.value = false;
  navigator.clipboard.writeText(short)
      .then(() => {
        showAlert.value = true;
        showSuccess.value = false;
      })
}

const validateUrl = (str: string) => {
  if (!str) return true;
  let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

watch(url, () => {
  short.value = "";
  loading.value = false;
  showAlert.value = false;
  showSuccess.value = false;
  validUrl.value = validateUrl(url.value)
})

</script>

