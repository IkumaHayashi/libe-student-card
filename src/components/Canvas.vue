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
};
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
    fontSize: 20,
    width: 200,
    x: 200,
    y: 100,
  };
});
const majorTextConfig = computed<konva.TextConfig>(() => {
  return {
    text: props.major,
    fontSize: 20,
    width: 200,
    x: 200,
    y: 155,
  };
});

const iconConfig = computed<konva.ImageConfig | null>(() => {
  if (props.iconImage === null) {
    return null;
  }
  return {
    image: props.iconImage,
    width: 100,
    height: 100,
    x: 30,
    y: 95,
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
  <div id="canvas_div">
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
  </div>
  <button @click="exportImage">ダウンロード</button>
</template>
