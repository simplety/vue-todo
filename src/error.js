export function code2message (error) {
  let code = null
  let msg = ''
  if (typeof error === 'string') {
    code = Number(error)
  } else if (typeof error === 'number') {
    code = error
  } else if (typeof error.code === 'number') {
    code = error.code
  }
  switch (code) {
    case 200:
      msg = '用户名为空'
      break
    case 201:
      msg = '密码为空'
      break
    case 202:
      msg = '用户名已经被占用'
      break
    case 210:
      msg = '用户名密码不匹配'
      break
    case 211:
      msg = '找不到用户'
      break
    case 217:
      msg = '无效的用户名'
      break
    case 218:
      msg = '无效的密码'
      break
    case 219:
      msg = '登录失败次数超过限制'
      break
    default:
      msg = '登录失败，请重试'
  }
  return msg
}
