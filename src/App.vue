<script setup lang="ts">
import Canvas from "./components/Canvas.vue";
import { reactive, ref } from "vue";
import { BaseImageType } from "./config/baseImages";
const fonts = ["M PLUS 1p", "M PLUS Rounded 1c", "Nico Moji"];

const canvasRef = ref<InstanceType<typeof Canvas>>();
const mainContentDivRef = ref<HTMLDivElement | null>(null);

const state = reactive({
  icon: null as HTMLImageElement | null,
  name: "",
  major: "",
  profUrl: "",
  font: "M PLUS 1p",
  color: "#36455E",
  baseImageType: "base_opposite_jump" as BaseImageType,
  canvasWidth: 0,
});

// main-contentsのDIV幅をCanvasに伝えるために描画完了後に設定
const paddingSize = 15 + 18; // li: 15, ul: 18
const lineSize = 1;
window.onload = () => {
  const divClientWidth = mainContentDivRef.value?.clientWidth ?? 0;
  if (divClientWidth === 0) {
    state.canvasWidth = 0;
    return;
  }
  state.canvasWidth = divClientWidth - paddingSize * 2 - lineSize * 2;
};

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
  <div class="main-contents" ref="mainContentDivRef">
    <h1 class="main-visual">
      <img
        src="./assets/main-visual.png"
        alt="【非公式】リベシティ 名札メーカー"
      />
    </h1>
    <p class="main-heading">
      <img src="./assets/main-heading.png" alt="7ステップで簡単作成" />
    </p>
    <ul class="step">
      <!-- step1 -->
      <li class="step-item">
        <span class="step-item__number"
          >Step
          <span class="step-item__number--lg">01</span>
        </span>
        <p class="step-item__title">画像のタイプを選択してください</p>
        <div class="step__content">
          <div class="step-item__typeA">
            <input
              id="base-image-opposite-jump-radio"
              type="radio"
              value="base_opposite_jump"
              v-model="state.baseImageType"
            /><label
              for="base-image-opposite-jump-radio"
              class="step-item__radio-label"
            >
              タイプ<span class="step-item__text--lg">A</span> :
              ハガキ･縦･ジャンプ学長</label
            >
            <img src="./assets/base_opposite_jump.png" class="step__type-img" />
          </div>
          <div class="step-item__typeB">
            <input
              id="base-image-opposite-finger-radio"
              type="radio"
              value="base_opposite_finger"
              v-model="state.baseImageType"
            /><label
              for="base-image-opposite-finger-radio"
              class="step-item__radio-label"
            >
              タイプ<span class="step-item__text--lg">B</span> :
              ハガキ･縦･指差し学長</label
            >
            <img
              src="./assets/base_opposite_finger.png"
              class="step__type-img"
            />
          </div>
          <div class="step-item__typeC">
            <input
              id="base-image-beside-jump-radio"
              type="radio"
              value="base_beside_jump"
              v-model="state.baseImageType"
            /><label
              for="base-image-beside-jump-radio"
              class="step-item__radio-label"
            >
              タイプ<span class="step-item__text--lg">C</span> :
              ハガキ･横･ジャンプ学長</label
            >
            <img src="./assets/base_beside_jump.png" class="step__type-img" />
          </div>
          <div class="step-item__typeD">
            <input
              id="base-image-beside-finger-radio"
              type="radio"
              value="base_beside_finger"
              v-model="state.baseImageType"
            /><label
              for="base-image-beside-finger-radio"
              class="step-item__radio-label"
            >
              タイプ<span class="step-item__text--lg">D</span> :
              ハガキ･横･指差し学長</label
            >
            <img src="./assets/base_beside_finger.png" class="step__type-img" />
          </div>
        </div>
      </li>
      <!-- /.step1 -->

      <!-- step2 -->
      <li class="step-item">
        <span class="step-item__number"
          >Step
          <span class="step-item__number--lg">02</span>
        </span>
        <p class="step-item__title">アイコンを選択してください</p>
        <div class="step__content">
          <label variant="dark" class="step__button">
            <input
              type="file"
              accept="image/*"
              @change="readImage"
              ref="fileRef"
              style="display: none"
            />アイコンを選択
          </label>
        </div>
      </li>
      <!-- /.step2 -->

      <!-- step3 -->
      <li class="step-item">
        <span class="step-item__number"
          >Step
          <span class="step-item__number--lg">03</span>
        </span>
        <p class="step-item__title">
          名前・専攻・プロフィールURLを<br />入力してください
        </p>
        <div class="step__content">
          <b-form-input
            type="text"
            v-model="state.name"
            placeholder="名前を入力してください"
            class="mb-3"
          />
          <b-form-textarea
            v-model="state.major"
            placeholder="専攻を入力してください"
            rows="2"
            max-rows="2"
            class="mb-3"
          />
          <b-form-input
            type="text"
            v-model="state.profUrl"
            placeholder="プロフィールURLを入力してください"
          />
        </div>
      </li>
      <!-- /.step3 -->

      <!-- step4 -->
      <li class="step-item">
        <span class="step-item__number"
          >Step
          <span class="step-item__number--lg">04</span>
        </span>
        <p class="step-item__title">文字のフォントと色を入力してください</p>
        <div class="step__content">
          <b-form-select
            v-model="state.font"
            :options="fonts"
            class="mb-3"
          ></b-form-select>
          <b-form-input type="color" v-model="state.color" />
        </div>
      </li>
      <!-- /.step4 -->

      <!-- step5 -->
      <li class="step-item">
        <span class="step-item__number"
          >Step<span class="step-item__number--lg">05</span></span
        >
        <p class="step-item__title">仕上がりチェック！</p>
        <p class="step-item__text">
          アイコン、文字、QRコードは自由に動かすことができます!
        </p>
        <div class="step__content">
          <Canvas
            ref="canvasRef"
            :baseImageType="state.baseImageType"
            :iconImage="state.icon"
            :name="state.name"
            :major="state.major"
            :profUrl="state.profUrl"
            :font="state.font"
            :color="state.color"
            :canvasWidth="state.canvasWidth"
          />
        </div>
      </li>
      <!-- step5 -->

      <!-- step6 -->
      <li class="step-item">
        <span class="step-item__number"
          >Step
          <span class="step-item__number--lg">06</span>
        </span>
        <p class="step-item__title">↓のボタンを押してダウンロード</p>
        <div class="step__content">
          <b-button
            class="step__button step__button--download"
            variant="light"
            @click="canvasRef?.exportImage()"
            >ダウンロード</b-button
          >
        </div>
      </li>
      <!-- /.step6 -->

      <!-- step7 -->
      <li class="step-item">
        <span class="step-item__number"
          >Step
          <span class="step-item__number--lg">07</span>
        </span>
        <p class="step-item__title">
          ダウンロードした画像を印刷して名札ケースにIN!
        </p>
        <div class="step__content">
          <ul class="step-item__list">
            <li>印刷する際は、用紙サイズを「はがき」に変更してください</li>
            <li>
              名札ケース買いに行くのめんどくさい！という方は<a
                href="https://www.amazon.co.jp/dp/B081N4D2GH"
                target="_blank"
                >コチラ</a
              >がおすすめです
            </li>
            <li>
              コピー機をお持ちでない方はコンビニで印刷も可能です。<a
                href="https://networkprint.ne.jp/Lite/start?lang=jajp"
                target="_blank"
                >詳細はこちら</a
              >
            </li>
            <li>
              お問い合わせは「いくま」まで。リベシティ<a
                href="https://libecity.com/user_profile/nVtrD8twizc9C3OJeISfiGCFClw2"
                target="_blank"
                >DM</a
              >でお受けいたします。
            </li>
          </ul>
        </div>
      </li>
      <!-- /.step7 -->
    </ul>
  </div>
</template>
