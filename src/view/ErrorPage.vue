<template>
  <div class="error-page">
    <div class="main">
      <p>{{errorTip}}</p>
    </div>
    <router-link to="/login"></router-link>
  </div>
</template>

<script>
import {code2message} from '../error.js'
export default {
  name: 'error-page',
  props: ['errorId'],
  data () {
    return {
      errorTip: ''
    }
  },
  methods: {
  },
  created: function () {
    if (this.errorId === 'number' || this.errorId === null) {
      this.errorTip = this.code2message(this.errorId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.error-page {
  display: relative;
  .main {
    position: absolute;
    max-width: 37.5rem;
    top: 3.75rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 1.5rem 4rem;
    border-radius: 1.25rem;
    background: #a3c9c7;
    color: #3a5134;
  }
}
</style>
