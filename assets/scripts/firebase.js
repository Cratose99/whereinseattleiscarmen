var firebaseConfig = {
    apiKey: "AIzaSyBLk3mtxqYgoS0DT0iHT-NSsqBSiizpf4g",
    authDomain: "whereintheworld-df6df.firebaseapp.com",
    databaseURL: "https://whereintheworld-df6df.firebaseio.com",
    projectId: "whereintheworld-df6df",
    storageBucket: "",
    messagingSenderId: "537579770542",
    appId: "1:537579770542:web:c6200290332d27abe3933f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
//Set up global variables for use in firebase
var displayName = "";
var email;
var uid;
var currentScore;
var previousScore;
var userScores = [];
var testSnapshot;

function signOut(){
    console.log("Inside sign out");
    firebase.auth().signOut().then(function() {
        console.log("signed out!")
        displayName = "";
        email = "";
        uid ="";
        currentScore = "";
        previousScore ="";
      }).catch(function(error) {
        // An error happened.
      });
}

function writeUserDataForLoggedInUser(currentScore) {
    console.log("Writing user data...")
    firebase.database().ref('users/' + uid).set({
        username: displayName,
        email: email,
        score: currentScore
    });
}

function updateHighScoreForLoggedInUser(currentScore) {
    console.log("current:" + currentScore)
    console.log("previous score:" + previousScore)
    if (currentScore > previousScore) {
        writeUserDataForLoggedInUser(currentScore);
    }
}

function signin(email, password) {
    signOut();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}

function createEntryForNewUser(displayName, email){
    console.log("Writing new user data...")
    firebase.database().ref('users/' + uid).set({
        username: displayName,
        email: email,
        score: 0
    });
}

function createAuthProfile(newusername, email, password) {
    signOut();
    displayName = newusername;
    console.log("Display name in createauth: " + displayName);
    firebase.auth().createUserWithEmailAndPassword(email, password);
    createEntryForNewUser(displayName, email);
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("Auth state changed...")
        email = user.email;
        emailVerified = user.emailVerified;
        photoURL = user.photoURL;
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        providerData = user.providerData;
        console.log("Score:" + user.score);
        console.log("Name:" + user.username);
        // ...
    } else {
        // User is signed out.
        // ...
    }
});

function sortScores(scores) {
    scores = scores.sort((a, b) => (a.score < b.score) ? 1 : -1);
    return scores;
}

function topTenScores(scores) {
    scores = scores.slice(0, 9);
    return scores;
}

database.ref().on("value", function (snapshot) {
    console.log(snapshot.val())
    var currentSnapshot = snapshot.val();

    for (let key in currentSnapshot) {
        console.log(key)
        for (innerKey in currentSnapshot[key]) {
            var userObj = currentSnapshot[key][innerKey];
            userScores.push(userObj);
            if(innerKey === uid){
                console.log("here!");
                displayName = userObj.username;
                previousScore = userObj.score;
            }
        }
    }
    displayScores(userScores);
    userScores = [];
});

var scoresTest = [
    user1 = {
        name: "Mike",
        score: "30"
    },
    user1 = {
        name: "Bill",
        score: "20"
    },
    user1 = {
        name: "Joe",
        score: "15"
    },
    user1 = {
        name: "Mary",
        score: "19"
    },
    user1 = {
        name: "Daria",
        score: "21"
    },
    user1 = {
        name: "Chelsea",
        score: "14"
    }
]

function displayScores(scores) {
    scores = sortScores(scores);
    scores = topTenScores(scores);
    var leaderBoardDiv = $('#leaderboard');
    leaderBoardDiv.empty();
    var table = $('<table>');
    table.attr("class", "striped")
    table.attr("class", "responsive-table");
    table.attr("id", "leaderboardTable");
    var thead = $('<thead>');
    var nameHeader = $('<th>').text("Name");
    var scoreHeader = $('<th>').text("Score");
    thead.append(nameHeader);
    thead.append(scoreHeader);
    table.append(thead);

    scores.forEach(score => {
        var row = $('<tr>')
        var nameData = $('<td>').text(score.username);
        var scoreData = $('<td>').text(score.score);
        row.append(nameData, scoreData);
        table.append(row);
    });
    table.append('<tbody>');
    leaderBoardDiv.append(table);
}

$('#signUp').on("click", function(event){
    var pWord = $('#password').val();
    var displayName = $('#first_name').val();
    var email = $('#email').val();

    createAuthProfile(displayName, email, pWord);
    signin(email, pWord);

    console.log("Authorized mew user");
    window.location.assign("./map.html");
})

$('#signIn').on("click", function(event){
    var email = $('#email').val();
    var pWord = $('#password').val();

    signin(email,pWord);
    console.log("Logged in via sign in button: " + displayName);
    window.location.assign("./map.html");
})