<template>
  <div id="thinklife-conversation-1">
    <!-- <router-view/> -->
    {{ mcid }}
    <conversationbot :mcid="mcid" />
  </div>
</template>

<script>
import Conversationbot from '@/components/Conversationbot'
export default {
  name: 'App1',
  components: { Conversationbot },
  data () {
    return {
      mcid: document.getElementById('thinklife-conversation-1').dataset.mcid
    }
  }
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
