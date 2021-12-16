<template>
  <section class="page">
    <div class="page-content page-not-found">
      <div class="box">
        <img src="~assets/img/bg_404.png" />
        <p class="dec">-&nbsp;页面找不到了&nbsp;-</p>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.page-not-found {
  position: relative;
  background-color: $colorWhite;

  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  img {
    position: relative;
    width: 218px;
    height: auto;
  }

  p {
    text-align: center;
  }

  .dec {
    padding: 15px 0;
    font-size: 14px;
    color: $color9;
  }
}
</style>
