<script setup>
import Game from "@/lib/Game";
import { ref } from "vue";
//import zhCn from "element-plus/dist/locale/zh-cn.mjs";
let game = ref(new Game());
game.value.init();

function infectedMsg() {
  // 按需导入无需import，eslint误报错
  if (game.value.gameover)
    ElMessage.error("你没能扛过这次感染！"); //eslint-disable-line no-undef
  else ElMessage({ message: "很不幸，你被感染了！", type: "warning" }); //eslint-disable-line no-undef
}

function work() {
  let r = game.value.work();
  if (r) infectedMsg();
}

function study() {
  let r = game.value.study();
  if (r) infectedMsg();
}

function sleep() {
  let r = game.value.sleep();
  if (r) infectedMsg();
}

function gameover() {
  ElMessageBox.alert("你存活了 " + (game.value.now_week * 7) + " 天", "游戏结束", { //eslint-disable-line
      confirmButtonText: "OK",
      callback: () => {
        game.value.init();
      },
    }
  );
}
</script>

<template>
  <el-container>
    <el-main>
      <el-row :gutter="20" type="flex" justify="center">
        <el-col :span="4">
          <el-card class="box-week" shadow="hover">
            <el-tooltip content="游戏以周为单位选择行动方式" placement="top">
              <span>第 {{ game.now_week }} 周</span>
            </el-tooltip>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="box-stat" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>当前状态</span>
              </div>
            </template>

            <el-row :gutter="20" type="flex">
              <el-col :span="10">
                <el-tooltip content="感染了多少次" placement="right-start">
                  <div class="card-text left-item">感染记录</div>
                </el-tooltip>
              </el-col>
              <el-col :span="14">
                <div
                  :style="{ color: game.Info_Infected_color }"
                  class="card-text right-item"
                >
                  {{ game.Info_Infected }}
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20" type="flex">
              <el-col :span="10">
                <el-tooltip placement="right-start">
                  <template #content
                    >当前抵抗力/最大抵抗力<br />感染病毒会消耗你的抵抗力，抵抗力低下时再次感染则有生命危险</template
                  >
                  <div class="card-text left-item">抵抗力</div>
                </el-tooltip>
              </el-col>
              <el-col :span="14">
                <div
                  :style="{ color: game.max_resistance_color }"
                  class="card-text right-item"
                >
                  {{ game.now_resistance }} / {{ game.max_resistance }}
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20" type="flex">
              <el-col :span="10">
                <el-tooltip
                  content="游戏不考虑接种疫苗的情况，只有被感染后的一段时间有抗体"
                  placement="right-start"
                >
                  <div class="card-text left-item">抗体水平</div>
                </el-tooltip>
              </el-col>
              <el-col :span="14">
                <div
                  :style="{ color: game.Info_P_Antibody_color }"
                  class="card-text right-item"
                >
                  {{ game.Info_P_Antibody }}
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20" type="flex">
              <el-col :span="10">
                <el-tooltip
                  content="更好的防疫效果需要更好的防疫设备，也意味着更多的资金投入"
                  placement="right-start"
                >
                  <div class="card-text left-item">防疫效果</div>
                </el-tooltip>
              </el-col>
              <el-col :span="14">
                <div class="card-text right-item">
                  {{ game.Info_P_ProtectVal }}
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20" type="flex">
              <el-col :span="10">
                <el-tooltip
                  content="储蓄越少，面对突发情况就越脆弱"
                  placement="right-start"
                >
                  <div class="card-text left-item">资金</div>
                </el-tooltip>
              </el-col>
              <el-col :span="14">
                <div
                  :style="{ color: game.now_money_color }"
                  class="card-text right-item"
                >
                  {{ game.now_money }} G
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="box-stat" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>日程提醒</span>
              </div>
            </template>

            <el-row :gutter="20" type="flex">
              <el-col :span="10">
                <el-tooltip
                  content="无防护无抗体情况下的感染概率，增强防疫知识可以更精确判断"
                  placement="right-start"
                >
                  <div class="card-text left-item">感染可能</div>
                </el-tooltip>
              </el-col>
              <el-col :span="14">
                <div
                  :style="{ color: game.Tip_P_NaturalInfect_color }"
                  class="card-text right-item"
                >
                  {{ game.Tip_P_NaturalInfect }}
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20" type="flex">
              <el-col :span="10">
                <el-tooltip content="衣食住行固定成本" placement="right-start">
                  <div class="card-text left-item">生活开销</div>
                </el-tooltip>
              </el-col>
              <el-col :span="14">
                <div class="card-text right-item">
                  {{ game.EXPENSE_BASIC }} G
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20" type="flex">
              <el-col :span="10">
                <el-tooltip
                  content="抵抗力下降时需要药物维持生活"
                  placement="right-start"
                >
                  <div class="card-text left-item">药物开销</div>
                </el-tooltip>
              </el-col>
              <el-col :span="14">
                <div class="card-text right-item">{{ game.expense_med }} G</div>
              </el-col>
            </el-row>

            <el-row :gutter="20" type="flex">
              <el-col :span="10">
                <el-tooltip
                  content="提升防护措施需要花更多的钱"
                  placement="right-start"
                >
                  <div class="card-text left-item">防疫开销</div>
                </el-tooltip>
              </el-col>
              <el-col :span="14">
                <div class="card-text right-item">
                  {{ game.expense_protect }} G
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-container>
        <el-main>
          <el-row :gutter="20" type="flex">
            <el-col :span="6">
              <el-card class="box-action" shadow="hover">
                <template #header>
                  <div class="action-header">
                    <el-tooltip content="这一周去工作" placement="top">
                      <el-button
                        type="primary"
                        size="large"
                        :disabled="game.workAble === false"
                        @click="work"
                        >出门工作
                      </el-button>
                    </el-tooltip>
                  </div>
                  <div class="action-info">{{ game.tip_Work }}</div>
                </template>

                <el-row :gutter="20" type="flex">
                  <el-col :span="12">
                    <div class="action-text left-item">感染可能</div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      :style="{ color: game.tip_Work_Infect_color }"
                      class="action-text right-item"
                    >
                      {{ game.tip_Work_Infect }}
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20" type="flex">
                  <el-col :span="12">
                    <div class="action-text left-item">获得工资</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="action-text right-item">
                      +{{ game.tip_worksalary }} G
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20" type="flex">
                  <el-col :span="12">
                    <div class="action-text left-item">生活开销</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="action-text right-item">
                      -{{ game.expense_total_work }} G
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>

            <el-col :span="6">
              <el-card class="box-action" shadow="hover">
                <template #header>
                  <div class="action-header">
                    <el-tooltip content="这一周去升级防疫设备" placement="top">
                      <el-button
                        type="primary"
                        size="large"
                        :disabled="game.studyAble === false"
                        @click="study"
                        >增强防疫
                      </el-button>
                    </el-tooltip>
                  </div>
                  <div class="action-info">{{ game.tip_Study }}</div>
                </template>

                <el-row :gutter="20" type="flex">
                  <el-col :span="12">
                    <div class="action-text left-item">感染可能</div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      :style="{ color: game.tip_Study_Infect_color }"
                      class="action-text right-item"
                    >
                      {{ game.tip_Study_Infect }}
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20" type="flex">
                  <el-col :span="12">
                    <div class="action-text left-item">防疫效果达到</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="action-text right-item">
                      {{ game.tip_nextProtectVal }}
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20" type="flex">
                  <el-col :span="12">
                    <div class="action-text left-item">生活开销</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="action-text right-item">
                      -{{ game.expense_total_study }} G
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>

            <el-col :span="6">
              <el-card class="box-action" shadow="hover">
                <template #header>
                  <div class="action-header">
                    <el-tooltip content="这一周就待在家" placement="top">
                      <el-button
                        type="primary"
                        size="large"
                        :disabled="game.sleepAble === false"
                        @click="sleep"
                        >在家休息
                      </el-button>
                    </el-tooltip>
                  </div>
                  <div class="action-info">{{ game.tip_Sleep }}</div>
                </template>

                <el-row :gutter="20" type="flex">
                  <el-col :span="12">
                    <div class="action-text left-item">生活开销</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="action-text right-item">
                      -{{ game.expense_total_sleep }} G
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>

            <el-col :span="6">
              <el-card class="box-action" shadow="hover">
                <template #header>
                  <div class="action-header">
                    <el-tooltip
                      content="这游戏为什么没有胜利结局"
                      placement="top"
                    >
                      <el-button
                        type="primary"
                        size="large"
                        :disabled="game.gameover === false"
                        @click="gameover"
                        >游戏结束
                      </el-button>
                    </el-tooltip>
                  </div>
                  <div class="action-info">
                    {{ game.tip_GameOver }}
                  </div>
                </template>

                <el-row :gutter="20" type="flex">
                  <el-col :span="12">
                    <div class="action-text left-item">DEAD</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="action-text right-item">END</div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<style scoped>
.el-container {
  max-width: 1200px;
}

.box-week {
  font-size: 28px;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box-stat {
  /*max-width: 360px;*/
  min-height: 100%;
}

.box-action {
  max-width: 300px;
  min-height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-header {
  display: flex;
  justify-content: center;
  align-items: center;
  top: 2px;
  position: relative;
}

.card-text {
  font-size: 14px;
  line-height: 16px;
  padding: 5px 0;
}

.action-info {
  white-space: pre-wrap;
  font-size: 10px;
  line-height: 12px;
  padding: 2px 0;
  color: gray;
}

.action-text {
  font-size: 14px;
  line-height: 16px;
  padding: 2px 0;
}

.left-item {
  text-align: right;
}

.right-item {
  text-align: left;
}
</style>
