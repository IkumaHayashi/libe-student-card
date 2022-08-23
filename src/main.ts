import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import VueKonva from "vue-konva";
import BootstrapVue3 from "bootstrap-vue-3";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

const app = createApp(App);
app.use(VueKonva).use(BootstrapVue3).mount("#app");
