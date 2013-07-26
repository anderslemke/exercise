$(document).ready(function () {
  var workout = 30,
  rest = 10;

  var playingSounds = true;
  var running = false;
  var rounds = 0;

  $(function(){
    $('.start').show();
    $('.stop').hide();
    $('.start').on('click', function(e){
      e.preventDefault();
      loadAndStart();
    });
    $('.share.facebook').on('click', function(e) {
      e.preventDefault();
      promptForFacebookThing();
    });
    $('.share.twitter').on('click', function(e) {
      e.preventDefault();
      window.open('http://twitter.com/share?text='+twitterText(), 'Share your workout', 'height=250,width=550');
    });
    $('.stop').on('click', stop);

    $('.mute').on('click', mute);
    $('.unMute').on('click', unMute);

    $(document).keyup(function(evt) {
      if (evt.keyCode == 32) {
        if (running) {
          stop(evt);
        }else{
          evt.preventDefault();
          loadAndStart();
        }
      }
    });

    $('.credits h3').on('click', function(e){
      $('.credits p').toggle();
    });

    showSoundStatus(false);
    showRoundStatus();
  });

  var nextExercise = -1;
  var workoutTimer, infoTimer;

  function start(){
    running = true;
    rounds = 0;
    showRoundStatus();
    $('.share').hide();
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

  function showRoundStatus(){
    $('div.counter').html(''+rounds);
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
    playSound('rest');
    period = period || rest;
    var element = $('.drills li.active');
    var index = $('.drills li').index(element);
    nextExercise = (index + 1) % $('.drills li').length;

    if (element.hasClass('last')) {
      rounds++;
      showRoundStatus();
    }

    element.removeClass('active');
    $($('.drills li')[nextExercise]).addClass('next');

    if (nextExercise > 2) {
      turnAround();
    }

    workoutTimer = setTimeout(go, (period*1000));
  }

  function turnAround(){
    var top = $($('.drills li')[0]);
    var list = $('.drills ol');
    top.remove();
    list.append(top);
  }

  function go(){
    playSound('go');
    var element = $('.drills li.next');
    $('.drills li').removeClass('next');
    element.addClass('active');
    workoutTimer = setTimeout(doRest, (workout*1000));
  }

  function stop(e){
    e.preventDefault();
    running = false;
    clearTimeout(workoutTimer);
    $('.stop').hide();
    $('.start').show();
    $('.share').show();
    $('.drills li').removeClass('next');
    $('.drills li').removeClass('active');

    reset();
  }

  function twitterText(){
    return primerText() + ' ' + iDidItText();
  }

  function iDidItText(){
    var text;
    switch(rounds){
      case 0:
        text = 'I didn\'t do it. Yet.';
        break;
      case 1:
        text = 'I just did it.';
        break;
      case 2:
        text = 'I just did it. Twice!';
        break;
      default:
        text = 'I just did it. '+ rounds + ' times!';
        break;
    }
    return text;
  }
  function primerText(){
    return 'It\'s very tough and you really get to sweat.';
  }

  function promptForFacebookThing(){
    alert('Getting Facebook on the line..');
    FB.api('/platform', function(response) {
        alert(response.company_overview);
      });
    FB.api(
      'me/scientificseven:complete',
      'post',
      {
        workout: "http://thescientificsevenminuteworkout.com/1.html"
      },
      function(response) {
        window.console.log(response);
        // handle the response
      }
    );
  }

  var firstElement = $('.drills li.first');

  function reset(){
    var all = $('.drills li');
    if (all.index(firstElement) !== 0) {
      turnAround();
      reset();
    }
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
    bell = new Audio('/assets/sounds/bell.mp3');
    bell.addEventListener("canplaythrough", soundLoaded('bell'), !1);
    bell.load();

    horn = new Audio('/assets/sounds/horn.mp3');
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