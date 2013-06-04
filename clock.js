var workout = 30,
    rest = 10;

var playingSounds = true;

$(function(){
  $('.start').show();
  $('.stop').hide();
  $('.start').on('click', start);
  $('.stop').on('click', stop);

  $('.mute').on('click', mute);
  $('.unMute').on('click', unMute);

  
  showSoundStatus(false);
  fitText();
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
  fitText();
  workoutTimer = setTimeout(go, (period*1000));
}

function go(){
  $('.getReady').hide();
  playSound('go');
  $('.drills li').removeClass('next');
  $($('.drills li')[nextExercise]).addClass('active');
  fitText();
  workoutTimer = setTimeout(doRest, (workout*1000));
}

function fitText(){
  $(window).off('resize.fittext orientationchange.fittext');
  $('body').fitText();
  $('.actions div').fitText(0.5,  {minFontSize: '40'});
  $('.drills li').css({fontSize: 'inherit'});
  $('.drills li').fitText(3, {minFontSize: '23'});
  var compress = 1;
  $('.active').fitText(compress);
  $('.next').fitText(compress);
}

function stop(e){
  e.preventDefault();
  clearTimeout(workoutTimer);
  $('.stop').hide();
  $('.start').show();
  nextExercise = -1;
  $('.drills li').removeClass('next');
  $('.drills li').removeClass('active');
  fitText();
}

var bell = document.createElement('audio');
bell.setAttribute('src', 'bell.mp3');

var horn = document.createElement('audio');
horn.setAttribute('src', 'horn.mp3');

$.get();

function playSound(type){
  if (playingSounds) {
    if (type === 'rest') {
      bell.play();
    }else{
      horn.play();
    }
  }
}