<template>
  <div class="home">测试</div>
</template>

<script>
import { HOME_PREFIX } from "@/constant";
import { SetDocumentTitle } from "@/common";

export default {
  name: "Home",
  created() {
    this.$toast("欢迎来到vue-tamplate!");
    SetDocumentTitle();
    // this.$services.testApi().then((res) => {
    //   console.log(res);
    // });
    this.$services
      .testApi({
        prefix: HOME_PREFIX,
      })
      .then((res) => {
        console.log(res);
      });
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
