<template>
  <section class="editor">
    <div
      class="error"
      aria-live="polite"
      :class="{show: invalidForm}"
      >
      <div v-if="invalidForm">
        <div v-for="(error, index) in errors" :key="index">
          {{error}}
        </div>
      </div>
    </div>
    <form novalidate
      v-if="item !== null"
      :class="{ invalid: invalidForm, validated: validated }"
      @submit.prevent="submit"
      >
      <div class="editor-content">
        {{item.preAnswer}}
        <input
          ref="input"
          v-model="item.value"
          :type="inputType"
          :placeholder="item.placeholder"
          :aria-placeholder="item.placeholder"
          :min="item.min"
          :max="item.max"
          :minlength="item.minlength"
          :maxlength="item.maxlength"
          :step="item.step"
          :pattern="item.pattern"
          :required="item.required"
          @keypress.enter="formValidated"
          :disabled="validating"
        />
        {{item.postAnswer}}
      </div>
      <button
        type="submit"
        @click="formValidated"
        :disabled="validating"
        >
        GO
      </button>
    </form>
  </section>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      invalidForm: false,
      validated: false,
      errors: [],
      valid: true,
      validating: false
    }
  },
  computed: {
    inputType () {
      switch (this.item.type.toLowerCase()) {
        case 'number':
          return 'number'
        case 'email':
          return 'email'
        case 'tel':
          return 'tel'
        case 'date':
        case 'dob':
          return 'date'
        case 'postcode':
        default:
          return 'text'
      }
    },
    isInvalid () {
      // TO FINISH
      //
      // console.log(this.$refs.input)
      // return this.$v.item.value.$anyError
      // if (this.$refs.input === undefined) {
      //   return false
      // }
      return !this.$refs.input.validity.valid
    }
  },
  methods: {
    formValidated () {
      this.validated = true
    },
    submit () {
      this.validating = true
      this.invalidForm = false
      this.$forceUpdate()
      this.validate()
    },
    save () {
      this.$emit('save')
      this.valid = true
      this.validating = false
      this.invalidForm = true
    },
    error () {
      this.valid = false
      this.validating = false
      this.setInvalidForm()
      this.$refs.input.focus()
      setTimeout(() => { this.$emit('scrollToBottom') }, 100)
      // this.$emit('scrollToBottom')
    },
    setInvalidForm () {
      this.invalidForm = true
      setTimeout(() => { this.invalidForm = false }, 5000)
    },
    validate () {
      this.errors = []
      this.valid = true
      switch (this.item.type.toLowerCase()) {
        case 'text':
          this.validateText()
          break
        case 'number':
          this.validateNumber()
          break
        case 'dob':
          this.validateDob()
          break
        case 'date':
          this.validateDate()
          break
        case 'postcode':
          this.item.value = this.item.value.toUpperCase()
          this.validatePostcode()
          break
        case 'email':
          this.validateEmail()
          break
        default:
          if (!this.validGeneric()) {
            this.error()
          } else {
            this.save()
          }
      }
    },
    validateText () {
      if (!this.validRequired() ||
          !this.validMinlength() ||
          !this.validMaxlength() ||
          !this.validPattern() ||
          !this.validGeneric()) {
        this.error()
      } else {
        this.save()
      }
    },
    validateNumber () {
      if (!this.validRequired() ||
          !this.validMin() ||
          !this.validMax() ||
          !this.validStep() ||
          !this.validPattern() ||
          !this.validGeneric()) {
        this.error()
      } else {
        this.save()
      }
    },
    validateDate () {
      if (!this.validRequired() ||
          !this.validMin() ||
          !this.validMax() ||
          !this.validGeneric()) {
        this.error()
      } else {
        this.save()
      }
    },
    validateDob () {
      this.validateDate()
    },
    validatePostcode () {
      if (!this.validRequired() ||
          !this.validPattern('Please specify a valid UK postcode') ||
          !this.validGeneric()) {
        this.error()
      } else {
        this.save()
      }
    },
    validateEmail () {
      if (!this.validRequired() ||
          !this.validPattern() ||
          !this.validGeneric()) {
        this.error()
      } else {
        this.save()
      }
    },
    validateTelephone () {
      if (!this.validRequired() ||
          !this.validPattern() ||
          !this.validGeneric()) {
        this.error()
      } else {
        // to do checkTelephone
        this.save()
      }
    },
    validRequired (msg) {
      if (this.item.required) {
        if (this.$refs.input.validity.valueMissing) {
          this.valid = false
          this.errors.push(msg || 'Please specify a value')
          return false
        }
      }
      return true
    },
    validMin (msg) {
      if (this.item.min && this.$refs.input.validity.rangeUnderflow) {
        this.valid = false
        this.errors.push(msg || 'Please specify a higher value')
        return false
      }
      return true
    },
    validMax (msg) {
      if (this.item.max && this.$refs.input.validity.rangeOverflow) {
        this.valid = false
        this.errors.push(msg || 'Please specify a lower value')
        return false
      }
      return true
    },
    validStep (msg) {
      if (this.item.step && this.$refs.input.validity.stepMismatch) {
        this.valid = false
        this.errors.push(msg || 'Please specify a valid value multiple of ' + this.item.step)
        return false
      }
      return true
    },
    validMinlength (msg) {
      if (this.item.minlength && this.$refs.input.validity.tooShort) {
        this.valid = false
        this.errors.push(msg || 'Please specify a longer value')
        return false
      }
      return true
    },
    validMaxlength (msg) {
      if (this.item.maxlength && this.$refs.input.validity.tooLong) {
        this.valid = false
        this.errors.push(msg || 'Please specify a shorter value')
        return false
      }
      return true
    },
    validPattern (msg) {
      if (this.item.pattern && this.$refs.input.validity.patternMismatch) {
        this.valid = false
        this.errors.push(msg || 'Please specify a valid value as per requested format')
        return false
      }
      return true
    },
    validGeneric (msg) {
      if (!this.$refs.input.validity.valid) {
        this.valid = false
        this.errors.push(msg || 'Please specify a valid value')
        return false
      }
      return true
    },
    // validUrl (msg) {
    //   if (this.inputType.toLowerCase() === 'url') {
    //     if (this.$refs.input.validity.typeMismatch) {
    //       this.valid = false
    //       this.errors.push(msg || 'Please specify a valid URL')
    //       return false
    //     }
    //   }
    //   return true
    // },
    checkTelephone (msg) {
      if (this.$refs.input.validity.valid) {
        this.validating = true
        this.$http.get('https://api.coindesk.com/v1/bpi/currentprice.json')
          .then(response => {
            if (response.error) {
              this.valid = false
              this.errors.push(msg || 'Please specify a valid UK phone number')
            }
          })
          .catch(error => {
            console.log(error)
          })
          .finally(() => (this.validating = false))
      }
    }
  },
  beforeDestroy () {
    if (this.isInvalid) {
      this.invalidForm = false
      // prevent jumping edit on a different QA and set as completed
      this.$emit('notSaved')
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/conversation-editor";
</style>
