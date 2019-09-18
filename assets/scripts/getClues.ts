class Question {
    cityName: string;
    clue: string;
    answer: boolean;

    constructor(answer: string, clue: string) {
        this.cityName = answer;
        this.clue = clue;
        this.answer = false;
    }
}



var quests;
var usedCitys = Array<string>();
var currentQuestions = Array<Question>();

function buildQuestions(response: any): Array<Question> {
    let questions = Array<Question>();
    response.forEach((question: { answer: string; question: string; }) => {
        if(useableQuestion(question.answer)){
            let newQuestion = new Question(question.answer, question.question);
            questions.push(newQuestion);
        }
    });

    return questions;
}

function useableQuestion(answer: string){
    //console.log(answer);
    //worlds worst api cleansing:
    if(answer === "(2 of) Bucharest, Budapest & Belgrade" || answer === "Bill Gates" || answer === ""|| answer === "to Rome"|| answer === "Meryl Streep"|| answer === "David Copperfield" || answer === "Anne Rice"|| answer === "Buenos Aires/Montevideo"
    ){
        return false;
    }
    return true;
}

function shuffleArray(array: Array<Question>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getQuestions() {
    let queryURL = "https://jservice.io/api/clues?category=";
    let category = "78";
    queryURL += category;

    var d = $.Deferred();
    var ajax_promise = $.ajax({
        url: queryURL,
        method: "GET",
    })
    
    ajax_promise.then(function (response: any) {
        quests = buildQuestions(response);
        parseQuestions(quests);
        getAnswer();
        d.resolve(currentQuestions);
    }).catch((err: string) => {
        console.error("Problem getting data from jservice:" + err);
    });
    return d.promise();
}

function parseQuestions(questions: Array<Question>) {
    //redeclare the array to empty it out for new use;
    currentQuestions = Array<Question>();
    shuffleArray(questions);
    while (currentQuestions.length < 4) {
        for (let index = 0; index < 4; index++) {
            const element = questions[index];
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