<template>
  <div
    id="thinklife-conversation-1"
    class="thinklife-conversation"
  >
    <conversation
      :mcid="mcid"
      :redirect="redirect"
      :items="items"
    />
  </div>
</template>

<script>
import Conversation from '@/components/Conversation'
import Millenial from '@/items/millenial'

export default {
  // name: 'App1',
  components: { Conversation },
  mixins: [Millenial],
  data () {
    return {
      mcid: document.getElementById('thinklife-conversation-1').dataset.mcid || '0',
      redirect: document.getElementById('thinklife-conversation-1').dataset.redirect || '/thank-you/'
    }
  }
}
</script>

<style lang="scss">
@import "assets/scss/app1.scss";
</style>
