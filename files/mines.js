const minusButton = document.getElementById('minusButton'); 
const plusButton = document.getElementById('plusButton'); 
const bombDisplay = document.getElementById('bombDisplay'); 
const playButton = document.getElementById('playButton'); 
const resetButton = document.getElementById('resetButton');
const gameBoard = document.getElementById('gameBoard');
let color1 = '#3b007e4b'; 
let color2 = '#0d001dde';
let isColor1 = true; 
let pocetMin = 5; 
const maxMin = 24;
const minMin = 1;

minusButton.addEventListener('click', () => {
    if (pocetMin > minMin) {
        pocetMin--;
        bombDisplay.textContent = pocetMin; // Aktualizace zobrazeni poctu bomb
    }
});

plusButton.addEventListener('click', () => {
    if (pocetMin < maxMin) {
        pocetMin++;
        bombDisplay.textContent = pocetMin;
    }
});

playButton.addEventListener('click', () => {
    gameBoard.innerHTML = ''; 
    resetButton.style.display = 'inline'; // Zobrazi tlacitko resetu
    playButton.style.display = 'none'; // Skryje tlacitko Play
    setupGame(pocetMin); // Spusteni hry s vybranym poctem bomb
});

resetButton.addEventListener('click', () => {
    resetGame(); // Reset hry
});

function setupGame(pocetMin) {
    const velikostPole = 5;  // Definice velikosti herniho pole
    const pocetPoli = velikostPole * velikostPole; 
    let bombaPole = Array(pocetMin).fill('💣').concat(Array(pocetPoli - pocetMin).fill('⭐'));
    bombaPole.sort(() => Math.random() - 0.5); // Nahodne promichani pole

    gameBoard.style.gridTemplateColumns = `repeat(${velikostPole}, 1fr)`; // Nastaveni maticoveho zobrazeni
    gameBoard.style.gridTemplateRows = `repeat(${velikostPole}, 1fr)`;

    bombaPole.forEach((symbol) => {
        const bunka = document.createElement('div'); 
        bunka.classList.add('cell'); 
        bunka.classList.add('disabled'); // Zablokovani bunky pred startem hry
        bunka.addEventListener('click', () => odhalitBunku(bunka, symbol)); // Nastaveni udalosti na kliknuti
        gameBoard.appendChild(bunka); 
    });
}

function odhalitBunku(bunka, symbol) {
    if (bunka.classList.contains('revealed')) return; // Kontrola, zda nebyla bunka jiz odhalena

    bunka.classList.add('revealed'); // Oznaceni bunky jako odhalene
    bunka.textContent = symbol; // Zobrazeni symbolu na bunce

    if (symbol === '💣') { // Kontrola, zda hrac klikl na bombu
        alert('Prohral jsi! Klikni na Reset pro novou hru.');
        disableAllCells(); // Deaktivace dalsi interakce po prohre
    }
}

function zkontrolujVyhru() {
    const vsechnyPolicka = document.querySelectorAll('.policko');
    let vsechnyHvezdickyOdkryte = true; // Vychozi kontrola, zda jsou vsechny hvezdicky odkryte

    vsechnyPolicka.forEach(policko => {
        const jeOdkryte = policko.classList.contains('odkryte'); // Kontrola, zda je policko odkryte
        const jeHvezdicka = policko.dataset.typ === 'hvezdicka'; // Kontrola, zda policko obsahuje hvezdicku

        if (jeHvezdicka && !jeOdkryte) {
            vsechnyHvezdickyOdkryte = false; // Pokud existuje neodkryta hvezdicka, nastavi se false
        }
    });

    if (vsechnyHvezdickyOdkryte) {
        const zprava = document.createElement('div');
        zprava.textContent = 'VYHRAL JSI!'; // Zobrazeni vitezne zpravy
        zprava.style.position = 'absolute';
        zprava.style.top = '50%';
        zprava.style.left = '50%';
        zprava.style.transform = 'translate(-50%, -50%)';
        zprava.style.padding = '20px';
        zprava.style.fontSize = '24px';
        zprava.style.color = 'white';
        zprava.style.backgroundColor = 'green';
        zprava.style.borderRadius = '10px';
        zprava.style.textAlign = 'center';
        document.body.appendChild(zprava);

        document.querySelectorAll('.policko').forEach(policko => {
            policko.removeEventListener('click', odkrytPolicko); // Odebrani udalosti po vyhre
        });
    }
}

function odkrytPolicko(event) {
    const policko = event.target; // Identifikace kliknuteho policka

    if (policko.classList.contains('odkryte')) return; 
    if (!hraSpustena) return;

    policko.classList.add('odkryte');

    if (policko.dataset.typ === 'bomba') {
        zobrazitZpravuProhry(); // Zavolani zpravy o prohre
    } else if (policko.dataset.typ === 'hvezdicka') {
        policko.textContent = '★'; 
        zkontrolujVyhru();
    }
}

function disableAllCells() {
    const cells = document.querySelectorAll('.cell'); 
    cells.forEach(cell => {
        cell.classList.add('disabled'); // Deaktivace bunky
        cell.style.cursor = 'not-allowed';
    });
}

playButton.addEventListener('click', () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('disabled'); // Povoli interakci s bunkami
        cell.style.cursor = 'pointer'; 
    });
});

function resetGame() {
    gameBoard.innerHTML = ''; // Vycisteni herniho pole
    resetButton.style.display = 'none';
    playButton.style.display = 'inline'; // Obnoveni tlacitka Play
    setupGame(pocetMin); // Inicializace nove hry
}

document.getElementById('visual-mode').addEventListener('click', function() {
    if (isColor1) {
        document.body.style.backgroundColor = color1;
        this.style.color = "black";
        this.textContent = "Dark Mode";
    } else {
        document.body.style.backgroundColor = color2;
        this.style.color = "white";
        this.textContent = "Light Mode";
    }
    isColor1 = !isColor1; // Prepnuti mezi rezimy
});
