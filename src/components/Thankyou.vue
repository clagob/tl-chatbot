<template>
  <div class="conversation-thankyou">
    <h1>Thank you!</h1>
    <p>
      Great news.. I’ve got some prices for you! I just need to check a few things to make sure you get the right cover at the best price.
      <br>
      I can do this in one quick call.
    </p>
    <h2>Here what we reccommend.</h2>
    <div>
      <div class="">
        <h3>Life Insurance</h3>
        <p>Monthly premium of <big>&pound; <span/></big></p>
        <ul>
          <li>Amount: {{ amountLI | currency }}</li>
          <li>Term: {{ termLI }}</li>
          <li>Type: {{ typeLI }}</li>
        </ul>
      </div>
      <div class="">
        <h3>Critical Illness</h3>
        <p>Monthly premium of <big>&pound; <span/></big></p>
        <ul>
          <li>Amount: {{ amountCI | currency }}</li>
          <li>Term: {{ termCI }}</li>
          <li>Type: {{ typeCI }}</li>
        </ul>
      </div>
      <div class="">
        <h3>PDI</h3>
        <p>Monthly premium of <big>&pound; <span/></big></p>
      </div>
    </div>
    <!-- <p><button @click="complete = false">Amend your answers</button></p> -->
  </div>
</template>

<script>
import ItemResponse from '@/mixins/itemResponse'
export default {
  mixins: [ItemResponse],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    responses: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    age () {
      // TODO calculate the age from DOB
      return this.int('age') + 1
    },
    amountLI () {
      let c2 = this.int('C2', 21)
      if (c2 > 21) {
        c2 = 21
      }
      if ((this.int('F2') - this.int('M4')) > this.int('F4')) {
        return this.int('M1') + ((21 - c2) * 12 * (this.int('F2') - this.int('M4') - this.int('F4')))
      }
      return this.int('M1')
    },
    termLI () {
      let age = 65
      let c2 = this.int('C2', 21)
      if (c2 > 21) {
        c2 = 21
      }
      if (this.age < 65) {
        age = this.age
      }
      if (this.int('M2') > 0 || c2 < 21) {
        return Math.max(this.int('M2'), (21 - c2))
      }
      // no mortgage and no kids
      return (65 - age)
    },
    typeLI () {
      if (this.isYes('Q1') && (this.getResponse('M3') === 'interest only') && !this.isYes('Q2')) {
        return 'Level'
      } else if (this.isYes('Q1') && this.isYes('Q2')) {
        return 'Increase'
      } else if (this.isYes('Q1')) {
        return 'Decrese'
      } else {
        return 'TBC'
      }
    },
    amountCI () {
      return (this.int('F2') - this.int('F4')) * 24
    },
    termCI () {
      if (this.age < 55) {
        return 55 - this.age
      }
      return 0
    },
    typeCI () {
      return this.typeLI
    }
  }
}
</script>

<style lang="scss">
</style>
