<template>
  <div>
    <section
      v-if="!complete"
      class="conversation-main"
    >
      <conversation
        :items="items"
        :mcid="mcid"
        :responses.sync="responses"
        :complete.sync="complete"
        :error.sync="error"
      />
    </section>
    <section
      v-else
      class="conversation-results"
    >
      <thankyou
        :items="items"
        :responses="responses"
      />
    </section>
  </div>
</template>

<script>
import Conversation from '@/components/Conversation'
import Thankyou from '@/components/Thankyou'

export default {
  components: { Conversation, Thankyou },
  props: {
    mcid: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      complete: false,
      error: '',
      responses: {}
    }
  }
}
</script>

<style lang="scss">
</style>
