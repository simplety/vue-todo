<template>
  <div id="find-password" class="content">
    <p v-show="error">发生错误，请稍后重试</p>
    <p v-show="!sended">点击<a href="javascript:void(0);" @click="resetPassword">这里</a>重设密码，邮件会发送至您的邮箱。</p>
    <p v-show="sended">邮件已经发送，请登录邮箱点击链接进行重设。</p>
    <router-link to="/login">返回登录页面</router-link>
  </div>
</template>

<script>
import { resetPassword } from '../util/userUtil.js'

export default {
  name: 'find-password',
  props: ['email'],
  data () {
    return {
      sended: false,
      error: false
    }
  },
  methods: {
    resetPassword: function () {
      resetPassword(this.email, function () {
        this.sended = true
      }.bind(this), function () {
        this.error = true
      }.bind(this))
    }
  },
  created: function () {
    if (!this.email) {
      this.$router.replace('login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  min-height: 10rem;
  > p {
    margin-top: 1rem;
    > a {
      color: #2b90d9;
      &:hover {
        color: #0080ff;
      }
    }
  }
  > a {
    padding: .5rem 0;
    margin-top: 2rem;
    color: #f1f1f1;
    background: #77AF9C;
    border-radius: .25rem;
    &:hover {
      color: #0080ff;
    }
  }
}
</style>
