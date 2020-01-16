import pattern from '@/lib/pattern'
import ItemResponse from '@/mixins/itemResponse'

export default {
  mixins: [ItemResponse],
  data () {
    return {
      items: [
        {
          id: 'MSG-A',
          question: 'Hi! Let’s get you covered!',
          type: 'message',
          next: 'MSG-B',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'MSG-B',
          question: 'So, tell me about yourself…',
          type: 'message',
          next: 'your-firstname',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'your-firstname',
          question: 'What’s your first name?',
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
          question: () => {
            return this.getItem('your-firstname').value + ', what’s your last name?'
          },
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
          options: { 1: 'Just me 👤', 2: 'Me & my partner 👥' },
          value: '',
          next: 'MSG-C',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'MSG-C',
          question: 'Are you a smoker?',
          type: 'message',
          next: 'your-smoke-status',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'your-smoke-status',
          question: 'No bluffing!',
          type: 'options',
          options: { Y: 'I smoke sometimes 🚬', N: 'Nah, it’s not for me.' },
          value: '',
          next: 'your-dob',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'your-dob',
          question: 'Now, what’s your date of birth? 🎂',
          type: 'date',
          required: true,
          min: this.ageToDbDate(79),
          max: this.ageToDbDate(18),
          preAnswer: 'My birthday is ',
          placeholder: 'dd/mm/yyyy',
          value: '',
          next: 'FORK-PARTNER',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'FORK-PARTNER',
          type: 'hidden',
          next: () => {
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
          question: 'What’s your partner called?',
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
          question: () => {
            return 'What’s ' + this.getItem('p-firstname').value + '’s last name?'
          },
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
          question: () => {
            return 'And what’s ' + this.getItem('p-firstname').value + '’s date of birth? 🎂'
          },
          type: 'date',
          required: true,
          min: this.ageToDbDate(79),
          max: this.ageToDbDate(18),
          preAnswer: 'Their date of birth is ',
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
          options: { yes: 'I sure do! 👍', no: 'I’m unsure. 🤷' },
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
          question: 'Brilliant. Roughly how much?',
          type: 'number',
          min: 10000,
          max: 1000000,
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
          question: 'and for how long?',
          type: 'number',
          min: 5,
          max: 40,
          required: true,
          preAnswer: 'For ',
          placeholder: '##',
          postAnswer: ' years.',
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
          question: 'If we need to speak to you… 📞',
          type: 'tel',
          required: true,
          pattern: pattern.phonesUK,
          preAnswer: 'You can ring me on ',
          placeholder: '07#########',
          value: '',
          next: 'your-email',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'your-email',
          question: 'How about an email address, too?',
          type: 'email',
          required: true,
          pattern: pattern.email,
          preAnswer: 'My email is ',
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
