<script setup lang="ts">
import { computed, reactive, ref, toRefs, watch } from "vue";
import konva from "konva";
import qrcode from "qrcode";
import { BaseImage, BaseImageType } from "../config/baseImages";

const props = defineProps<{
  iconImage: HTMLImageElement | null;
  baseImageType: BaseImageType;
  name: string;
  major: string;
  profUrl: string;
  font: string;
  color: string;
  canvasWidth: number;
}>();
const propRefs = toRefs(props);

const state = reactive({
  isLoaded: false,
  qrcodeImage: new Image(),
  baseBesideImage: new Image(),
  baseOpposite1Image: new Image(),
});
const stageRef = ref<InstanceType<typeof konva.Stage>>();

watch(propRefs.canvasWidth, async (newValue) => {
  const baseBeside = new BaseImage("base_beside", newValue);
  await baseBeside.readImage();
  state.baseBesideImage = baseBeside.image;
  const baseOpposite1 = new BaseImage("base_opposite1", newValue);
  await baseOpposite1.readImage();
  state.baseOpposite1Image = baseOpposite1.image;
  state.isLoaded = true;
});

const konvaConfig = computed(() => {
  const baseImage = new BaseImage(
    props.baseImageType,
    propRefs.canvasWidth.value
  );
  return {
    width: propRefs.canvasWidth.value,
    height: baseImage.sizes.height * baseImageRatio.value,
  };
});

const baseImageRatio = computed<number>(
  () => propRefs.canvasWidth.value / baseImage.value.sizes.width
);

const baseImage = computed<BaseImage>(
  () => new BaseImage(props.baseImageType, propRefs.canvasWidth.value)
);

const nameTextConfig = computed<konva.TextConfig>(() => {
  return {
    text: props.name,
    fontSize:
      (baseImage.value.sizes.nameEnd.y - baseImage.value.sizes.nameStart.y) *
      baseImageRatio.value,
    x: baseImage.value.sizes.nameStart.x * baseImageRatio.value,
    y: baseImage.value.sizes.nameStart.y * baseImageRatio.value,
    draggable: true,
    fontFamily: props.font,
    fill: props.color,
  };
});
const majorTextConfig = computed<konva.TextConfig>(() => {
  return {
    text: props.major,
    fontSize:
      (baseImage.value.sizes.majorEnd.y - baseImage.value.sizes.majorStart.y) *
      baseImageRatio.value,
    x: baseImage.value.sizes.majorStart.x * baseImageRatio.value,
    y: baseImage.value.sizes.majorStart.y * baseImageRatio.value,
    draggable: true,
    fontFamily: props.font,
    fill: props.color,
  };
});

const iconConfig = computed<konva.ImageConfig | null>(() => {
  if (props.iconImage === null) {
    return null;
  }
  return {
    image: props.iconImage,
    width: baseImage.value.sizes.iconWidth * baseImageRatio.value,
    height: baseImage.value.sizes.iconWidth * baseImageRatio.value,
    x:
      (baseImage.value.sizes.iconCenter.x -
        baseImage.value.sizes.iconWidth / 2) *
      baseImageRatio.value,
    y:
      (baseImage.value.sizes.iconCenter.y -
        baseImage.value.sizes.iconWidth / 2) *
      baseImageRatio.value,
    draggable: true,
  };
});

const qrcodeConfig = computed<konva.ImageConfig>(() => {
  return {
    image: state.qrcodeImage,
    width:
      (baseImage.value.sizes.qrEnd.x - baseImage.value.sizes.qrStart.x) *
      baseImageRatio.value,
    height:
      (baseImage.value.sizes.qrEnd.y - baseImage.value.sizes.qrStart.y) *
      baseImageRatio.value,
    x: baseImage.value.sizes.qrStart.x * baseImageRatio.value,
    y: baseImage.value.sizes.qrStart.y * baseImageRatio.value,
    draggable: true,
  };
});

watch(propRefs.profUrl, async (newValue) => {
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
    .toDataURL({ pixelRatio: 1 / baseImageRatio.value });

  const link = document.createElement("a");
  link.download = "icon.png";
  link.href = imageUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

defineExpose({ exportImage });
</script>

<template>
  <v-stage :config="konvaConfig" id="stage" ref="stageRef">
    <v-layer
      :config="{
        visible: state.isLoaded && props.baseImageType === 'base_beside',
      }"
    >
      <v-image :config="{ image: state.baseBesideImage }" />
    </v-layer>
    <v-layer
      :config="{
        visible: state.isLoaded && props.baseImageType === 'base_opposite1',
      }"
    >
      <v-image :config="{ image: state.baseOpposite1Image }" />
    </v-layer>
    <v-layer>
      <v-text :config="nameTextConfig"></v-text>
      <v-text :config="majorTextConfig"></v-text>
      <v-image v-if="iconConfig !== null" :config="iconConfig"></v-image>
      <v-image v-if="profUrl !== ''" :config="qrcodeConfig"></v-image>
    </v-layer>
  </v-stage>
</template>
