/* eslint-disable vue/no-use-v-if-with-v-for */
<template>
  <div
    v-if="isNotHidden && isRealQA"
    class="conversation-qa"
    :class="{ active: isCurrent }"
  >
    <sms v-if="!isTyping">
      <p
        v-for="(val, index) in questions"
        :key="index"
      >
        {{ val }}
      </p>
    </sms>
    <sms v-if="isTyping">
      <typing />
    </sms>
    <sms
      v-if="!isTyping && !isMessage"
      out
      :no="showEditor"
      :modify="isDone"
    >
      <p
        v-if="showAnswer"
        @click="edit"
      >
        <span>{{ answer }}</span>
      </p>
      <div
        v-if="showOptions"
        class="options"
      >
        <label
          v-for="(val, key, index) in item.options"
          :key="key"
          :class="{active: key === item.value}"
          :data-value="key"
          @click="saveOptions(key, index)"
        >
          {{ val }}
        </label>
      </div>
      <editor
        v-if="showEditor"
        :item="item"
        @save="save"
        @notSaved="notSaved"
        @scrollToBottom="scrollToBottom"
      />
    </sms>
    <!-- <slot></slot> -->
  </div>
</template>

<script>
import Sms from '@/components/Conversation/Sms'
import Typing from '@/components/Conversation/Typing'
import Editor from '@/components/Conversation/Editor'
import DateFilter from '@/mixins/dateFilter'
export default {
  components: {
    Sms,
    Typing,
    Editor
  },
  mixins: [DateFilter],
  props: {
    start: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: null
    },
    current: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    questions () {
      return [].concat(this.item.question)
    },
    answer () {
      switch (this.item.type) {
        case 'options':
          return this.item.options[this.item.value]
        case 'date':
          return this.$options.filters.dateFormat(this.item.value)
        default:
          return this.item.value
      }
    },
    value () {
      // for watcher
      return this.item.value
    },
    mode () {
      return this.item.mode
    },
    isNotHidden () {
      return !(this.isMode('hidden') || this.isCurrentAnchester())
    },
    isTyping () {
      return this.isMode('typing')
    },
    isDone () {
      return this.isMode('done')
    },
    showAnswer () {
      return this.isMode('done') && this.item.complete
    },
    showEditor () {
      return this.isMode('edit') && this.item.type !== 'options'
    },
    showOptions () {
      return this.isMode('edit') && this.item.type === 'options'
    },
    isRealQA () {
      return this.item.type !== 'hidden'
    },
    isMessage () {
      return this.item.type === 'message'
    },
    isCurrent () {
      return this.item.id === this.current
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal !== '') {
        this.item.dirty = true
      } else if (newVal !== oldVal) {
        // re-edited
        // change the mode of the decendents
      }
    },
    current (newVal, oldVal) {
      if (newVal === this.item.id) {
        if (this.mode === 'hidden' && this.item.complete) {
          // Down to the next not already answered question
          this.setModeDone()
          this.next()
        } else if (this.mode === 'hidden') {
          this.loading()
        }
      }
    }
  },
  created () {
    if (this.start) {
      this.loading()
    }
  },
  updated () {
    this.$emit('loaded')
  },
  methods: {
    loading () {
      this.setModeTyping()
      setTimeout(() => {
        if (this.isMessage) {
          this.save()
        } else {
          this.setModeEdit()
        }
      }, Math.floor(Math.random() * 2000) + 250)
    },
    saveOptions (value, index) {
      this.item.value = value
      this.save()
    },
    save () {
      this.item.complete = true
      this.item.dirty = true
      this.setModeDone()
      this.next()
    },
    notSaved () {
      this.item.complete = false
      this.item.dirty = false
    },
    next () {
      this.$emit('next')
    },
    edit () {
      this.$emit('edit', this.item.id)
    },
    isCurrentAnchester () {
      // this.current < this.item.id
      let parent = false
      for (const item of this.$parent.items) {
        if (item.id === this.item.id) {
          break
        }
        if (item.id === this.current) {
          parent = true
        }
      }
      return parent
    },
    isMode (value) {
      if (this.item.mode === value) {
        return true
      }
      return false
    },
    setMode (value) {
      this.item.mode = value
    },
    setModeHidden () {
      this.setMode('hidden')
    },
    setModeTyping () {
      this.setMode('typing')
    },
    setModeEdit () {
      this.setMode('edit')
    },
    setModeDone () {
      this.setMode('done')
    },
    scrollToBottom () {
      this.$emit('scrollToBottom')
    }
  }
}
</script>

<style lang="scss">
// @import "../../assets/scss/conversation-qa";
</style>
