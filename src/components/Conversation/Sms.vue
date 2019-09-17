<template>
  <div :class="classNames">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    out: {
      type: Boolean,
      default: false
    },
    no: {
      type: Boolean,
      default: false
    },
    modify: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classNames () {
      let elemClasses = []
      elemClasses.push('sms')
      elemClasses.push(this.out ? 'out' : 'in')
      // if (this.no) elemClasses.push('no-sms')
      if (this.modify) elemClasses.push('modify')
      return elemClasses.join(' ')
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/conversation-sms";
</style>
