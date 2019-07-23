let locale = navigator.language;
let request = new XMLHttpRequest();
var requestAPI = "";
var numberOfQuestionsOpened = 0;

// settings to search questions using the Kitsune API
var product = "Firefox";
var is_solved = "False";
var is_spam = "False";
var is_locked = "False";
var is_taken = "False";
var is_archived = "False";

// popup menu
var refresh = document.getElementById('refresh');
var openTab = document.getElementById('open_tab');
var load = document.getElementById('load');
var empty = document.getElementById('empty');
var questions = document.getElementById('questions');
var clear = document.getElementById('clear');
var questionOpened = '';

// title i18n
clear.title = browser.i18n.getMessage("clear_notifications");
refresh.title = browser.i18n.getMessage("refresh");

// Event Listener
clear.addEventListener('click', function(){
    clearNotifications();
}, false);

refresh.addEventListener('click', function(){
    location.reload();
}, false);

// automatically refresh
setInterval(function () {
    request.onload();
}, 900000); // checks every 15 minutes

function initAPICall() {
    // request for questions not solved, not spam, not locked, product Firefox, not taken, not archived
    // and using the language based of the Firefox used
    requestAPI = "https://support.mozilla.org/api/2/question/?format=json&ordering=-id&is_solved="+is_solved+"&is_spam="+
                is_spam+"&is_locked="+is_locked+"&product="+product+"&is_taken="+is_taken+"&is_archived="+is_archived+"&locale="+locale;
    request.open('GET', requestAPI, true);
    request.responseType = 'json';
    request.send();
}

initAPICall();

// search for new questions
request.onload = function() {
        var responseSUMO = request.response;
        for(var i = 0; i < 20; i++){
                if(responseSUMO.results[i].num_answers == 0){
                    for(var j = 0; j < responseSUMO.results[i].tags.length; j++){
                        if(responseSUMO.results[i].tags[j].name == "desktop" && responseSUMO.results[i].tags[j].slug == "desktop"){
                            numberOfQuestionsOpened = numberOfQuestionsOpened + 1;
                            // saves the number of questions opened
                            localStorage.setItem('numberOfQuestionsOpened', numberOfQuestionsOpened);

                            // url of the question
                            var url = "https://support.mozilla.org/"+locale+"/questions/"+responseSUMO.results[i].id;

                            // create elements
                            var questionOrder = document.createElement("div");
                            var questionTitle = document.createElement("label");
                            var iconProduct = document.createElement("img");
                            var zeroDiv = document.createElement("div");
                            var firstDiv = document.createElement("div");
                            var secondDiv = document.createElement("div");
                            var buttonOpen = document.createElement("a");
                            var section = document.querySelector("section");

                            //
                            zeroDiv.className = "col-md-12 margin-and-top-distance";
                            firstDiv.className = "col-md-12 margin-and-top-distance";
                            secondDiv.className = "panel-section-separator"
                            questionTitle.className = "text-justify question-settings";
                            questionTitle.textContent = responseSUMO.results[i].title;
                            iconProduct.className = "icon-size-and-distance";
                            iconProduct.title = browser.i18n.getMessage("firefox_for_desktop");
                            iconProduct.src = "../res/icons/firefox.png";
                            buttonOpen.className = "btn btn-primary btn-settings";
                            buttonOpen.text = browser.i18n.getMessage("open_tab");
                            buttonOpen.href = url;

                            //
                            questionOrder.appendChild(zeroDiv);
                            questionOrder.appendChild(iconProduct);
                            questionOrder.appendChild(questionTitle);
                            questionOrder.appendChild(buttonOpen);
                            questionOrder.appendChild(firstDiv);
                            questionOrder.appendChild(secondDiv);

                            section.appendChild(questionOrder);
                        }
                    }
                }
        }

        // number of questions opened
        console.log("Questions opened = "+numberOfQuestionsOpened);

        // verifies if have any questions opened
        if(localStorage.getItem('numberOfQuestionsOpened') >= 1){
            browser.browserAction.setBadgeText({text: localStorage.getItem('numberOfQuestionsOpened')});
            questions.style.display = "block";
            load.style.display = "none";
            empty.style.display = "none";
        }else{
            browser.browserAction.setBadgeText({text: ''});
            empty.style.display = "block";
            load.style.display = "none";
            questions.style.display = "none";
        }

        // changes the title
        if(localStorage.getItem('numberOfQuestionsOpened') >= 2){
            browser.browserAction.setTitle({title: localStorage.getItem('numberOfQuestionsOpened')+browser.i18n.getMessage("more_than_one_question_without_answer")});
        }else if (localStorage.getItem('numberOfQuestionsOpened') == 1){
            browser.browserAction.setTitle({title: localStorage.getItem('numberOfQuestionsOpened')+browser.i18n.getMessage("one_question_without_answer")});
        }else{
            browser.browserAction.setBadgeText({text: ''});
        }

        // clears the number of questions
        numberOfQuestionsOpened = 0;
}

// clears the notification and sets the title
function clearNotifications() {
  browser.browserAction.setBadgeText({text: ''});
  browser.browserAction.setTitle({title: localStorage.getItem('extensionName')});
}
