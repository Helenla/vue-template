<template>
  <div class="home">测试</div>
</template>

<script>
import { SetDocumentTitle } from "@/common";

export default {
  name: "Home",
  created() {
    this.$toast("欢迎来到vue-tamplate!");
    SetDocumentTitle();
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
