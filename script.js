const checkbox = document.getElementById('custom-checkbox');
const label = document.querySelector('label');
const modal = document.getElementById('puzzle-modal');
const modalContent = document.getElementById('modal-content');

let currentLevel = 1;

checkbox.addEventListener('click', startCaptcha);
label.addEventListener('click', startCaptcha);

function startCaptcha() {
    if (checkbox.classList.contains('loading') || checkbox.classList.contains('checked')) return;
    
    checkbox.classList.add('loading');
    
    setTimeout(() => {
        checkbox.classList.remove('loading');
        showModal();
    }, 1500);
}

function showModal() {
    modal.style.display = 'flex';
    loadLevel(currentLevel);
}

function loadLevel(level) {
    if (level === 1) {
        renderGridLevel('🚦', 'traffic lights', false, false);
    } else if (level === 2) {
        renderGridLevel('🚲', 'bicycles', true, false);
    } else if (level === 3) {
        renderGridLevel('👽', 'aliens', false, true);
    } else if (level === 4) {
        renderMathLevel();
    } else if (level === 5) {
        renderTeleportLevel();
    }
}

function renderGridLevel(targetEmoji, targetName, isEvading, isVibrating) {
    const emojis = [targetEmoji, targetEmoji, targetEmoji, '🚗', '🚌', '🏍️', '🚶', '🐕', '🌳'];
    emojis.sort(() => Math.random() - 0.5);

    let html = `
        <div class="modal-header">
            Select all squares with
            <span>${targetName}</span>
        </div>
        <div class="modal-body ${isVibrating ? 'vibrate' : ''}" id="grid-body">
            ${emojis.map((emoji) => `<div class="grid-item" data-emoji="${emoji}">${emoji}</div>`).join('')}
        </div>
        <div class="modal-footer">
            <div class="footer-icons">
                <span title="Reload challenge">↻</span>
                <span title="Audio challenge">🎧</span>
                <span title="Information">ℹ️</span>
            </div>
            <button class="verify-btn" id="verify-btn">${isVibrating ? 'H E L P' : 'Verify'}</button>
        </div>
    `;

    modalContent.innerHTML = html;

    const gridItems = document.querySelectorAll('.grid-item');
    const verifyBtn = document.getElementById('verify-btn');

    gridItems.forEach(item => {
        if (isVibrating) {
            item.classList.add('vibrate-intense');
        }

        // Level 2 behavior: Evading emojis
        if (isEvading) {
            item.addEventListener('mouseenter', function() {
                if (this.dataset.emoji === targetEmoji) {
                    // Swap text with another random non-target grid item
                    const otherItems = Array.from(gridItems).filter(i => i !== this && i.dataset.emoji !== targetEmoji);
                    if (otherItems.length > 0) {
                        const randomItem = otherItems[Math.floor(Math.random() * otherItems.length)];
                        
                        const tempEmoji = this.innerText;
                        this.innerText = randomItem.innerText;
                        this.dataset.emoji = randomItem.innerText;
                        
                        randomItem.innerText = tempEmoji;
                        randomItem.dataset.emoji = tempEmoji;
                        
                        // Remove selection if swapped
                        this.classList.remove('selected');
                        randomItem.classList.remove('selected');
                    }
                }
            });
        }

        item.addEventListener('click', function(e) {
            this.classList.toggle('selected');
        });
    });

    verifyBtn.addEventListener('click', () => {
        verifyBtn.innerText = "Checking...";
        setTimeout(() => {
            if (currentLevel === 3) {
                // JUMPSCARE!
                const jumpscare = document.getElementById('jumpscare-container');
                jumpscare.style.display = 'block';
                
                // Play the jumpscare sound
                const audio = new Audio('nam_ewwww.wav');
                audio.volume = 1.0; // Max volume for full effect
                audio.play().catch(e => console.log('Audio autoplay prevented:', e));
                
                setTimeout(() => {
                    jumpscare.style.display = 'none';
                    currentLevel++;
                    loadLevel(currentLevel);
                }, 2000); // 2 seconds of pure terror
            } else {
                // Always fail and move to next level
                const header = document.querySelector('.modal-header');
                header.style.backgroundColor = '#d93025';
                header.innerHTML = `Please try again.`;
                
                setTimeout(() => {
                    currentLevel++;
                    loadLevel(currentLevel);
                }, 1000);
            }
        }, 800);
    });
}

function renderMathLevel() {
    let html = `
        <div class="modal-header">
            Prove you are human
            <span style="font-size: 14px; font-weight: normal; margin-top: 10px;">Solve the following to continue:</span>
        </div>
        <div class="modal-body" style="display: block; padding: 30px; min-height: auto;">
            <div style="font-size: 28px; text-align: center; margin-bottom: 10px; font-family: 'Times New Roman', Times, serif;">
                <math xmlns="http://www.w3.org/1998/Math/MathML">
                  <msubsup>
                    <mo>&#x222B;</mo>
                    <mn>0</mn>
                    <mi>&#x03C0;</mi>
                  </msubsup>
                  <msup>
                    <mi>e</mi>
                    <mi>x</mi>
                  </msup>
                  <mo>&#xB7;</mo>
                  <mi>sin</mi>
                  <mo>(</mo>
                  <mi>x</mi>
                  <mo>)</mo>
                  <mo>&#x2009;</mo>
                  <mi>d</mi>
                  <mi>x</mi>
                </math>
            </div>
            <input type="text" class="math-input" placeholder="Enter exact answer...">
        </div>
        <div class="modal-footer">
            <div class="footer-icons">
                <span title="Reload challenge">↻</span>
                <span title="Audio challenge">🎧</span>
                <span title="Information">ℹ️</span>
            </div>
            <button class="verify-btn" id="verify-btn">Verify</button>
        </div>
    `;

    modalContent.innerHTML = html;

    const verifyBtn = document.getElementById('verify-btn');
    const input = document.querySelector('.math-input');

    verifyBtn.addEventListener('click', () => {
        if (input.value.trim() === '') return;
        verifyBtn.innerText = "Checking...";
        setTimeout(() => {
            currentLevel++;
            loadLevel(currentLevel);
        }, 1000);
    });
}

function renderTeleportLevel() {
    let html = `
        <div class="modal-header" style="background: #ea4335;">
            Final Step
            <span style="font-size: 18px;">Click Verify to complete</span>
        </div>
        <div class="modal-body" style="height: 250px; position: relative; background: #fff;">
            <button class="verify-btn teleport-btn" id="teleport-btn" style="top: 100px; left: 130px;">Verify</button>
        </div>
    `;

    modalContent.innerHTML = html;

    const teleportBtn = document.getElementById('teleport-btn');
    const modalBody = document.querySelector('.modal-body');

    teleportBtn.addEventListener('mouseover', () => {
        const maxX = modalBody.clientWidth - teleportBtn.clientWidth;
        const maxY = modalBody.clientHeight - teleportBtn.clientHeight;
        
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;

        teleportBtn.style.left = newX + 'px';
        teleportBtn.style.top = newY + 'px';
        
        teleportBtn.innerText = "Too slow!";
        teleportBtn.style.backgroundColor = "#ea4335";
    });

    teleportBtn.addEventListener('click', () => {
        alert("You caught it! But your reaction time was 0.001ms. Nice try, robot.");
        modal.style.display = 'none';
        
        // Reset or show success? Let's just show fake success
        checkbox.classList.add('checked');
        document.querySelector('.captcha-box').style.borderColor = '#009688';
        currentLevel = 1; // Reset for next time
    });
}
