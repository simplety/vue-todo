<template>
<div id="signUp" class="content">
  <h4>注册</h4>
  <div class="tip">{{tip}}</div>
  <form @submit.prevent="signUp">
    <div class="row">
      <login-input type="text" name="username" v-model="userData.username" placeholder="电子邮箱" 
      @focusout.native="checkUsernameTaken(userData.username)" v-focus/>
      <icon class="status" name="right" v-show="isFormattedUsername && isUsernameUntaken"/>
    </div>
    <div class="row">
      <login-input type="password" name="password" v-model="userData.password" placeholder="密码（8位以上的数字和字母）"></login-input>
      <icon class="status" name="right" v-show="isFormattedPassword"/>
    </div>
    <div class="row">
      <login-input type="password" name="password" v-model="userData.password2" placeholder="再次输入密码"
      @keypress.enter.native="signUp"/>
      <icon class="status" name="right" v-show="isFormattedPassword2 && isSamePassword"/>
    </div>
    <a class="submit" href="javascript:void(0)" @click.prevent="signUp">注册</a>
    <div class="footer">
      <a href="javascript:void(0)" @click = "goToLogIn">登录去啦</a>
    </div>
  </form>
</div>
</template>

<script>
import loginInput from '../components/common/Input.vue'
import Icon from '../components/common/Icon'
import { checkFormatted, checkUsernameTaken, getCurrentUser, signUp } from '../util/userUtil.js'
import * as todoUtil from '../util/todoUtil.js'
import * as errorHandler from '../error.js'

export default {
  name: 'signup',
  props: ['username'],
  components: {
    'login-input': loginInput,
    'icon': Icon
  },
  data: function () {
    return {
      userData: {
        username: '',
        password: '',
        password2: ''
      },
      isUsernameUntaken: false,
      tip: '',
      focusInput: ''
    }
  },
  computed: {
    isFormattedUsername: function () {
      let result = !!(checkFormatted(this.userData.username, 'username'))
      return result
    },
    isFormattedPassword: function () {
      return !!(checkFormatted(this.userData.password, 'password'))
    },
    isFormattedPassword2: function () {
      return !!(checkFormatted(this.userData.password2, 'password'))
    },
    isSamePassword: function () {
      return this.userData.password2 === this.userData.password
    }
  },
  methods: {
    goToLogIn: function () {
      let username = this.isFormattedUsername ? this.userData.username : ''
      this.$router.replace({name: 'login', params: {username}})
    },
    setTip: function (str) {
      this.tip = str
    },
    checkUsernameTaken: async function (username) {
      try {
        this.isUsernameUntaken = !(await checkUsernameTaken(username))
        if (!this.isUsernameUntaken) {
          this.tip = '用户名已经被占用'
        }
      } finally { }
    },
    signUp: function () {
      if (!this.isFormattedUsername || !this.isFormattedPassword || !this.isFormattedPassword2) { return }
      if (!this.isSamePassword || !this.isUsernameUntaken) { return }
      signUp(this.userData, function () {
        this.$router.push('/login/validate')
        this.tip = ''
      }.bind(this), function (err) {
        this.tip = errorHandler.code2message(err.message)
        this.userData = {
          username: '',
          password: ''
        }
      }.bind(this))
    },
    sessionHdler: function () {
      window.sessionStorage.setItem('signUser', this.userData.username)
    }
  },
  created: function () {
    window.addEventListener('beforeunload', this.sessionHdler.bind(this))
    // check if params passed by routing.
    if (this.username) {
      this.userData.username = this.username
    } else {
      this.userData.username = window.sessionStorage.getItem('user') || ''
    }
  },
  destroyed: function () {
    window.removeEventListener('beforeunload', this.sessionHdler)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.status {
  height: 3.125rem;
}
.footer {
  justify-content: center;
  > a {
    color: #2b90d9;
  }
}
</style>
