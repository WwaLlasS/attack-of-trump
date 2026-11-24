// Steering by tilting the device (accelerometer). Silently does nothing on
// devices or browsers without motion sensors (e.g. desktop computers).
var Tilt = (function () {
  // Same direction convention as the original Cordova build: iPhones and
  // other devices report the x axis with opposite signs.
  var isIphone = navigator.userAgent.indexOf('iPhone') !== -1;
  var gain = isIphone ? 100 : -100;
  var listening = false;
  var ax = 0;

  function onMotion(e) {
    var g = e.accelerationIncludingGravity;
    if (g && g.x !== null) ax = g.x;
  }

  function attach() {
    window.addEventListener('devicemotion', onMotion);
    listening = true;
  }

  // Call from a user gesture (tap or key press): iOS asks for permission then.
  function start() {
    if (listening || !('DeviceMotionEvent' in window)) return;
    var DME = window.DeviceMotionEvent;
    if (typeof DME.requestPermission === 'function') {
      DME.requestPermission().then(function (state) {
        if (state === 'granted') attach();
      }).catch(function () {});
    } else {
      attach();
    }
  }

  // Horizontal speed in px/s from the current tilt.
  function velocityX() {
    return ax * gain;
  }

  return { start: start, velocityX: velocityX };
})();
