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
var displayName;
var email;
var uid;
var currentScore = 0;
var previousScore;
var scores = [];
var testSnapshot;

function getPreviousScoreForLoggedInUser() {
    firebase.database().ref('/users/' + uid).once('value').then(function (snapshot) {
        previousScore = snapshot.val().score;
    });
}

function writeUserDataForLoggedInUser() {
    firebase.database().ref('users/' + uid).set({
        username: displayName,
        email: email,
        score: currentScore
    });
}

function updateHighScoreForLoggedInUser(current){
    getPreviousScoreForLoggedInUser();
    if(currentScore > previousScore){
        writeUserDataForLoggedInUser();
    }
}

function signin(displayName, email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}


function ceateAuthProfile(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        currentScore = 0;
        writeUserDataForLoggedInUser();
        // ...
    });
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        displayName = user.displayName;
        email = user.email;
        emailVerified = user.emailVerified;
        photoURL = user.photoURL;
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        providerData = user.providerData;
        // ...
    } else {
        // User is signed out.
        // ...
    }
});

function sortScores(scores){
    scores = scores.sort((a, b) => (a.score < b.score) ? 1 : -1);
    return scores;
}

function topTenScores(scores){
    scores = scores.slice(0,9);
    return scores;
}

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
        var nameData = $('<td>').text(score.name);
        var scoreData = $('<td>').text(score.score);
        row.append(nameData, scoreData);
        table.append(row);
    });
    table.append('<tbody>');
    leaderBoardDiv.append(table);
}