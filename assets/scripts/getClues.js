var Question = /** @class */ (function () {
    function Question(answer, clue) {
        this.cityName = answer;
        this.clue = clue;
    }
    return Question;
}());
var quests;
function buildQuestions(response) {
    var questions = Array();
    response.forEach(function (question) {
        var newQuestion = new Question(question.answer, question.question);
        questions.push(newQuestion);
    });
    return questions;
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
    })["catch"](function (err) {
        console.error("Problem getting data from jservice:" + err);
    });
}
function parseQuestions(questions) {
    questions.forEach(function (Question) {
        console.log(Question.clue);
    });
}
