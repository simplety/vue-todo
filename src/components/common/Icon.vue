<template>
<svg class="icon" :class="'icon-' + name" aria-hidden="true" :name="name">
  <use v-bind = "{'xlink:href' : '#icon-' + name}"></use>
</svg>
</template>

<script>
// import { checkFormatted } from '../../util/userUtil.js'

export default {
  name: 'icon',
  props: ['name']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.icon {
  display: inline-block;
  width: 1rem;
  height: 1rem;
}
</style>
