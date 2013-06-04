var workout = 30,
    rest = 10;

var playingSounds = true;

$(function(){
  $('.mute').tooltip();
  $('.unMute').tooltip();

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

function playSound(type){
  if (playingSounds) {
    var audioElement = document.createElement('audio');
    if (type === 'rest') {
      audioElement.setAttribute('src', 'bell.mp3');
    }else{
      audioElement.setAttribute('src', 'horn.mp3');
    }
    audioElement.setAttribute('autoplay', 'autoplay');
    $.get();
    audioElement.addEventListener("load", function() {
    audioElement.play();
    }, true);
    audioElement.load();
  } 
}