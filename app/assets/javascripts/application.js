// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .




  window.fbAsyncInit = function() {
  FB.init({
    appId      : 1420182251563878,
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });



  // FB.getLoginStatus(function(response) {
  //   if (response.status === 'connected') {
  //     // the user is logged in and has authenticated your
  //     // app, and response.authResponse supplies
  //     // the user's ID, a valid access token, a signed
  //     // request, and the time the access token 
  //     // and signed request each expire
  //     var uid = response.authResponse.userID;
  //     var accessToken = response.authResponse.accessToken;
  //     console.log(uid);
  //     console.log(accessToken);
  //   } else if (response.status === 'not_authorized') {
  //     // the user is logged in to Facebook, 
  //     // but has not authenticated your app
  //     console.log('app is not authentcated');
  //   } else {
  //     console.log('not signed into FB');
  //   }
  //  });

  //creates a pop-up login window
  FB.login(function(response){
    console.log("Response");
    console.log(response);
    getPhotos();
  }, {scope: 'user_photos'});

  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below 
  // will be handled. 

  FB.Event.subscribe('auth.authResponseChange', function(response) {
    console.log(response);
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they 
      // have logged in to the app.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // In this case, the person is logged into Facebook, but not into the app, so we call
      // FB.login() to prompt them to do so. 
      // In real-life usage, you wouldn't want to immediately prompt someone to login 
      // like this, for two reasons:
      // (1) JavaScript created popup windows are blocked by most browsers unless they 
      // result from direct interaction from people using the app (such as a mouse click)
      // (2) it is a bad experience to be continually prompted to login upon page load.
      FB.login();
    } else {
      // In this case, the person is not logged into Facebook, so we call the login() 
      // function to prompt them to do so. Note that at this stage there is no indication
      // of whether they are logged into the app. If they aren't then they'll see the Login
      // dialog right after they log in to Facebook. 
      // The same caveats as above apply to the FB.login() call here.
      FB.login();
    }
  });
  };

  // Load the SDK asynchronously
  (function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
  }(document));

  // Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases. 
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });
  }
pics = [];
function getPhotos() {
  FB.api(
    "me?fields=photos.limit(400).fields(likes, comments, source)",
    function (response) {
      if (response && !response.error) {
        var photosArray = response.photos.data;
        var cleanPhotosArray = removeUnwantedPhotos(photosArray);
        var rankedPhotosArray = addRank(cleanPhotosArray);
        var orderedPhotosArray = getSortedPhotos(rankedPhotosArray);
        pics = orderedPhotosArray;
        insertPhotos();
      } else {
        console.log("not working");
      }
    }
  );
}

function removeUnwantedPhotos(photosArray) {
  var cleanPhotosArray = [];
  for(var i = 0; i<photosArray.length; i++) {
    if (photosArray[i].likes !== undefined || photosArray[i].comments !== undefined ) {
      cleanPhotosArray.push(photosArray[i]);
    }
  }
  return cleanPhotosArray;
}

function addRank(cleanPhotosArray) {
  for (var i = 0; i<cleanPhotosArray.length; i++) {
    var photo = cleanPhotosArray[i];
    if (photo.comments !== undefined && photo.likes !== undefined) {
      photo.rank = photo.comments.data.length + photo.likes.data.length;
    } else if (photo.comments === undefined) {
      photo.rank = photo.likes.data.length;
    } else {
      photo.rank = photo.comments.data.length;
    }
  }
  return cleanPhotosArray;
}


function getSortedPhotos(rankedPhotosArray) {
  var sortedPhotosArray = rankedPhotosArray.sort(function(a,b){
    if (a.rank < b.rank) {
        return 1;
    } else if (a.rank > b.rank) {
        return -1;
    } else {
        return 0;
    }
  });
  return (sortedPhotosArray);
}

function insertPhotos() {
  var imgSource = pics[1].source;
  $('#pic1').attr('src', imgSource);
}



