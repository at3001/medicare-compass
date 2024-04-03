const sentences = document.querySelectorAll('#content-info span');
const continueBtn = document.getElementById('continue-btn');
let currentIndex = 0;

function showNextSentence() {
    if (currentIndex < sentences.length) {
        currentIndex++;
    }

    for (let i = 0; i < currentIndex; i++) {
        sentences[i].classList.remove('hidden');
    }
}

continueBtn.addEventListener('click', showNextSentence);