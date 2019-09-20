(function (d) {
  var h = (d.location.protocol === 'https:' ? 'https:' : 'http:')
  var e = null
  if (d.getElementsByClassName) {
    e = d.getElementsByClassName('thinklife-conversation')
  } else if (d.querySelectorAll) {
    e = d.querySelectorAll('.thinklife-conversation')
  }
  for (var i = 0; i < e.length; i++) {
    var r = d.createElement('script')
    var v = e.dataset.conversation || 0
    e.id = 'thinklife-conversation-' + v
    r.src = h + '//localhost:9001/conversation-' + v + '.js'
    r.async = !0
    d.querySelector('head').appendChild(r)
  }
})(document)

// function conversationCallback(data) {

// }
