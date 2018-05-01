<template>
<label class="input" :class="{focus, error: !isFormatted}" 
@focusin="focus = true" @focusout="focus = false" @input.once="init=true" autocomplete="true">
  <icon :name="name"/>
  <input :type="type" v-model="_value" :placeholder="placeholder"  :autofocus="autofocus" :autocomplete="autocomplete">
  <icon name="clear" class="clear" @click.native="clearContent"/>
</label>
</template>

<script>
import { checkFormatted } from '../../util/userUtil.js'
import Icon from './Icon'
export default {
  name: 'cus-input',
  props: ['name', 'type', 'placeholder', 'value', 'autofocus'],
  components: {
    icon: Icon
  },
  data: function () {
    return {
      init: false,
      focus: false
    }
  },
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    autocomplete: function () {
      if (this.name === 'email') {
        return 'email'
      } else return 'off'
    },
    isFormatted: function () {
      if (this.init) {
        return checkFormatted(this._value, this.name)
      } else {
        return true
      }
    }
  },
  methods: {
    clearContent: function () {
      this._value = ''
    }
  },
  created: function () {
    this.focus = this.autofocus
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.input {
  display: inline-block;
  width: 18.75rem;
  height: 3.125rem;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 0.5rem;
  border: 0.0625rem solid #77aaad;
  color: #666;
  &.focus {
    border: 0.0625rem solid #03a6ff;
  }
  &.error {
    border: 0.0625rem solid #ff4e50;
  }
  .icon {
    display: inline-block;
    fill: green;
    width: 2.5rem;
    height: 1.875rem;
    padding: 0.375rem;
    margin: 0;
    border-radius: 0.5rem 0 0 0.5rem;
    background: #fff;
    cursor: pointer;
    ~ span {
      color: black;
    }
  }
  .icon.clear {
    width: .75rem;
    height: .75rem;
    fill: #aaa;
    // height: 1.875rem;
    padding: 0;
    margin: 0 0.625rem;
    &:hover {
      fill: #03a6ff;
    }
    &:active {
      fill: green;
    }
  }
  input {
    font-size: 1rem;
    border: none;
    border-left: 0.0625rem solid green;
    padding-left: 0.625rem;
    flex-grow: 1;
    &.error {
      color: red;
    }
  }
}
</style>
