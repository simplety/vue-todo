import AV from 'leancloud-storage'
import * as errorHandler from '../error.js'

function _checkUsernameFormatted (username) {
  // validate if it's a valid email address
  let result = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/i.test(username)
  return result
}
function _checkPasswordFormatted (password) {
  // include at least 8 letters
  // include at least 1 alphabet
  // include at least 1 number
  var result = false
  if (password.length >= 8) {
    result = /[a-zA-Z]/i.test(password) && /[0-9]/.test(password)
  }
  return result
}

export function checkUsernameTaken (username) {
  // check if the username have existed already
  if (typeof username !== 'string') return null
  return new Promise((resolve, reject) => {
    let query = new AV.Query('_User')
    query.equalTo('username', username)
    query.select('username')
    query.find().then((result) => {
      if (typeof result.length === 'number') {
        resolve(result.length === 1)
      }
    }, (err) => {
      reject(err)
    })
  })
}

export function checkFormatted (target, type) {
  let format = {
    username: _checkUsernameFormatted,
    password: _checkPasswordFormatted
  }
  if (typeof target === 'string' && typeof type === 'string') {
    return format[type](target)
  }
  if (typeof target === 'object' && type === undefined) {
    if ((typeof target.username === 'string') && (typeof target.password === 'string')) {
      return format.username(target.username) && format.password(target.password)
    }
  }
  return null
}

export function getCurrentUser () {
  let user = AV.User.current()
  if (user) {
    var { id, createdAt, attributes: { username, emailVerified }, _sessionToken } = user
    return { id, username, createdAt, emailVerified, _sessionToken }
  } else {
    return null
  }
}
export function logInByToken (token, done, undone) {
  AV.User.become(token)
    .then(function (val) {
      done(val)
    }, function (err) {
      throw new Error(err.code)
    }
    )
    .catch(
      function (err) {
        if (undone instanceof Function) {
          undone(err)
        }
      }
    )
}
export function logIn (user, done, undone) {
  AV.User.logIn(user.username, user.password)
    .then(function (val) {
      done(val)
    }, function (err) {
      throw new Error(err.code)
    }
    )
    .catch(
      function (err) {
        if (undone instanceof Function) {
          undone(err)
        }
      }
    )
}
export function logOut () {
  AV.User.logOut()
}
export function signUp (userData, done, undone) {
  // 检查数据all pass， && 不存在注入
  let userAV = new AV.User()
  userAV.setUsername(userData.username)
  userAV.setPassword(userData.password)
  userAV.setEmail(userData.username)
  userAV.signUp()
    .then(function (val) {
      done(val)
    }, function (err) {
      throw new Error(err.code)
    })
    .catch(function (err) {
      if (undone instanceof Function) {
        undone(err)
      }
    }
    )
}

export function resetPassword (email, done, undone) {
  AV.User.requestPasswordReset(email)
  .then(function (val) {
    done(val)
  }, function (err) {
    throw new Error(err.code)
  })
  .catch(function (err) {
    if (undone instanceof Function) {
      undone(err)
    }
  })
}
