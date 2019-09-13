var Question = /** @class */ (function () {
    function Question(answer, clue) {
        this.cityName = answer;
        this.clue = clue;
        this.answer = false;
    }
    return Question;
}());
var quests;
var usedCitys = Array();
var currentQuestions = Array();
function buildQuestions(response) {
    var questions = Array();
    response.forEach(function (question) {
        var newQuestion = new Question(question.answer, question.question);
        questions.push(newQuestion);
    });
    return questions;
}
function shuffleArray(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}
function getQuestions() {
    var queryURL = "http://jservice.io/api/clues?category=";
    var category = "78";
    queryURL += category;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        quests = buildQuestions(response);
        test();
        return currentQuestions;
    })["catch"](function (err) {
        console.error("Problem getting data from jservice:" + err);
    });
}
function parseQuestions(questions) {
    //redeclare the array to empty it out for new use;
    currentQuestions = Array();
    shuffleArray(questions);
    while (currentQuestions.length < 4) {
        for (var index = 0; index < 4; index++) {
            var element = questions[index];
            if (usedCitys.indexOf(element.cityName) === -1) {
                currentQuestions.push(element);
            }
        }
    }
}
function getAnswer() {
    currentQuestions = shuffleArray(currentQuestions);
    currentQuestions[0].answer = true;
    usedCitys.push(currentQuestions[0].cityName);
}
function test() {
    parseQuestions(quests);
    getAnswer();
}
