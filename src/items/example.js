import pattern from '@/lib/pattern'

export default {
  data () {
    return {
      items: [
        {
          id: 'A',
          question: 'I want to pay off my debts💳/leave money 💷 behind for my family when I die.',
          type: 'options',
          options: { yes: 'Yes! I want to leave my family 👨‍👩‍👧‍👦 without issues.', no: 'No, I am already sorted.' },
          value: '',
          next: 'postcode',
          // start: true,
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'postcode',
          question: 'Please enter the postcode where you live? 🏡',
          type: 'postcode',
          required: true,
          pattern: pattern.postcodeUK,
          preAnswer: 'The postcode where I live is ',
          placeholder: 'AB123XZ',
          value: '',
          next: 'telephone2',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'telephone2',
          question: 'What is your telephone number 🇬🇧📱📞☎?',
          type: 'tel',
          required: true,
          pattern: pattern.phonesUK,
          preAnswer: 'Please call me on ',
          placeholder: '07#########',
          value: '',
          next: 'MSG-1',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'MSG-1',
          question: 'This is just a text not a question',
          type: 'message',
          value: '',
          next: 'B',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'B',
          question: 'I want to be able to support myself/my family financially if I become unwell. 🏥',
          type: 'options',
          options: { yes: 'Correct! 👍', no: 'No, I don\'t consider that.' },
          value: '',
          next: 'age',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'age',
          question: 'If you don\'t mind, may I ask your age?',
          type: 'number',
          min: 18,
          max: 69,
          required: true,
          preAnswer: 'I am ',
          placeholder: '##',
          postAnswer: ' years old.',
          value: '',
          next: 'dob',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'dob',
          question: 'Please enter your date of birth? 🎂🍾🥂',
          type: 'date',
          required: true,
          min: this.ageToDbDate(69),
          max: this.ageToDbDate(18),
          preAnswer: 'I was born on ',
          placeholder: 'dd/mm/yyyy',
          value: '',
          next: 'email',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'C',
          question: 'I want to be able to return to work asap if I become unwell.',
          type: 'options',
          options: { yes: 'Definitely! I cannot afford to stay at home unpaid.', no: 'No, I can have a period not working.' },
          value: '',
          next: 'FORK1',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'FORK1',
          type: 'hidden',
          next: (val) => {
            // A || B
            if (this.isYes('A') || this.isYes('B')) {
              return 'Q1'
            }
            return 'Q4'
          },
          complete: true,
          mode: 'hidden'
        },
        {
          id: 'Q1',
          question: 'Do you have a mortgage?',
          type: 'options',
          options: { yes: 'Yes 👍', no: 'No 👎' },
          value: '',
          next: (val) => {
            switch (val) {
              case 'yes':
                return 'M1'
              case 'no':
                return 'Q2'
            }
          },
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'M1',
          question: 'Your mortgage outstanding balance?',
          type: 'number',
          placeholder: 'Your outstanding balance...',
          value: '',
          next: 'M2',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'M2',
          question: 'Your mortgage remaining term?',
          type: 'number',
          placeholder: 'Your remaining years...',
          value: '',
          next: 'M3',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'M3',
          question: 'What type of mortgage?',
          type: 'options',
          options: { repayment: 'Repayment (interest and capital)', 'interest only': 'Interest Only' },
          value: '',
          next: 'M4',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'M4',
          question: 'Your monthly mortgage payment?',
          type: 'number',
          placeholder: 'Your montly payment...',
          value: '',
          next: 'Q2',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'Q2',
          question: 'Do you have children under the age of 21?',
          type: 'options',
          options: { yes: 'Yes 👍', no: 'No 👎' },
          value: '',
          next: (val) => {
            switch (val) {
              case 'yes':
                return 'C2'
              case 'no':
                return 'F1'
            }
          },
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'C2',
          question: 'What is the age of your youngest child under 21?',
          type: 'number',
          placeholder: 'Your youngest child age...',
          value: '',
          next: 'F1',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'Q3',
          question: 'Is there anyone who relies on you financially?',
          type: 'options',
          options: { yes: 'Yes 👍', no: 'No 👎' },
          value: '',
          next: (val) => {
            switch (val) {
              case 'yes':
                return 'F1'
              case 'no':
                return 'CC1'
            }
          },
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'F1',
          question: 'Your monthly take-home pay?',
          type: 'number',
          placeholder: 'Your monthly income...',
          value: '',
          next: 'F2',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'F2',
          question: 'Total monthly household outgoings?',
          type: 'number',
          placeholder: 'Total monthly household outgoings...',
          value: '',
          next: 'F3',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'F3',
          question: 'Spouse/Partner?',
          type: 'options',
          options: { yes: 'Yes 👍', no: 'No 👎' },
          value: '',
          next: (val) => {
            switch (val) {
              case 'yes':
                return 'F4'
              case 'no':
                return 'FORK2'
            }
          },
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'F4',
          question: 'Partner monthly take-home pay?',
          type: 'number',
          placeholder: 'Partner monthly income...',
          value: '',
          next: 'FORK2',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'FORK2',
          type: 'hidden',
          next: (val) => {
            // A || B
            if (this.isYes('B') || this.isYes('C')) {
              return 'Q4'
            }
            return 'Q4'
          },
          complete: true,
          mode: 'hidden'
        },
        {
          id: 'Q4',
          question: 'Do you have a health insurance?',
          type: 'options',
          options: { yes: 'Yes 👍', no: 'No 👎' },
          value: '',
          next: 'email',
          complete: false,
          mode: 'hidden'
        },
        // {
        //   id: 2,
        //   question: 'Please answer 💳 to Q2?',
        //   type: 'options',
        //   options: {'val1': 'Option 1 tel 🚬😍👋', 'val2': 'Option 2 number 🚭🐒 :)', 'val3': 'Option 3 date 😂'},
        //   next: (val) => {
        //     switch (val) {
        //       case 'val1':
        //         return 3
        //       case 'val2':
        //         return 4
        //       case 'val3':
        //         return 5
        //     }
        //   },
        //   value: '',
        //   complete: false,
        //   mode: 'hidden'
        // },
        // {
        //   id: 3,
        //   question: 'Please answer to Q3🇬🇧 📱📞☎ ?',
        //   type: 'tel',
        //   placeholder: 'Your telephone...',
        //   value: '',
        //   next: 'firstname',
        //   complete: false,
        //   mode: 'hidden'
        // },
        // {
        //   id: 4,
        //   question: 'Please answer 📱 to Q4?',
        //   type: 'number',
        //   placeholder: 'Your age...',
        //   value: '',
        //   next: 'firstname',
        //   complete: false,
        //   mode: 'hidden'
        // },
        // {
        //   id: 5,
        //   question: 'Please answer to Q5?',
        //   type: 'date',
        //   placeholder: 'Your date of purchase...',
        //   value: '',
        //   next: 'firstname',
        //   complete: false,
        //   mode: 'hidden'
        // },
        {
          id: 'email',
          question: 'What is your email address?',
          type: 'email',
          required: true,
          pattern: pattern.email,
          preAnswer: 'My email address is ',
          placeholder: 'name@email.com',
          value: '',
          next: 'firstname',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'firstname',
          question: 'What is your first name?',
          type: 'text',
          required: true,
          minlength: 1,
          pattern: pattern.name,
          preAnswer: 'My first name is ',
          placeholder: '',
          value: '',
          next: 'lastname',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'lastname',
          question: 'What is your last name?',
          type: 'text',
          required: true,
          minlength: 2,
          pattern: pattern.name,
          preAnswer: 'My last name is ',
          placeholder: '',
          value: '',
          next: 'telephone',
          complete: false,
          mode: 'hidden'
        },
        {
          id: 'telephone',
          question: 'What is your telephone number 🇬🇧📱📞☎?',
          type: 'tel',
          required: true,
          pattern: pattern.phonesUK,
          preAnswer: 'Please call me on ',
          placeholder: '07#########',
          value: '',
          next: null,
          complete: false,
          mode: 'hidden'
        }
      ]
    }
  }
}
