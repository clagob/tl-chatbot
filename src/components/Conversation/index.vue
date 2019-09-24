
<template>
  <div class="conversation">
    <qa
      v-for="(item, index) in items"
      :key="item.id"
      :item="item"
      :start="index === 0"
      :current.sync="currentPosition"
      @next="next"
      @loaded="loaded"
      @edit="edit"
      @scrollToBottom="scrollToBottom"
    />
    <h2 v-if="items === null || items.length === 0">
      Sorry there is nothing that I have to say. Bye!
    </h2>
  </div>
</template>

<script>
import config from '@/../config'
import Qa from '@/components/Conversation/Qa'

export default {
  components: { Qa },
  props: {
    complete: Boolean,
    items: {
      type: Array,
      default: () => []
    },
    responses: {
      type: Object,
      default: () => {}
    },
    mcid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentPosition: null,
      lastPosition: null,
      errorMessage: ''
    }
  },
  updated () {
    this.scrollToBottom()
  },
  created () {
    if (this.items.length > 0) {
      this.currentPosition = this.items[0].id
    }
  },
  methods: {
    loaded () {
      this.scrollToBottom()
    },
    next () {
      let nextId = null
      const currentItem = this.getItem(this.currentPosition)

      // Calculate next item
      if (typeof currentItem.next === 'function') {
        nextId = currentItem.next(currentItem.value)
      } else if (typeof currentItem.next === 'number' || typeof currentItem.next === 'string') {
        nextId = currentItem.next
      }

      // Move to next item
      if (nextId === null) {
        // END
        this.lastPosition = currentItem.id
        this.setResponses()
        // Submit form now
        this.submit()
      } else {
        // call the next step.
        this.currentPosition = nextId
      }
    },
    edit (id) {
      this.currentPosition = id
      this.items.map((item) => {
        if (item.id === id) {
          item.mode = 'edit'
        }
      })
      this.resetDescendantModes()
    },
    getItem (id) {
      return this.items.find(item => item.id === id)
    },
    resetDescendantModes () {
      let hide = false
      this.items.map((item) => {
        if (hide) {
          item.mode = 'hidden'
        }
        if (item.id === this.currentPosition) {
          hide = true
        }
      })
    },
    setResponses () {
      const responses = {}
      this.items.map((item) => {
        if (item.mode === 'done' && item.complete) {
          responses[item.id] = item.value
        }
      })
      this.$emit('update:responses', responses)
    },
    scrollToBottom () {
      // const el = document.querySelector('.conversation')
      this.$el.scrollIntoView({
        block: 'end',
        behavior: 'smooth'
      })
      // el.scrollTop = el.scrollHeight - el.clientHeight
    },
    submit () {
      this.errorMessage = ''
      var data = this.responses
      data.mcid = this.mcid
      console.log(data)
      const apiUrl = config.IS_DEV ? config.dev.api.lunar : config.build.api.lunar
      this.$http({
        method: 'post',
        url: apiUrl,
        data: data
      })
        .then(response => {
          console.log('Successful Lunar submission.')
          console.log(response)
          if (response.status === 200) {
            if (response.data.status === '1') {
              // SUCCESS
              console.log('SUCCESS')
              console.log(response.data)
              this.$emit('update:complete', true)
            } else {
              // ERROR
              console.error(response.data)
              switch (data.status) {
                case '-3': // Mandatory field not found
                  this.errorMessage = 'Please check your data and try again. Mandatory field empty.'
                  break
                case '-5': // Invalid data type failed - Please ammend the fields
                  this.errorMessage = 'Please check your data and try again. (Invalid data type failed: ' + data.message.replace('Invalid XML received: ', '') + ')'
                  break
                default: // Generic error / other error
                  this.errorMessage = 'Please check your data and try again or contact us.'
              }
            }
          } else {
            this.errorMessage = 'OPS! An error occurred, and we are unable to proceed. Please contact us.'
          }
        })
        .catch(error => {
          console.error(error)
          this.errorMessage = 'An error occurred, and we are unable to proceed. Please contact us.'
        })
        .finally(() => {
          if (this.errorMessage !== null) {
            // ERROR
            this.$emit('update:error', this.errorMessage)
          }
        })
    }
  }
}
</script>

<style lang="scss">
// @import "../../assets/scss/conversation";
</style>
