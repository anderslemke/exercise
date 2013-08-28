$(document).ready(function () {
  renderButtons();
  bind();

  var workoutTimer;

  function renderButtons(blinkInfo) {
    showSoundStatus(blinkInfo);
    showRoundStatus();
    if (State.running) {
      $('.share').hide();
      $('.start').hide();
      $('.stop').show();
    }else{
      $('.share').show();
      $('.start').show();
      $('.stop').hide();
    }
  }

  function start(e){
    e.preventDefault();
    
    ga('send', 'event', 'control', 'start');

    State.rounds = 0;
    State.running = true;
    renderButtons();
    doRest(Config.wait);
  }

  function stop(e){
    e.preventDefault();

    ga('send', 'event', 'control', 'stop');
  
    State.running = false;
    renderButtons();
    clearTimeout(workoutTimer);
    resetList();
  }

  function mute(e){
    e.preventDefault();

    ga('send', 'event', 'sound', 'mute');

    State.playingSounds = false;
    renderButtons(true);
  }

  function unMute(e){
    e.preventDefault();

    ga('send', 'event', 'sound', 'unmute');

    State.playingSounds = true;
    renderButtons(true);
  }

  function showRoundStatus(){
    $('div.counter').html(''+State.rounds);
  }

  var soundInfoTimer;
  function showSoundStatus(showInfo){
    if (showInfo) {
      $('.actions .info').show();
      clearTimeout(soundInfoTimer);
      soundInfoTimer = setTimeout(function(){$('.actions .info').fadeOut();}, 2000);
    }

    if (State.playingSounds) {
      $('.unMute').hide();
      $('.mute').show();
    }else{
      $('.mute').hide();
      $('.unMute').show();
    }
  }

  function getReadyForNextExercise() {
    var element = $('.drills li.active');
    var index = $('.drills li').index(element);
    nextExercise = (index + 1) % $('.drills li').length;

    if (element && element.attr('id')) {
      // I.e. don't track when getting ready for the first exercise
      ga('send', 'event', 'exercise', 'rest', element.attr('id'));
    };

    if (element.hasClass('last')) {
      State.rounds++;
      ga('send', 'event', 'exercise', 'completedRound', State.rounds.toString());
      showRoundStatus();
    }

    element.removeClass('active');
    $($('.drills li')[nextExercise]).addClass('next');

    if (nextExercise > 2) {
      turnAround();
    }
  }

  function doRest(period){
    playSound('rest');
    period = period || Config.rest;
    getReadyForNextExercise();
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

    ga('send', 'event', 'exercise', 'workout', element.attr('id'));

    workoutTimer = setTimeout(doRest, (Config.workout*1000));
  }

  function bind(){
    $('.start').on('click', start);
    $('.stop').on('click', stop);
    $('.mute').on('click', mute);
    $('.unMute').on('click', unMute);

    $(document).keyup(function(evt) {
      var focused = $(':focus');
      if (evt.keyCode == 32 && !focused.is("li")) {
        ga('send', 'event', 'control', 'spaceUsed');
        if (State.running) {
          stop(evt);
        }else{
          start(evt);
        }
      }
    });

    $('.credits h3').on('click', function(e){
      ga('send', 'event', 'credits', 'toggle');
      $('.credits p').toggle();
    });
  }

  
  function resetList(){
    $('.drills li').removeClass('next');
    $('.drills li').removeClass('active');
    var all = $('.drills li');
    var firstElement = $('.drills li.first');
    if (all.index(firstElement) !== 0) {
      turnAround();
      resetList();
    }
  }

  function playSound(type){
    if (State.playingSounds) {
      if (type === 'rest') {
        Sounds.play('bell');
      }else{
        Sounds.play('horn');
      }
    }
  }
});