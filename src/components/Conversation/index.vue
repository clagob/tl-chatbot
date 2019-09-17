
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
    <h2 v-if="items === null || items.length === 0">Sorry there is nothing that I have to say. Bye!</h2>
  </div>
</template>

<script>
import Qa from '@/components/Conversation/Qa'
import Sms from '@/components/Conversation/Sms'
import Typing from '@/components/Conversation/Typing'
import Editor from '@/components/Conversation/Editor'

export default {
  components: {
    Qa,
    Sms,
    Typing,
    Editor
  },
  props: {
    complete: Boolean,
    items: {
      type: Array,
      default: () => []
    },
    responses: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      currentPosition: null
    }
  },
  methods: {
    loaded () {
      this.scrollToBottom()
    },
    next () {
      let nextId = null
      let currentItem = this.getItem(this.currentPosition)

      // Calculate next item
      if (typeof currentItem.next === 'function') {
        nextId = currentItem.next(currentItem.value)
      } else if (typeof currentItem.next === 'number' || typeof currentItem.next === 'string') {
        nextId = currentItem.next
      }

      // to do afterNext() hook

      // Move to next item
      if (nextId === null) {
        // END
        this.setResponses()
        this.$emit('update:complete', true)
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
      let responses = []
      this.items.map((item) => {
        if (item.mode === 'done' && item.complete) {
          responses.push({ id: item.id, value: item.value })
        }
      })
      this.$emit('update:responses', responses)
    },
    scrollToBottom () {
      const el = document.querySelector('.conversation')
      el.scrollIntoView({
        block: 'end',
        behavior: 'smooth'
      })
      // el.scrollTop = el.scrollHeight - el.clientHeight
    }
  },
  updated () {
    this.scrollToBottom()
  },
  created () {
    if (this.items.length > 0) {
      this.currentPosition = this.items[0].id
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/conversation";
</style>
