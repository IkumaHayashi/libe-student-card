<script setup lang="ts">
import Canvas from "./components/Canvas.vue";
import { reactive, ref } from "vue";
import { BaseImage, BaseImageType } from "./config/baseImages";
const fonts = ["M PLUS 1p", "M PLUS Rounded 1c", "Nico Moji"];

const canvasRef = ref<InstanceType<typeof Canvas>>();
const state = reactive({
  icon: null as HTMLImageElement | null,
  name: "",
  major: "",
  profUrl: "",
  font: "M PLUS 1p",
  color: "#36455E",
  baseImageType: "base_opposite1" as BaseImageType,
});

const fileRef = ref<HTMLInputElement>();
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
  state.icon = image;
};
</script>

<template>
  <h1>【非公式】リベシティ 学生証メーカー</h1>
  <p>7ステップでかんたん作成💡</p>
  <b-accordion>
    <b-accordion-item
      title="Step1 ベースとなる画像を選択してください"
      variant="dark"
      visible
    >
      <input
        id="base-image-opposite1-radio"
        type="radio"
        value="base_opposite1"
        v-model="state.baseImageType"
      /><label for="base-image-opposite1-radio">
        ハガキ・縦・ジャンプ学長<img src="./assets/base_opposite1.png" />
      </label>
      <input
        id="base-image-beside-radio"
        type="radio"
        value="base_beside"
        v-model="state.baseImageType"
      /><label for="base-image-beside-radio">
        ハガキ・横・指差し学長<img src="./assets/base_beside.png" />
      </label>
    </b-accordion-item>
    <b-accordion-item
      title="Step2 アイコンを選択してください"
      variant="dark"
      visible
    >
      <b-button class="mx-1" variant="light" size="sm">
        <label variant="dark">
          <input
            type="file"
            accept="image/*"
            @change="readImage"
            ref="fileRef"
            style="display: none"
          />アイコンを選択
        </label>
      </b-button>
    </b-accordion-item>
    <b-accordion-item
      title="Step3 名前・専攻・プロフィールURLを選択してください"
      variant="dark"
      visible
    >
      <b-row>
        <b-form-input
          type="text"
          v-model="state.name"
          placeholder="名前を入力してください"
        />
      </b-row>
      <b-row>
        <b-form-textarea
          v-model="state.major"
          placeholder="専攻を入力してください"
          rows="2"
          max-rows="2"
        />
      </b-row>
      <b-row>
        <b-form-input
          type="text"
          v-model="state.profUrl"
          placeholder="プロフィールURLを入力してください"
        />
      </b-row>
    </b-accordion-item>
    <b-accordion-item
      title="Step4 文字のフォントと色を入力してください"
      variant="dark"
      visible
    >
      <b-row>
        <b-form-select v-model="state.font" :options="fonts"></b-form-select>
      </b-row>
      <b-row>
        <b-form-input type="color" v-model="state.color" />
      </b-row>
    </b-accordion-item>
  </b-accordion>
  <h2 class="pt-3 pb-2">Step5 仕上がりチェック！</h2>
  <p class="text-start">
    アイコン、文字、QRコードは自由に動かすことができます💡
  </p>
  <Canvas
    ref="canvasRef"
    :baseImageType="state.baseImageType"
    :iconImage="state.icon"
    :name="state.name"
    :major="state.major"
    :profUrl="state.profUrl"
    :font="state.font"
    :color="state.color"
  />
  <b-accordion class="pt-3">
    <b-accordion-item
      title="Step6 ↓のボタンを押してダウンロード"
      variant="dark"
      visible
    >
      <b-button class="mx-1" variant="light" @click="canvasRef?.exportImage()"
        >ダウンロード</b-button
      >
    </b-accordion-item>
    <b-accordion-item
      title="Step7 ダウンロードした画像を印刷して名札ケースにIN！"
      variant="dark"
      visible
    >
      <ul>
        <li>印刷する際は、用紙サイズを「はがき」に変更してください</li>
        <li>
          名札ケース買いに行くのめんどくさい！という方は<a
            href="https://www.amazon.co.jp/dp/B081N4D2GH"
            target="_blank"
            >コチラ</a
          >がおすすめです
        </li>
        <li>コピー機をお持ちでない方はコンビニで印刷も可能です
          <a href="https://photolog.aiko15.com/30017/" target="_blank">詳細はこちら</a>
        </li>
      </ul>
    </b-accordion-item>
  </b-accordion>
</template>
