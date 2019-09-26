export default {
  filters: {
    // dateInput: function (value) {
    //   // dd/mm/yyyy to yyyy-mm-dd
    //   if (!value) return ''
    //   value = value.toString()
    //   const x = value.split('/')
    //   const d = new Date(x[2] + '-' + x[1] + '-' + x[0])
    //   if (d.toString() !== 'Invalid Date') {
    //     return x[2] + '-' + x[1] + '-' + x[0]
    //   } else {
    //     return ''
    //   }
    // },
    dateFormat: function (value) {
      // yyyy-mm-dd to dd/mm/yyyy
      if (!value) return ''
      value = value.toString()
      const x = value.split('-')
      const d = new Date(value)
      if (d.toString() !== 'Invalid Date') {
        return x[2] + '/' + x[1] + '/' + x[0]
      } else {
        return ''
      }
    },
    dateTimeFormat: function (value) {
      // yyyy-mm-dd hh:mm:ss to dd/mm/yyyy hh:mm:ss
      if (!value) return ''
      value = value.toString()
      const x = value.split(' ')
      if (x.length > 1) {
        return this.$options.filters.dateFormat(x[0]) + ' ' + x[1]
      } else {
        return value
      }
    }
  },
  beforeCreate () {
    this.$options.filters.dateTimeFormat = this.$options.filters.dateTimeFormat.bind(this)
  }
}
