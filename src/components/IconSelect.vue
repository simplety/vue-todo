<template>
<div class="icon-select" :value = "value" v-show="_show" >
  <div class="option" :class="{selected: opt.value === value}" v-for="(opt, index) in options" :key="index" @click="select(opt.value)">
    <icon name="star-inactive" class="star-inactive" v-for="(e,i) in Array(5-opt.value)" :key="i" />
    <icon name="star-active" class="star-active" v-for="(e,i) in Array(opt.value)" :key="5-opt.value+1+i"/>
  </div>
</div>

</template>
<script>
import Icon from './common/Icon'

export default {
  name: 'icon-select',
  components: {
    icon: Icon
  },
  props: ['value', 'show'],
  data: function () {
    return {
      options: [{
        label: '',
        value: 1
      }, {
        label: '',
        value: 2
      }, {
        label: '',
        value: 3
      }, {
        label: '',
        value: 4
      }, {
        label: '',
        value: 5
      }]
    }
  },
  computed: {
    _show: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    select (val) {
      this.$emit('input', val)
      this._show = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.icon-select {
  border: 1px solid #379392;
  border-radius: .5rem;
  padding: .5rem 1rem;
  background: #f1f1f1;
  @mixin triangle() {

  }
  &.top-right:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    border: .5rem solid transparent;
    border-bottom: .5rem solid #379392;
    position: absolute;
    top: -1rem;
    right: 1rem;
  }
  &.top-right:after {
    content: '';
    display: block;
    height: 0;
    width: 0;
    border: .5rem solid transparent;
    border-bottom: .5rem solid #f1f1f1;
    position: absolute;
    top: -.92rem;
    right: 1rem;
  }
  &.bottom-left:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    border: .5rem solid transparent;
    border-top: .5rem solid #379392;
    position: absolute;
    bottom: -1rem;
    left: 1rem;
  }
  &.bottom-left:after {
    content: '';
    display: block;
    height: 0;
    width: 0;
    border: .5rem solid transparent;
    border-top: .5rem solid #f1f1f1;
    position: absolute;
    bottom: -.92rem;
    left: 1rem;
  }
  &.bottom-right:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    border: .5rem solid transparent;
    border-top: .5rem solid #379392;
    position: absolute;
    bottom: -1rem;
    right: 1rem;
  }
  &.bottom-right:after {
    content: '';
    display: block;
    height: 0;
    width: 0;
    border: .5rem solid transparent;
    border-top: .5rem solid #f1f1f1;
    position: absolute;
    bottom: -.92rem;
    right: 1rem;
  }
}
.option {
  display: flex;
  border-top: 1px dotted #ccc;
  justify-content: flex-end;
  align-items: center;
  padding: .375rem 0;
  &.selected > svg{
    fill: #379392 !important;
  }
  &:first-child {
    border-top: none;
  }
  &:hover {
    cursor: pointer;
    >.icon {
      fill: #379392;
      &.star-active {
        fill: #379392;
      }
    }
  }
  >.icon {
    width: 2rem;
    height: 2rem;
    fill: #ABD0CE;
    &.star-active {
      fill: #77AAAD;
    }
  }
}
</style>
