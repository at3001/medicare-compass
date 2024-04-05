const bitesLeft = document.getElementsByClassName('bite-left');
const bitesRight = document.getElementsByClassName('bite-right');
const continueBtn = document.getElementById('continue-btn');
let currentIndex = 0;

var noteDict = {};

var tutorialNoteCompleted = false;
var tutorialAidCompleted = false;

function showNextBite() {
    if (currentIndex < bitesLeft.length) {
        currentIndex++;
    }

    for (let i = 0; i < currentIndex; i++) {
        bitesLeft[i].classList.remove('hidden');
        bitesRight[i].classList.remove('hidden');
    }

    // content container scrolls to bottom
    var elem = document.getElementsByClassName('content-container')[0];
    elem.scrollTop = elem.scrollHeight;

    if (currentIndex === bitesLeft.length) {
        continueBtn.textContent = "Next section";
    }
}

function increaseProgress() {
    var progressBar = document.getElementById('progress-bar');
    var currentWidth = progressBar.style.width;
    
    var newWidth = parseFloat(currentWidth) + (100 / (bitesLeft.length + 1)); // Increase width by 10%
    // progressBar.textContent = currentWidth;
    progressBar.style.width = newWidth + '%';
    
  }

function nextSection(url) {
    if (continueBtn.textContent === "Next section") {
        window.location.href = url;
    }
}

function selectOption(option, clickedButton, question) {
    // store selected input
    var queryInput = '#' + question + ' input';
    document.querySelectorAll(queryInput)[0].value = option;

    // change button formatting to selected
    var queryButton = '#' + question + ' button';
    var buttons = document.querySelectorAll(queryButton);
    buttons.forEach(function(button) {
        button.classList.remove('option-button-select');
      });
    clickedButton.classList.add('option-button-select');
  }


function showReadingAid(event, reference) {
    event.stopPropagation();
    var elem = document.getElementById("aid_" + reference);

    if (elem.style.visibility == "hidden" || elem.style.visibility == "" ) {
        elem.style.visibility = "visible";
    }
    else {
        elem.style.visibility = "hidden";
    }
}

// This event makes all aids dissapear if user clicks anywhere in the document
document.addEventListener('click', function(event) {
    var elems_aids = document.getElementsByClassName("tooltiptext");
    var elems_note = document.getElementsByClassName("input-box-container");
    
    for (let i = 0; i < elems_aids.length; i++){
        if (elems_aids[i].style.visibility == "visible") {
            elems_aids[i].style.visibility = "hidden"
        }
        
    }

    for (let i = 0; i < elems_note.length; i++){
        if (elems_note[i].style.visibility == "visible" & !(elems_note[i].contains(event.target))) {
            elems_note[i].style.visibility = "hidden"
        }
        
    }

});


function noteTakeAction(event, reference) {
    event.stopPropagation();

    var elem = document.getElementById("note_" + reference);

    if (elem.style.visibility == "hidden" || elem.style.visibility == "" ) {
        elem.style.visibility = "visible";
    }
    else {
        elem.style.visibility = "hidden";
    }
}



// Need to fix this to get the right elements;
function submitNote(event, reference, num) {
    // Get the text from the user input
    userNote = document.getElementById("text_" + reference).value;

    // Get the text
    parentDiv = document.getElementById("note_" + reference).parentNode;

    var textParagraphChinese = document.getElementsByClassName("content-info")[num].textContent;
    var textParagraphEnglish = document.getElementsByClassName("content-info")[num+1].textContent;
    console.log(textParagraphEnglish);
    noteDict[userNote] = [textParagraphChinese, textParagraphEnglish];
    console.log("notedict here")
    console.log(JSON.stringify(noteDict));
    document.getElementById("text_" + reference).value = "Your note has been submitted!";

    // This makes the whole thing dissapear after a certain time lag
    setTimeout(function() {
        document.getElementById("note_" + reference).style.visibility = 'hidden';
        document.getElementById("text_" + reference).value = "";

      }, 1000);

    

}

function speak(event, num){
    // const utterance = new SpeechSynthesisUtterance(document.getElementsByClassName('content-info')[num*2].textContent);
    textUtterance = document.getElementsByClassName('content-info')[num*2].textContent;
    console.log(textUtterance);
    const utterance = new SpeechSynthesisUtterance(textUtterance);

    // Optionally set some properties
    utterance.pitch = 1; // Range between 0 and 2
    utterance.rate = 1; // Range between 0.1 (slow) and 10 (fast)
    utterance.volume = 1; // Range between 0 and 1

    // Choose a voice from speechSynthesis.getVoices()
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');

    speechSynthesis.speak(utterance);
}

const noteElems = document.getElementsByClassName("input-box-container");

for (let i = 0; i < noteElems.length; i++){

    noteElems[i].addEventListener('click', function(event) {
        // event.stopPropagation();
        // noteElems[i].style.display = "block";
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname == '/client%20(frontend)/src/pages/InfoPrintPage.html'){
        console.log("pdf fired")
        // Create the PDF file
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        pos = 10;
        dif = 10;

        for (let key in noteDict){
            console.log(key);
            doc.text(noteDict[key][0], 10, pos);
            pos = pos + dif;
            doc.text(noteDict[key][1], 10, pos);
            pos = pos + dif;
            doc.text("\n");
            doc.text(key, 10, 10);
            pos = pos + dif;
        }

        // Now we will do what is appropriate to display the PDF preview

        const dataUrl = doc.output('datauristring');
        
        document.getElementById('pdf-preview').src = dataUrl;

        document.getElementById('download-btn').addEventListener('click', function() {
    
            doc.save("sample-document.pdf");
        });

    }


});


document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    console.log('Page content has been loaded');
    // You can perform actions like modifying the DOM, fetching data, etc.
    console.log(window.location.pathname);
    if ((window.location.pathname == '/client%20(frontend)/src/pages/ClassPage.html') || (window.location.pathname == '/client%20(frontend)/src/pages/ClassPage-arabic.html')) {
        if (tutorialAidCompleted == false) {

            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black
            overlay.style.zIndex = '9999'; // Ensure it's above other content
            document.body.appendChild(overlay);
            
            const text = document.createElement('div');
            text.style.position = 'fixed';
            text.style.transform = 'translate(-50%, -50%)';
            text.style.top = '55%';
            text.style.textAlign = 'center';
            text.style.left = '50%';
            text.style.width = '600px';
            text.style.height = '200px';
            text.style.color = '#E59981';
            text.style.fontWeight = 'bold';
            text.style.fontFamily = 'Arial, Helvetica, sans-serif';
            if (window.location.pathname == '/client%20(frontend)/src/pages/ClassPage.html') {
                text.textContent = "单击突出显示部分以获取有关整个课程中某些术语和概念的更多详细信息 \n Click highlights to get more details on certain terms and concepts throughout the course";
            }
            else {
                text.textContent = "انقر فوق النقاط البارزة للحصول على مزيد من التفاصيل حول مصطلحات ومفاهيم معينة خلال الدورة التدريبية \n Click highlights to get more details on certain terms and concepts throughout the course";
            }
            text.style.zindex = '10000';
            text.style.fontSize = '25px';
            overlay.appendChild(text);

            var readingAid = document.getElementById("tip_one");
            var readingAidTwo = document.getElementById("tip_two")

            readingAid.style.backgroundColor = '#F8CEBF'; // Set background color

            readingAid.style.fontWeight = 'bold';

            readingAid.style.zIndex = '10000000';

            readingAidTwo.style.backgroundColor = '#F8CEBF'; // Set background color

            readingAidTwo.style.fontWeight = 'bold';

            readingAidTwo.style.zIndex = '10000000';

            document.addEventListener('click', function(event) {
                // Check if the click target is the overlay or its child elements
                    // If not, remove the overlay
                
                if (tutorialAidCompleted == false) {
                    console.log('fired')
                    overlay.removeChild(text);
                    document.body.removeChild(overlay);
                    // document.body.removeChild(text);
                    readingAid.style.backgroundColor = 'initial'; // Set background color

                    readingAid.style.zIndex = 'initial';
            
                    readingAidTwo.style.backgroundColor = 'initial'; // Set background color
        
                    readingAidTwo.style.zIndex = 'initial';

                    tutorialAidCompleted = true;
                }

            });

        }
    } else if ((window.location.pathname == '/client%20(frontend)/src/pages/WhatIsMedicare.html') || (window.location.pathname == '/client%20(frontend)/src/pages/WhatIsMedicare-arabic.html')) {
        if (tutorialNoteCompleted == false) {

            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black
            overlay.style.zIndex = '9999'; // Ensure it's above other content
            document.body.appendChild(overlay);


            
            const text_note = document.createElement('div');
            text_note.style.position = 'fixed';
            text_note.style.transform = 'translate(-50%, -50%)';
            text_note.style.top = '55%';
            text_note.style.left = '75%';
            text_note.style.width = '600px';
            text_note.style.height = '200px';
            text_note.style.color = '#E59981';
            text_note.style.fontWeight = 'bold';
            text_note.style.fontFamily = 'Arial, Helvetica, sans-serif';
            if (window.location.pathname == '/client%20(frontend)/src/pages/WhatIsMedicare.html') {
                text_note.innerHTML = "对任何您可能不清楚的地方留下注释或问题<br>Write and save a note or question on anything you might be unclear on to reference them with your insurance agent";
            }
            else {
                text_note.innerHTML = "اكتب واحفظ ملاحظة أو سؤالاً حول أي شيء قد لا تكون واضحًا بشأنه للرجوع إليه مع وكيل التأمين الخاص بك<br>Write and save a note or question on anything you might be unclear on to reference them with your insurance agent";
            }
            text_note.style.textAlign = 'center';
            text_note.style.zindex = '100000';
            text_note.style.fontSize = '25px';
            overlay.appendChild(text_note);

            // const text_submit = document.createElement('div');
            // text_submit.style.position = 'fixed';
            // text_submit.style.transform = 'translate(-50%, -50%)';
            // text_submit.style.top = '80%';
            // text_submit.style.left = '90%';
            // text_submit.style.width = '600px';
            // text_submit.style.height = '200px';
            // text_submit.style.color = '#C27760';
            // text_submit.style.fontFamily = 'Arial, Helvetica, sans-serif';
            // text_submit.textContent = "您的所有笔记将保存在“我的信息和问题”中，以便您稍后返回查看 <br> All your notes will be saved in “My info & questions” so you can come back to them and review them with your agent";
            // text_submit.style.zindex = '10000';
            // text_submit.style.fontSize = '25px';
            // document.body.appendChild(text_submit);

            var noteButton = document.getElementById("note_button_one");

            noteButton.style.zIndex = '1000000';


            document.addEventListener('click', function(event) {
                // Check if the click target is the overlay or its child elements
                    // If not, remove the overlay
                
                if (tutorialNoteCompleted == false) {
                    console.log('fired')
                    overlay.removeChild(text_note);
                    document.body.removeChild(overlay);
                    // document.body.removeChild(text_note);


                    noteButton.style.zIndex = 'initial';

                    tutorialNoteCompleted = true;
                }

            });

        }

    }



});

