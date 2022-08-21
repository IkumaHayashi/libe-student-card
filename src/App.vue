<script setup lang="ts">
import Form from "./components/Form.vue";
import Canvas from "./components/Canvas.vue";
import { reactive } from "vue";
const state = reactive({
  icon: null,
  name: "",
  major: "",
  profUrl: "",
});
</script>

<template>
  <Form
    v-model:iconImageElement="state.icon"
    v-model:name="state.name"
    v-model:major="state.major"
    v-model:profUrl="state.profUrl"
  />
  <Canvas
    :iconImage="state.icon"
    :name="state.name"
    :major="state.major"
    :profUrl="state.profUrl"
  />
</template>
