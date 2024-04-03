const bitesLeft = document.getElementsByClassName('bite-left');
const bitesRight = document.getElementsByClassName('bite-right');
const continueBtn = document.getElementById('continue-btn');
let currentIndex = 0;


function showNextBite() {
    if (currentIndex < bitesLeft.length) {
        currentIndex++;
    }

    for (let i = 0; i < currentIndex; i++) {
        bitesLeft[i].classList.remove('hidden');
        bitesRight[i].classList.remove('hidden');
        // to do: add increase to progress bar
    }

    // content container scrolls to bottom
    var elem = document.getElementsByClassName('content-container')[0];
    elem.scrollTop = elem.scrollHeight;
}


continueBtn.addEventListener('click', showNextBite);