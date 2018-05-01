<template>
<div id="logIn" class="content">
  <h4>登录</h4>
  <div class="tip">{{tip}}</div>
  <form @submit.prevent="logIn">
    <div class="row">
      <login-input type="text" name="username" v-model="userData.username" placeholder="电子邮箱" 
      autofocus="true"/>
    </div>
    <div class="row">
      <login-input type="password" name="password" v-model="userData.password" placeholder="密码" @keypress.enter.native="logIn"/>
    </div>
    <a class="submit" href="javascript:void(0)" @click="logIn">登录</a>
    <div class="footer">
      <a href="javascript:void(0)" @click = "goToSignUp">注册去啦</a>
      <a href="javascript:void(0)" @click = "goToFindPassword" >忘记密码</a>
    </div>
  </form>
</div>
</template>

<script>
import loginInput from '../components/common/Input.vue'
import router from 'vue-router'
import {checkFormatted, checkUsernameTaken, logIn, logOut, getCurrentUser} from '../util/userUtil.js'
import * as todoUtil from '../util/todoUtil.js'
import * as errorHandler from '../error.js'

export default {
  name: 'login',
  props: ['username'],
  components: { 'login-input': loginInput },
  data: function () {
    return {
      userData: {
        username: '',
        password: ''
      },
      tip: ''
    }
  },
  methods: {
    goToSignUp: function () {
      let username = checkFormatted(this.userData.username, 'username') ? this.userData.username : null
      this.$router.replace({name: 'signup', params: {username}})
    },
    goToFindPassword: async function () {
      let {username} = this.userData
      try {
        this.isUsernameTaken = await checkUsernameTaken(username)
        if (this.isUsernameTaken) {
          this.$router.push({name: 'find-password', params: {email: username}})
        } else {
          this.tip = '用户名不存在'
        }
      } finally { }
    },
    logIn: function () {
      let user = this.userData
      if (!checkFormatted(user.username, 'username')) {
        this.tip = '请输入合法电子邮件地址'
      } else if (user.password.length === 0) {
        this.tip = '请输入合法密码'
      } else {
        logIn(user, function () {
          this.$router.replace('/todo')
        }.bind(this), function (err) {
          this.tip = errorHandler.code2message(err.message)
          this.userData.password = ''
        }.bind(this))
      }
    },
    sessionHdler: function () {
      window.sessionStorage.setItem('logUser', this.userData.username)
    }
  },
  created: function () {
    window.addEventListener('beforeunload', this.sessionHdler.bind(this))
    if (this.username) {
      this.userData.username = this.username
    } else {
      this.userData.username = window.sessionStorage.getItem('logUser') || ''
    }
  },
  beforeDestory: function () {
  },
  destroyed: function () {
    window.removeEventListener('beforeunload', this.sessionHdler)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.footer {
  justify-content: space-between;
}
</style>
