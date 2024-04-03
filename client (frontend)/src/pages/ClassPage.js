const sentencesEng = document.querySelectorAll('#content-info-eng span');
const sentencesCn = document.querySelectorAll('#content-info-cn span');
const continueBtn = document.getElementById('continue-btn');
let currentIndex = 0;

function showNextSentence() {
    if (currentIndex < sentencesEng.length) {
        currentIndex++;
    }

    for (let i = 0; i < currentIndex; i++) {
        sentencesEng[i].classList.remove('hidden');
        sentencesCn[i].classList.remove('hidden');
    }
}

continueBtn.addEventListener('click', showNextSentence);