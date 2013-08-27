var SoundsFactory = function() {
  var sounds = {};
  
  soundManager.setup({
    url: '/assets/soundmanager2/swf/',
    onready: function() {
      sounds['bell'] = soundManager.createSound({
       url: '/assets/sounds/bell.mp3'
      });
      sounds['horn'] = soundManager.createSound({
       url: '/assets/sounds/horn.mp3'
      });
    }
  });

  function play(sound) {
    sounds[sound].play();
  }

  return {
    play: play
  };
};

var Sounds = SoundsFactory();