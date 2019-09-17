<template>
  <div id="app">
    <!-- <router-view/> -->
    <conversationbot />
  </div>
</template>

<script>
import Conversationbot from '@/components/Conversationbot'
export default {
  name: 'App',
  components: {Conversationbot}
}
</script>

<style lang="scss">
html {
  font-family: sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*,
:after,
:before {
  box-sizing: border-box;
}
</style>
