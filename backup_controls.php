<?php
/**
 * Universal Accessibility Controls Module - STANDALONE VERSION
 * 
 * This is a complete, self-contained accessibility module that can be included in any website.
 * All CSS and JavaScript is inline - no external dependencies.
 * 
 * INSTALLATION:
 * 1. Include this file: <?php include 'accessibility-module/accessibility-controls.php'; ?>
 * 2. Ensure Bootstrap dropdown JS is loaded on your site
 * 3. Customize colors and styles marked with "CUSTOMIZE" comments below
 * 
 * DEVELOPER CONFIGURATION:
 * - SKIP_ACCESSIBILITY_MENU: Prevent screen reader from reading the accessibility menu
 * - SCREEN_READER_EXCLUSIONS: Array of CSS classes to exclude from screen reader
 * - USE_TWO_COLUMN_LAYOUT: Enable two-column layout for compact display
 * 
 * SCREEN READER FEATURES:
 * - Click-to-read functionality for all page elements
 * - Configurable exclusion classes for elements that shouldn't be read
 * - Speech settings with speed and volume controls
 * - Read entire page functionality
 * 
 * BROWSER COMPATIBILITY:
 * - Uses browser-level zoom for font scaling (preferred method)
 * - Falls back to CSS font-size scaling for older browsers
 * - Web Speech API for text-to-speech functionality
 * 
 * CUSTOMIZATION:
 * - All site-specific colors and styles are marked with "CUSTOMIZE" comments
 * - Button styling is minimal - inherits from your site's CSS
 * - Dropdown colors can be changed to match your theme
 */
?>

<style>
/* 
 * CUSTOMIZABLE SECTION - MODIFY THESE COLORS TO MATCH YOUR SITE
 * Change these colors to match your website's theme and design
 */
.accessibility-dropdown .dropdown-menu {
    min-width: 260px;
    padding: 15px 20px;
    font-size: 15px;
    z-index: 9999;
    /* CUSTOMIZE: Change dropdown background color to match your site */
    background: #13c0e4 !important;
    color: #fff !important;
    border-radius: 0 0 8px 8px;
    border: none;
    box-shadow: 0 4px 18px rgba(0,0,0,0.12);
}
.accessibility-dropdown .dropdown-menu strong {
    /* CUSTOMIZE: Change dropdown text color */
    color: #fff !important;
}
.accessibility-dropdown .dropdown-menu .divider {
    /* CUSTOMIZE: Change divider color */
    border-top: 1px solid #fff;
    margin: 10px 0;
}

/* 
 * BUTTON STYLING REMOVED - Let the host site control button appearance
 * The dropdown toggle button will inherit styles from your site's CSS
 */
.accessibility-dropdown .dropdown-toggle {
    /* Minimal required styles only - no visual styling */
    padding: 5px !important;
    border: none !important;
    background: transparent !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}
.accessibility-dropdown .dropdown-toggle:focus {
    outline: 2px solid #005fcc;
}
.accessibility-dropdown .dropdown-toggle img {
    /* Fluid icon sizing with padding */
    width: 100% !important;
    height: 100% !important;
    max-width: 24px !important;
    max-height: 24px !important;
    min-width: 16px !important;
    min-height: 16px !important;
    object-fit: contain !important;
}
.accessibility-dropdown .ac-btn {
    display: flex;
    align-items: center;
    width: 100%;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 15px;
    padding: 7px 0;
    margin: 0;
    text-align: left;
    transition: background 0.2s, color 0.2s;
    border-radius: 4px;
    position: relative;
}
.accessibility-dropdown .ac-btn img {
    margin-right: 10px;
    font-size: 16px;
    min-width: 18px;
    text-align: center;
}
.accessibility-dropdown .ac-btn:hover, .accessibility-dropdown .ac-btn:focus {
    /* CUSTOMIZE: Change button hover color to match your site */
    background: #0ea7c7;
    color: #fff;
    outline: none;
}
.accessibility-dropdown .ac-btn.active {
    /* CUSTOMIZE: Change active button color */
    background: #0ea7c7;
}
.accessibility-dropdown .level-indicator {
    position: absolute;
    top: 2px;
    right: 5px;
    /* CUSTOMIZE: Change level indicator colors */
    background: #ffb300;
    color: #222;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 10px;
    font-weight: bold;
    display: none;
    align-items: center;
    justify-content: center;
}
.accessibility-dropdown .ac-btn.active .level-indicator {
    display: flex;
}
.accessibility-dropdown .status-indicator {
    position: absolute;
    top: 2px;
    right: 5px;
    /* CUSTOMIZE: Change status indicator color */
    background: #28a745;
    color: #fff;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    font-weight: bold;
    display: none;
    align-items: center;
    justify-content: center;
}
.accessibility-dropdown .ac-btn.active .status-indicator {
    display: flex;
}
.accessibility-dropdown .status-indicator::after {
    content: '✓';
}

/* 
 * ACCESSIBILITY EFFECTS - UNIVERSAL STYLES
 * These styles are applied globally and should work on any website
 * Modify colors if needed to ensure proper contrast on your site
 */
body.high-contrast { 
    /* CUSTOMIZE: Adjust high contrast colors for your site */
    background: #000 !important; 
    color: #fff !important; 
}
body.high-contrast a, body.high-contrast a:visited { 
    /* CUSTOMIZE: Change high contrast link color */
    color: #0ff !important; 
    text-decoration: underline; 
}
body.invert-colors { 
    filter: invert(1) hue-rotate(180deg) !important; 
}
body.saturate-colors { 
    filter: saturate(3) !important; 
}
body.highlight-links a { 
    /* CUSTOMIZE: Change link highlight colors */
    background: yellow !important; 
    color: #222 !important; 
    text-decoration: underline !important; 
}
body.text-spacing { 
    letter-spacing: 0.15em !important; 
}
body.line-height { 
    line-height: 2.2 !important; 
}
body.hide-images img { 
    visibility: hidden !important; 
}
/* Exception: Keep accessibility toggle button image visible */
body.hide-images .accessibility-dropdown .dropdown-toggle img {
    visibility: visible !important;
}
body { 
    transition: font-size 0.2s, letter-spacing 0.2s, line-height 0.2s; 
}

/* Universal transitions for smooth font scaling */
* {
    transition: font-size 0.2s ease !important;
}

/* DEVELOPER OPTION: Two-column layout styles (activated via JavaScript) */
.accessibility-dropdown .dropdown-menu.two-column {
    min-width: 420px !important;
    display: flex !important;
    flex-wrap: wrap !important;
}
.accessibility-dropdown .dropdown-menu.two-column > li {
    width: 48% !important;
    margin: 1% !important;
    display: inline-block !important;
}
.accessibility-dropdown .dropdown-menu.two-column > li strong {
    font-size: 13px !important;
}
.accessibility-dropdown .dropdown-menu.two-column > li.divider {
    width: 100% !important;
    margin: 5px 0 !important;
}
.accessibility-dropdown .dropdown-menu.two-column > li:last-child {
    width: 100% !important; /* Reset button takes full width */
}
.accessibility-dropdown .dropdown-menu.two-column #speechControls {
    width: 100% !important; /* Speech controls take full width */
}

/* 
 * MOBILE RESPONSIVE STYLES - VIEWPORT BOUNDARY PROTECTION
 * Ensure dropdown never goes outside screen boundaries
 */

/* Base responsive adjustments for all screen sizes */
.accessibility-dropdown .dropdown-menu {
    /* Prevent horizontal overflow */
    max-width: calc(100vw - 20px) !important;
    /* Prevent vertical overflow */
    max-height: calc(100vh - 100px) !important;
    overflow-y: auto !important;
    /* Smart positioning - stay within viewport */  
    position: absolute !important;
    box-sizing: border-box !important;
}

/* Dynamic positioning to prevent off-screen issues */
.accessibility-dropdown.dropdown {
    position: relative !important;
}

/* Tablet and mobile adjustments */
@media (max-width: 768px) {
    .accessibility-dropdown .dropdown-menu {
        /*
         * VIEWPORT POSITIONING & LAYERING
         */
        position: fixed !important;
        z-index: 99999999 !important; /* Ensure it's on top of everything */
        top: 50px !important;      /* A safe distance from the top of the viewport */
        right: 10px !important;     /* A small margin from the right edge */
        left: auto !important;
        transform: none !important;

        /*
         * SIZE CONSTRAINTS
         */
        width: auto !important;
        min-width: 280px !important;
        max-width: calc(100vw - 20px) !important;
        
        /*
         * CRITICAL SCROLLING FIX
         * This section solves the "can't scroll" issue on mobile.
         */
        max-height: calc(100vh - 70px) !important; /* Set a max height smaller than the screen */
        overflow-y: auto !important;               /* Add a scrollbar if content overflows */
        -webkit-overflow-scrolling: touch !important; /* Enables smooth, momentum-based scrolling on iOS */
        touch-action: pan-y !important;            /* Tells the browser this element handles vertical swipes */

        /* General styling for mobile */
        padding: 15px 20px !important;
        font-size: 15px !important;
        border-radius: 12px !important;
        box-shadow: 0 5px 25px rgba(0,0,0,0.3);
    }
    
    /* Force single column layout on mobile */
    .accessibility-dropdown .dropdown-menu.two-column {
        display: block !important;
        width: 100% !important;
    }
    
    .accessibility-dropdown .dropdown-menu.two-column > li {
        width: 100% !important;
        margin: 2px 0 !important;
        display: block !important;
    }

    .accessibility-dropdown .ac-btn {
        font-size: 15px !important;
        padding: 10px 5px !important; /* More padding for better touch targets */
    }
    
    .accessibility-dropdown .ac-btn img {
        margin-right: 12px !important;
    }
}
</style>

<div class="accessibility-dropdown dropdown" style="display:inline-block;">
    <button class="dropdown-toggle" type="button" id="accessibilityMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Accessibility Options">
        <img src="https://img.icons8.com/ios/50/accessibility2.png" alt="Accessibility">
    </button>
    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="accessibilityMenu">
        <li><strong><img width="16" height="16" src="https://img.icons8.com/color/16/rgb-circle-2--v1.png" alt="Contrast"> Color & Contrast</strong></li>
        <li><button class="ac-btn" id="contrastBtn" onclick="toggleHighContrast()" title="Toggle High Contrast">
            <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/contrast.png" alt="High Contrast">
            High Contrast
            <div class="status-indicator"></div>
        </button></li>
        <li><button class="ac-btn" id="invertBtn" onclick="toggleInvert()" title="Invert Colors">
            <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/inverts-color-off.png" alt="Invert Colors">
            Invert Colors
            <div class="status-indicator"></div>
        </button></li>
        <li><button class="ac-btn" id="saturationBtn" onclick="toggleSaturation()" title="Increase Saturation">
            <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/saturation.png" alt="Saturation">
            Saturation
            <div class="status-indicator"></div>
        </button></li>
        <li><button class="ac-btn" id="highlightLinksBtn" onclick="toggleHighlightLinks()" title="Highlight Links">
            <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/marker-pen.png" alt="Highlight Links">
            Highlight Links
            <div class="status-indicator"></div>
        </button></li>
        <li class="divider"></li>
        <li><strong><img width="16" height="16" src="https://img.icons8.com/ios/16/text.png" alt="Text"> Text & Font</strong></li>
        <li><button class="ac-btn" id="fontIncreaseBtn" onclick="increaseFontSize()" title="Font Size Increase">
            <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/increase-font.png" alt="Font Increase">
            Font Size +
            <div class="level-indicator" id="fontIncreaseLevel"></div>
        </button></li>
        <li><button class="ac-btn" id="fontDecreaseBtn" onclick="decreaseFontSize()" title="Font Size Decrease">
            <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/decrease-font.png" alt="Font Decrease">
            Font Size -
            <div class="level-indicator" id="fontDecreaseLevel"></div>
        </button></li>
        <li><button class="ac-btn" id="fontNormalBtn" onclick="resetFontSize()" title="Normal Font Size">
            <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/sentence-case--v2.png" alt="Normal Font">
            Normal Font
        </button></li>
        <li><button class="ac-btn" id="textSpacingBtn" onclick="toggleTextSpacing()" title="Text Spacing">
            <img width="16" height="16" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/16/external-text-spacing-text-editor-inkubators-detailed-outline-inkubators.png" alt="Text Spacing">
            Text Spacing
            <div class="status-indicator"></div>
        </button></li>
        <li><button class="ac-btn" id="lineHeightBtn" onclick="toggleLineHeight()" title="Line Height">
            <img width="16" height="16" src="https://img.icons8.com/ios/16/height.png" alt="Line Height">
            Line Height
            <div class="status-indicator"></div>
        </button></li>
        <li class="divider"></li>
        <li><strong><img width="16" height="16" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/16/external-more-information-music-inkubators-detailed-outline-inkubators.png" alt="Other"> Other Controls</strong></li>
        <li><button class="ac-btn" id="screenReaderBtn" onclick="toggleScreenReader()" title="Screen Reader with Text-to-Speech">
            <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/high-volume--v1.png" alt="Screen Reader">
            Screen Reader
            <div class="status-indicator"></div>
        </button></li>
        <li><button class="ac-btn" id="speechSettingsBtn" onclick="toggleSpeechSettings(event)" title="Speech Settings">
            <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/settings.png" alt="Speech Settings">
            Speech Settings
        </button></li>
        <li id="speechControls" style="display: none; padding-left: 20px; font-size: 12px;" onclick="event.stopPropagation();">
            <div style="margin: 5px 0;" onclick="event.stopPropagation();">
                <label style="color: #fff;">Speed: </label>
                <input type="range" id="speechRate" min="0.5" max="2" step="0.1" value="0.9" style="width: 100px;" onchange="updateSpeechSettings()" onclick="event.stopPropagation();">
                <span id="rateValue" style="color: #fff;">0.9</span>
            </div>
            <div style="margin: 5px 0;" onclick="event.stopPropagation();">
                <label style="color: #fff;">Volume: </label>
                <input type="range" id="speechVolume" min="0" max="1" step="0.1" value="0.8" style="width: 100px;" onchange="updateSpeechSettings()" onclick="event.stopPropagation();">
                <span id="volumeValue" style="color: #fff;">0.8</span>
            </div>
            <button class="ac-btn" onclick="testSpeech(); event.stopPropagation();" style="font-size: 11px; padding: 3px 0;">
                <img width="14" height="14" src="https://img.icons8.com/ios-filled/14/play.png" alt="Test">
                Test Speech
            </button>
        </li>
        <li><button class="ac-btn" id="hideImagesBtn" onclick="toggleHideImages()" title="Hide Images">
            <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/no-image.png" alt="Hide Images">
            Hide Images
            <div class="status-indicator"></div>
        </button></li>
        <li class="divider"></li>
        <li><button class="ac-btn" onclick="resetAllSettings()" title="Reset All Settings" style="background: #dc3545 !important; color: #fff !important; margin-top: 5px; margin-right: 5px;">
            <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/recurring-appointment.png" alt="Reset">
            Reset All Settings
        </button></li>
    </ul>
</div>

<script>
// Font Size Controls - Browser-level zoom with fallback
var fontIncreaseLevel = 0;
var fontDecreaseLevel = 0;
var maxLevels = 3;
var fontScaleStep = 1.1; // 10% increase/decrease per level
var originalFontSize = null; // Store original font size
var usesBrowserZoom = false; // Track which method we're using

function detectBrowserZoomSupport() {
    // Try to detect if browser supports zoom property
    try {
        document.body.style.zoom = '1';
        usesBrowserZoom = true;
        return true;
    } catch (e) {
        usesBrowserZoom = false;
        return false;
    }
}

function applyFontScale() {
    var scaleValue = 1; // Default scale (100%)
    
    if (fontIncreaseLevel > 0) {
        scaleValue = Math.pow(fontScaleStep, fontIncreaseLevel);
    } else if (fontDecreaseLevel > 0) {
        scaleValue = Math.pow(1/fontScaleStep, fontDecreaseLevel);
    }
    
    // Use browser zoom if supported (preferred method)
    if (usesBrowserZoom) {
        if (fontIncreaseLevel > 0 || fontDecreaseLevel > 0) {
            document.body.style.zoom = scaleValue;
        } else {
            document.body.style.zoom = '';
        }
    } else {
        // Fallback to font-size scaling
        if (originalFontSize === null) {
            var computedStyle = window.getComputedStyle(document.documentElement);
            originalFontSize = computedStyle.fontSize;
        }
        
        if (fontIncreaseLevel > 0 || fontDecreaseLevel > 0) {
            document.documentElement.style.fontSize = (parseFloat(originalFontSize) * scaleValue) + 'px';
        } else {
            document.documentElement.style.fontSize = '';
        }
    }
}

function increaseFontSize() {
    if (fontIncreaseLevel < maxLevels) {
        fontDecreaseLevel = 0; // Reset decrease level
        fontIncreaseLevel++;
        applyFontScale();
        updateLevelIndicators();
        saveSettings();
    }
}

function decreaseFontSize() {
    if (fontDecreaseLevel < maxLevels) {
        fontIncreaseLevel = 0; // Reset increase level
        fontDecreaseLevel++;
        applyFontScale();
        updateLevelIndicators();
        saveSettings();
    }
}

function resetFontSize() {
    fontIncreaseLevel = 0;
    fontDecreaseLevel = 0;
    // Reset using appropriate method
    if (usesBrowserZoom) {
        document.body.style.zoom = '';
    } else {
        document.documentElement.style.fontSize = '';
    }
    updateLevelIndicators();
    saveSettings();
}

function updateLevelIndicators() {
    var increaseIndicator = document.getElementById('fontIncreaseLevel');
    var decreaseIndicator = document.getElementById('fontDecreaseLevel');
    var increaseBtn = document.getElementById('fontIncreaseBtn');
    var decreaseBtn = document.getElementById('fontDecreaseBtn');
    
    if (fontIncreaseLevel > 0) {
        increaseIndicator.textContent = fontIncreaseLevel;
        increaseBtn.classList.add('active');
    } else {
        increaseIndicator.textContent = '';
        increaseBtn.classList.remove('active');
    }
    
    if (fontDecreaseLevel > 0) {
        decreaseIndicator.textContent = fontDecreaseLevel;
        decreaseBtn.classList.add('active');
    } else {
        decreaseIndicator.textContent = '';
        decreaseBtn.classList.remove('active');
    }
}

// Contrast & Color Controls - Using original working logic
function setNormalContrast() {
    document.body.classList.remove('high-contrast', 'invert-colors', 'saturate-colors');
}

function setHighContrast() {
    document.body.classList.add('high-contrast');
    document.body.classList.remove('invert-colors', 'saturate-colors');
}

function toggleHighContrast() {
    var btn = document.getElementById('contrastBtn');
    if (document.body.classList.contains('high-contrast')) {
        setNormalContrast();
        btn.classList.remove('active');
    } else {
        setHighContrast();
        btn.classList.add('active');
    }
    saveSettings();
}

function toggleInvert() {
    var btn = document.getElementById('invertBtn');
    document.body.classList.toggle('invert-colors');
    btn.classList.toggle('active');
    saveSettings();
}

function toggleSaturation() {
    var btn = document.getElementById('saturationBtn');
    document.body.classList.toggle('saturate-colors');
    btn.classList.toggle('active');
    saveSettings();
}

function toggleHighlightLinks() {
    var btn = document.getElementById('highlightLinksBtn');
    document.body.classList.toggle('highlight-links');
    btn.classList.toggle('active');
    saveSettings();
}

// Text Spacing & Line Height - Using original working logic
function toggleTextSpacing() {
    var btn = document.getElementById('textSpacingBtn');
    document.body.classList.toggle('text-spacing');
    btn.classList.toggle('active');
    saveSettings();
}

function toggleLineHeight() {
    var btn = document.getElementById('lineHeightBtn');
    document.body.classList.toggle('line-height');
    btn.classList.toggle('active');
    saveSettings();
}

// Hide Images - Using original working logic
function toggleHideImages() {
    var btn = document.getElementById('hideImagesBtn');
    document.body.classList.toggle('hide-images');
    btn.classList.toggle('active');
    saveSettings();
}

// Screen Reader Toggle with Text-to-Speech
var screenReaderActive = false;
var speechSynthesis = window.speechSynthesis;
var currentUtterance = null;

// DEVELOPER CONFIGURATION OPTIONS
// Toggle to prevent screen reader from reading the accessibility menu itself
var SKIP_ACCESSIBILITY_MENU = true; // Set to false to allow reading the accessibility menu

// Array of CSS classes/IDs that should be excluded from screen reader
// Add your custom classes here that you don't want to be read aloud
var SCREEN_READER_EXCLUSIONS = [
    'accessibility-dropdown',     // The accessibility menu itself
    'no-screen-reader',          // Generic class for exclusion
    'skip-reading',              // Another generic class
    // 'hehehe-not-imp',         // Example custom class (uncommented for use)
    // 'advertisement',          // Example: Skip ads
    // 'navigation-secondary'    // Example: Skip secondary navigation
];

// DEVELOPER LAYOUT OPTION - Set to true for two-column layout
var USE_TWO_COLUMN_LAYOUT = false; // Set to true to enable two-column layout

function toggleScreenReader() {
    var btn = document.getElementById('screenReaderBtn');
    screenReaderActive = !screenReaderActive;
    
    if (screenReaderActive) {
        btn.classList.add('active');
        initializeScreenReader();
        speakText("Screen reader activated. Click on any text to have it read aloud, or use the read page button.");
    } else {
        btn.classList.remove('active');
        stopSpeaking();
        removeScreenReaderListeners();
        speakText("Screen reader deactivated.");
    }
    saveSettings();
}

function initializeScreenReader() {
    // Add click listeners to readable elements
    var readableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, label, li, td, th, span, div');
    readableElements.forEach(function(element) {
        element.addEventListener('click', handleElementClick);
        element.style.cursor = 'pointer';
        element.title = (element.title || '') + ' (Click to read aloud)';
    });
    
    // Add read page button to dropdown if not exists
    if (!document.getElementById('readPageBtn')) {
        addReadPageButton();
    }
}

function removeScreenReaderListeners() {
    var readableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, label, li, td, th, span, div');
    readableElements.forEach(function(element) {
        element.removeEventListener('click', handleElementClick);
        element.style.cursor = '';
        // Remove the read aloud part from title
        if (element.title) {
            element.title = element.title.replace(' (Click to read aloud)', '');
        }
    });
    
    // Remove the read page button if it exists
    var readPageBtn = document.getElementById('readPageBtn');
    if (readPageBtn) {
        readPageBtn.parentElement.remove();
    }
}

function handleElementClick(event) {
    if (!screenReaderActive) return;
    
    // Check if element should be excluded from screen reader
    var element = event.target;
    
    // Skip accessibility menu if configured
    if (SKIP_ACCESSIBILITY_MENU && element.closest('.accessibility-dropdown')) {
        return;
    }
    
    // Check for exclusion classes
    var shouldSkip = SCREEN_READER_EXCLUSIONS.some(function(className) {
        return element.classList.contains(className) || 
               element.closest('.' + className) || 
               element.closest('#' + className);
    });
    
    if (shouldSkip) {
        return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    
    var text = getElementText(element);
    if (text.trim()) {
        speakText(text);
    }
}

function getElementText(element) {
    // Get meaningful text from element
    var text = '';
    
    // For images, read alt text
    if (element.tagName === 'IMG') {
        text = element.alt || 'Image';
    }
    // For links, include href info
    else if (element.tagName === 'A') {
        text = element.textContent.trim();
        if (element.href && element.href !== '#') {
            text += ' (Link)';
        }
    }
    // For buttons
    else if (element.tagName === 'BUTTON') {
        text = element.textContent.trim() || element.title || 'Button';
    }
    // For form elements
    else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
        text = element.value || element.placeholder || 'Form field';
    }
    // For other elements
    else {
        text = element.textContent.trim();
    }
    
    return text;
}

function speakText(text) {
    if (!speechSynthesis) {
        console.log('Screen Reader: ' + text);
        alert('Text-to-Speech not supported. Message: ' + text);
        return;
    }
    
    // Stop any current speech
    stopSpeaking();
    
    // Create new utterance
    currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Get saved speech settings
    var settings = getSpeechSettings();
    
    // Configure speech settings
    currentUtterance.rate = settings.rate;
    currentUtterance.pitch = 1;
    currentUtterance.volume = settings.volume;
    
    // Try to use a natural voice
    var voices = speechSynthesis.getVoices();
    var preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Natural') || voice.name.includes('Google') || voice.name.includes('Microsoft'))
    );
    if (preferredVoice) {
        currentUtterance.voice = preferredVoice;
    }
    
    // Event handlers
    currentUtterance.onend = function() {
        currentUtterance = null;
    };
    
    currentUtterance.onerror = function(event) {
        console.error('Speech synthesis error:', event.error);
        currentUtterance = null;
    };
    
    // Speak the text
    speechSynthesis.speak(currentUtterance);
}

function stopSpeaking() {
    if (speechSynthesis && speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    currentUtterance = null;
}

function readEntirePage() {
    var content = '';
    
    // Get page title
    content += 'Page title: ' + document.title + '. ';
    
    // Get main content elements in order
    var mainElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li');
    mainElements.forEach(function(element) {
        var text = element.textContent.trim();
        if (text && text.length > 3) { // Skip very short text
            // Add element type for headings
            if (element.tagName.startsWith('H')) {
                content += 'Heading level ' + element.tagName.substring(1) + ': ';
            }
            content += text + '. ';
        }
    });
    
    speakText(content);
}

function addReadPageButton() {
    // Add to the Other Controls section
    var otherSection = document.querySelector('.accessibility-dropdown .dropdown-menu');
    var readPageItem = document.createElement('li');
    readPageItem.innerHTML = '<button class="ac-btn" id="readPageBtn" onclick="readEntirePage()" title="Read Entire Page">' +
        '<img width="16" height="16" src="https://img.icons8.com/ios-filled/16/speaker.png" alt="Read Page">' +
        'Read Page Aloud' +
        '</button>';
    
    // Insert before the last divider
    var lastDivider = otherSection.lastElementChild.previousElementSibling;
    otherSection.insertBefore(readPageItem, lastDivider);
}

// Speech Settings Controls
function toggleSpeechSettings(event) {
    if (event) {
        event.stopPropagation(); // Prevent dropdown from closing
    }
    var controls = document.getElementById('speechControls');
    if (controls.style.display === 'none') {
        controls.style.display = 'block';
    } else {
        controls.style.display = 'none';
    }
}

function updateSpeechSettings() {
    var rate = document.getElementById('speechRate').value;
    var volume = document.getElementById('speechVolume').value;
    
    document.getElementById('rateValue').textContent = rate;
    document.getElementById('volumeValue').textContent = volume;
    
    // Save to localStorage
    var speechSettings = {
        rate: parseFloat(rate),
        volume: parseFloat(volume)
    };
    localStorage.setItem('speechSettings', JSON.stringify(speechSettings));
}

function loadSpeechSettings() {
    var speechSettings = JSON.parse(localStorage.getItem('speechSettings') || '{"rate": 0.9, "volume": 0.8}');
    
    document.getElementById('speechRate').value = speechSettings.rate;
    document.getElementById('speechVolume').value = speechSettings.volume;
    document.getElementById('rateValue').textContent = speechSettings.rate;
    document.getElementById('volumeValue').textContent = speechSettings.volume;
}

function getSpeechSettings() {
    var speechSettings = JSON.parse(localStorage.getItem('speechSettings') || '{"rate": 0.9, "volume": 0.8}');
    return speechSettings;
}

function testSpeech() {
    speakText("This is a test of the text to speech functionality. You can adjust the speed and volume settings above.");
}

// Settings Management
function saveSettings() {
    var settings = {
        fontIncreaseLevel: fontIncreaseLevel,
        fontDecreaseLevel: fontDecreaseLevel,
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
    
    // Load font size levels
    fontIncreaseLevel = settings.fontIncreaseLevel || 0;
    fontDecreaseLevel = settings.fontDecreaseLevel || 0;
    
    // Only apply font scaling if there are saved levels
    if (fontIncreaseLevel > 0 || fontDecreaseLevel > 0) {
        applyFontScale();
    }
    
    // Apply other settings
    if (settings.highContrast) {
        document.body.classList.add('high-contrast');
        document.getElementById('contrastBtn').classList.add('active');
    }
    if (settings.invertColors) {
        document.body.classList.add('invert-colors');
        document.getElementById('invertBtn').classList.add('active');
    }
    if (settings.saturateColors) {
        document.body.classList.add('saturate-colors');
        document.getElementById('saturationBtn').classList.add('active');
    }
    if (settings.highlightLinks) {
        document.body.classList.add('highlight-links');
        document.getElementById('highlightLinksBtn').classList.add('active');
    }
    if (settings.textSpacing) {
        document.body.classList.add('text-spacing');
        document.getElementById('textSpacingBtn').classList.add('active');
    }
    if (settings.lineHeight) {
        document.body.classList.add('line-height');
        document.getElementById('lineHeightBtn').classList.add('active');
    }
    if (settings.hideImages) {
        document.body.classList.add('hide-images');
        document.getElementById('hideImagesBtn').classList.add('active');
    }
    if (settings.screenReader) {
        screenReaderActive = true;
        document.getElementById('screenReaderBtn').classList.add('active');
        initializeScreenReader();
    }
    
    updateLevelIndicators();
}

function resetAllSettings() {
    // Reset font size
    fontIncreaseLevel = 0;
    fontDecreaseLevel = 0;
    // Reset using appropriate method
    if (usesBrowserZoom) {
        document.body.style.zoom = '';
    } else {
        document.documentElement.style.fontSize = '';
    }
    
    // Reset all other settings
    document.body.classList.remove('high-contrast', 'invert-colors', 'saturate-colors', 'highlight-links', 'text-spacing', 'line-height', 'hide-images');
    
    // Reset screen reader
    if (screenReaderActive) {
        screenReaderActive = false;
        stopSpeaking();
        removeScreenReaderListeners();
    }
    
    // Remove active class from all buttons
    var buttons = document.querySelectorAll('.ac-btn');
    buttons.forEach(function(btn) {
        btn.classList.remove('active');
    });
    
    updateLevelIndicators();
    localStorage.removeItem('accessibilitySettings');
    
    // No alert - just silent reset
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Detect browser zoom support first
    detectBrowserZoomSupport();
    
    // Apply two-column layout if enabled
    if (USE_TWO_COLUMN_LAYOUT) {
        var dropdownMenu = document.querySelector('.accessibility-dropdown .dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.add('two-column');
        }
    }
    
    // Initialize speech synthesis voices (async in some browsers)
    if (speechSynthesis) {
        speechSynthesis.getVoices(); // Trigger voice loading
        speechSynthesis.onvoiceschanged = function() {
            // Voices are now loaded
        };
    }
    
    // Then load saved settings
    loadSettings();
    loadSpeechSettings();
});
</script>
