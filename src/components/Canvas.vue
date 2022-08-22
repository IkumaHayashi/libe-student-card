<script setup lang="ts">
import { computed, reactive, ref, toRefs, watch } from "vue";
import konva from "konva";
import qrcode from "qrcode";

const props = defineProps<{
  iconImage: HTMLImageElement | null;
  name: string;
  major: string;
  profUrl: string;
}>();

const baseImageSizes = {
  width: 2041,
  height: 1379,
  qrStart: {
    x: 1723,
    y: 1060,
  },
  qrEnd: {
    x: 1969,
    y: 1307,
  },
  iconCenter: {
    x: 450,
    y: 780,
  },
  iconWidth: 280 * 2,
  nameStart: {
    x: 1080,
    y: 550,
  },
  nameEnd: {
    x: 1950,
    y: 650,
  },
  majorStart: {
    x: 1080,
    y: 840,
  },
  majorEnd: {
    x: 1950,
    y: 940,
  },
};

const defaultFont = "M PLUS 1p";
const fonts = ["M PLUS 1p", "M PLUS Rounded 1c", "Nico Moji"];

const { profUrl } = toRefs(props);
const baseImageRatio = window.innerWidth / baseImageSizes.width;
const canvasWidth = window.innerWidth;
const canvasHeight = baseImageSizes.height * baseImageRatio;
const configKonva = {
  width: canvasWidth,
  height: canvasHeight,
};
const state = reactive({
  backgroundImage: new Image(),
  isLoaded: false,
  imageUrl: "",
  qrcodeBase64: "",
  qrcodeImage: new Image(),
  font: defaultFont,
});
const stageRef = ref<InstanceType<typeof konva.Stage>>();

// 背景画像の設定
state.backgroundImage.width = canvasWidth;
state.backgroundImage.height = canvasHeight;
const backgroundImageConfig = computed(() => {
  if (!state.isLoaded) {
    return null;
  }
  return {
    image: state.backgroundImage,
  };
});
const loadBackgroundImage = async () => {
  return new Promise<void>(async (resolve, reject) => {
    const src = (await import("../assets/base_beside.png")).default;
    state.backgroundImage.onload = () => {
      state.isLoaded = true;
      resolve();
    };
    state.backgroundImage.onerror = (e) => reject(e);
    state.backgroundImage.src = src;
  });
};
loadBackgroundImage();

const nameTextConfig = computed<konva.TextConfig>(() => {
  return {
    text: props.name,
    fontSize:
      (baseImageSizes.nameEnd.y - baseImageSizes.nameStart.y) * baseImageRatio,
    x: baseImageSizes.nameStart.x * baseImageRatio,
    y: baseImageSizes.nameStart.y * baseImageRatio,
    draggable: true,
    fontFamily: state.font,
  };
});
const majorTextConfig = computed<konva.TextConfig>(() => {
  return {
    text: props.major,
    fontSize:
      (baseImageSizes.majorEnd.y - baseImageSizes.majorStart.y) *
      baseImageRatio,
    x: baseImageSizes.majorStart.x * baseImageRatio,
    y: baseImageSizes.majorStart.y * baseImageRatio,
    draggable: true,
    fontFamily: state.font,
  };
});

const iconConfig = computed<konva.ImageConfig | null>(() => {
  if (props.iconImage === null) {
    return null;
  }
  return {
    image: props.iconImage,
    width: baseImageSizes.iconWidth * baseImageRatio,
    height: baseImageSizes.iconWidth * baseImageRatio,
    x:
      (baseImageSizes.iconCenter.x - baseImageSizes.iconWidth / 2) *
      baseImageRatio,
    y:
      (baseImageSizes.iconCenter.y - baseImageSizes.iconWidth / 2) *
      baseImageRatio,
    draggable: true,
  };
});

const qrcodeConfig = computed<konva.ImageConfig>(() => {
  return {
    image: state.qrcodeImage,
    width: (baseImageSizes.qrEnd.x - baseImageSizes.qrStart.x) * baseImageRatio,
    height:
      (baseImageSizes.qrEnd.y - baseImageSizes.qrStart.y) * baseImageRatio,
    x: baseImageSizes.qrStart.x * baseImageRatio,
    y: baseImageSizes.qrStart.y * baseImageRatio,
  };
});

watch(profUrl, async (newValue) => {
  const qrUrl = await qrcode.toDataURL(newValue);

  return new Promise<void>(async (resolve, reject) => {
    const src = qrUrl;
    state.qrcodeImage.onload = () => {
      state.isLoaded = true;
      resolve();
    };
    state.qrcodeImage.onerror = (e) => reject(e);
    state.qrcodeImage.src = src;
  });
});
const exportImage = async () => {
  if (stageRef.value === undefined) {
    return null;
  }
  const imageUrl = stageRef.value
    .getStage()
    .toDataURL({ pixelRatio: 1 / baseImageRatio });

  const link = document.createElement("a");
  link.download = "icon.png";
  link.href = imageUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <select v-model="state.font">
    <option v-for="font in fonts" :value="font" :key="font">{{ font }}</option>
  </select>
  <v-stage :config="configKonva" id="stage" ref="stageRef">
    <v-layer>
      <v-image
        v-if="backgroundImageConfig !== null"
        :config="backgroundImageConfig"
      />
    </v-layer>
    <v-layer>
      <v-text :config="nameTextConfig"></v-text>
    </v-layer>
    <v-layer>
      <v-text :config="majorTextConfig"></v-text>
    </v-layer>
    <v-layer>
      <v-image v-if="iconConfig !== null" :config="iconConfig"></v-image>
    </v-layer>
    <v-layer>
      <v-image v-if="profUrl !== ''" :config="qrcodeConfig"></v-image>
    </v-layer>
  </v-stage>
  <button @click="exportImage">ダウンロード</button>
</template>
