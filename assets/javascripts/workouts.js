$(function(){
  var storage = localStorage;

  function loadedWorkoutName(){
    var name = window.location.hash;
    name = name.replace(/#/g, '');
    name = name.replace(/\//g, '');
    return name;
  }

  function loadWorkout(name) {
    if (name !== '' && storage[name]) {
      _.each(storage[name].split(','), function(value, n){
        $('#exercise'+(n+1)).text(value);
      });
      window.location.hash = name;
    }else{
      window.location.hash = '';   
    }
  }
  loadWorkout(loadedWorkoutName());

  function saveWorkout(name) {
    var workoutNames = [];
    _.times(12, function(n){
      workoutNames.push($('#exercise'+(n+1)).text());
    });
    storage[name] = workoutNames;
    loadWorkout(name);
  }

  function getWorkoutName(){
    return $('#name-of-workout').val();
  }

  var modal = $('.js-load-or-save-modal');
  
  $('.save').on('click', function(){
    modal.modal();
    $('#name-of-workout').val(loadedWorkoutName());
    $('#name-of-workout').typeahead({
      source: _.keys(storage),
      minLength: 0
    });
  });

  $('.js-do-load').on('click', function(){
    loadWorkout(getWorkoutName());
    modal.modal('hide');
  });

  $('.js-do-save').on('click', function(){
    saveWorkout(getWorkoutName());
    modal.modal('hide');
  });


});