var SocialFactory = function(){
  function promptForFacebookThing(){
    if (facebookConnected) {
      showModal('#facebookPostModal');
    }else{
      showModal('#facebookConnectModal');
    }
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

  function twitterText(){
    return primerText() + ' ' + iDidItText();
  }

  function iDidItText(){
    var text;
    switch(State.rounds){
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
        text = 'I just did it. '+ State.rounds + ' times!';
        break;
    }
    return text;
  }
  function primerText(){
    return 'It\'s very tough and you really get to sweat.';
  }

  function roundsText(){
    switch(State.rounds){
      case 1:
        return '1 round';
      default:
        return State.rounds+' rounds';
    }
  }

  function showModal(id) {
    $('.js-rounds').html(roundsText());
    $(id).modal();
  }

  function postToFacebook(){
    FB.api(
      'me/scientificseven:complete',
      'post',
      {
        workout: 'http://thescientificsevenminuteworkout.com/workouts/'+State.rounds+'.html'
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

  function bind(){
    $('.js-connect-to-facebook').on('click', connectToFacebookAndPost);
    $('.js-post-activity').on('click', postToFacebook);  
    $('.share.twitter').on('click', function(e) {
      e.preventDefault();
      window.open('http://twitter.com/share?text='+twitterText(), 'Share your workout', 'height=250,width=550');
    });
    $('.share.facebook').on('click', function(e) {
      e.preventDefault();
      promptForFacebookThing();
    });
  }

  $(function(){
    bind();
  });
  

  return {
    
  };
};

var Social = SocialFactory();