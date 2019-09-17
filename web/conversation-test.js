(function() {
  var d = document,
  h = ('https:' === d.location.protocol ? 'https:' : 'http:'),
  e = void 0;
  if (d.getElementsByClassName) {
    e = d.getElementsByClassName('thinklife-conversation');
  } else if (d.querySelectorAll) {
    e = d.querySelectorAll('.thinklife-conversation');
  }
  for (var i=0; i < e.length; i++) {
    var r = d.createElement('script'),
    v = e.dataset.conversation || 0;
    e.id = 'thinklife-conversation-' + v,
    r.src  = h + '//localhost:9001/conversation/app-' + v + '.js',
    r.async = !0,
    d.querySelector("head").appendChild(r);
  }
})();

// function conversationCallback(data) {

// }
