<script setup>
import router from "@/router";
function start() {
  router.push({
    path: "./game",
  });
}
</script>

<template>
  <div class="intro">
    <p class="big">
      在致命瘟疫的阴影下尽可能存活下去的微型文字游戏
      <br />
      只需要选择每周的行动即可
    </p>
    <br />
    <br />
    <p class="small">
      本游戏纯属虚构，与现实中的环境、人物、事件、团体没有任何关系
      <br />
      如有雷同，纯属巧合
      <br />
      游戏中的所有数据、算法均为游戏本身设计，与现实无关
      <br />
      并非科学，切勿当真
    </p>
    <br />
    <el-button type="primary" size="large" @click="start">开始游戏</el-button>
  </div>
</template>

<style scoped>
.intro {
  height: 100%;
}

.big {
  font-size: 24px;
}

.small {
  font-size: 18px;
  color: gray;
}
</style>
