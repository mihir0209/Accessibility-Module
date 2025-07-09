/**
 * Universal Accessibility Controls Module - JavaScript Core
 * v3.1 FINAL & STABLE - ALL FEATURES RESTORED & BUGS FIXED
 */

// Global state variables
var dropdownInitialized = false;
var dropdownJustOpened = false;
var fontIncreaseLevel = 0, fontDecreaseLevel = 0, maxLevels = 3;
var screenReaderActive = false;
var speechSynthesis = window.speechSynthesis;
var currentUtterance = null;

// --- DEVELOPER CONFIGURATION ---
var SKIP_ACCESSIBILITY_MENU = true;
var SCREEN_READER_EXCLUSIONS = ['accessibility-widget', 'no-screen-reader'];
// --- END CONFIGURATION ---

// ====== DROPDOWN MANAGEMENT ======
function initializeAccessibilityDropdown() {
    if (dropdownInitialized) return;
    var toggleButton = document.getElementById('accessibilityMenu');
    var dropdownMenu = document.getElementById('accessibilityDropdown');
    if (!toggleButton || !dropdownMenu) return;

    toggleButton.addEventListener('click', function(event) { event.stopPropagation(); dropdownJustOpened = true; setTimeout(function() { dropdownJustOpened = false; }, 200); toggleDropdown(); });
    document.addEventListener('click', function(event) {
        if (dropdownJustOpened) return;
        var widget = document.querySelector('.accessibility-widget');
        if (dropdownMenu.classList.contains('show') && widget && !widget.contains(event.target)) { closeDropdown(); }
    });
    document.addEventListener('keydown', function(event) { if (event.key === 'Escape') closeDropdown(); });
    dropdownInitialized = true;
}
function toggleDropdown() { document.getElementById('accessibilityDropdown').classList.contains('show') ? closeDropdown() : openDropdown(); }
function openDropdown() {
    var toggleButton = document.getElementById('accessibilityMenu'), dropdownMenu = document.getElementById('accessibilityDropdown');
    if (!toggleButton || !dropdownMenu) return;
    dropdownMenu.classList.add('show');
    toggleButton.setAttribute('aria-expanded', 'true');
}
function closeDropdown() {
    var toggleButton = document.getElementById('accessibilityMenu'), dropdownMenu = document.getElementById('accessibilityDropdown');
    if (!toggleButton || !dropdownMenu) return;
    dropdownMenu.classList.remove('show');
    toggleButton.setAttribute('aria-expanded', 'false');
}

// ====== FONT SCALING ======
function applyFontScale() {
    var scale = 1;
    if (fontIncreaseLevel > 0) scale = Math.pow(1.1, fontIncreaseLevel);
    else if (fontDecreaseLevel > 0) scale = Math.pow(1 / 1.1, fontDecreaseLevel);
    document.body.style.zoom = scale === 1 ? '' : scale;
    updateLevelIndicators();
}
function increaseFontSize() { if (fontIncreaseLevel < maxLevels) { fontDecreaseLevel = 0; fontIncreaseLevel++; applyFontScale(); saveSettings(); } }
function decreaseFontSize() { if (fontDecreaseLevel < maxLevels) { fontIncreaseLevel = 0; fontDecreaseLevel++; applyFontScale(); saveSettings(); } }
function updateLevelIndicators() {
    var increaseIndicator = document.getElementById('fontIncreaseLevel'), decreaseIndicator = document.getElementById('fontDecreaseLevel');
    if (increaseIndicator) increaseIndicator.textContent = fontIncreaseLevel > 0 ? fontIncreaseLevel : '';
    if (decreaseIndicator) decreaseIndicator.textContent = fontDecreaseLevel > 0 ? fontDecreaseLevel : '';
    document.getElementById('fontIncreaseBtn')?.classList.toggle('active', fontIncreaseLevel > 0);
    document.getElementById('fontDecreaseBtn')?.classList.toggle('active', fontDecreaseLevel > 0);
}

// ====== FEATURE TOGGLES ======
function toggleBodyClass(className, btnId) { document.body.classList.toggle(className); document.getElementById(btnId)?.classList.toggle('active'); saveSettings(); }
function toggleHighContrast() { toggleBodyClass('high-contrast', 'contrastBtn'); }
function toggleInvert() { toggleBodyClass('invert-colors', 'invertBtn'); }
function toggleSaturation() { toggleBodyClass('saturate-colors', 'saturationBtn'); }
function toggleHighlightLinks() { toggleBodyClass('highlight-links', 'highlightLinksBtn'); }
function toggleTextSpacing() { toggleBodyClass('text-spacing', 'textSpacingBtn'); }
function toggleLineHeight() { toggleBodyClass('line-height', 'lineHeightBtn'); }
function toggleHideImages() { toggleBodyClass('hide-images', 'hideImagesBtn'); }

// ====== SCREEN READER (FULL VERSION) ======
function toggleScreenReader() {
    screenReaderActive = !screenReaderActive;
    document.getElementById('screenReaderBtn').classList.toggle('active', screenReaderActive);
    if (screenReaderActive) {
        initializeScreenReader();
        speakText("Screen reader activated.");
    } else {
        removeScreenReaderListeners();
        stopSpeaking();
        speakText("Screen reader deactivated.");
    }
    saveSettings();
}
function initializeScreenReader() { document.body.addEventListener('click', handleElementClickForReading, true); if (!document.getElementById('readPageBtn')) addReadPageButton(); }
function removeScreenReaderListeners() { document.body.removeEventListener('click', handleElementClickForReading, true); document.getElementById('readPageBtn')?.remove(); } // FIX: Removes only the button, not its parent.
function handleElementClickForReading(event) {
    if (!screenReaderActive) return;
    var element = event.target;
    if (SKIP_ACCESSIBILITY_MENU && element.closest('.accessibility-widget')) return;
    if (SCREEN_READER_EXCLUSIONS.some(cls => element.closest('.' + cls))) return;
    event.preventDefault(); event.stopPropagation();
    var text = (element.textContent || element.innerText || element.alt || element.title || '').trim();
    if (text) speakText(text);
}
function speakText(text) {
    if (!speechSynthesis) { console.warn("Speech Synthesis not supported."); return; }
    stopSpeaking();
    currentUtterance = new SpeechSynthesisUtterance(text);
    var speechSettings = getSpeechSettings();
    currentUtterance.rate = speechSettings.rate;
    currentUtterance.volume = speechSettings.volume;
    speechSynthesis.speak(currentUtterance);
}
function stopSpeaking() { if (speechSynthesis && speechSynthesis.speaking) speechSynthesis.cancel(); }
function readEntirePage() {
    var content = Array.from(document.querySelectorAll('h1, h2, h3, p, a, li'))
        .map(el => (el.textContent || '').trim())
        .filter(text => text.length > 10)
        .join('. ');
    speakText('Reading page contents. ' + content);
}
function addReadPageButton() {
    var container = document.getElementById('otherControlsContainer');
    if (!container) return;
    var readPageBtn = document.createElement('button');
    readPageBtn.className = 'ac-btn';
    readPageBtn.id = 'readPageBtn';
    readPageBtn.title = 'Read Page Aloud';
    readPageBtn.onclick = readEntirePage;
    readPageBtn.innerHTML = '<img width="16" height="16" src="https://img.icons8.com/ios-filled/16/speaker.png" alt="Read Page">Read Page Aloud';
    container.insertBefore(readPageBtn, document.getElementById('speechSettingsBtn'));
}

// ====== SPEECH SETTINGS (FULL VERSION) ======
function toggleSpeechSettings(event) {
    event.stopPropagation();
    var speechControls = document.getElementById('speechControls');
    if (speechControls) {
        var isVisible = speechControls.style.display !== 'none';
        speechControls.style.display = isVisible ? 'none' : 'block';
        document.getElementById('speechSettingsBtn').classList.toggle('active', !isVisible);
    }
}
function updateSpeechSettings() {
    var rate = document.getElementById('speechRate').value;
    var volume = document.getElementById('speechVolume').value;
    document.getElementById('rateValue').textContent = parseFloat(rate).toFixed(1);
    document.getElementById('volumeValue').textContent = parseFloat(volume).toFixed(1);
    localStorage.setItem('speechSettings', JSON.stringify({ rate: parseFloat(rate), volume: parseFloat(volume) }));
}
function loadSpeechSettings() {
    var settings = getSpeechSettings();
    document.getElementById('speechRate').value = settings.rate;
    document.getElementById('speechVolume').value = settings.volume;
    document.getElementById('rateValue').textContent = settings.rate.toFixed(1);
    document.getElementById('volumeValue').textContent = settings.volume.toFixed(1);
}
function getSpeechSettings() { return JSON.parse(localStorage.getItem('speechSettings') || '{"rate": 1, "volume": 1}'); }
function testSpeech(event) { event.stopPropagation(); speakText("This is a test of the current speech settings."); }

// ====== SETTINGS MANAGEMENT (FULL VERSION) ======
function saveSettings() {
    localStorage.setItem('accessibilitySettings', JSON.stringify({
        fontIncreaseLevel, fontDecreaseLevel,
        highContrast: document.body.classList.contains('high-contrast'),
        invertColors: document.body.classList.contains('invert-colors'),
        saturateColors: document.body.classList.contains('saturate-colors'),
        highlightLinks: document.body.classList.contains('highlight-links'),
        textSpacing: document.body.classList.contains('text-spacing'),
        lineHeight: document.body.classList.contains('line-height'),
        hideImages: document.body.classList.contains('hide-images'),
        screenReader: screenReaderActive
    }));
}
function loadSettings() {
    var settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
    fontIncreaseLevel = settings.fontIncreaseLevel || 0;
    fontDecreaseLevel = settings.fontDecreaseLevel || 0;
    applyFontScale();
    if (settings.highContrast) toggleBodyClass('high-contrast', 'contrastBtn');
    if (settings.invertColors) toggleBodyClass('invert-colors', 'invertBtn');
    if (settings.saturateColors) toggleBodyClass('saturate-colors', 'saturationBtn');
    if (settings.highlightLinks) toggleBodyClass('highlight-links', 'highlightLinksBtn');
    if (settings.textSpacing) toggleBodyClass('text-spacing', 'textSpacingBtn');
    if (settings.lineHeight) toggleBodyClass('line-height', 'lineHeightBtn');
    if (settings.hideImages) toggleBodyClass('hide-images', 'hideImagesBtn');
    if (settings.screenReader) { toggleScreenReader(); } // This will correctly set it up
}
function resetAllSettings() { // FIX: No-reload reset
    if (screenReaderActive) { toggleScreenReader(); } // Turn off reader if active
    fontIncreaseLevel = 0; fontDecreaseLevel = 0; applyFontScale();
    ['high-contrast', 'invert-colors', 'saturate-colors', 'highlight-links', 'text-spacing', 'line-height', 'hide-images'].forEach(cls => document.body.classList.remove(cls));
    document.querySelectorAll('.accessibility-widget .ac-btn.active').forEach(btn => btn.classList.remove('active'));
    localStorage.removeItem('accessibilitySettings');
    localStorage.removeItem('speechSettings');
    loadSpeechSettings(); // Reset speech sliders to default
    console.log('All accessibility settings have been reset.');
}

// ====== INITIALIZATION & STRUCTURE ======
function reorganizeDropdownStructure() {
    var dropdownMenu = document.getElementById('accessibilityDropdown');
    if (!dropdownMenu) return;
    dropdownMenu.innerHTML = `
        <div class="section-group">
            <strong><img width="16" height="16" src="https://img.icons8.com/color/16/rgb-circle-2--v1.png" alt="Contrast"> Color & Contrast</strong>
            <div class="category-controls">
                <button class="ac-btn" id="contrastBtn" onclick="toggleHighContrast()"><img src="https://img.icons8.com/ios-glyphs/16/contrast.png" alt="">High Contrast<div class="status-indicator"></div></button>
                <button class="ac-btn" id="invertBtn" onclick="toggleInvert()"><img src="https://img.icons8.com/ios-filled/16/inverts-color-off.png" alt="">Invert Colors<div class="status-indicator"></div></button>
                <button class="ac-btn" id="saturationBtn" onclick="toggleSaturation()"><img src="https://img.icons8.com/ios-filled/16/saturation.png" alt="">Saturation<div class="status-indicator"></div></button>
                <button class="ac-btn" id="highlightLinksBtn" onclick="toggleHighlightLinks()"><img src="https://img.icons8.com/ios-filled/16/marker-pen.png" alt="">Highlight Links<div class="status-indicator"></div></button>
            </div>
        </div>
        <div class="menu-divider"></div>
        <div class="section-group">
            <strong><img width="16" height="16" src="https://img.icons8.com/ios/16/text.png" alt="Text"> Text & Font</strong>
            <div class="category-controls">
                <button class="ac-btn" id="fontIncreaseBtn" onclick="increaseFontSize()"><img src="https://img.icons8.com/ios-glyphs/16/increase-font.png" alt="">Font Size +<div class="level-indicator" id="fontIncreaseLevel"></div></button>
                <button class="ac-btn" id="fontDecreaseBtn" onclick="decreaseFontSize()"><img src="https://img.icons8.com/ios-glyphs/16/decrease-font.png" alt="">Font Size -<div class="level-indicator" id="fontDecreaseLevel"></div></button>
                <button class="ac-btn" id="textSpacingBtn" onclick="toggleTextSpacing()"><img src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/16/external-text-spacing-text-editor-inkubators-detailed-outline-inkubators.png" alt="">Text Spacing<div class="status-indicator"></div></button>
                <button class="ac-btn" id="lineHeightBtn" onclick="toggleLineHeight()"><img src="https://img.icons8.com/ios/16/height.png" alt="">Line Height<div class="status-indicator"></div></button>
            </div>
        </div>
        <div class="menu-divider"></div>
        <div class="section-group">
            <strong><img src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/16/external-more-information-music-inkubators-detailed-outline-inkubators.png" alt="Other"> Other Controls</strong>
            <div class="category-controls" id="otherControlsContainer">
                <button class="ac-btn" id="screenReaderBtn" onclick="toggleScreenReader()"><img src="https://img.icons8.com/ios-filled/16/high-volume--v1.png" alt="">Screen Reader<div class="status-indicator"></div></button>
                <button class="ac-btn" id="speechSettingsBtn" onclick="toggleSpeechSettings(event)"><img src="https://img.icons8.com/ios-filled/16/settings.png" alt="">Speech Settings</button>
                <button class="ac-btn" id="hideImagesBtn" onclick="toggleHideImages()"><img src="https://img.icons8.com/ios-glyphs/16/no-image.png" alt="">Hide Images<div class="status-indicator"></div></button>
            </div>
            <div id="speechControls" style="display: none; padding: 10px 0; font-size: 12px;" onclick="event.stopPropagation();">
                <div style="margin: 5px 0;"><label style="color: #fff;">Speed: <span id="rateValue">1.0</span></label><input type="range" id="speechRate" min="0.5" max="2" step="0.1" value="1" oninput="updateSpeechSettings()"></div>
                <div style="margin: 5px 0;"><label style="color: #fff;">Volume: <span id="volumeValue">1.0</span></label><input type="range" id="speechVolume" min="0" max="1" step="0.1" value="1" oninput="updateSpeechSettings()"></div>
                <button class="ac-btn" onclick="testSpeech(event)" style="font-size: 12px; padding: 5px; margin-top: 5px; justify-content: center;"><img src="https://img.icons8.com/ios-filled/14/play.png" alt="Test" style="margin-right: 5px;">Test</button>
            </div>
        </div>
        <div class="menu-divider"></div>
        <button class="ac-btn" onclick="resetAllSettings()" title="Reset All Settings" style="background: #dc3545; justify-content: center; font-weight: bold;"><img src="https://img.icons8.com/ios-filled/16/recurring-appointment.png" alt="Reset">Reset All Settings</button>
    `;
}

// ====== DOM READY ======
document.addEventListener('DOMContentLoaded', function() {
    var widget = document.querySelector('.accessibility-widget');
    if (widget) { document.body.appendChild(widget); }
    reorganizeDropdownStructure();
    initializeAccessibilityDropdown();
    try {
        loadSettings();
        loadSpeechSettings();
    } catch(e) {
        console.error("Failed to load accessibility settings:", e);
        localStorage.clear(); // Clear all settings on error to be safe
    }
});