$(document).ready(function () {
  var workout = 30,
  rest = 10;

  var playingSounds = false;

  $(function(){
    $('.start').show();
    $('.stop').hide();
    $('.start').on('click', function(e){
      e.preventDefault();
      loadAndStart();
    });
    $('.stop').on('click', stop);

    $('.mute').on('click', mute);
    $('.unMute').on('click', unMute);

    showSoundStatus(false);
  });

  var nextExercise = -1;
  var workoutTimer, infoTimer;

  function start(){
    $('.start').hide();
    $('.stop').show();
    doRest(3);
  }

  function mute(e){
    e.preventDefault();
    playingSounds = false;
    showSoundStatus(true);
  }

  function unMute(e){
    e.preventDefault();
    playingSounds = true;
    showSoundStatus(true);
  }

  function showSoundStatus(showInfo){
    if (showInfo) {
      $('.actions .info').show();
      clearTimeout(infoTimer);
      infoTimer = setTimeout(function(){$('.actions .info').fadeOut();}, 2000);
    }

    if (playingSounds) {
      $('.unMute').hide();
      $('.mute').show();
    }else{
      $('.mute').hide();
      $('.unMute').show();
    }
  }

  function doRest(period){
    period = period || rest;
    $('.getReady').show();
    playSound('rest');
    $('.drills li').removeClass('active');
    nextExercise = (nextExercise + 1) % $('.drills li').length;
    $($('.drills li')[nextExercise]).addClass('next');
    workoutTimer = setTimeout(go, (period*1000));
  }

  function go(){
    $('.getReady').hide();
    playSound('go');
    $('.drills li').removeClass('next');
    $($('.drills li')[nextExercise]).addClass('active');
    workoutTimer = setTimeout(doRest, (workout*1000));
  }

  function stop(e){
    e.preventDefault();
    clearTimeout(workoutTimer);
    $('.stop').hide();
    $('.start').show();
    nextExercise = -1;
    $('.drills li').removeClass('next');
    $('.drills li').removeClass('active');
  }

  var loadedFiles = 0;
  function soundLoaded(type){
    window.console.log('Loaded', type);
    loadedFiles = loadedFiles + 1;
    if (loadedFiles === 2) {
      start();
    }
  }

  var bell;
  var horn;

  function loadAndStart(){
    loadedFiles = 0;
    bell = new Audio('bell.mp3');
    bell.addEventListener("canplaythrough", soundLoaded('bell'), !1);
    bell.load();

    horn = new Audio('horn.mp3');
    horn.addEventListener("canplaythrough", soundLoaded('horn'), !1);
    horn.load();
  }

  function playSound(type){
    if (playingSounds) {
      if (type === 'rest') {
        bell.play();
      }else{
        horn.play();
      }
    }
  }
});