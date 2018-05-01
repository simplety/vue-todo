export function throttle (fn, delay) {
  var timer = null
  return function () {
    var context = this
    var args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
export function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function createRangeArr (...val) {
  let from, to, arr
  if (typeof val[0] !== 'number') return []
  if (typeof val[1] !== 'number') {
    val.unshift(1)
  }
  [from, to] = [...val]
  return Array(to - from + 1).fill(0).map((_, i) => (i + from))
}
