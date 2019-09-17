

var apiKey = "AIzaSyDjkiXSorawjm2A34CuENp-BWDCoubGy8w";
var map;
var userLocation = { lat: 0, lng: 0 };
var myMarker = {};
var bigObject1 = { city: [], answer: "" };
var correctAnswer = 0;

var questionCount = 2;
var total_score = questionCount * 5;
var inCorrectAnswer = 0;
//var logic_question = Array();
//var markers = [];
//var mark;
//var myLatLang = [];
//var optionsObject = bigObject1.city;
/*
function initMap() {
  getLocation();
  var loc = { lat: 0, lng: 0 }
  console.log("in init", userLocation)
  map = new google.maps.Map(document.getElementById('map'), {
   center: { lat: 0, lng: 0 },
    zoom: 2
  });
}
*/
$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, function () { console.log("error stuff") }, { timeout: 60000 });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function changeQuestionAndAnswer() {
  bigObject = {
    city: ["cape town", "milan", "new york", "ambala"],
    answer: "milan"
  };

}

function showPosition(position) {

  userLocation.lat = position.coords.latitude;
  userLocation.lng = position.coords.longitude;
  console.log(userLocation);
  console.log("Latitude: " + position.coords.latitude +
    "\nLongitude: " + position.coords.longitude);
}



function getCityLoc(x) {
  var d = $.Deferred();
  my_url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + x + "&key=" + apiKey;
  var sam;
  var ajax1_promise = $.getJSON({
    url: my_url,

  });
  ajax1_promise.done(function (response) {
    result = response.results[0].geometry.location;
    d.resolve(result);
    //console.log(result);

  });
  return d.promise();
}
function calculateScore(ca) {
  total_score = total_score + (ca * 5);
}

function stopGame() {
  console.log("hello stop")
  var divid = $("#map");
  divid.text("you win");
}

function updateScore() {
  if (win === true) {
    var pid = $("#pid");
    pid.text("Congratulations, Carmen is behind the bars!")
  } else {
    var pid = $("#pid");
    pid.text("Carmen is on Run, better chase next time")
  }
}

function updateLocation(x, y) {
  var locid = $("#location")
  locid.append("lat: "+x+"  lng: "+y);
}

function playGame() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ad2103' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
      }
    ]
  });

  bigObject1.city = [];
  bigObject1.answer = "";

  getQuestions().then(

    function (result) {
      console.log("result is :", result[0]);
      console.log(result.length)
      result.forEach(element => {
        bigObject1.city.push(element.cityName)
        if (element.answer === true) {
          bigObject1.answer = element.cityName;
          $("#pid").text(element.clue);
        }
      });
      console.log(bigObject1);
      return bigObject1;
    }).then(function (bo1) {

      var cityArray = bo1.city;

      cityArray.forEach(element => {
        //consuming promise 
        getCityLoc(element).done(
          function (cityLoc) {
            console.log("here is :", cityLoc)
            return cityLoc;
          })
          .then(function (markLoc) {

            var city_mark = new google.maps.Marker({
              position: markLoc,
              map: map,
              title: element,
              icon: "./assets/images/mapIcon.png",
            });

            city_mark.addListener("click", function () {
              if (city_mark.title === bigObject1.answer) {
                console.log("correct answer: ", city_mark.title);
                correctAnswer++;
                // calculateScore(correctAnswer);
                console.log("total score :", total_score);
                console.log("correctAnswer:", correctAnswer);
                console.log("you are answering question number: " + questionCount + "  and you answered " + correctAnswer + " correct so far");
                updateHighScoreForLoggedInUser(total_score);
                // console.log("citymarker:", city_mark)
                // console.log("lat: ", markLoc)
                updateLocation(markLoc.lat, markLoc.lng);
                if (questionCount > 0) {
                  playGame();
                } else {
                  stopGame();
                }
              }
              else {
                total_score = total_score - 2;
                console.log("wrong answer: ", city_mark.title)
                console.log("totalscore after wrong answer: ", total_score);
                $("#pid").text("wrong answer, you gave carmen time to move ahead ");
                console.log("you are answering question number: " + questionCount + "  and you answered " + correctAnswer + " correct so far");
                updateHighScoreForLoggedInUser(total_score);
                if (questionCount > 0) {
                  playGame();
                } else {
                  stopGame();
                }
              }
            });

          })
      });
      //console.log("myMarker is :",myMarker);

      // return myMarker;

    })

  questionCount--;
  console.log("you are left with  :" + questionCount + " question");
}

document.addEventListener('DOMContentLoaded', function () {

  let lang = "";
  if (document.querySelectorAll('#map').length > 0) {
    if (document.querySelector('html').lang)
      lang = document.querySelector('html').lang;
    else
      lang = 'en';

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.async = true;
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDFN4M1LYq8xp9YJOc_S3dP_aRJpaUh_AI&callback=playGame&language=' + lang;
    document.getElementsByTagName('head')[0].appendChild(js_file);

  }
});




