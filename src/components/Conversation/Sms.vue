<template>
  <div :class="classNames">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    out: {
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
      const elemClasses = []
      elemClasses.push('conversation-sms')
      elemClasses.push(this.out ? 'out' : 'in')
      if (this.modify) elemClasses.push('modify')
      return elemClasses.join(' ')
    }
  }
}
</script>
