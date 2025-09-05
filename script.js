// 일시정지 변수
let isPaused = false;
let currentTimeline = null;

function splitTextIntoWords(element, text) {
    element.innerHTML = '';
    element.className = 'demo-text'; // 기본 클래스 초기화
    
    if (!text.trim()) {
        element.textContent = '안녕하세요!';
        return;
    }
    
    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.dataset.wordIndex = wordIndex;
        
        // 각 글자를 span으로 감싸기
        for (let i = 0; i < word.length; i++) {
            const char = word.charAt(i);
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
        }
        
        element.appendChild(wordSpan);
        
        // 마지막 단어가 아니면 공백 추가
        if (wordIndex < words.length - 1) {
            element.appendChild(document.createTextNode(' '));
        }
    });
}

function updateTextPosition() {
    const demoText = document.getElementById('demoText');
    const selectedPosition = document.querySelector('input[name="position"]:checked');
    
    // 기존 위치 클래스 제거
    demoText.classList.remove('position-top', 'position-center', 'position-bottom');
    
    // 새 위치 클래스 추가
    if (selectedPosition) {
        demoText.classList.add(`position-${selectedPosition.value}`);
    }
}

function updateTextDisplay() {
    const textInput = document.getElementById('textInput');
    const demoText = document.getElementById('demoText');
    
    const inputText = textInput.value || '안녕하세요!';
    demoText.textContent = inputText;
    demoText.style.opacity = '1';
    updateTextPosition();
}

function updateAnimationBoundary() {
    const constrainCheckbox = document.getElementById('constrainAnimation');
    const boundary = document.getElementById('animationBoundary');
    const rangeControls = document.getElementById('rangeControls');
    
    if (constrainCheckbox.checked) {
        boundary.classList.add('visible');
        rangeControls.classList.add('visible');
        updateBoundarySize();
        initializeDragHandles();
    } else {
        boundary.classList.remove('visible');
        rangeControls.classList.remove('visible');
        removeDragHandles();
    }
}

function updateBoundarySize() {
    const boundary = document.getElementById('animationBoundary');
    const topValue = document.getElementById('rangeTop').value;
    const bottomValue = document.getElementById('rangeBottom').value;
    const leftValue = document.getElementById('rangeLeft').value;
    const rightValue = document.getElementById('rangeRight').value;
    
    // 경계선 위치 업데이트
    boundary.style.top = `${topValue}%`;
    boundary.style.bottom = `${bottomValue}%`;
    boundary.style.left = `${leftValue}%`;
    boundary.style.right = `${rightValue}%`;
    
    // 값 표시 업데이트
    document.getElementById('topValue').textContent = `${topValue}%`;
    document.getElementById('bottomValue').textContent = `${bottomValue}%`;
    document.getElementById('leftValue').textContent = `${leftValue}%`;
    document.getElementById('rightValue').textContent = `${rightValue}%`;
}

// 드래그 기능 구현
let isDragging = false;
let dragHandle = null;
let startPos = { x: 0, y: 0 };
let startBounds = { top: 0, left: 0, bottom: 0, right: 0 };

function initializeDragHandles() {
    const handles = document.querySelectorAll('.drag-handle');
    
    handles.forEach(handle => {
        handle.addEventListener('mousedown', startDrag);
    });
}

function removeDragHandles() {
    const handles = document.querySelectorAll('.drag-handle');
    handles.forEach(handle => {
        handle.removeEventListener('mousedown', startDrag);
    });
    isDragging = false;
}

function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    dragHandle = e.target;
    dragHandle.classList.add('dragging');
    
    const boundary = document.getElementById('animationBoundary');
    const previewArea = document.getElementById('previewArea');
    
    startPos.x = e.clientX;
    startPos.y = e.clientY;
    
    // 현재 경계 위치 저장 (퍼센트 값)
    startBounds.top = parseFloat(boundary.style.top) || 15;
    startBounds.left = parseFloat(boundary.style.left) || 10;
    startBounds.bottom = parseFloat(boundary.style.bottom) || 15;
    startBounds.right = parseFloat(boundary.style.right) || 10;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    // 마우스 커서 변경
    document.body.style.cursor = window.getComputedStyle(dragHandle).cursor;
}

function drag(e) {
    if (!isDragging || !dragHandle) return;
    
    e.preventDefault();
    
    const boundary = document.getElementById('animationBoundary');
    const previewArea = document.getElementById('previewArea');
    const previewRect = previewArea.getBoundingClientRect();
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    // 퍼센트 변화량 계산
    const deltaXPercent = (deltaX / previewRect.width) * 100;
    const deltaYPercent = (deltaY / previewRect.height) * 100;
    
    const handleType = dragHandle.dataset.handle;
    let newTop = startBounds.top;
    let newLeft = startBounds.left;
    let newBottom = startBounds.bottom;
    let newRight = startBounds.right;
    
    // 핸들 타입에 따라 경계 조정
    switch(handleType) {
        case 'top-left':
            newTop = Math.max(0, Math.min(40, startBounds.top + deltaYPercent));
            newLeft = Math.max(0, Math.min(40, startBounds.left + deltaXPercent));
            break;
        case 'top-right':
            newTop = Math.max(0, Math.min(40, startBounds.top + deltaYPercent));
            newRight = Math.max(0, Math.min(40, startBounds.right - deltaXPercent));
            break;
        case 'bottom-left':
            newBottom = Math.max(0, Math.min(40, startBounds.bottom - deltaYPercent));
            newLeft = Math.max(0, Math.min(40, startBounds.left + deltaXPercent));
            break;
        case 'bottom-right':
            newBottom = Math.max(0, Math.min(40, startBounds.bottom - deltaYPercent));
            newRight = Math.max(0, Math.min(40, startBounds.right - deltaXPercent));
            break;
        case 'top':
            newTop = Math.max(0, Math.min(40, startBounds.top + deltaYPercent));
            break;
        case 'bottom':
            newBottom = Math.max(0, Math.min(40, startBounds.bottom - deltaYPercent));
            break;
        case 'left':
            newLeft = Math.max(0, Math.min(40, startBounds.left + deltaXPercent));
            break;
        case 'right':
            newRight = Math.max(0, Math.min(40, startBounds.right - deltaXPercent));
            break;
    }
    
    // 최소 크기 확보 (각각 최소 5%)
    if (newTop + newBottom > 80) {
        const excess = (newTop + newBottom) - 80;
        newTop -= excess / 2;
        newBottom -= excess / 2;
    }
    if (newLeft + newRight > 80) {
        const excess = (newLeft + newRight) - 80;
        newLeft -= excess / 2;
        newRight -= excess / 2;
    }
    
    // 경계 업데이트
    boundary.style.top = `${newTop}%`;
    boundary.style.left = `${newLeft}%`;
    boundary.style.bottom = `${newBottom}%`;
    boundary.style.right = `${newRight}%`;
    
    // 슬라이더 값 동기화
    document.getElementById('rangeTop').value = Math.round(newTop);
    document.getElementById('rangeBottom').value = Math.round(newBottom);
    document.getElementById('rangeLeft').value = Math.round(newLeft);
    document.getElementById('rangeRight').value = Math.round(newRight);
    
    // 표시 값 업데이트
    document.getElementById('topValue').textContent = `${Math.round(newTop)}%`;
    document.getElementById('bottomValue').textContent = `${Math.round(newBottom)}%`;
    document.getElementById('leftValue').textContent = `${Math.round(newLeft)}%`;
    document.getElementById('rightValue').textContent = `${Math.round(newRight)}%`;
}

function stopDrag() {
    if (isDragging && dragHandle) {
        dragHandle.classList.remove('dragging');
        dragHandle = null;
    }
    
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.body.style.cursor = 'default';
}

function getAnimationBounds() {
    const constrainCheckbox = document.getElementById('constrainAnimation');
    
    if (!constrainCheckbox.checked) {
        return null; // 제한 없음
    }
    
    const previewArea = document.getElementById('previewArea');
    const previewRect = previewArea.getBoundingClientRect();
    
    const topPercent = parseFloat(document.getElementById('rangeTop').value);
    const bottomPercent = parseFloat(document.getElementById('rangeBottom').value);
    const leftPercent = parseFloat(document.getElementById('rangeLeft').value);
    const rightPercent = parseFloat(document.getElementById('rangeRight').value);
    
    // 실제 화면 좌표로 변환
    return {
        left: previewRect.left + (previewRect.width * leftPercent / 100),
        right: previewRect.left + (previewRect.width * (100 - rightPercent) / 100),
        top: previewRect.top + (previewRect.height * topPercent / 100),
        bottom: previewRect.top + (previewRect.height * (100 - bottomPercent) / 100)
    };
}

function createPhysicsBall(x, y, bounds = null) {
    const ball = document.createElement('div');
    ball.className = 'physics-ball';
    document.body.appendChild(ball);
    
    const size = gsap.utils.random(8, 20);
    
    gsap.set(ball, {
        width: size,
        height: size,
        left: x,
        top: y,
        scale: 0
    });
    
    // 기본 애니메이션으로 구슬 효과 구현
    gsap.timeline({
        onComplete: () => ball.remove()
    })
    .to(ball, {
        scale: 1,
        duration: 0.2,
        ease: "back.out(2)"
    })
    .to(ball, {
        y: `+=${gsap.utils.random(100, 300)}`,
        x: `+=${gsap.utils.random(-80, 80)}`,
        rotation: gsap.utils.random(0, 360),
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    }, "<0.1");
}

// 수정된 애니메이션 효과들
function posterEffect(words, demoText, wordDelay) {
    // 먼저 모든 요소 표시
    gsap.set(demoText, { opacity: 1 });
    gsap.set(words, { opacity: 1 });
    
    // 각 단어의 글자들도 표시
    const allChars = demoText.querySelectorAll('.char');
    gsap.set(allChars, { opacity: 1 });
    
    // 각 단어 개별 애니메이션
    words.forEach((word, index) => {
        // 초기 상태
        gsap.set(word, { 
            scale: 0, 
            rotation: 360,
            transformOrigin: "center center" 
        });
        
        // 애니메이션
        gsap.to(word, {
            scale: 1,
            rotation: 0,
            duration: 1.2,
            delay: index * wordDelay,
            ease: "back.out(1.7)"
        });
    });
}

function rainbowEffect(words, demoText, words) {
    demoText.className = 'demo-text rainbow-text';
    updateTextPosition();
    
    // 먼저 모든 요소 표시
    gsap.set(demoText, { opacity: 1 });
    gsap.set(words, { opacity: 1 });
    
    // 각 단어의 글자들도 표시
    const allChars = demoText.querySelectorAll('.char');
    gsap.set(allChars, { opacity: 1 });
    
    words.forEach((word, index) => {
        // 초기 상태
        gsap.set(word, { 
            scale: 0.3, 
            y: 50,
            transformOrigin: "center center" 
        });
        
        // 애니메이션
        gsap.to(word, {
            scale: 1,
            y: 0,
            duration: 0.8,
            delay: index * wordDelay,
            ease: "elastic.out(1, 0.5)",
            onComplete: function() {
                const chars = word.querySelectorAll('.char');
                chars.forEach((char, charIndex) => {
                    char.style.animationDelay = `${charIndex * 0.1}s`;
                });
            }
        });
    });
}

function popEffect(words, demoText, wordDelay) {
    const bounds = getAnimationBounds();
    
    // 먼저 모든 요소 표시
    gsap.set(demoText, { opacity: 1 });
    gsap.set(words, { opacity: 1 });
    
    // 각 단어의 글자들도 표시
    const allChars = demoText.querySelectorAll('.char');
    gsap.set(allChars, { opacity: 1 });
    
    words.forEach((word, index) => {
        // 초기 상태
        gsap.set(word, { 
            scale: 0, 
            y: 50,
            transformOrigin: "center center" 
        });
        
        // 애니메이션
        gsap.to(word, {
            scale: 1,
            y: 0,
            duration: 0.6,
            delay: index * wordDelay,
            ease: "back.out(2)",
            onComplete: function() {
                // 구슬 생성
                const chars = word.querySelectorAll('.char');
                chars.forEach((char, charIndex) => {
                    setTimeout(() => {
                        const rect = char.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        
                        const ballCount = gsap.utils.random(4, 8, 1);
                        
                        for (let i = 0; i < ballCount; i++) {
                            setTimeout(() => {
                                createPhysicsBall(
                                    centerX + gsap.utils.random(-5, 5),
                                    centerY + gsap.utils.random(-5, 5),
                                    bounds
                                );
                            }, i * 15);
                        }
                    }, charIndex * 20);
                });
            }
        });
    });
}

function bounceEffect(words, demoText, wordDelay) {
    demoText.className = 'demo-text bounce-text';
    updateTextPosition();
    
    // 먼저 모든 요소 표시
    gsap.set(demoText, { opacity: 1 });
    gsap.set(words, { opacity: 1 });
    
    // 각 단어의 글자들도 표시
    const allChars = demoText.querySelectorAll('.char');
    gsap.set(allChars, { opacity: 1 });
    
    words.forEach((word, index) => {
        // 초기 상태
        gsap.set(word, { 
            scale: 0, 
            y: -100,
            transformOrigin: "center center" 
        });
        
        // 애니메이션
        gsap.to(word, {
            scale: 1,
            y: 0,
            duration: 1,
            delay: index * wordDelay,
            ease: "bounce.out",
            onComplete: function() {
                const chars = word.querySelectorAll('.char');
                chars.forEach((char, charIndex) => {
                    char.style.animationDelay = `${charIndex * 0.1}s`;
                });
            }
        });
    });
}

// 일시정지 기능
function togglePause() {
    const pauseBtn = document.querySelector('.pause-btn');
    
    if (!isPaused) {
        // 일시정지
        gsap.globalTimeline.pause();
        isPaused = true;
        pauseBtn.textContent = '재생';
        pauseBtn.style.background = 'linear-gradient(135deg, #00c851 0%, #00e676 100%)';
    } else {
        // 재생
        gsap.globalTimeline.play();
        isPaused = false;
        pauseBtn.textContent = '일시정지';
        pauseBtn.style.background = 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)';
    }
}

function applyEffect() {
    const textInput = document.getElementById('textInput');
    const demoText = document.getElementById('demoText');
    const selectedEffect = document.querySelector('input[name="effect"]:checked');
    const wordDelay = parseFloat(document.getElementById('wordDelay').value);
    
    const inputText = textInput.value || '안녕하세요!';
    
    // 기존 애니메이션 완전 정리
    gsap.killTweensOf("*");
    
    // 일시정지 상태 초기화
    isPaused = false;
    const pauseBtn = document.querySelector('.pause-btn');
    if (pauseBtn) {
        pauseBtn.textContent = '일시정지';
        pauseBtn.style.background = 'linear-gradient(135deg, #ff6b00 0%, #ff8f00 100%)';
    }
    
    // 기존 구슬들 제거
    document.querySelectorAll('.physics-ball').forEach(ball => ball.remove());
    
    // 텍스트를 단어별로 분리
    splitTextIntoWords(demoText, inputText);
    
    // 위치 및 범위 업데이트
    updateTextPosition();
    updateAnimationBoundary();
    
    const words = demoText.querySelectorAll('.word');
    
    // 먼저 텍스트가 보이도록 설정
    gsap.set(demoText, { opacity: 1 });
    
    if (selectedEffect && words.length > 0) {
        // 선택된 효과에 따라 애니메이션 적용
        switch(selectedEffect.value) {
            case 'poster':
                posterEffect(words, demoText, wordDelay);
                break;
            case 'rainbow':
                rainbowEffect(words, demoText, wordDelay);
                break;
            case 'pop':
                popEffect(words, demoText, wordDelay);
                break;
            case 'bounce':
                bounceEffect(words, demoText, wordDelay);
                break;
        }
    } else {
        // 효과 없이 기본 표시
        demoText.innerHTML = inputText;
        gsap.set(demoText, { opacity: 1 });
        updateTextPosition();
    }
}

// 이벤트 리스너들
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const wordDelaySlider = document.getElementById('wordDelay');
    const delayValue = document.getElementById('delayValue');
    const constrainCheckbox = document.getElementById('constrainAnimation');
    const positionInputs = document.querySelectorAll('input[name="position"]');
    
    // 범위 조정 슬라이더들
    const rangeSliders = ['rangeTop', 'rangeBottom', 'rangeLeft', 'rangeRight'];
    
    // 텍스트 입력 엔터키 지원
    textInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyEffect();
        }
    });
    
    // 텍스트 입력 실시간 업데이트
    textInput.addEventListener('input', updateTextDisplay);
    
    // 단어 지연 슬라이더 값 업데이트
    wordDelaySlider.addEventListener('input', function() {
        delayValue.textContent = this.value + '초';
    });
    
    // 애니메이션 범위 체크박스 변경
    constrainCheckbox.addEventListener('change', updateAnimationBoundary);
    
    // 범위 조정 슬라이더 이벤트 리스너
    rangeSliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', updateBoundarySize);
        }
    });
    
    // 위치 변경 시 즉시 반영
    positionInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateTextPosition();
            updateTextDisplay();
        });
    });
    
    // 페이지 로드 시 기본 예제 표시
    updateTextDisplay();
    updateTextPosition();
});