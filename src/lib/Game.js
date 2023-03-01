class Game {
  constructor(debug = false) {
    /** debug模式 */
    this.debug = debug;

    /** 当前周 */
    this.now_week = 1;
    /**
     * 当前是否被感染
     * 感染状态只持续1周
     * 感染当周只能休息
     * 如果感染当周资金不足开销，也不会游戏结束，直接负值，逼着下周工作
     */
    this.isInfected = false;
    /** 受感染次数 */
    this.infectCount = 0;
    /** 感染情况提示 */
    this.Info_Infected = "";
    /** 感染情况提示颜色 */
    this.Info_Infected_color = "#000000";

    /** 初始资金 */
    this.MONEY_START = 10000;
    /** 当前资金 */
    this.now_money = this.MONEY_START;
    /** 当前资金颜色 */
    this.now_money_color = "#000000";

    /** 当前抵抗力（0-100）  */
    this.now_resistance = 100;
    /**
     * 再次受感染时抵抗力下限要求
     * 抵抗力小于该值时再次受到感染则有几率游戏失败
     */
    this.RESITANCE_REQUIRE = 20;
    /**
     *  抵抗力上限（0-100）
     *  该值会随着受感染次数而下降
     */
    this.max_resistance = 100;
    /** 抵抗力上限颜色 */
    this.max_resistance_color = "#30bf30";
    /** 受感染后最大抵抗力系数 */
    this.RESITANCE_INFECTION_LOSS = 0.8;
    /** 抵抗力恢复系数 */
    this.RESITANCE_RECOVER = 0.2;
    /**
     * 最大抵抗力恢复值
     * 为了游戏难度还是不给恢复好了
     */
    this.MAX_RESITANCE_RECOVER = 0;
    /**
     * 因抵抗力下降而需要额外开销金额
     * 买药看病呀
     */
    this.expense_med = 0;
    /** 因抵抗力下降而需要额外开销金额系数 */
    this.EXPENSE_MED_COF = 5;

    /**
     * 默认传播周期20周
     * 为了提高游戏难度，随着游戏进行会逐渐缩短
     */
    this.DEFAULT_PERIOD = 20;
    /** 自然感染概率，无防护无抗体情况下 */
    this.P_NaturalInfect = 0;
    /** 自然感染概率提示 */
    this.Tip_P_NaturalInfect = "0%";
    /** 自然感染概率提示颜色 */
    this.Tip_P_NaturalInfect_color = "#000000";

    /**
     * 防疫增强次数
     * 就是提高防疫知识、改进防疫设备，降低感染概率
     * 购买防疫设备需要提高每周开销
     * 需要出门采购，有一定几率受感染
     * 资金不足时无法增强防疫
     */
    this.protectStudyCount = 0;
    /** 防疫抗感染系数 */
    this.P_ProtectVal = 0;
    /** 防疫抗感染系数提示 */
    this.Info_P_ProtectVal = "0%";
    /**
     * 防疫每周开销
     * 会随着防疫增强次数而增加
     */
    this.expense_protect = 0;
    /** 防疫每周开销系数 */
    this.EXPENSE_PROTECT_COF = 10;
    /**
     * 增强防疫行动受自然感染系数
     * 感染概率肯定要比工作小吧
     */
    this.STUDY_INFECT_MUL = 0.3;

    /**
     * 抗体水平（0-1）
     * 其实就是抗感染系数
     */
    this.P_Antibody = 0;
    /** 抗体水平提示 */
    this.Info_P_Antibody = "0%";
    /** 抗体水平提示颜色 */
    this.Info_P_Antibody_color = "#bf3030";
    /**
     * 抗体每周衰减系数
     * 抗体会随着抵抗力下降而增大衰减量
     */
    this.DEFAULT_ANTIBODY_DICREASE = 0.97;

    /** 初始每周工资 */
    this.WORKSALARY = 1000;
    /** 工作次数 */
    this.workCount = 0;
    /** 工作次数奖励工资系数 */
    this.WORKCOUNTBONUS = 20;

    /** 每周固定开销 */
    this.EXPENSE_BASIC = 400;
    /**
     * 工作时每周开销总和
     * 每周开销 = 固定开销+抵抗力下降开销+防疫开销
     */
    this.expense_total_work = 0;
    /**
     * 增强防疫时每周开销总和
     * 每周开销 = 固定开销+抵抗力下降开销+防疫开销/2
     */
    this.expense_total_study = 0;
    /**
     * 休息时每周开销总和
     * 每周开销 = 固定开销+抵抗力下降开销
     */
    this.expense_total_sleep = 0;

    /** 工作中受感染率 */
    this.P_Work_Infect = 0;
    /** 工作中受感染率 显示字符串 */
    this.tip_Work_Infect = "";
    /** 工作中受感染率颜色 */
    this.tip_Work_Infect_color = "#000000";
    /** 增强防疫中受感染率 */
    this.P_Study_Infect = 0;
    /** 增强防疫中受感染率 显示字符串 */
    this.tip_Study_Infect = "";
    /** 增强防疫中受感染率颜色 */
    this.tip_Study_Infect_color = "#000000";
    /** 本次工作将会得到的工资 */
    this.tip_worksalary = 0;
    /** 本次防疫增强后的新抗感染系数 */
    this.tip_nextProtectVal = 0;

    /** 工作提示 */
    this.tip_Work = "";
    /** 增强防疫提示 */
    this.tip_Study = "";
    /** 休息提示 */
    this.tip_Sleep = "";
    /** 游戏结束提示 */
    this.tip_GameOver = "";

    /**
     * 工作按钮状态
     * 不可以工作的情形：受感染时、游戏结束时
     */
    this.workAble = true;
    /**
     * 增强防疫按钮状态
     * 不可以增强防疫的情形：受感染时、金额不足时、游戏结束时
     */
    this.studyAble = true;
    /**
     * 休息按钮状态
     * 不可以休息的情形：金额不足时、游戏结束时
     */
    this.sleepAble = true;
    /**
     * 游戏结束按钮状态
     * 当抵抗力低于下限时再次受到感染则判断游戏失败
     */
    this.gameover = false;
  }

  cal_P_NaturalInfect() {
    let period =
      this.DEFAULT_PERIOD - Math.floor(this.now_week / this.DEFAULT_PERIOD);
    if (period <= 1) period = 1;
    let process = (this.now_week % period) - period / 2;
    let basic = Math.exp(0 - Math.pow(process, 2) / 5);
    let diff = this.now_week / 500;
    let total = basic + diff;
    if (total > 1) total = 1;
    this.P_NaturalInfect = total;
  }

  cal_P_ProtectVal() {
    if (this.protectStudyCount <= 0) this.P_ProtectVal = 0;
    else this.P_ProtectVal = 1 / (1 + 10 / this.protectStudyCount);
    this.Info_P_ProtectVal = (this.P_ProtectVal * 100).toFixed(0) + "%";
  }

  update_P_Antibody() {
    this.P_Antibody *=
      this.DEFAULT_ANTIBODY_DICREASE * Math.pow(this.max_resistance / 100, 0.1);
    this.Info_P_Antibody = (this.P_Antibody * 100).toFixed(0) + "%";
    this.Info_P_Antibody_color = this.getColorByValue(
      this.P_Antibody,
      0,
      1,
      true
    );
  }

  update_resistance() {
    this.now_resistance += Math.floor(
      this.max_resistance * this.RESITANCE_RECOVER
    );
    if (this.now_resistance > this.max_resistance)
      this.now_resistance = this.max_resistance;
    if (this.max_resistance < 100)
      this.max_resistance += this.MAX_RESITANCE_RECOVER;
    this.max_resistance_color = this.getColorByValue(
      this.max_resistance,
      0,
      100,
      true
    );
  }

  cal_expense_med() {
    let med = parseInt((80 - this.now_resistance) * this.EXPENSE_MED_COF);
    if (med < 0) med = 0;
    this.expense_med = med;
  }

  cal_expense_protect() {
    this.expense_protect = parseInt(
      this.protectStudyCount * this.EXPENSE_PROTECT_COF
    );
  }

  cal_expense_total() {
    this.expense_total_work =
      this.EXPENSE_BASIC + this.expense_med + this.expense_protect;
    this.expense_total_study =
      this.EXPENSE_BASIC +
      this.expense_med +
      Math.round(this.expense_protect / 2);
    this.expense_total_sleep = this.EXPENSE_BASIC + this.expense_med;
  }

  cal_P_Infect() {
    this.P_Work_Infect =
      this.P_NaturalInfect *
      (1 - 0.5 * this.P_ProtectVal) *
      (1 - this.P_Antibody);
    this.P_Study_Infect =
      this.P_NaturalInfect *
      (1 - 0.5 * this.P_ProtectVal) *
      (1 - this.P_Antibody) *
      this.STUDY_INFECT_MUL;
  }

  setTips() {
    this.Tip_P_NaturalInfect = this.getInfectTip(this.P_NaturalInfect);
    this.Tip_P_NaturalInfect_color = this.getInfectTipColor(
      this.P_NaturalInfect
    );
    this.tip_Work_Infect = this.getInfectTip(this.P_Work_Infect);
    this.tip_Work_Infect_color = this.getInfectTipColor(this.P_Work_Infect);
    this.tip_Study_Infect = this.getInfectTip(this.P_Study_Infect);
    this.tip_Study_Infect_color = this.getInfectTipColor(this.P_Study_Infect);
    this.tip_worksalary =
      this.WORKSALARY + this.workCount * this.WORKCOUNTBONUS;
    this.tip_nextProtectVal =
      ((1 / (1 + 10 / (this.protectStudyCount + 1))) * 100).toFixed(0) + "%";
  }

  beInfected() {
    this.isInfected = true;
    this.infectCount += 1;

    if (this.now_resistance < this.RESITANCE_REQUIRE) {
      let t = Math.random();
      if (
        t <=
        (this.RESITANCE_REQUIRE - this.now_resistance) / this.RESITANCE_REQUIRE
      )
        this.gameover = true;
    }

    this.now_resistance = 0;
    this.max_resistance = parseInt(
      this.max_resistance * this.RESITANCE_INFECTION_LOSS
    );
    this.P_Antibody = 1;
  }

  beCured() {
    this.isInfected = false;
  }

  getInfectTip(percent) {
    if (this.debug) return (percent * 100).toFixed(2) + "%";
    if (this.protectStudyCount <= 5) {
      if (percent < 0.15) return "极低";
      if (percent < 0.3) return "低";
      if (percent < 0.6) return "中";
      if (percent < 0.85) return "高";
      else return "极高";
    }
    if (this.protectStudyCount <= 10)
      return "大约" + Math.round(percent * 20) * 5 + "%";
    return Math.round(percent * 100) + "%";
  }

  getColorByValue(val, min, max, red2green = true) {
    let HSV2RGB = (H, S, V) => {
      let [R, G, B] = [0, 0, 0];
      if (S === 0) R = G = B = V;
      else {
        H /= 60;
        let i = Math.floor(H);
        let f = H - i;
        let a = V * (1 - S);
        let b = V * (1 - S * f);
        let c = V * (1 - S * (1 - f));
        switch (i) {
          case 0:
            R = V;
            G = c;
            B = a;
            break;
          case 1:
            R = b;
            G = V;
            B = a;
            break;
          case 2:
            R = a;
            G = V;
            B = c;
            break;
          case 3:
            R = a;
            G = b;
            B = V;
            break;
          case 4:
            R = c;
            G = a;
            B = V;
            break;
          case 5:
            R = V;
            G = a;
            B = b;
            break;
          default:
            console.log("HSV2color Error");
        }
        R = Math.floor(R * 255).toString(16);
        G = Math.floor(G * 255).toString(16);
        B = Math.floor(B * 255).toString(16);
        return [R, G, B];
      }
    };
    if (val < min) val = min;
    if (val > max) val = max;
    let pr = (val - min) / (max - min);
    if (pr > 1) pr = 1;
    if (pr < 0) pr = 0;
    if (!red2green) pr = 1 - pr;
    let h = parseInt(120 * pr);
    let [r, g, b] = HSV2RGB(h, 0.75, 0.75);
    if (r.length < 2) r = "0" + r;
    if (g.length < 2) g = "0" + g;
    if (b.length < 2) b = "0" + b;
    return "#" + r + g + b;
  }

  getInfectTipColor(percent) {
    if (this.debug) return this.getColorByValue(percent, 0, 1, false);
    if (this.protectStudyCount <= 5) {
      if (percent < 0.15) return this.getColorByValue(0.1, 0, 1, false);
      if (percent < 0.3) return this.getColorByValue(0.23, 0, 1, false);
      if (percent < 0.6) return this.getColorByValue(0.45, 0, 1, false);
      if (percent < 0.85) return this.getColorByValue(0.73, 0, 1, false);
      else return this.getColorByValue(0.92, 0, 1, false);
    }
    if (this.protectStudyCount <= 10)
      return this.getColorByValue(Math.round(percent * 20) / 20, 0, 1, false);
    return this.getColorByValue(percent, 0, 1, false);
  }

  setInfectInfo() {
    if (this.isInfected) {
      this.Info_Infected = "已感染";
      this.Info_Infected_color = "#bf3030";
    } else if (this.infectCount <= 0) {
      this.Info_Infected = "尚未被感染";
      this.Info_Infected_color = "#30bf30";
    } else {
      this.Info_Infected = "未感染（感染过" + this.infectCount + "次）";
      this.Info_Infected_color = "#30bf30";
    }
  }

  checkButtonStat() {
    this.now_money_color = "#000000";
    if (this.gameover) {
      this.workAble = false;
      this.tip_Work =
        "很不幸，你的身体没有抵抗过这一次感染\n再也不能赚钱养家了";
      this.studyAble = false;
      this.tip_Study =
        "很不幸，你的身体没有抵抗过这一次感染\n再也不能出门购物了";
      this.sleepAble = false;
      this.tip_Sleep =
        "很不幸，你的身体没有抵抗过这一次感染\n再也不能在家睡觉了";
      this.gameover = true;
      this.tip_GameOver = "希望下次能出生在没有疾病的世界\n ";
      return;
    }
    /** 如果感染当周资金不足开销，也不会游戏结束，直接负值，逼着下周工作 */
    if (this.isInfected) {
      this.workAble = false;
      this.tip_Work = "这周就别想着工作了\n休息一下吧";
      this.studyAble = false;
      this.tip_Study = "这周就别想着防疫了\n休息一下吧";
      this.sleepAble = true;
      this.tip_Sleep = "这周就在家好好休息\n下周就康复了";
      this.gameover = false;
      this.tip_GameOver =
        "当抵抗力低于" +
        this.RESITANCE_REQUIRE +
        "时再次受到感染\n则有几率丧命";
      return;
    }
    this.workAble = true;
    this.tip_Work = "冒着被感染的风险打工赚钱\n没有钱是万万不能的";
    this.gameover = false;
    this.tip_GameOver =
      "当抵抗力低于" + this.RESITANCE_REQUIRE + "时再次受到感染\n则有几率丧命";
    if (this.now_money < this.expense_total_study) {
      this.studyAble = false;
      this.now_money_color = "#bf3030";
      this.tip_Study = "我得有钱才能升级防疫装备\n只能去打工赚钱了";
    } else {
      this.studyAble = true;
      this.tip_Study = "提高防疫知识、改进防疫设备\n提高每周开销，需要出门采购";
    }
    if (this.now_money < this.expense_total_sleep) {
      this.sleepAble = false;
      this.now_money_color = "#bf3030";
      this.tip_Sleep = "我得有钱才能维持生计\n只能去打工赚钱了";
    } else {
      this.sleepAble = true;
      this.tip_Sleep = "能躲就躲，积蓄够用\n在家睡觉，岂不美哉";
    }
  }

  beforeAction() {
    this.cal_P_NaturalInfect();
    this.cal_P_ProtectVal();
    this.cal_expense_med();
    this.cal_expense_protect();
    this.cal_expense_total();
    this.cal_P_Infect();
    this.setTips();
    this.setInfectInfo();

    this.checkButtonStat();

    if (this.debug) console.log(this);
  }

  afterAction(getInfected) {
    this.now_week += 1;
    this.update_P_Antibody();
    this.update_resistance();
    if (this.isInfected) this.beCured();
    if (getInfected) this.beInfected();

    //new week
    this.beforeAction();
    return getInfected;
  }

  checkInfected(p) {
    let t = Math.random();
    if (t <= p) return true;
    return false;
  }

  work() {
    this.now_money += this.WORKSALARY + this.workCount * this.WORKCOUNTBONUS;
    this.workCount += 1;
    this.now_money -= this.expense_total_work;
    let getInfected = this.checkInfected(this.P_Work_Infect);
    return this.afterAction(getInfected);
  }

  study() {
    this.protectStudyCount += 1;
    this.now_money -= this.expense_total_study;
    let getInfected = this.checkInfected(this.P_Study_Infect);
    return this.afterAction(getInfected);
  }

  sleep() {
    this.now_money -= this.expense_total_sleep;
    return this.afterAction(false);
  }

  init() {
    this.gameover = false;
    this.now_week = 1;
    this.isInfected = false;
    this.infectCount = 0;
    this.now_money = this.MONEY_START;
    this.now_resistance = 100;
    this.max_resistance = 100;
    this.expense_med = 0;
    this.P_NaturalInfect = 0;
    this.protectStudyCount = 0;
    this.P_Antibody = 0;
    this.workCount = 0;

    this.beforeAction();
  }
}

module.exports = Game;
