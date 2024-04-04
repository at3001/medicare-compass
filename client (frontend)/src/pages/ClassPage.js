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
    progressBar.style.width = newWidth + '%';
    // progressBar.textContent = newWidth;
  }

continueBtn.addEventListener('click', showNextBite);
continueBtn.addEventListener('click', increaseProgress);