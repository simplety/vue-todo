<template>
<div id="SignUpAndLogIn">
  <h2 class="title" v-if="curUser == null">记录每日事项⧸⎩⎠⎞͏(・∀・)⎛͏⎝⎭⧹</h2>
  <div class="main">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
export default {
  name: 'signup-login',
  data: function () {
    return {
      curUser: null
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#SignUpAndLogIn {
  position: relative;
  > .title {
    text-align: center;
    font-size: 1.875rem;
    line-height: 1.5;
    color: #5a9367;
  }
  > .main {
    position: absolute;
    max-width: 37.5rem;
    top: 3.75rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 1.5rem 4rem;
    border-radius: 1.25rem;
    background: #a3c9c7;
    color: #3a5134;
    > .content {
      margin: 0 auto;
      text-align: center;
      > h4 {
        font-size: 1.25rem;
        font-weight: 500;
      }
      > .tip {
        color: #f1404b;
        font-size: 0.875rem;
        width: 18.75rem;
        margin-top: 0.25rem;
        height: 1.25rem;
        text-align: center;
        line-height: 1.25rem;
      }
    }

    > .content {
      > form {
        margin: 0;
        > .row {
          position: relative;
          left: 0;
          top: 0;
          width: 18.75rem;
          height: 2.625rem;
          font-size: 0;
          margin-bottom: 1.5rem;
          .status {
            position: absolute;
            left: 100%;
            top: 0;
            display: block;
            height: 1.5rem;
            width: 1.5rem;
            margin: 0.765rem 0.375rem;
          }
        }
        > a.submit {
          display: block;
          width: 18.75rem;
          height: 1.875rem;
          line-height: 1.875rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          background: #d8e9ef;
          border-radius: 0.5rem;
          color: #3a5134;
        }
        > .footer {
          display: flex;
          overflow: hidden;
          > a {
            margin-top: 0.5rem;
            color: #2b90d9;
            &:hover {
              color: #0080ff;
            }
          }
        }
      }
    }
  }
}
</style>
