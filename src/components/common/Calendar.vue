<template>
  <div class="calendar" :class="{active: _show}">
    <div class="title">
      <span>{{targDate.year()}}年{{targDate.month()}}月</span>
      <div class="wrap">
        <a href="javascript:void(0);" @click="prevMonth">&lt;</a>
        <a href="javascript:void(0)" @click="goToday">今天</a>
        <a href="javascript:void(0);" @click="nextMonth">&gt;</a>
      </div>
      <div class="wrap">
        <icon name="reset" @click.native="reset"/>
        <icon name="clear" @click.native="hidePanel"/>
      </div>
    </div>
    <ul class="weekdays">
      <li v-for="(weekday, i) in weekdays" :key="i">{{weekday}}</li>
    </ul>
    <div class="wrap">
      <ul class="days">
        <li v-for="(day, index) in dayArr" :key="index"
        :class="{'today': day.isToday, 'cur-month': day.isCurMonth, 'selected': day.isSelected}"
        @click="selectDate(day, index)">
          <span>{{day.date.day()}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Date2 from '../../class/Date2'
import Icon from './Icon'

export default {
  name: 'calendar',
  props: {
    show: {
      type: Boolean
    },
    value: {
      validator: function (value) {
        return value instanceof Date || value === null
      }
    }
  },
  components: {
    icon: Icon
  },
  data () {
    return {
      current: null,
      weekdays: { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' },
      targDate: null
    }
  },
  // watch: {
  // },
  computed: {
    dayArr () {
      return this._generateMonthArr(this.targDate)
      // return this.(this.targDate).targMonthArr
    },
    _show: {
      get () {
        // 切换组件时，重新初始化targDate
        if (this._value !== null) {
          this.targDate = new Date2(this._value)
        }
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    },
    _value: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  created: function () {
    this.current = new Date2()
    if (this._value !== null) {
      this.targDate = new Date2(this._value)
    } else {
      this.targDate = new Date2()
    }
  },
  methods: {
    selectDate: function (day) {
      this._value = day.date.date
      this.targDate = day.date
      this.hidePanel()
    },
    reset: function () {
      this._value = null
      this.targDate = new Date2()
    },
    goToday: function () {
      this.targDate = new Date2()
    },
    prevMonth: function () {
      this.targDate = this.targDate.previousMonth
    },
    nextMonth: function () {
      this.targDate = this.targDate.nextMonth
    },
    hidePanel: function () {
      this._show = false
    },
    showPanel: function () {
      this._show = true
    },
    _generateMonthArr (current) {
    // 根据一个既定的日期生成本月的 calendar 数组
      if (current instanceof Date) {
        current = new Date2(current)
      } else if (!(current instanceof Date2)) {
        return []
      }
      let startPadding = current.monthBeginning.weekday() || 0
      let endPadding = 6 - current.monthEnding.weekday() || 0
      let dayCount = current.monthEnding.day() || 0
      let startPaddingArr = Array(startPadding).fill(0).map((_, i) => {
        return {
          date: current.day(i + 1 - startPadding),
          isToday: false,
          isCurMonth: false,
          isSelected: false
        }
      })
      let endPaddingArr = Array(endPadding).fill(0).map((_, i) => {
        return {
          date: current.day(dayCount + i + 1),
          isToday: false,
          isCurMonth: false,
          isSelected: false
        }
      })
      let curMonthArr = Array(dayCount).fill(0).map((_, i) => {
        return {
          date: current.day(i + 1),
          isToday: false,
          isCurMonth: true,
          isSelected: false
        }
      })
      curMonthArr[current.day() - 1].isSelected = true
      curMonthArr[new Date2().day() - 1].isToday = true
      return [...startPaddingArr, ...curMonthArr, ...endPaddingArr]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
/* 作为组件，宽高等应该自适应，可调节 */
.calendar {
  width: 400px;
  border: 1px solid green;
  display: none;
  &.active {
    display: block;
  }
  .title {
    width: 100%;
    background: #379392;
    color: #f2f2f2;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: .5rem .5rem;
    >span{
      font-size: 1.25rem;
      text-align: left;
    }
    >.wrap {
      >a {
        color: #cdcdcd;
        padding: 0 .25rem;
        &:hover {
          color: #fff;
        }
      }
      >.icon {
        width: 1rem;
        height: 1rem;
        margin-left: .125rem;
        margin-bottom: -.125rem;
        fill: #cdcdcd;
        &:hover {
          cursor: pointer;
          fill: #fff;
        }
      }
    }
  }
  >.weekdays {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    background: #e3e5e9;
  }
  >.wrap {
    width: 100%;
    position: relative;
    &::before {
      content: "";
      display: inline-block;
      width: 0.1px;
      height: 0;
      padding-bottom: 75%;
    }
    .days {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      position: absolute;
      left: 0;
      top: 0;
      li {
        width: 14.28%;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #d1d1d1;
        border-top: 1px solid #d1d1d1;
        border-left: 1px solid #d1d1d1;
        > span {
          display: inline-block;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          line-height: 1.75rem;
          color: #999;
        }
        &:hover {
          cursor: not-allowed;
        }
        &.cur-month {
          cursor: pointer;
          background: #f1f1f1;
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          >span {
            color: #285943;
          }
          &:nth-child(7n + 1) {
            border-left: none;
          }
          &.today {
            > span {
              background: teal;
              color: #fff;
            }
          }
          &.selected {
            background: #f4f5f9;
            > span {
              line-height: 1.5rem;
              border: 0.125rem solid teal;
            }
            &:hover {
              background: #f1f1f1;
            }
          }
          &:hover {
            background: #D8E6E7;
          }
          &:active {
            background: #f4f5f9;
            > span {
              line-height: 1.5rem;
              border: 0.125rem solid teal;
            }
          }
        }
      }
    }
  }
}
</style>
