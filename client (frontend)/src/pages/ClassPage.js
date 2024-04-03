const sentences = document.querySelectorAll('#content-info span');
const continueBtn = document.getElementById('continue-btn');
let currentIndex = 0;

// document.addEventListener('DOMContentLoaded', function() {
//     // Find the element with the id "demo" and change its text
//     var element = document.getElementById('demo');
//     element.textContent = "JavaScript is working!";
// });

function showNextSentence() {
    // if (currentIndex < sentences.length) {
    //     sentences[currentIndex].classList.add('hidden');
    //     currentIndex++;
    // }
    
    var element = document.getElementById('demo');
    element.textContent = "test"// sentences[0];

    console.log("test");

    for (let i = 0; i < currentIndex; i++) {
        sentences[i].classList.remove('hidden');
    }
}

continueBtn.addEventListener('click', showNextSentence);