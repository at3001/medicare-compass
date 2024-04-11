const bitesLeft = document.getElementsByClassName('bite-left');
const bitesRight = document.getElementsByClassName('bite-right');
const continueBtn = document.getElementById('continue-btn');
let currentIndex = 0;

var noteDict = {};
var timeline_cn = [];
var timeline_eng = [];

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

function saveTimeline(event){
    console.log('save fired');

    if (document.getElementById('continue-btn').textContent == "Next section"){
        cn_one = document.getElementById('content-info-cn-timeline1').textContent;
        cn_two = document.getElementById('content-info-cn-timeline2').textContent;
        cn_three = document.getElementById('content-info-cn-timeline3').textContent;
    
        eng_one = document.getElementById('content-info-eng-timeline1').textContent;
        eng_two = document.getElementById('content-info-eng-timeline2').textContent;
        eng_three = document.getElementById('content-info-eng-timeline3').textContent;
    
        timeline_cn.push(cn_one);
        timeline_cn.push(cn_two);
        timeline_cn.push(cn_three);
    
        timeline_eng.push(eng_one);
        timeline_eng.push(eng_two);
        timeline_eng.push(eng_three);
    
        localStorage.setItem('timeline_cn', JSON.stringify(timeline_cn));
        localStorage.setItem('timeline_eng', JSON.stringify(timeline_eng));

        whole_timeline = document.getElementById("timeline-container");
        localStorage.setItem("whole_timeline", whole_timeline);

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


function submitNote(event, reference, num) {
    userNote = document.getElementById("text_" + reference).value;

    parentDiv = document.getElementById("note_" + reference).parentNode;

    var textParagraphChinese = document.getElementById("content-info-cn-"+reference).textContent;
    var textParagraphEnglish = document.getElementById("content-info-eng-"+reference).textContent;

    noteDict[userNote] = [textParagraphChinese, textParagraphEnglish];
    document.getElementById("text_" + reference).value = "Your note has been submitted!";


    localStorage.setItem('noteDict', JSON.stringify(noteDict));

    // This makes the whole thing dissapear after a certain time lag
    setTimeout(function() {
        document.getElementById("note_" + reference).style.visibility = 'hidden';
        document.getElementById("text_" + reference).value = "";

      }, 1000);

}

function speak(event, lang, reference){
    if(lang == "cn"){
        textUtterance = document.getElementById("content-info-cn-" + reference).textContent;
    } else{
        textUtterance = document.getElementById("content-info-eng-" + reference).textContent;
    }

    console.log(textUtterance);
    const utterance = new SpeechSynthesisUtterance(textUtterance);

    language = 'en-US'
    if (lang == "cn"){
        language = "zh-CN";
    }
    utterance.pitch = 1; 
    utterance.rate = 1; 
    utterance.volume = 1; 

    utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === language);

    speechSynthesis.speak(utterance);
}

const noteElems = document.getElementsByClassName("input-box-container");

for (let i = 0; i < noteElems.length; i++){

    noteElems[i].addEventListener('click', function(event) {
    });
}

function htmlToCanvas(elementId) {
    // Find the HTML element by ID
    var element = localStorage.getItem("whole_timeline");
    console.log(element);


    // Use html2canvas library to convert the HTML content to canvas
    return html2canvas(element);
}

// Need to change this to have HTML code so it looks better.
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname == '/client%20(frontend)/src/pages/InfoPrintPage.html'){
        console.log("pdf fired")

        const { jsPDF } = window.jspdf;
        const notes_pdf = new jsPDF();

        notes_pdf.addFileToVFS('../images/chinesebase64.txt', 'chinese');
        notes_pdf.addFont('../images/chinese_font.ttf', 'chinese', 'normal');
        
        noteDict = JSON.parse(localStorage.getItem('noteDict'));

        notes_pdf.setFontSize(20);
        notes_pdf.text("Information & Questions Form", 60, 15);


        // This is really bad code -- gonna change this to more scalable but jsut trying out for now;
        timeline_cn = JSON.parse(localStorage.getItem('timeline_cn'));
        timeline_eng = JSON.parse(localStorage.getItem('timeline_eng'));

        console.log(timeline_cn);
        
        pos = 30;
        dif = 10;

        notes_pdf.setFont('chinese', 'normal');
        notes_pdf.setFontSize(12);

        timelineUrl = "../images/timeline_img.png";
        notes_pdf.addImage(timelineUrl, 'PNG', 10, 20, 180, 150);

        notes_pdf.addPage();

        // for(let i = 0; i < timeline_cn.length; i++){
        //     cn_text = timeline_cn[i].replace(/\s+/g, ' ').trim();
        //     cn_text = cn_text.replace(/\\n/g, '');
        //     cn_text = notes_pdf.splitTextToSize(cn_text, 180);

        //     notes_pdf.text(cn_text, 10, pos);
            
        //     console.log(cn_text.length);
            
        //     pos = pos + notes_pdf.getTextDimensions(cn_text).h + 10;

        //     if (pos >= 200) {
        //         notes_pdf.addPage();
        //         pos = 15;
        //     }
        // }

        // notes_pdf.setFont('helvetica', 'normal');

        // for(let i = 0; i < timeline_cn.length; i++){
           
        //     eng_text = timeline_eng[i].replace(/\s+/g, ' ').trim();
        //     eng_text = eng_text.replace(/\\n/g, '');
        //     eng_text = notes_pdf.splitTextToSize(eng_text, 180);

        //     notes_pdf.text(eng_text, 10, pos);

        //     // pos = pos + eng_text.length * 6;
        //     pos = pos + notes_pdf.getTextDimensions(eng_text).h + 10;

        //     if (pos >= 200) {
        //         notes_pdf.addPage();
        //         pos = 15;
        //     }
        // }

        // pos = pos + 20;
        notes_pdf.setFont("helvetica", "normal");
        notes_pdf.setFontSize(20);
        notes_pdf.text("Your Course Notes", 60, pos);

        pos = pos + 10;

        for (let key in noteDict){
            notes_pdf.setFontSize(14);
            notes_pdf.setFont("helvetica", "bold");

            notes_pdf.text(key, 10, pos);
            pos = pos + dif;
            
            notes_pdf.setFont("helvetica", "italic");

            notes_pdf.setFontSize(12);

            temp = JSON.stringify(noteDict[key][1]);
            temp2 = temp.replace(/\s+/g, ' ').trim();
            temp2 = temp2.replace(/\\n/g, '');

            var splitText = notes_pdf.splitTextToSize(temp2, 180); 
            notes_pdf.text(splitText, 10, pos);

            pos = pos + splitText.length * 6;

            notes_pdf.setFont('chinese', 'normal');
            temp = JSON.stringify(noteDict[key][0]);
            temp2 = temp.replace(/\s+/g, ' ').trim();
            temp2 = temp2.replace(/\\n/g, '');

            var splitText = notes_pdf.splitTextToSize(temp2, 180); 
            notes_pdf.text(splitText, 10, pos);

            pos = pos + splitText.length * 6;

            if (pos >= 200){
                notes_pdf.addPage();
                pos = 15;
            }
            
        }
        const tempPdf = notes_pdf.output('datauristring');
        
        document.getElementById('pdf-preview').src = tempPdf;

        document.getElementById('download-btn').addEventListener('click', function() {
    
            notes_pdf.save("medicare-compass-mynotes.pdf");
        });

    }


});


document.addEventListener('DOMContentLoaded', function() {
    console.log('Page content has been loaded');
    console.log(window.location.pathname);
    if ((window.location.pathname == '/client%20(frontend)/src/pages/ClassPage.html') || (window.location.pathname == '/client%20(frontend)/src/pages/ClassPage-arabic.html')) {
        if (tutorialAidCompleted == false) {

            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.zIndex = '500';
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

            readingAid.style.backgroundColor = '#F8CEBF'; 

            readingAid.style.fontWeight = 'bold';

            readingAid.style.zIndex = '10000000';

            readingAidTwo.style.backgroundColor = '#F8CEBF'; 

            readingAidTwo.style.fontWeight = 'bold';

            readingAidTwo.style.zIndex = '10000000';

            document.addEventListener('click', function(event) {
                
                if (tutorialAidCompleted == false) {
                    console.log('fired')
                    overlay.removeChild(text);
                    document.body.removeChild(overlay);
                    readingAid.style.backgroundColor = 'initial';

                    readingAid.style.zIndex = 'initial';
            
                    readingAidTwo.style.backgroundColor = 'initial';
        
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
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.zIndex = '9999'; 
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

            var noteButton = document.getElementById("note_button_one");

            noteButton.style.zIndex = '1000000';


            document.addEventListener('click', function(event) {

                if (tutorialNoteCompleted == false) {
                    console.log('fired')
                    overlay.removeChild(text_note);
                    document.body.removeChild(overlay);

                    noteButton.style.zIndex = 'initial';

                    tutorialNoteCompleted = true;
                }

            });

        }

    }



});


