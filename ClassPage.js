const bitesLeft = document.getElementsByClassName('bite-left');
const bitesRight = document.getElementsByClassName('bite-right');
const continueBtn = document.getElementById('continue-btn');
let currentIndex = 0;
let sectionIndex = 0;

var noteDict = {};
var timeline_cn = [];
var timeline_eng = [];

var tutorialNoteCompleted = false;
var tutorialAidCompleted = false;

// Lilly's functions

function showNextBite() {
    if (currentIndex < bitesLeft.length) {
        currentIndex++;
    }

    for (let i = 0; i < currentIndex; i++) {
        bitesLeft[i].classList.remove('hidden');
        bitesRight[i].classList.remove('hidden');
    }

    if (bitesLeft[currentIndex-1].classList.contains("section")) {
        // content container scrolls to next section
        var section = document.getElementsByClassName('section')[sectionIndex];
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        sectionIndex++;
    }
        else {
        // content container scrolls to bottom
            bitesRight[currentIndex-1].scrollIntoView({ behavior: 'smooth', block: 'end' });
        }

    if (currentIndex === bitesLeft.length) {
        continueBtn.textContent = "下一节 Next section";
    }
}

function increaseProgress() {
    var progressBar = document.getElementById('progress-bar');
    var currentWidth = progressBar.style.width;
    
    var newWidth = parseFloat(currentWidth) + (100 / (bitesLeft.length + 1)); // Increase width by 10%
    // progressBar.textContent = currentWidth;
    progressBar.style.width = newWidth + '%';
  }

  // dynamic timeline

function generateTimeline() {
    var birthdate = new Date (document.getElementById('birthdate').value);
    
    // calculate current age
    var today = new Date();
    var age = today.getFullYear() - birthdate.getFullYear();
    var monthDiff = today.getMonth() - birthdate.getMonth();
    
    // If the birth month is after the current month or if it's the same month but the birth day is after today's day
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    var immigration = document.getElementById('immigration-input').value;
    var current_insurance = document.getElementById('current-insurance-input').value;
    var retirement_age = document.getElementById('retirement-age').value

    var initialEnrollmentEnd = calculateEnrollmentPeriod (birthdate, Number(retirement_age), age, current_insurance);
    writeTimelineOne(age, immigration, current_insurance);
    writeTimelineTwo(age, current_insurance, Number(retirement_age));
    writeTimelineThree(initialEnrollmentEnd);
}

function calculateEnrollmentPeriod(birthdate, retirement_age, age, current_insurance, immigration) {
    if (retirement_age > 65) {
        var startdate = new Date(birthdate);
        startdate.setFullYear(startdate.getFullYear() + retirement_age);
        var enddate = new Date(startdate);
        enddate.setMonth(enddate.getMonth()+2);

        const dateOptions = {
            month: "short",
            year: "numeric"
        }
        var startdateFormattedEng = startdate.toLocaleDateString('en-US', dateOptions);
        var enddateFormattedEng = enddate.toLocaleDateString('en-US', dateOptions);
    
        var startdateFormattedCn = startdate.getFullYear() + "年" + (startdate.getMonth()+1) + "月";
        var enddateFormattedCn = enddate.getFullYear() + "年" + (enddate.getMonth()+1) + "月";
        
        document.getElementById('enrollment-period-eng').textContent = startdateFormattedEng + " - " + enddateFormattedEng + ":";
        document.getElementById('enrollment-period-cn').textContent = startdateFormattedCn + " - " + enddateFormattedCn + ":";
    
        return enddate;
    }

    else if (age > 65 && current_insurance === "no" && immigration !=="other") {
        document.getElementById('enrollment-period-eng').textContent = "ASAP:";
        document.getElementById('enrollment-period-cn').textContent = "尽快:";
    }

    else {
        var startdate = new Date(birthdate);
        startdate.setFullYear(startdate.getFullYear() + 65, startdate.getMonth() - 3, 1);
        var enddate = new Date(startdate);
        enddate.setMonth(enddate.getMonth()+6);
    
        const dateOptions = {
            month: "short",
            year: "numeric"
        }
        var startdateFormattedEng = startdate.toLocaleDateString('en-US', dateOptions);
        var enddateFormattedEng = enddate.toLocaleDateString('en-US', dateOptions);
    
        var startdateFormattedCn = startdate.getFullYear() + "年" + (startdate.getMonth()+1) + "月";
        var enddateFormattedCn = enddate.getFullYear() + "年" + (enddate.getMonth()+1) + "月";
        
        document.getElementById('enrollment-period-eng').textContent = startdateFormattedEng + " - " + enddateFormattedEng + ":";
        document.getElementById('enrollment-period-cn').textContent = startdateFormattedCn + " - " + enddateFormattedCn + ":";
    
        return enddate;
    }

}

function writeTimelineOne(age, immigration, current_insurance) {
    
    if (immigration === "other" && age < 65) {
        document.getElementById('timeline-one-eng').textContent = 
            "Become eligible for Medicare. It is possible you will not be eligible for Medicare when you turn 65 because of your current immigration status. Once you become either a US citizen or a Green Card holder with 5+ years of continuous US residency, you will be eligible for Medicare when you turn 65.";
        document.getElementById('timeline-one-cn').textContent =
            "获得 Medicare 资格。 由于您当前的移民身份，当您年满 65 岁时，您可能没有资格享受 Medicare。 一旦您成为美国公民或在美国连续居住 5 年以上的绿卡持有者，您在年满 65 岁时就有资格享受 Medicare。";
    }

    else if (immigration === "other" && age >= 65) {
        document.getElementById('timeline-one-eng').textContent = 
            "Become eligible for Medicare. There is a possibility you are not be eligible for Medicare despite reaching 65 because of your current immigration status. Once you become either a US citizen or a Green Card holder with 5+ years of continuous US residency, you will be eligible for Medicare.";
        document.getElementById('timeline-one-cn').textContent =
            "获得 Medicare 资格。 尽管您年满 65 岁，但由于您当前的移民身份，您可能没有资格享受 Medicare。 一旦您成为美国公民或在美国连续居住 5 年以上的绿卡持有者，您将有资格享受 Medicare。";
    }

    else if (immigration !== "other" && age >= 63 && age < 65) {
        document.getElementById('timeline-one-eng').textContent = 
            "Learn about Medicare and make a plan. According to your responses, you will be age 65 soon, which is when people become eligible for Medicare. Use this course to start your research now!";
        document.getElementById('timeline-one-cn').textContent =
            "了解 Medicare 并制定计划。 根据您的回答，您很快就会年满 65 岁，届时人们就有资格享受 Medicare。 现在就使用本课程开始您的研究！";
    }

    else if (immigration !== "other" && age < 63) {
        document.getElementById('timeline-one-eng').textContent = 
            "Be aware of your timeline and when to start planning. Most people become eligible for Medicare at age 65. Based on your responses, you still have " + (65-age) + " years before you reach this age - but it's never too early to start learning! We recommend seriously planning for Medicare at least one year before turning 65.";
        document.getElementById('timeline-one-cn').textContent = 
            "请注意您的时间表以及何时开始计划。 大多数人在 65 岁时就有资格享受 Medicare。根据您的回答，您距离达到此年龄还有" + (65-age) + "年 - 但开始学习永远不会太早！ 我们建议在 65 岁之前至少一年认真规划 Medicare。";
    }

    else if (immigration !== "other" && age >= 65 && current_insurance == "no") {
        document.getElementById('timeline-one-eng').textContent = 
            "Learn about Medicare and make a plan ASAP. According to your responses, you are age 65 or over and do not have health insurance, which means you may have a gap in coverage. Use this course to start your research now!";
        document.getElementById('timeline-one-cn').textContent = 
            "了解 Medicare 并制定计划。 根据您的回答，您很快就会年满 65 岁，届时人们就有资格享受 Medicare。 现在就使用本课程开始您的研究！";
    }
}

function writeTimelineTwo(age, current_insurance, retirement_age) {
    if (retirement_age > 65 ) {
        document.getElementById('timeline-two-eng').textContent = 
            "Enroll in Medicare through a special enrollment period. After you or your spouse retires and your employer sponsored coverage ends, you will have two full months to enroll in Medicare.";
        document.getElementById('timeline-two-cn').textContent =
            "在特殊投保期内投保 Medicare。 在您或您的配偶退休并且您的雇主保险结束后，您将有整整两个月的时间参加 Medicare。";
    }

    else if (age > 65 && current_insurance=="no"){
    document.getElementById('timeline-two-eng').textContent = 
        "Enroll in Medicare now through a special enrollment period. Because you may have a gap in coverage, you may incur late enrollment penalty fees that will increase the longer you wait to enroll.";
    document.getElementById('timeline-two-cn').textContent =
        "立即通过特殊投保期投保 Medicare。 由于您的承保范围可能存在差距，因此您可能会产生延迟注册罚款，等待注册的时间越长，罚款就会增加。";
    }
}

function writeTimelineThree(initialEnrollmentEnd) {
    if (initialEnrollmentEnd) {
        var openEnrollmentStart = new Date("10/15/2024");
        openEnrollmentStart.setFullYear(initialEnrollmentEnd.getFullYear()+1);
        var openEnrollmentEnd = new Date ("12/07/2024");
        openEnrollmentEnd.setFullYear(openEnrollmentStart.getFullYear());
    
        const dateOptions = {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
        var openEnrollmentStartFormattedEng = openEnrollmentStart.toLocaleDateString('en-US', dateOptions);
        var openEnrollmentEndFormattedEng = openEnrollmentEnd.toLocaleDateString('en-US', dateOptions);
        
        var openEnrollmentStartFormattedCn = openEnrollmentStart.getFullYear() + "年" + (openEnrollmentStart.getMonth()+1) + "月" + (openEnrollmentStart.getDate()) + "号";
        var openEnrollmentEndFormattedCn = openEnrollmentEnd.getFullYear() + "年" + (openEnrollmentEnd.getMonth()+1) + "月" + (openEnrollmentEnd.getDate()) + "号";
        
        document.getElementById('timeline-three-head-eng').textContent = openEnrollmentStartFormattedEng + " - " + openEnrollmentEndFormattedEng + ":";
        document.getElementById('timeline-three-head-cn').textContent = openEnrollmentStartFormattedCn + " - " + openEnrollmentEndFormattedCn + ":";
    }

    else {
        document.getElementById('timeline-three-head-eng').textContent = "Oct 15, 2025 - Dec 7, 2025";
        document.getElementById('timeline-three-head-cn').textContent = "2025年10月15号 - 2025年12月7号";
    }
    
}

function selectOption(option, clickedButton, question) {
    // change button formatting to selected
    var queryButton = '#' + question + ' button';
    var buttons = document.querySelectorAll(queryButton);
    buttons.forEach(function(button) {
        button.classList.remove('option-button-select');
      });
    clickedButton.classList.add('option-button-select');

    // store selected input
    var queryInput = '#' + question + ' input';
    document.querySelectorAll(queryInput)[0].value = option;
  }

  function deselectOptions(question) {
    // change button formatting to deselected
    var queryButton = '#' + question + ' button';
    var buttons = document.querySelectorAll(queryButton);
    buttons.forEach(function(button) {
        button.classList.remove('option-button-select');
      });

    // empty selected input
        var queryInput = '#' + question + ' input';
        document.querySelectorAll(queryInput)[0].value = "";  
  }

function showQuestion (question_container) {
    var question = document.getElementById(question_container);
    question.classList.remove('hidden');
    var section = document.getElementsByClassName('section')[0];
    section.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function hideQuestion (question_container) {
    var question = document.getElementById(question_container);
    question.classList.add('hidden');
    var elem = document.getElementsByClassName('content-container')[0];
    elem.scrollTop = elem.scrollHeight;
}

function switchHomepageLanguage(language) {
    var engHomeElems = document.getElementsByClassName('homepage-eng');
    var cnHomeElems = document.getElementsByClassName('homepage-cn');
    var homepageContinue = document.getElementById('homepage-continue');

    if (language === 'chinese') {
        for (let i = 0; i < engHomeElems.length; i++) {
            engHomeElems[i].classList.add('hidden');
        }
        for (let i = 0; i < cnHomeElems.length; i++) {
            cnHomeElems[i].classList.remove('hidden');
        }
        homepageContinue.classList.remove('hidden');

    }

    else if (language === 'english') {
        for (let i = 0; i < engHomeElems.length; i++) {
            engHomeElems[i].classList.remove('hidden');
        }
        for (let i = 0; i < cnHomeElems.length; i++) {
            cnHomeElems[i].classList.add('hidden');
        }
        homepageContinue.classList.remove('add');
    }
}

// switch homepage language back to english if user deselects chinese
document.addEventListener('click', function(event) {
    var homepageCnButton = document.getElementById("homepage-lang-button-cn");
    var homepageContinue = document.getElementById("homepage-continue");
    if (event.target !== homepageCnButton && event.target !== homepageContinue) {
        switchHomepageLanguage('english');
        deselectOptions('homepage-language'); 
    };
});

// grade quiz in WhatIsMedicare
function gradeQuiz() {
    // Define correct answers for each question
    const correctAnswers = {
        "question-one": "correct",
        "question-two": "correct",
        "question-three": "correct"
    };

    // Initialize score
    let score = 0;

    // Loop through each question
    for (const questionId in correctAnswers) {
        // Get selected answer for the current question
        const selectedAnswer = document.querySelector(`input[name="${questionId}"]:checked`);

        // If an answer is selected and it matches the correct answer, increment score
        if (selectedAnswer && selectedAnswer.value === correctAnswers[questionId]) {
            score++;
        }

        if (selectedAnswer) {
        var correctOptions = document.querySelectorAll('.correct-option');
    
        correctOptions.forEach(correctOption => {
            correctOption.style.color = "#C27760";
        });
        }
    }



    // Display the score
    const scoreElement = document.querySelector('.score-text');
    scoreElement.textContent = `Your score: ${score}/3`;
}

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}


// Akshat's functions

function nextSection(url) {
    if (continueBtn.textContent === "下一节 Next section") {
        window.location.href = url;
    }
}

function scrollDown() {
    document.getElementById('target-section').scrollIntoView({ behavior: 'smooth' });
}

function saveTimeline(event){
    console.log('save fired');

    if (document.getElementById('continue-btn').textContent == "下一节 Next section"){
        cn_one = document.getElementById('content-info-cn-three').textContent;
        cn_two = document.getElementById('content-info-cn-four').textContent;
        cn_three = document.getElementById('content-info-cn-five').textContent;
    
        eng_one = document.getElementById('content-info-eng-three').textContent;
        eng_two = document.getElementById('content-info-eng-four').textContent;
        eng_three = document.getElementById('content-info-eng-five').textContent;
    
        timeline_cn.push(cn_one);
        timeline_cn.push(cn_two);
        timeline_cn.push(cn_three);
    
        timeline_eng.push(eng_one);
        timeline_eng.push(eng_two);
        timeline_eng.push(eng_three);
    
        localStorage.setItem('timeline_cn', JSON.stringify(timeline_cn));
        localStorage.setItem('timeline_eng', JSON.stringify(timeline_eng));

        // whole_timeline = document.getElementById("timeline-container");
        // localStorage.setItem("whole_timeline", whole_timeline);

    }
    
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
    
    if(userNote in noteDict){
        userNote = userNote + " ";
    }

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
        textUtterance = document.getElementById("content-info-cn-" + reference);
    } else{
        textUtterance = document.getElementById("content-info-eng-" + reference);
    }
    var copyUtterance = textUtterance.cloneNode(true);

    var tooltips = copyUtterance.querySelectorAll('.tooltiptext');

    tooltips.forEach(tooltip => {
        tooltip.remove();
    });

    // if (tooltip) {
    //     tooltip.remove();
    // }

    var textSpeak = copyUtterance.textContent;

    const utterance = new SpeechSynthesisUtterance(textSpeak);

    language = 'en-US'
    if (lang == "cn"){
        language = "zh-CN";
        utterance.lang = 'zh-CN';
    }
    utterance.pitch = 1; 
    utterance.rate = 1; 
    utterance.volume = 1; 

    utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === language);

    console.log(utterance.voice);
    speechSynthesis.speak(utterance);
}

const noteElems = document.getElementsByClassName("input-box-container");

for (let i = 0; i < noteElems.length; i++){

    noteElems[i].addEventListener('click', function(event) {
    });
}

// function htmlToCanvas(elementId) {
//     // Find the HTML element by ID
//     var element = localStorage.getItem("whole_timeline");
//     console.log(element);


//     // Use html2canvas library to convert the HTML content to canvas
//     return html2canvas(element);
// }

// Need to change this to have HTML code so it looks better.
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname == '/medicare-compass.github.io/InfoPrintPage.html'){
        console.log("pdf fired")

        const { jsPDF } = window.jspdf;
        const notes_pdf = new jsPDF();
        const display_pdf = new jsPDF();

        var first_page_flag = false;

        notes_pdf.addFileToVFS('chinesebase64.txt', 'chinese');
        notes_pdf.addFont('chinese_font.ttf', 'chinese', 'normal');

        display_pdf.addFileToVFS('chinesebase64.txt', 'chinese');
        display_pdf.addFont('chinese_font.ttf', 'chinese', 'normal');
        
        
        noteDict = JSON.parse(localStorage.getItem('noteDict'));

        notes_pdf.setFontSize(20);
        notes_pdf.text("Information & Questions Form", 60, 15);


        // This is really bad code -- gonna change this to more scalable but jsut trying out for now;
        timeline_cn = JSON.parse(localStorage.getItem('timeline_cn'));
        timeline_eng = JSON.parse(localStorage.getItem('timeline_eng'));

        
        
        
        notes_pdf.setFontSize(15);
        notes_pdf.text("Your Timeline", 90, 25);

        notes_pdf.setFont('chinese', 'normal');
        notes_pdf.setFontSize(12);

        pos = 40;
        dif = 10;

        // timelineUrl = "../images/timeline_img.png";
        // notes_pdf.addImage(timelineUrl, 'PNG', 10, 20, 180, 150);

        // first_page_pdf = notes_pdf;

        // notes_pdf.addPage();

        for(let i = 0; i < timeline_cn.length; i++){
            cn_text = timeline_cn[i].replace(/\s+/g, ' ').trim();
            cn_text = cn_text.replace(/\\n/g, '');
            cn_text = notes_pdf.splitTextToSize(cn_text, 180);
            console.log(cn_text);

            notes_pdf.text(cn_text, 10, pos);
            
            console.log(cn_text.length);
            
            pos = pos + notes_pdf.getTextDimensions(cn_text).h + 10;

            if (pos >= 200) {
                notes_pdf.addPage();
                pos = 15;
            }
        }

        notes_pdf.setFont('helvetica', 'normal');

        for(let i = 0; i < timeline_cn.length; i++){
           
            eng_text = timeline_eng[i].replace(/\s+/g, ' ').trim();
            eng_text = eng_text.replace(/\\n/g, '');
            eng_text = notes_pdf.splitTextToSize(eng_text, 180);

            notes_pdf.text(eng_text, 10, pos);

            // pos = pos + eng_text.length * 6;
            pos = pos + notes_pdf.getTextDimensions(eng_text).h + 10;

            if (pos >= 200) {
                notes_pdf.addPage();
                pos = 15;
            }
        }

        if (pos != 15){
            notes_pdf.addPage();
        }

        pos = 30;

        notes_pdf.setFont("helvetica", "normal");
        notes_pdf.setFontSize(20);
        notes_pdf.text("Your Course Notes", 60, pos);

        display_pdf.setFont("helvetica", "normal");
        display_pdf.setFontSize(20);
        display_pdf.text("Your Course Notes", 60, pos);

        pos = pos + 10;
        pos_2 = pos

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

            if (first_page_flag == false){
                display_pdf.setFontSize(14);
                display_pdf.setFont("helvetica", "bold");

                display_pdf.text(key, 10, pos_2);
                pos_2 = pos_2 + dif;
                
                display_pdf.setFont("helvetica", "italic");

                display_pdf.setFontSize(12);

                temp = JSON.stringify(noteDict[key][1]);
                temp2 = temp.replace(/\s+/g, ' ').trim();
                temp2 = temp2.replace(/\\n/g, '');

                var splitText = display_pdf.splitTextToSize(temp2, 180); 
                display_pdf.text(splitText, 10, pos_2);

                pos_2 = pos_2 + splitText.length * 6;

                display_pdf.setFont('chinese', 'normal');
                temp = JSON.stringify(noteDict[key][0]);
                temp2 = temp.replace(/\s+/g, ' ').trim();
                temp2 = temp2.replace(/\\n/g, '');

                var splitText = display_pdf.splitTextToSize(temp2, 180); 
                display_pdf.text(splitText, 10, pos_2);

                pos_2 = pos_2 + splitText.length * 6;


            }

            if (pos >= 200){
                notes_pdf.addPage();
                first_page_flag = true;
                pos = 15;
            }

            
            
        }
        const tempPdf = display_pdf.output('datauristring');
        const doc = new jsPDF();
        
        document.getElementById('pdf-preview').src = tempPdf;

        

        document.getElementById('download-btn').addEventListener('click', function() {
    
            notes_pdf.save("medicare-compass-mynotes.pdf");
        });

    }


});


document.addEventListener('DOMContentLoaded', function() {
    console.log("window location");
    console.log(window.location.pathname);
    if ((window.location.pathname == '/medicare-compass.github.io/ClassPage.html') || (window.location.pathname == '/medicare-compass.github.io/ClassPage-arabic.html')) {
        if (tutorialAidCompleted == false) {

            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.zIndex = '5';
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
            if (window.location.pathname == '/medicare-compass.github.io/ClassPage.html') {
                text.textContent = "单击突出显示部分以获取有关整个课程中某些术语和概念的更多详细信息 \n Click highlights to get more details on certain terms and concepts throughout the course";
            }
            else {
                text.textContent = "انقر فوق النقاط البارزة للحصول على مزيد من التفاصيل حول مصطلحات ومفاهيم معينة خلال الدورة التدريبية \n Click highlights to get more details on certain terms and concepts throughout the course";
            }
            text.style.zIndex = '10000';
            text.style.fontSize = '25px';
            overlay.appendChild(text);

            var readingAid = document.getElementById("tip_one");
            var readingAidTwo = document.getElementById("tip_two")

            readingAid.style.backgroundColor = '#F8CEBF'; 

            readingAid.style.fontWeight = 'bold';

            readingAid.style.zIndex = '1000';

            readingAidTwo.style.backgroundColor = '#F8CEBF'; 

            readingAidTwo.style.fontWeight = 'bold';

            readingAidTwo.style.zIndex = '1000';

            document.addEventListener('click', function(event) {
                
                if (tutorialAidCompleted == false) {
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
    } else if ((window.location.pathname == '/medicare-compass.github.io/WhatIsMedicare.html') || (window.location.pathname == '/medicare-compass.github.io/WhatIsMedicare-arabic.html')) {
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
            if (window.location.pathname == '/medicare-compass.github.io/WhatIsMedicare.html') {
                text_note.innerHTML = "对任何您可能不清楚的地方留下注释或问题<br>Write and save a note or question on anything you might be unclear on to reference them with your insurance agent";
            }
            else {
                text_note.innerHTML = "اكتب واحفظ ملاحظة أو سؤالاً حول أي شيء قد لا تكون واضحًا بشأنه للرجوع إليه مع وكيل التأمين الخاص بك<br>Write and save a note or question on anything you might be unclear on to reference them with your insurance agent";
            }
            text_note.style.textAlign = 'center';
            text_note.style.zindex = '100000';
            text_note.style.fontSize = '25px';
            overlay.appendChild(text_note);
3
            var noteButton = document.getElementById("note_button_one");

            noteButton.style.zIndex = '1000000';


            document.addEventListener('click', function(event) {

                if (tutorialNoteCompleted == false) {
                    overlay.removeChild(text_note);
                    document.body.removeChild(overlay);

                    noteButton.style.zIndex = 'initial';

                    tutorialNoteCompleted = true;
                }

            });

        }

    }



});