var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', { dynamicNavbar: false });
var server = 'http://noko.dk/ds/app/'


function toPage(p) { mainView.router.load({ url: p+'.html' }); }
function loginNoko(m) {
  var METHOD_TYPED = 0;
  var METHOD_SAVED = 1;
  var WEEK_DAY = ['mandag','tirsdag','onsdag','torsdag','fredag','lørdag','søndag'];

  if (m == METHOD_TYPED) {
    var user = $('#login_u').val();
    var pass = MD5($('#login_p').val());

  } else if (m == METHOD_SAVED) {
    var user = localStorage.getItem("user");
		var pass = localStorage.getItem("pass");

  } else {
    console.log('No method passed to login function');
    return;
  }


  $$.post(server+'n_login.php', {u: user, p: pass}, function (data) {
    if (data == 'access') {

      localStorage.setItem("user", user);
      localStorage.setItem("pass", pass);

      console.log(data);
      $$.post(server+'p_front.php', {u: user, p: pass}, function (data) {

        console.log(data);
        var obj = JSON.parse(data);

        // INSERT THE DISH OF THE DAY
        $('#circle_food').text('I dag skal du have '+obj['mad'].toLowerCase()+' til aftensmad.');

        // INSERT KITCHEN DUTY SHIFTS
        if (obj.vagter) {
  				$('#circle_kitchen').text('Dine køkkenvagter denne måned er den ');
  				for (var i = 0; i < obj.vagter.length-1; i++) {
  					if (i > 0) { $('#circle_kitchen').append(', '); }
  					$('#circle_kitchen').append( obj.vagter[i]['day'] );
  				}
  			} else {
  				$('#circle_kitchen').text('Du har ingen køkkenvagter denne måned.');
  			}

        // INSERT RESERVED LAUNDRY TIMES
        if (obj.vaske) {
          $('#circle_laundry').text('Husk dine vasketider ');
          for (var v = 0; v < obj['vaske'].length; v++) {
            if (v > 0) { $('#circle_laundry').append(', '); }
            $('#circle_laundry').append( WEEK_DAY[obj['vaske'][v]-1] );
          }
          $('#circle_laundry').append(' i denne uge!');
        } else {
          $('#circle_laundry').text('Du har ikke reserveret vasketider denne uge.');
        }

        // INSERT THE NEXT NOKO EVENT
        $('#circle_calendar').text('Det næste NOKO event er '+obj['event_e']+' ('+obj['event_d'].substring(0,10)+').');

        myApp.closeModal();

      });

    } else {
      console.log(data);
      $('.login-screen .error-msg').text(data).show();
    }
  });
}
function logoutNoko() {
  localStorage.removeItem('user');
	localStorage.removeItem('pass');

  myApp.loginScreen();
}


$$(document).on('deviceready', function() {

  $('#circle_food').click(function() { toPage('food'); });
  $('#circle_kitchen').click(function() { toPage('kitchen'); });
  $('#circle_laundry').click(function() { toPage('laundry'); });
  $('#circle_calendar').click(function() { toPage('calendar'); });
  $('#btn_login').click(function() { loginNoko(0); });
  $('#btn_logout').click(function() { logoutNoko(); });

  window.addEventListener('keypress', function(e) { if (event.keyCode == '13') { loginNoko(0); }});

  if ( (localStorage.getItem("user") != null && localStorage.getItem("pass") != null) ) {
    loginNoko(1);
  } else {
    myApp.loginScreen();
  }

});


myApp.onPageInit('about', function (page) {



})
