export default {
  methods: {
    getItem (id) {
      return this.items.find(item => item.id === id)
    },
    isYes (itemId) {
      return this.getItem(itemId).value === 'yes'
    },
    ageToDbDate (age) {
      // Age to yyyy-mm-dd
      age = parseInt(age) || 0
      const date = new Date()
      date.setFullYear(date.getFullYear() - age)
      return date.toISOString().split('T')[0]
    },
    getResponse (id) {
      // const item = this.responses.find(item => item.id === id)
      // return item !== undefined ? item.value : undefined
      return this.responses[id]
    },
    int (itemId, defaultValue) {
      defaultValue = parseInt(defaultValue) || 0
      if (isNaN(this.getResponse(itemId))) {
        return defaultValue
      }
      return parseInt(this.getResponse(itemId))
    }
  }
}
