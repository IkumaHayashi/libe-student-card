<script setup lang="ts">
import Form from "./components/Form.vue";
import Canvas from "./components/Canvas.vue";
import { reactive } from "vue";
import { IForm } from "./types";
const state = reactive<IForm>({
  icon: null,
  name: "",
  major: "",
});
</script>

<template>
  <Form
    v-model:iconImageElement="state.icon"
    v-model:name="state.name"
    v-model:major="state.major"
  />
  <Canvas :iconImage="state.icon" :name="state.name" :major="state.major" />
</template>
