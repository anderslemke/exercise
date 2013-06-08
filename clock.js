var workout = 3,
    rest = 1;

var playingSounds = true;

$(function(){
  $('.start').show();
  $('.stop').hide();
  $('.start').on('click', start);
  $('.stop').on('click', stop);

  $('.mute').on('click', mute);
  $('.unMute').on('click', unMute);

  showSoundStatus(false);
});

var nextExercise = -1;
var workoutTimer, infoTimer;

function start(e){
  e.preventDefault();
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

function soundLoaded(type){
  
}

var bell = new Audio('bell.mp3');
bell.addEventListener("canplaythrough", soundLoaded('bell'), !1);
bell.load();

var horn = new Audio('horn.mp3');
horn.addEventListener("canplaythrough", soundLoaded('horn'), !1);
horn.load();

// $.get();

function playSound(type){
  if (playingSounds) {
    if (type === 'rest') {
      horn.play();
    }else{
      horn.play();
    }
  }
}