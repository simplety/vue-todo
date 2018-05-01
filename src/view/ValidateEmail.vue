<template>
  <div class="validate">
    <p>{{tip}}</p>
    <p>邮箱验证OK后，可戳<a href="javascript:void(0);" @click="goTodo">这里</a>进入主页</p>
  </div>
</template>

<script>
import { getCurrentUser, logInByToken } from '../util/userUtil.js'
export default {
  name: 'validateEmail',
  data () {
    return {
      tip: ''
    }
  },
  methods: {
    goTodo: function () {
      // 检查当前user是否验证过邮箱，
      // 如果是则可以跳转
      // 如果没有，则提示
      // getCurrentUser() 是从本地缓存里获取，无法及时得到更新。
      let user = getCurrentUser()
      logInByToken(user._sessionToken, function (loginedUser) {
        if (loginedUser === null || loginedUser === undefined) {
          this.tip = '用户不存在'
          this.$router.push('/signup')
        } else {
          let {attributes: { emailVerified }} = loginedUser
          if (emailVerified) {
            this.$router.push('/todo')
          } else {
            this.tip = '还未验证成功，请确认已点击邮箱链接'
          }
        }
      }.bind(this))
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.validate {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  min-width: 18rem;
  min-height: 10rem;
  > p {
    margin: 0.5rem 0;
    > a {
      color: #2b90d9;
      &:hover {
        color: #0080ff;
      }
    }
  }
}
</style>
