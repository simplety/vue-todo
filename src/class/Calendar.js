import Date2 from './Date2.js'

export default class Calendar {
  constructor (date = new Date2()) {
    if (date instanceof Date2) {
      this.targDate = date
    } else if (date instanceof Date) {
      this.targDate = new Date2(date)
    } else {
      this.targDate = new Date2()
    }
  }
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
  get targMonthArr () {
    return this._generateMonthArr(this.targDate)
  }
  curMonthArr () {
    this.targDate = new Date2()
    return this._generateMonthArr(this.targDate)
  }
  nextMonthArr () {
    this.targDate = this.targDate.nextMonthArr
    return this._generateMonthArr(this.targDate)
  }
  prevMonthArr () {
    this.targDate = this.targDate.previousMonth
    return this._generateMonthArr(this.targDate)
  }
}
