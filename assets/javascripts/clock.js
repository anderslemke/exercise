$(document).ready(function () {
  var workout = 30,
  rest = 10;

  var playingSounds = true;
  var running = false;
  var rounds = 0;

  $(function(){
    bind();
    $('.start').show();
    $('.stop').hide();

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

  function roundsText(){
    switch(rounds){
      case 1:
        return '1 round';
      default:
        return rounds+' rounds';
    }
  }

  function showModal(id) {
    $('.js-rounds').html(roundsText());
    $(id).modal();
  }

  function promptForFacebookThing(){
    if (facebookConnected) {
      showModal('#facebookPostModal');
    }else{
      showModal('#facebookConnectModal');
    }
  }

  function bind(){
    $('.start').on('click', function(e){
      e.preventDefault();
      loadAndStart();
    });
    $('.share.twitter').on('click', function(e) {
      e.preventDefault();
      window.open('http://twitter.com/share?text='+twitterText(), 'Share your workout', 'height=250,width=550');
    });
    $('.share.facebook').on('click', function(e) {
      e.preventDefault();
      promptForFacebookThing();
    });
    $('.stop').on('click', stop);

    $('.mute').on('click', mute);
    $('.unMute').on('click', unMute);

    $(document).keyup(function(evt) {
      evt.preventDefault();
      var focused = $(':focus');
      if (evt.keyCode == 32 && !focused.is("li")) {
        if (running) {
          stop(evt);
        }else{
          loadAndStart();
        }
      }
    });

    $('li').keyup(function(evt) {
      evt.preventDefault();
    });

    $('.credits h3').on('click', function(e){
      $('.credits p').toggle();
    });

    $('.js-connect-to-facebook').on('click', connectToFacebookAndPost);
    $('.js-post-activity').on('click', postToFacebook);
  }

  function connectToFacebookAndPost(){
    FB.login(function(response){
      if (response.status === 'connected') {
        showModal('#facebookPostModal');
      }else{
        showModal('#facebookConnectModal');
      }
    }, {scope: 'publish_actions'});
  }

  function postToFacebook(){
    FB.api(
      'me/scientificseven:complete',
      'post',
      {
        workout: 'http://thescientificsevenminuteworkout.com/workouts/'+rounds+'.html'
      },
      function(response) {
        if (response.error) {
          window.console.log(response);
          showModal('#facebookConnectModal');
        }else{
          window.console.log(response);
          var activityId = response.id;
          var activityUrl = 'https://www.facebook.com/me/activity/'+activityId
          $('.js-facebook-activity-link').attr('href', activityUrl);
          showModal('#facebookSuccessModal');
        }
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