<template>
  <div
    id="thinklife-conversation-1"
    class="thinklife-conversation"
  >
    <conversationbot
      :mcid="mcid"
      :redirect="redirect"
      :items="items"
    />
  </div>
</template>

<script>
import Conversationbot from '@/components/Conversationbot'
import ItemResponse from '@/mixins/itemResponse'
import pattern from '@/lib/pattern'

export default {
  // name: 'App1',
  components: { Conversationbot },
  mixins: [ItemResponse],
  data () {
    return {
      mcid: document.getElementById('thinklife-conversation-1').dataset.mcid || '0',
      redirect: document.getElementById('thinklife-conversation-1').dataset.redirect || '/thank-you/',
      items: [
        {
          id: 'MSG-A',
          question: 'So, let’s get you covered!',
          type: 'message',
          value: '',
          next: 'MSG-B',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'MSG-B',
          question: 'Tell me about yourself...',
          type: 'message',
          value: '',
          next: 'your-firstname',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'your-firstname',
          question: 'What is your first name?',
          type: 'text',
          required: true,
          minlength: 1,
          maxlength: 50,
          pattern: pattern.name,
          preAnswer: 'My first name is ',
          placeholder: '',
          value: '',
          next: 'your-lastname',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'your-lastname',
          question: 'What is your last name?',
          type: 'text',
          required: true,
          minlength: 2,
          maxlength: 50,
          pattern: pattern.name,
          preAnswer: 'My last name is ',
          placeholder: '',
          value: '',
          next: 'quote-for',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'quote-for',
          question: 'Ok, who would you like to insure?',
          type: 'options',
          options: { 1: 'Just me 👍', 2: 'Me & my partner 👥💞' },
          value: '',
          next: 'MSG-C',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'MSG-C',
          question: 'Are you a smoker?',
          type: 'message',
          value: '',
          next: 'your-smoke-status',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'your-smoke-status',
          question: 'Remember, no white lies!',
          type: 'options',
          options: { Y: 'I smoke sometimes 🚬💨', N: 'No, it’s not for me.' },
          value: '',
          next: 'your-dob',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'your-dob',
          // question: 'Now, what is your date of birth ' + this.getItem('your-firstname').value + '? 🎂🍾🥂',
          question: 'Now, what is your date of birth #####? 🎂🍾🥂',
          type: 'date',
          required: true,
          min: this.ageToDbDate(69),
          max: this.ageToDbDate(18),
          preAnswer: 'My birthday is ',
          placeholder: 'dd/mm/yyyy',
          value: '',
          next: 'MSG-D',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'MSG-D',
          question: 'Nice! Save us some cake.',
          type: 'message',
          value: '',
          next: 'FORK-PARTNER',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'FORK-PARTNER',
          type: 'hidden',
          next: (val) => {
            if (this.isValue('quote-for', '2')) {
              return 'p-firstname'
            }
            return 'how-cover'
          },
          complete: true,
          mode: 'hidden'
        },
        {
          id: 'p-firstname',
          question: 'What should we call your partner?',
          type: 'text',
          required: true,
          minlength: 1,
          maxlength: 50,
          pattern: pattern.name,
          preAnswer: 'Their first name is ',
          placeholder: '',
          value: '',
          next: 'p-lastname',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'p-lastname',
          question: 'What is partner last name?',
          type: 'text',
          required: true,
          minlength: 2,
          maxlength: 50,
          pattern: pattern.name,
          preAnswer: 'Their last name is ',
          placeholder: '',
          value: '',
          next: 'p-dob',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'p-dob',
          question: 'And what is their date of birth? 🎂',
          type: 'date',
          required: true,
          min: this.ageToDbDate(69),
          max: this.ageToDbDate(18),
          preAnswer: 'My birthday is ',
          placeholder: 'dd/mm/yyyy',
          value: '',
          next: 'how-cover',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'how-cover',
          question: 'Do you know how much cover you’d like?',
          type: 'options',
          options: { yes: 'I sure do! 👍', no: 'I’m unsure.' },
          value: '',
          next: (val) => {
            switch (val) {
              case 'yes':
                return 'amount'
              case 'no':
                return 'MSG-E'
            }
          },
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'amount',
          question: 'Brilliant. Just say how much',
          type: 'number',
          min: 0,
          max: 10000000,
          required: true,
          preAnswer: 'I’d like £ ',
          placeholder: '######',
          // postAnswer: '',
          value: '',
          next: 'product-term',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'product-term',
          question: '... and for how long.',
          type: 'number',
          min: 1,
          max: 99,
          required: true,
          preAnswer: 'I’d like for ',
          placeholder: '##',
          postAnswer: ' years',
          value: '',
          next: 'MSG-E',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'MSG-E',
          question: 'Right, almost there!',
          type: 'message',
          value: '',
          next: 'your-telephone',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'your-telephone',
          question: 'What’s your best contact number? 🇬🇧📱📞☎',
          type: 'tel',
          required: true,
          pattern: pattern.phonesUK,
          preAnswer: 'You can reach me at ',
          placeholder: '07#########',
          value: '',
          next: 'your-email',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'your-email',
          question: 'How about an email?',
          type: 'email',
          required: true,
          pattern: pattern.email,
          preAnswer: 'I’m online at ',
          placeholder: 'name@email.com',
          value: '',
          next: 'LEGAL',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'LEGAL',
          question: 'Explanation: Legal',
          type: 'message',
          value: '',
          next: 'QUOTE',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'QUOTE',
          question: 'I want to be able to support myself/my family financially if I become unwell. 🏥',
          type: 'options',
          options: { yes: 'Get a quote 👍' },
          value: '',
          next: null,
          complete: false,
          mode: 'hidden'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.thinklife-conversation {
  font-family: sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  &,
  *,
  :after,
  :before {
    box-sizing: border-box;
  }
  @import "assets/scss/app1";
}
</style>
