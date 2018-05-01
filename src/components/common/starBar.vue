<template>
<div class="star-bar">
  <icon name="star-active" v-if="direction === 'left'" v-for="(star, _) in Array(count).fill(0)" :key="_" :data="_"/>
  <icon name="star-inactive" v-for="(star, _) in Array(max-count).fill(0)" :key="count+_" :data="count+_"/>
  <icon name="star-active" v-if="direction === 'right'" v-for="(star, _) in Array(count).fill(0)" :key="_" :data="max+_"/>
</div>
</template>

<script>
import Icon from './Icon'
export default {
  name: 'star-bar',
  props: {
    direction: {
      validator: (val) => (val === 'left' || val === 'right'),
      type: String,
      default: 'left'
    },
    count: {
      validator: (val) => (val > 0),
      type: Number,
      default: 1
    },
    max: {
      validator: (val) => (val > 0),
      type: Number,
      default: 5
    }},
  components: {
    icon: Icon
  },
  data: function () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.star-bar {
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
}
</style>
