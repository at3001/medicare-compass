const sentencesEng = document.querySelectorAll('#content-info-eng span');
const sentencesCn = document.querySelectorAll('#content-info-cn span');
const continueBtn = document.getElementById('continue-btn');
let currentIndex = 0;

const bitesLeft = document.querySelectorAll('#bite-left');
const bitesRight = document.querySelectorAll('#bite-right');

function showNextSentence() {
    if (currentIndex < sentencesEng.length) {
        currentIndex++;
    }

    for (let i = 0; i < currentIndex; i++) {
        sentencesEng[i].classList.remove('hidden');
        sentencesCn[i].classList.remove('hidden');
        // to do: add increase to progress bar
    }
}

function showNextBite() {
    if (currentIndex < bitesRight.length) {
        currentIndex++;
    }

    for (let i = 0; i < currentIndex; i++) {
        bitesLeft[i].classList.remove('hidden');
        bitesRight[i].classList.remove('hidden');
        // to do: add increase to progress bar
    }
}


continueBtn.addEventListener('click', showNextBite);