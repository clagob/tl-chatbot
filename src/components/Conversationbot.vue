<template>
  <div>
    <section class="conversation-main">
      <conversation
        :items="items"
        :mcid="mcid"
        :responses.sync="responses"
        :error.sync="error"
        @success="success"
      />
      <div
        v-if="error"
        class="conversation-error"
      >
        {{ error }}
      </div>
    </section>
    <!-- <section
      v-else
      class="conversation-results"
    >
      <thankyou
        :items="items"
        :responses="responses"
      />
    </section> -->
  </div>
</template>

<script>
import Conversation from '@/components/Conversation'
// import Thankyou from '@/components/Thankyou'

export default {
  components: { Conversation },
  props: {
    mcid: {
      type: String,
      default: ''
    },
    redirect: {
      type: String,
      default: '/thank-you/'
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // complete: false,
      error: '',
      responses: {}
    }
  },
  methods: {
    success () {
      // SAVE responses on session storage
      sessionStorage.setItem('conversation', JSON.stringify(this.responses))
      // Redirect to
      if (/^https?:\/\//i.test(this.redirect)) {
        window.location = this.redirect + '?result=success'
      } else {
        window.location.pathname = this.redirect + '?result=success'
      }
    }
  }
}
</script>

<style lang="scss">
</style>
