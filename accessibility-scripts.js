/**
 * Universal Accessibility Controls Module - JavaScript Core
 * FINAL - v2.1.0
 * - Includes fix for positioning and invert/saturate issue.
 * - Uses class-based toggling for animations.
 */

// Global state variables
var dropdownInitialized = false;
var dropdownJustOpened = false;

// Dropdown functionality
function initializeAccessibilityDropdown() {
    if (dropdownInitialized) return;
    var toggleButton = document.getElementById('accessibilityMenu');
    var dropdownMenu = document.getElementById('accessibilityDropdown');
    if (!toggleButton || !dropdownMenu) return;

    toggleButton.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdownJustOpened = true;
        setTimeout(function() { dropdownJustOpened = false; }, 200);
        toggleDropdown();
    });

    document.addEventListener('click', function(event) {
        if (dropdownJustOpened) return;
        var widget = document.querySelector('.accessibility-widget');
        if (dropdownMenu.classList.contains('show') && !widget.contains(event.target)) {
            closeDropdown();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') closeDropdown();
    });

    dropdownInitialized = true;
}

function toggleDropdown() {
    var dropdownMenu = document.getElementById('accessibilityDropdown');
    if (!dropdownMenu) return;
    if (dropdownMenu.classList.contains('show')) {
        closeDropdown();
    } else {
        openDropdown();
    }
}

function openDropdown() {
    var toggleButton = document.getElementById('accessibilityMenu');
    var dropdownMenu = document.getElementById('accessibilityDropdown');
    if (!toggleButton || !dropdownMenu) return;

    // Use classList to trigger CSS animations/transitions
    dropdownMenu.classList.add('show');
    toggleButton.setAttribute('aria-expanded', 'true');

    var speechControls = document.getElementById('speechControls');
    if (speechControls) speechControls.style.display = 'none';
    var speechBtn = document.getElementById('speechSettingsBtn');
    if (speechBtn) speechBtn.classList.remove('active');
}

function closeDropdown() {
    var toggleButton = document.getElementById('accessibilityMenu');
    var dropdownMenu = document.getElementById('accessibilityDropdown');
    if (!toggleButton || !dropdownMenu) return;

    // Use classList to trigger CSS animations/transitions
    dropdownMenu.classList.remove('show');
    toggleButton.setAttribute('aria-expanded', 'false');

    var speechControls = document.getElementById('speechControls');
    if (speechControls) speechControls.style.display = 'none';
    var speechBtn = document.getElementById('speechSettingsBtn');
    if (speechBtn) speechBtn.classList.remove('active');
}


// Font Size Controls
var fontIncreaseLevel = 0, fontDecreaseLevel = 0, maxLevels = 3;
function increaseFontSize() { if (fontIncreaseLevel < maxLevels) { fontDecreaseLevel = 0; fontIncreaseLevel++; document.body.style.zoom = Math.pow(1.1, fontIncreaseLevel); updateLevelIndicators(); saveSettings(); } }
function decreaseFontSize() { if (fontDecreaseLevel < maxLevels) { fontIncreaseLevel = 0; fontDecreaseLevel++; document.body.style.zoom = Math.pow(1/1.1, fontDecreaseLevel); updateLevelIndicators(); saveSettings(); } }
function resetFontSize() { fontIncreaseLevel = 0; fontDecreaseLevel = 0; document.body.style.zoom = ''; updateLevelIndicators(); saveSettings(); }
function updateLevelIndicators() {
    var increaseIndicator = document.getElementById('fontIncreaseLevel');
    var decreaseIndicator = document.getElementById('fontDecreaseLevel');
    var increaseBtn = document.getElementById('fontIncreaseBtn');
    var decreaseBtn = document.getElementById('fontDecreaseBtn');
    if(increaseIndicator) increaseIndicator.textContent = fontIncreaseLevel > 0 ? fontIncreaseLevel : '';
    if(decreaseIndicator) decreaseIndicator.textContent = fontDecreaseLevel > 0 ? fontDecreaseLevel : '';
    if(increaseBtn) increaseBtn.classList.toggle('active', fontIncreaseLevel > 0);
    if(decreaseBtn) decreaseBtn.classList.toggle('active', fontDecreaseLevel > 0);
}

// Helper function for toggling body classes and saving settings
function toggleBodyClass(className, btnId) {
    document.body.classList.toggle(className);
    document.getElementById(btnId).classList.toggle('active');
    saveSettings();
}

// All toggle functions streamlined
function toggleHighContrast() { toggleBodyClass('high-contrast', 'contrastBtn'); }
function toggleInvert() { toggleBodyClass('invert-colors', 'invertBtn'); }
function toggleSaturation() { toggleBodyClass('saturate-colors', 'saturationBtn'); }
function toggleHighlightLinks() { toggleBodyClass('highlight-links', 'highlightLinksBtn'); }
function toggleTextSpacing() { toggleBodyClass('text-spacing', 'textSpacingBtn'); }
function toggleLineHeight() { toggleBodyClass('line-height', 'lineHeightBtn'); }
function toggleHideImages() { toggleBodyClass('hide-images', 'hideImagesBtn'); }


// Screen Reader state and functions
var screenReaderActive = false;
var speechSynthesis = window.speechSynthesis;
function toggleScreenReader() {
    screenReaderActive = !screenReaderActive;
    if (screenReaderActive) speakText("Screen reader activated."); else speakText("Screen reader deactivated.");
    document.getElementById('screenReaderBtn').classList.toggle('active', screenReaderActive);
    saveSettings();
}
function speakText(text) { if (speechSynthesis) { speechSynthesis.cancel(); var utterance = new SpeechSynthesisUtterance(text); speechSynthesis.speak(utterance); } }
function toggleSpeechSettings(event) {
    event.stopPropagation();
    var speechControls = document.getElementById('speechControls');
    if (speechControls) {
        var isVisible = speechControls.style.display !== 'none';
        speechControls.style.display = isVisible ? 'none' : 'block';
        document.getElementById('speechSettingsBtn').classList.toggle('active', !isVisible);
    }
}
function testSpeech() { speakText("This is a test of the text to speech functionality."); }

// Settings Management
function saveSettings() {
    var settings = {
        fontIncreaseLevel: fontIncreaseLevel, fontDecreaseLevel: fontDecreaseLevel,
        highContrast: document.body.classList.contains('high-contrast'),
        invertColors: document.body.classList.contains('invert-colors'),
        saturateColors: document.body.classList.contains('saturate-colors'),
        highlightLinks: document.body.classList.contains('highlight-links'),
        textSpacing: document.body.classList.contains('text-spacing'),
        lineHeight: document.body.classList.contains('line-height'),
        hideImages: document.body.classList.contains('hide-images'),
        screenReader: screenReaderActive
    };
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
}

function loadSettings() {
    var settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
    if (settings.fontIncreaseLevel) { fontIncreaseLevel = settings.fontIncreaseLevel; increaseFontSize(); }
    if (settings.fontDecreaseLevel) { fontDecreaseLevel = settings.fontDecreaseLevel; decreaseFontSize(); }
    if (settings.highContrast) toggleHighContrast();
    if (settings.invertColors) toggleInvert();
    if (settings.saturateColors) toggleSaturation();
    if (settings.highlightLinks) toggleHighlightLinks();
    if (settings.textSpacing) toggleTextSpacing();
    if (settings.lineHeight) toggleLineHeight();
    if (settings.hideImages) toggleHideImages();
    if (settings.screenReader) toggleScreenReader();
    updateLevelIndicators();
}

function resetAllSettings() {
    localStorage.removeItem('accessibilitySettings');
    window.location.reload();
}

function reorganizeDropdownStructure() {
    var dropdownMenu = document.querySelector('.accessibility-widget .accessibility-menu');
    if (!dropdownMenu) return;
    dropdownMenu.innerHTML = `
        <div class="section-group">
            <strong><img width="16" height="16" src="https://img.icons8.com/color/16/rgb-circle-2--v1.png" alt="Contrast"> Color & Contrast</strong>
            <div class="category-controls">
                <button class="ac-btn" id="contrastBtn" onclick="toggleHighContrast()" title="Toggle High Contrast"><img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/contrast.png" alt="">High Contrast<div class="status-indicator"></div></button>
                <button class="ac-btn" id="invertBtn" onclick="toggleInvert()" title="Invert Colors"><img width="16" height="16" src="https://img.icons8.com/ios-filled/16/inverts-color-off.png" alt="">Invert Colors<div class="status-indicator"></div></button>
                <button class="ac-btn" id="saturationBtn" onclick="toggleSaturation()" title="Increase Saturation"><img width="16" height="16" src="https://img.icons8.com/ios-filled/16/saturation.png" alt="">Saturation<div class="status-indicator"></div></button>
                <button class="ac-btn" id="highlightLinksBtn" onclick="toggleHighlightLinks()" title="Highlight Links"><img width="16" height="16" src="https://img.icons8.com/ios-filled/16/marker-pen.png" alt="">Highlight Links<div class="status-indicator"></div></button>
            </div>
        </div>
        <div class="section-group">
            <div class="menu-divider"></div>
            <strong><img width="16" height="16" src="https://img.icons8.com/ios/16/text.png" alt="Text"> Text & Font</strong>
            <div class="category-controls">
                <button class="ac-btn" id="fontIncreaseBtn" onclick="increaseFontSize()" title="Font Size Increase"><img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/increase-font.png" alt="">Font Size +<div class="level-indicator" id="fontIncreaseLevel"></div></button>
                <button class="ac-btn" id="fontDecreaseBtn" onclick="decreaseFontSize()" title="Font Size Decrease"><img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/decrease-font.png" alt="">Font Size -<div class="level-indicator" id="fontDecreaseLevel"></div></button>
                <button class="ac-btn" id="textSpacingBtn" onclick="toggleTextSpacing()" title="Text Spacing"><img width="16" height="16" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/16/external-text-spacing-text-editor-inkubators-detailed-outline-inkubators.png" alt="">Text Spacing<div class="status-indicator"></div></button>
                <button class="ac-btn" id="lineHeightBtn" onclick="toggleLineHeight()" title="Line Height"><img width="16" height="16" src="https://img.icons8.com/ios/16/height.png" alt="">Line Height<div class="status-indicator"></div></button>
            </div>
        </div>
        <div class="section-group">
            <div class="menu-divider"></div>
            <strong><img width="16" height="16" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/16/external-more-information-music-inkubators-detailed-outline-inkubators.png" alt="Other"> Other Controls</strong>
            <div class="category-controls">
                <button class="ac-btn" id="screenReaderBtn" onclick="toggleScreenReader()" title="Screen Reader"><img width="16" height="16" src="https://img.icons8.com/ios-filled/16/high-volume--v1.png" alt="">Screen Reader<div class="status-indicator"></div></button>
                <button class="ac-btn" id="speechSettingsBtn" onclick="toggleSpeechSettings(event)" title="Speech Settings"><img width="16" height="16" src="https://img.icons8.com/ios-filled/16/settings.png" alt="">Speech Settings</button>
                <button class="ac-btn" id="hideImagesBtn" onclick="toggleHideImages()" title="Hide Images"><img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/no-image.png" alt="">Hide Images<div class="status-indicator"></div></button>
            </div>
            <div id="speechControls" style="display: none; padding: 10px 0;" onclick="event.stopPropagation();">
                <button class="ac-btn" onclick="testSpeech(); event.stopPropagation();" style="font-size: 11px; padding: 3px 0;"><img width="14" height="14" src="https://img.icons8.com/ios-filled/14/play.png" alt="Test">Test Speech</button>
            </div>
        </div>
        <div class="section-group">
            <div class="menu-divider"></div>
            <button class="ac-btn reset-btn" onclick="resetAllSettings()" title="Reset All Settings" style="background: #dc3545 !important; color: #fff !important; margin-top: 5px; justify-content: center;"><img width="16" height="16" src="https://img.icons8.com/ios-filled/16/recurring-appointment.png" alt="Reset">Reset All Settings</button>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // CRUCIAL: Move widget to be a direct child of <body> to fix stacking context issues.
    var widget = document.querySelector('.accessibility-widget');
    if (widget) {
        document.body.appendChild(widget);
    }

    reorganizeDropdownStructure();
    initializeAccessibilityDropdown();
    loadSettings();
});