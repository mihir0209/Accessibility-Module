/**
 * Universal Accessibility Controls Module - JavaScript Core
 * v7.1 FINAL - Intelligent Single Contrast & Stable JS-Assisted Engine
 */

// Global state variables and configuration
var dropdownInitialized = false, dropdownJustOpened = false, fontIncreaseLevel = 0, fontDecreaseLevel = 0, maxLevels = 3;
var screenReaderActive = false, speechSynthesis = window.speechSynthesis, currentUtterance = null;
var navLinks = [], currentNavLinkIndex = -1;
var SKIP_ACCESSIBILITY_MENU = true;
var SCREEN_READER_EXCLUSIONS = ['accessibility-widget', 'no-screen-reader'];

// ====== JS-ASSISTED STYLING ENGINE ======
// This is now the core engine for most visual effects.
function applyStyleToPage(className, isActive, isFilter = false) {
    const elements = document.querySelectorAll('body > *:not(.accessibility-widget):not(#keyboard-info-toast-overlay)');
    elements.forEach(el => {
        el.classList.toggle(className, isActive);
        // For filters, we need to handle images specially to avoid color distortion
        if (isFilter && className === 'aw-invert') {
            el.querySelectorAll('img').forEach(img => img.classList.toggle('aw-invert-img', isActive));
        }
    });
}

// ====== DROPDOWN MANAGEMENT ======
function initializeAccessibilityDropdown() {
    if (dropdownInitialized) return;
    var toggleButton = document.getElementById('accessibilityMenu'), dropdownMenu = document.getElementById('accessibilityDropdown');
    if (!toggleButton || !dropdownMenu) return;
    toggleButton.addEventListener('click', function(event) { event.stopPropagation(); dropdownJustOpened = true; setTimeout(function() { dropdownJustOpened = false; }, 200); toggleDropdown(); });
    document.addEventListener('click', function(event) { if (dropdownJustOpened) return; var widget = document.querySelector('.accessibility-widget'); if (dropdownMenu.classList.contains('show') && widget && !widget.contains(event.target)) { closeDropdown(); } });
    document.addEventListener('keydown', function(event) { if (event.key === 'Escape') { closeDropdown(); closeKeyboardInfoToast(); } });
    dropdownInitialized = true;
}
function toggleDropdown() { document.getElementById('accessibilityDropdown').classList.contains('show') ? closeDropdown() : openDropdown(); }
function openDropdown() { var btn = document.getElementById('accessibilityMenu'), menu = document.getElementById('accessibilityDropdown'); if (btn && menu) { menu.classList.add('show'); btn.setAttribute('aria-expanded', 'true'); } }
function closeDropdown() { var btn = document.getElementById('accessibilityMenu'), menu = document.getElementById('accessibilityDropdown'); if (btn && menu) { menu.classList.remove('show'); btn.setAttribute('aria-expanded', 'false'); } }

// ====== KEYBOARD INFO TOAST ======
function showKeyboardInfoToast() { var toast = document.getElementById('keyboard-info-toast-overlay'); if (toast) toast.style.display = 'flex'; }
function closeKeyboardInfoToast() { var toast = document.getElementById('keyboard-info-toast-overlay'); if (toast) toast.style.display = 'none'; }

// ====== FONT SCALING ======
function applyFontScale() { var scale = 1; if (fontIncreaseLevel > 0) scale = Math.pow(1.1, fontIncreaseLevel); else if (fontDecreaseLevel > 0) scale = Math.pow(1 / 1.1, fontDecreaseLevel); document.body.style.zoom = scale === 1 ? '' : scale; updateLevelIndicators(); }
function increaseFontSize() { if (fontIncreaseLevel < maxLevels) { fontDecreaseLevel = 0; fontIncreaseLevel++; applyFontScale(); saveSettings(); } }
function decreaseFontSize() { if (fontDecreaseLevel < maxLevels) { fontIncreaseLevel = 0; fontDecreaseLevel++; applyFontScale(); saveSettings(); } }
function resetFontSize() { fontIncreaseLevel = 0; fontDecreaseLevel = 0; applyFontScale(); saveSettings(); }
function updateLevelIndicators() { var inc = document.getElementById('fontIncreaseLevel'), dec = document.getElementById('fontDecreaseLevel'); if (inc) inc.textContent = fontIncreaseLevel > 0 ? fontIncreaseLevel : ''; if (dec) dec.textContent = fontDecreaseLevel > 0 ? fontDecreaseLevel : ''; document.getElementById('fontIncreaseBtn')?.classList.toggle('active', fontIncreaseLevel > 0); document.getElementById('fontDecreaseBtn')?.classList.toggle('active', fontDecreaseLevel > 0); }

// ====== FEATURE TOGGLES (STABLE) ======
function toggleAndSave(btnId, className, isFilter = false) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    btn.classList.toggle('active');
    if (isFilter) {
        applyStyleToPage(className, btn.classList.contains('active'), true);
    } else {
        document.body.classList.toggle(className, btn.classList.contains('active'));
    }
    saveSettings();
}
function toggleHighContrast() { toggleAndSave('contrastBtn', 'high-contrast'); }
function toggleInvert() { toggleAndSave('invertBtn', 'aw-invert', true); }
function toggleSaturation() { toggleAndSave('saturationBtn', 'aw-saturate', true); }
function toggleHighlightLinks() { toggleAndSave('highlightLinksBtn', 'highlight-links'); }
function toggleHideImages() { toggleAndSave('hideImagesBtn', 'hide-images'); }
function toggleTextSpacing() { var btn = document.getElementById('textSpacingBtn'); if (!btn) return; btn.classList.toggle('active'); applyStyleToPage('aw-text-space', btn.classList.contains('active')); saveSettings(); }
function toggleLineHeight() { var btn = document.getElementById('lineHeightBtn'); if (!btn) return; btn.classList.toggle('active'); applyStyleToPage('aw-line-height', btn.classList.contains('active')); saveSettings(); }

// ====== SCREEN READER ======
function toggleScreenReader() { screenReaderActive = !screenReaderActive; document.getElementById('screenReaderBtn').classList.toggle('active', screenReaderActive); if (screenReaderActive) { initializeScreenReader(); speakText("Screen reader activated."); } else { removeScreenReaderListeners(); stopSpeaking(); speakText("Screen reader deactivated."); } saveSettings(); }
function initializeScreenReader() { document.body.addEventListener('click', handleElementClickForReading, true); if (!document.getElementById('readPageBtn')) addReadPageButton(); }
function removeScreenReaderListeners() { document.body.removeEventListener('click', handleElementClickForReading, true); document.getElementById('readPageBtn')?.remove(); }
function handleElementClickForReading(event) { if (!screenReaderActive) return; var el = event.target; if ((SKIP_ACCESSIBILITY_MENU && el.closest('.accessibility-widget')) || SCREEN_READER_EXCLUSIONS.some(cls => el.closest('.' + cls))) return; event.preventDefault(); event.stopPropagation(); var text = (el.textContent || el.alt || '').trim(); if (text) speakText(text); }
function speakText(text) { if (!speechSynthesis) return; stopSpeaking(); currentUtterance = new SpeechSynthesisUtterance(text); var settings = getSpeechSettings(); currentUtterance.rate = settings.rate; currentUtterance.volume = settings.volume; speechSynthesis.speak(currentUtterance); }
function stopSpeaking() { if (speechSynthesis && speechSynthesis.speaking) speechSynthesis.cancel(); }
function readEntirePage() { var content = Array.from(document.querySelectorAll('h1, h2, h3, p, a, li')).map(el => (el.textContent || '').trim()).filter(text => text.length > 10).join('. '); speakText('Reading page contents. ' + content); }
function addReadPageButton() { var container = document.getElementById('otherControlsContainer'); if (!container) return; var btn = document.createElement('button'); btn.className = 'ac-btn'; btn.id = 'readPageBtn'; btn.title = 'Read Page Aloud'; btn.onclick = readEntirePage; btn.innerHTML = '<img width="16" height="16" src="https://img.icons8.com/ios-filled/16/speaker.png" alt="Read Page">Read Page Aloud'; container.insertBefore(btn, document.getElementById('speechSettingsBtn')); }

// ====== SPEECH SETTINGS ======
function toggleSpeechSettings(event) { event.stopPropagation(); var controls = document.getElementById('speechControls'); if (controls) { var isVisible = controls.style.display !== 'none'; controls.style.display = isVisible ? 'none' : 'block'; document.getElementById('speechSettingsBtn').classList.toggle('active', !isVisible); } }
function updateSpeechSettings() { var rate = document.getElementById('speechRate').value, volume = document.getElementById('speechVolume').value; document.getElementById('rateValue').textContent = parseFloat(rate).toFixed(1); document.getElementById('volumeValue').textContent = parseFloat(volume).toFixed(1); localStorage.setItem('speechSettings', JSON.stringify({ rate: parseFloat(rate), volume: parseFloat(volume) })); }
function loadSpeechSettings() { var settings = getSpeechSettings(); document.getElementById('speechRate').value = settings.rate; document.getElementById('speechVolume').value = settings.volume; document.getElementById('rateValue').textContent = settings.rate.toFixed(1); document.getElementById('volumeValue').textContent = settings.volume.toFixed(1); }
function getSpeechSettings() { return JSON.parse(localStorage.getItem('speechSettings') || '{"rate": 1, "volume": 1}'); }
function testSpeech(event) { event.stopPropagation(); speakText("This is a test of the current speech settings."); }

// ====== SETTINGS MANAGEMENT ======
function saveSettings() {
    localStorage.setItem('accessibilitySettings', JSON.stringify({
        fontIncreaseLevel, fontDecreaseLevel,
        highContrast: document.body.classList.contains('high-contrast'),
        invert: document.getElementById('invertBtn')?.classList.contains('active'),
        saturate: document.getElementById('saturationBtn')?.classList.contains('active'),
        highlightLinks: document.body.classList.contains('highlight-links'),
        textSpacing: document.getElementById('textSpacingBtn')?.classList.contains('active'),
        lineHeight: document.getElementById('lineHeightBtn')?.classList.contains('active'),
        hideImages: document.body.classList.contains('hide-images'),
        screenReader: screenReaderActive
    }));
}
function loadSettings() {
    var settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
    fontIncreaseLevel = settings.fontIncreaseLevel || 0; fontDecreaseLevel = settings.fontDecreaseLevel || 0; applyFontScale();
    if (settings.highContrast) toggleHighContrast();
    if (settings.invert) toggleInvert();
    if (settings.saturate) toggleSaturation();
    if (settings.highlightLinks) toggleHighlightLinks();
    if (settings.textSpacing) toggleTextSpacing();
    if (settings.lineHeight) toggleLineHeight();
    if (settings.hideImages) toggleHideImages();
    if (settings.screenReader) toggleScreenReader();
}
function resetAllSettings() {
    if (screenReaderActive) toggleScreenReader();
    resetFontSize();
    if (document.body.classList.contains('high-contrast')) toggleHighContrast();
    if (document.getElementById('invertBtn')?.classList.contains('active')) toggleInvert();
    if (document.getElementById('saturationBtn')?.classList.contains('active')) toggleSaturation();
    if (document.body.classList.contains('highlight-links')) toggleHighlightLinks();
    if (document.getElementById('textSpacingBtn')?.classList.contains('active')) toggleTextSpacing();
    if (document.getElementById('lineHeightBtn')?.classList.contains('active')) toggleLineHeight();
    if (document.body.classList.contains('hide-images')) toggleHideImages();
    localStorage.removeItem('accessibilitySettings'); localStorage.removeItem('speechSettings');
    loadSpeechSettings();
}

// ====== INITIALIZATION & STRUCTURE ======
function createToast() {
    var toastOverlay = document.createElement('div'); toastOverlay.id = 'keyboard-info-toast-overlay'; toastOverlay.onclick = closeKeyboardInfoToast;
    toastOverlay.innerHTML = `<div id="keyboard-info-toast" onclick="event.stopPropagation();"><button id="keyboard-info-toast-close" onclick="closeKeyboardInfoToast()">×</button><h3>Keyboard Navigation Guide</h3><ul><li><code>Alt + A</code> <span>Toggle Menu</span></li><li><code>Alt + C</code><span>Contrast</span></li><li><code>Alt + I</code> <span>Invert Colors</span></li><li><code>Alt + H</code> <span>Highlight Links</span></li><li><code>Alt + R</code> <span>Screen Reader</span></li><li><code>Ctrl + /</code> <span>Show Guide</span></li><li><code>M</code>/<code>J</code>/<code>K</code>/<code>H</code> <span>Navigation</span></li></ul></div>`;
    document.body.appendChild(toastOverlay);
}
function reorganizeDropdownStructure() {
    var menu = document.getElementById('accessibilityDropdown'); if (!menu) return;
    menu.innerHTML = `
        <div class="section-group"><strong><img src="https://img.icons8.com/color/16/rgb-circle-2--v1.png" alt=""> Color & Contrast</strong><div class="category-controls">
            <button class="ac-btn" id="contrastBtn" onclick="toggleHighContrast()"><img src="https://img.icons8.com/ios-glyphs/16/new-moon.png" alt="">High Contrast<div class="status-indicator"></div></button>
            <button class="ac-btn" id="invertBtn" onclick="toggleInvert()"><img src="https://img.icons8.com/ios-filled/16/inverts-color-off.png" alt="">Invert Colors<div class="status-indicator"></div></button>
            <button class="ac-btn" id="saturationBtn" onclick="toggleSaturation()"><img src="https://img.icons8.com/ios-filled/16/saturation.png" alt="">Saturation<div class="status-indicator"></div></button>
        </div></div>
        <div class="menu-divider"></div>
        <div class="section-group"><strong><img src="https://img.icons8.com/ios/16/text.png" alt=""> Text & Font</strong><div class="category-controls"><button class="ac-btn" id="fontIncreaseBtn" onclick="increaseFontSize()"><img src="https://img.icons8.com/ios-glyphs/16/increase-font.png" alt="">Font Size +<div class="level-indicator" id="fontIncreaseLevel"></div></button><button class="ac-btn" id="fontDecreaseBtn" onclick="decreaseFontSize()"><img src="https://img.icons8.com/ios-glyphs/16/decrease-font.png" alt="">Font Size -<div class="level-indicator" id="fontDecreaseLevel"></div></button><button class="ac-btn" id="fontNormalBtn" onclick="resetFontSize()"><img src="https://img.icons8.com/ios-glyphs/16/sentence-case--v2.png" alt="">Normal Font</button><button class="ac-btn" id="textSpacingBtn" onclick="toggleTextSpacing()"><img src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/16/external-text-spacing-text-editor-inkubators-detailed-outline-inkubators.png" alt="">Text Spacing<div class="status-indicator"></div></button><button class="ac-btn" id="lineHeightBtn" onclick="toggleLineHeight()"><img src="https://img.icons8.com/ios/16/height.png" alt="">Line Height<div class="status-indicator"></div></button></div></div>
        <div class="menu-divider"></div>
        <div class="section-group"><strong><img src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/16/external-more-information-music-inkubators-detailed-outline-inkubators.png" alt=""> Other Controls</strong><div class="category-controls" id="otherControlsContainer"><button class="ac-btn" id="highlightLinksBtn" onclick="toggleHighlightLinks()"><img src="https://img.icons8.com/ios-filled/16/marker-pen.png" alt="">Highlight Links<div class="status-indicator"></div></button><button class="ac-btn" id="hideImagesBtn" onclick="toggleHideImages()"><img src="https://img.icons8.com/ios-glyphs/16/no-image.png" alt="">Hide Images<div class="status-indicator"></div></button><button class="ac-btn" id="screenReaderBtn" onclick="toggleScreenReader()"><img src="https://img.icons8.com/ios-filled/16/high-volume--v1.png" alt="">Screen Reader<div class="status-indicator"></div></button><button class="ac-btn" id="speechSettingsBtn" onclick="toggleSpeechSettings(event)"><img src="https://img.icons8.com/ios-filled/16/settings.png" alt="">Speech Settings</button><button class="ac-btn" id="keyboardNavBtn" onclick="showKeyboardInfoToast()"><img src="https://img.icons8.com/ios-glyphs/16/keyboard.png" alt="">Keyboard Guide</button></div><div id="speechControls" style="display: none; padding: 10px 0;" onclick="event.stopPropagation();"><div style="margin:5px 0"><label style="color:#fff">Speed: <span id="rateValue">1.0</span></label><input type="range" id="speechRate" min="0.5" max="2" step="0.1" value="1" oninput="updateSpeechSettings()"></div><div style="margin:5px 0"><label style="color:#fff">Volume: <span id="volumeValue">1.0</span></label><input type="range" id="speechVolume" min="0" max="1" step="0.1" value="1" oninput="updateSpeechSettings()"></div><button class="ac-btn" onclick="testSpeech(event)" style="font-size:12px;padding:5px;margin-top:5px;justify-content:center"><img src="https://img.icons8.com/ios-filled/14/play.png" alt="Test" style="margin-right:5px">Test</button></div></div>
        <div class="menu-divider"></div>
        <button class="ac-btn" onclick="resetAllSettings()" title="Reset All Settings" style="background:#dc3545;justify-content:center;font-weight:bold"><img src="https://img.icons8.com/ios-filled/16/recurring-appointment.png" alt="Reset">Reset All Settings</button>
    `;
}
function findMainNavigationLinks() {
    const allNavs = document.querySelectorAll('nav'); if (allNavs.length === 0) return document.querySelectorAll('header a[href]'); if (allNavs.length === 1) return allNavs[0].querySelectorAll('a[href]');
    let candidates = Array.from(allNavs).map(nav => { let score = 0; const links = nav.querySelectorAll('a[href]'); if (links.length < 3 || links.length > 25) return { score: -1 }; if (nav.closest('header')) score += 10; if (!nav.closest('footer')) score += 5; const idAndClasses = (nav.id + ' ' + nav.className).toLowerCase(); if (/main|primary|top|header|menu|cssmenu/.test(idAndClasses)) score += 10; return { element: nav, score }; });
    const sortedCandidates = candidates.filter(c => c.score > 0).sort((a, b) => b.score - a.score);
    if (sortedCandidates.length > 0) return sortedCandidates[0].element.querySelectorAll('a[href]');
    return document.querySelectorAll('header a[href]');
}
function setupKeyboardListeners() {
    navLinks = findMainNavigationLinks();
    document.addEventListener('keydown', (event) => {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) return;
        const key = event.key.toLowerCase();
        if (event.ctrlKey && key === '/') { event.preventDefault(); showKeyboardInfoToast(); }
        if (event.altKey) {
            event.preventDefault();
            switch (key) {
                case 'a': toggleDropdown(); break;
                case 'c': toggleHighContrast(); break;
                case 'i': toggleInvert(); break;
                case 'h': toggleHighlightLinks(); break;
                case 'r': toggleScreenReader(); break;
                case 'p': readEntirePage(); break;
            }
        } else {
            switch (key) {
                case 'm': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
                case 'j': window.scrollBy({ top: 100, left: 0, behavior: 'smooth' }); break;
                case 'k': window.scrollBy({ top: -100, left: 0, behavior: 'smooth' }); break;
                case 'h': if (navLinks.length > 0) { event.preventDefault(); currentNavLinkIndex = (currentNavLinkIndex + 1) % navLinks.length; navLinks[currentNavLinkIndex].focus(); } break;
            }
        }
    });
}

// ====== DOM READY ======
document.addEventListener('DOMContentLoaded', function() {
    var widget = document.querySelector('.accessibility-widget'); if (widget) { document.body.appendChild(widget); }
    reorganizeDropdownStructure(); createToast(); initializeAccessibilityDropdown(); setupKeyboardListeners();
    try { loadSettings(); loadSpeechSettings(); } catch(e) { console.error("Failed to load accessibility settings:", e); localStorage.clear(); }
});