export default {
  methods: {
    getItem (id) {
      return this.items.find(item => item.id === id)
    },
    isYes (itemId) {
      return this.getItem(itemId).value === 'yes'
    },
    getResponse (id) {
      const item = this.responses.find(item => item.id === id)
      return item !== undefined ? item.value : undefined
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
