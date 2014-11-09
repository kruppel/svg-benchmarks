function times(num, callback) {
  while (num--) {
    callback();
  }
}

var INLINE_SVG = '<svg viewBox="297 388.7 18 18" enable-background="new 299 390.7 14 14" width="18" height="18" id="gear" y="0"><path fill="#999" d="M311.7 397.7c0-.9.5-1.6 1.3-2-.1-.5-.3-1-.6-1.4-.9.2-1.6-.1-2.3-.7-.6-.6-.8-1.4-.6-2.3-.3-.3-.8-.5-1.3-.6-.5.8-1.3 1.3-2.2 1.3s-1.7-.5-2.2-1.3c-.5.1-1 .3-1.4.6.2.9 0 1.6-.6 2.3-.6.6-1.4 1-2.3.7-.2.4-.4.9-.5 1.4.8.5 1.3 1.2 1.3 2 0 .9-.5 1.7-1.3 2.2.1.5.3 1 .6 1.4.9-.2 1.6 0 2.3.6.6.6.8 1.4.6 2.3.4.2.9.4 1.4.6.5-.8 1.3-1.3 2.2-1.3s1.7.5 2.2 1.3c.5-.1 1-.3 1.4-.6-.2-.9 0-1.6.6-2.3.6-.6 1.4-1 2.3-.7.1-.5.3-1 .4-1.5-.8-.4-1.3-1.1-1.3-2zm-5.7 3c-1.7 0-3-1.4-3-3 0-1.7 1.4-3 3-3 1.7 0 3 1.4 3 3 0 1.7-1.3 3-3 3z"/></svg>';

var SPRITED_SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="40" viewBox="0 0 20 40">' +
  INLINE_SVG +
  '<svg viewBox="297 388.7 18 18" enable-background="new 299 390.7 14 14" width="18" height="18" id="gear" y="20"><path fill="#555" d="M311.7 397.7c0-.9.5-1.6 1.3-2-.1-.5-.3-1-.6-1.4-.9.2-1.6-.1-2.3-.7-.6-.6-.8-1.4-.6-2.3-.3-.3-.8-.5-1.3-.6-.5.8-1.3 1.3-2.2 1.3s-1.7-.5-2.2-1.3c-.5.1-1 .3-1.4.6.2.9 0 1.6-.6 2.3-.6.6-1.4 1-2.3.7-.2.4-.4.9-.5 1.4.8.5 1.3 1.2 1.3 2 0 .9-.5 1.7-1.3 2.2.1.5.3 1 .6 1.4.9-.2 1.6 0 2.3.6.6.6.8 1.4.6 2.3.4.2.9.4 1.4.6.5-.8 1.3-1.3 2.2-1.3s1.7.5 2.2 1.3c.5-.1 1-.3 1.4-.6-.2-.9 0-1.6.6-2.3.6-.6 1.4-1 2.3-.7.1-.5.3-1 .4-1.5-.8-.4-1.3-1.1-1.3-2zm-5.7 3c-1.7 0-3-1.4-3-3 0-1.7 1.4-3 3-3 1.7 0 3 1.4 3 3 0 1.7-1.3 3-3 3z"/></svg>' +
  '</svg>';

function addStylesheet() {
  var style = document.createElement('style');

  style.innerHTML = '.gear{display:inline-block;}.gear-wo-bg{width:14px;height:14px}.gear-w-bg{' +
   'transition:background-position 1ms ease;background-image:url(\'data:image/svg+xml;utf8,' + SPRITED_SVG + '\');' +
   'background-position:-2px -2px;width:14px;height:14px;}.gear-w-bg.hover{background-position:-2px 18px;}.gear-wo-bg path{transition:fill 1ms ease;}.gear-wo-bg.hover path{fill:#555;}';

  document.head.appendChild(style);
}

function addSVG(fragment) {
  var div = document.createElement('div');
  div.className = 'gear gear-wo-bg';
  div.innerHTML = INLINE_SVG;
  fragment.appendChild(div);
  return div;
}

function addBG(fragment) {
  var div = document.createElement('div');
  div.className = 'gear gear-w-bg';
  fragment.appendChild(div);
  return div;
}

suite('inline svg vs. svg image', function() {
  benchmark('inline svg', function(deferred) {
    var gears = this.gears,
        count;

    function check() {
      if (--count) return;

      gears.forEach(function(gear, index) {
        gear.removeEventListener('transitionend', check, false);
        gear.parentNode.removeChild(gear);
      });
      deferred.resolve();
    }

    gears = [].slice.call(gears);
    count = gears.length;
    gears.forEach(function(gear) {
      gear.addEventListener('transitionend', check, false);
      setTimeout(function() {
        gear.className += ' hover';
      }, 50);
    });
  }, { defer: true });

  benchmark('svg image', function(deferred) {
    var gears = this.gears,
        count;

    function check() {
      if (--count) return;

      gears.forEach(function(gear) {
        while (!gear.parentNode.parentNode) {}
        gear.removeEventListener('transitionend', check, false);
        gear.parentNode.removeChild(gear);
      });
      deferred.resolve();
    }

    gears = [].slice.call(gears);
    count = gears.length;
    gears.forEach(function(gear) {
      gear.addEventListener('transitionend', check, false);
      setTimeout(function() {
        gear.className += ' hover';
      }, 50);
    });
  }, { defer: true });
}, {

  setup: function() {
    var container = document.createElement('div'),
        fragment = document.createDocumentFragment();

    container.id = 'container-svg-test-' + this.benchmark.id;

    if (this.benchmark.name === 'inline svg') {
      times(10000, addSVG.bind(null, fragment));
    } else {
      times(10000, addBG.bind(null, fragment));
    }

    addStylesheet();
    container.appendChild(fragment);
    document.body.appendChild(container);

    this.gears = container.getElementsByClassName('gear');
  },

  teardown: function() {
    var container = document.getElementById('container-svg-test-' + this.benchmark.id);
        styles = document.head.getElementsByTagName('style');

    if (!container) return;

    container.parentNode.removeChild(container);
    document.head.removeChild(styles[styles.length - 1]);
  }

});
