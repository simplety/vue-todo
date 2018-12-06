import {capitalize, createRangeArr} from '../util/util.js'

export default class Date2 {
  constructor (date = new Date()) {
    this.date = new Date(date - 0)
  }
  toString () {
    // return `${this.year()}年${this.month()}月${this.day()}日`
  }
  year (n) {
    return this._proxySet('fullYear', n)
  }
  month (n) {
    return this._proxySet('month', n, 1)
  }
  day (n) {
    return this._proxySet('date', n)
  }
  weekday (n) {
    if (n) {
      throw new Error('cannot set weekday')
    }
    return this._proxySet('day', n)
  }
  get nextMonth () {
    let day = this.day()
    let month = this.month()
    let nextMonth = this.day(1).month(month + 1)
    if (day > nextMonth.monthEnding.day()) {
      return nextMonth.monthEnding
    } else {
      return nextMonth.day(day)
    }
  }
  get previousMonth () {
    let day = this.day()
    let month = this.month()
    let previousMonth = this.day(1).month(month - 1)
    if (day > previousMonth.monthEnding.day()) {
      return previousMonth.monthEnding
    } else {
      return previousMonth.day(day)
    }
  }
  get monthBeginning () {
    return this.day(1)
  }
  get monthEnding () {
    return this.day(1).month(this.month() + 1).day(0)
  }
  get clone () {
    return new Date2(this.date)
  }
  get localExp () {
    return [this.year(), this.month(), this.day()].join('/')
  }
  _proxySet (name, value, offset = 0) {
    if (value === undefined) {
      return this.date[`get${capitalize(name)}`]() + offset
    } else {
      let d = this.clone
      d.date[`set${capitalize(name)}`](value - offset)
      return d
    }
  }
}
