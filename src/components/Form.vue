<script setup lang="ts">
import { defineEmits, ref, watch } from "vue";
const fileRef = ref<HTMLInputElement>();
defineProps<{
  iconImageElement: HTMLImageElement | null;
  name: string;
  major: string;
  profUrl: string;
}>();
const emit = defineEmits<{
  (e: "update:iconImageElement", value: HTMLImageElement): HTMLImageElement;
  (e: "update:name", value: string): string;
  (e: "update:major", value: string): string;
  (e: "update:profUrl", value: string): string;
}>();
const draftName = ref("");
const draftMajor = ref("");
const draftProfUrl = ref("");
watch(draftName, (newValue) => {
  emit("update:name", newValue);
});
watch(draftMajor, (newValue) => {
  emit("update:major", newValue);
});
watch(draftProfUrl, (newValue) => {
  emit("update:profUrl", newValue);
});
const readImage = async () => {
  if (fileRef.value === null) {
    return;
  }
  if (fileRef.value!.files?.length === 0) {
    return;
  }
  const file = fileRef.value!.files![0];
  const reader = new FileReader();
  const imageUrl = await new Promise<string>((resolve, reject) => {
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
  const image = new window.Image();
  await new Promise<void>((resolve, rejects) => {
    image.onload = () => resolve();
    image.onerror = () => rejects;
    image.src = imageUrl;
  });
  emit("update:iconImageElement", image);
};
</script>
<template>
  <label for="image">画像を選択</label>
  <input type="file" accept="image/*" @change="readImage" ref="fileRef" />
  <input v-model="draftName" placeholder="名前を入力してください" />
  <input v-model="draftMajor" placeholder="専攻を入力してください" />
  <input
    v-model="draftProfUrl"
    placeholder="プロフィールURLを入力してください"
  />
</template>
