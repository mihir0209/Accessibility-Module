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

// Auto-detect screen size for responsive layout
function shouldUseTwoColumnLayout() {
    return USE_TWO_COLUMN_LAYOUT && window.innerWidth > 768;
}

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
    event.stopPropagation();
    var speechControls = document.getElementById('speechControls');
    if (speechControls) {
        var isVisible = speechControls.style.display !== 'none';
        speechControls.style.display = isVisible ? 'none' : 'block';
        
        // Update button state
        var btn = document.getElementById('speechSettingsBtn');
        if (btn) {
            if (isVisible) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
            }
        }
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
    
    // Reorganize HTML structure for better layout
    reorganizeDropdownStructure();
    
    // Apply two-column layout if enabled and screen is wide enough
    applyResponsiveLayout();
    
    // Listen for window resize to adjust layout
    window.addEventListener('resize', debounce(applyResponsiveLayout, 250));
    
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

// Debounce function to limit resize event calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply responsive layout based on screen size and settings
function applyResponsiveLayout() {
    var dropdownMenu = document.querySelector('.accessibility-dropdown .dropdown-menu');
    if (!dropdownMenu) return;
    
    // Remove existing layout classes
    dropdownMenu.classList.remove('two-column');
    
    // Apply two-column layout only if enabled and screen is wide enough
    if (shouldUseTwoColumnLayout()) {
        dropdownMenu.classList.add('two-column');
    }
}

function reorganizeDropdownStructure() {
    var dropdownMenu = document.querySelector('.accessibility-dropdown .dropdown-menu');
    if (!dropdownMenu) return;
    
    // Get all list items
    var allItems = Array.from(dropdownMenu.children);
    
    // Clear the dropdown
    dropdownMenu.innerHTML = '';
    
    // Reorganize into logical groups
    var colorSection = document.createElement('div');
    colorSection.className = 'section-group';
    colorSection.innerHTML = `
        <strong><img width="16" height="16" src="https://img.icons8.com/color/16/rgb-circle-2--v1.png" alt="Contrast"> Color & Contrast</strong>
        <div class="category-controls">
            <button class="ac-btn" id="contrastBtn" onclick="toggleHighContrast()" title="Toggle High Contrast">
                <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/contrast.png" alt="High Contrast">
                High Contrast
                <div class="status-indicator"></div>
            </button>
            <button class="ac-btn" id="invertBtn" onclick="toggleInvert()" title="Invert Colors">
                <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/inverts-color-off.png" alt="Invert Colors">
                Invert Colors
                <div class="status-indicator"></div>
            </button>
            <button class="ac-btn" id="saturationBtn" onclick="toggleSaturation()" title="Increase Saturation">
                <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/saturation.png" alt="Saturation">
                Saturation
                <div class="status-indicator"></div>
            </button>
            <button class="ac-btn" id="highlightLinksBtn" onclick="toggleHighlightLinks()" title="Highlight Links">
                <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/marker-pen.png" alt="Highlight Links">
                Highlight Links
                <div class="status-indicator"></div>
            </button>
        </div>
    `;
    
    var textSection = document.createElement('div');
    textSection.className = 'section-group';
    textSection.innerHTML = `
        <div class="divider"></div>
        <strong><img width="16" height="16" src="https://img.icons8.com/ios/16/text.png" alt="Text"> Text & Font</strong>
        <div class="category-controls">
            <button class="ac-btn" id="fontIncreaseBtn" onclick="increaseFontSize()" title="Font Size Increase">
                <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/increase-font.png" alt="Font Increase">
                Font Size +
                <div class="level-indicator" id="fontIncreaseLevel"></div>
            </button>
            <button class="ac-btn" id="fontDecreaseBtn" onclick="decreaseFontSize()" title="Font Size Decrease">
                <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/decrease-font.png" alt="Font Decrease">
                Font Size -
                <div class="level-indicator" id="fontDecreaseLevel"></div>
            </button>
            <button class="ac-btn" id="fontNormalBtn" onclick="resetFontSize()" title="Normal Font Size">
                <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/sentence-case--v2.png" alt="Normal Font">
                Normal Font
            </button>
            <button class="ac-btn" id="textSpacingBtn" onclick="toggleTextSpacing()" title="Text Spacing">
                <img width="16" height="16" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/16/external-text-spacing-text-editor-inkubators-detailed-outline-inkubators.png" alt="Text Spacing">
                Text Spacing
                <div class="status-indicator"></div>
            </button>
            <button class="ac-btn" id="lineHeightBtn" onclick="toggleLineHeight()" title="Line Height">
                <img width="16" height="16" src="https://img.icons8.com/ios/16/height.png" alt="Line Height">
                Line Height
                <div class="status-indicator"></div>
            </button>
        </div>
    `;
    
    var otherSection = document.createElement('div');
    otherSection.className = 'section-group';
    otherSection.innerHTML = `
        <div class="divider"></div>
        <strong><img width="16" height="16" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/16/external-more-information-music-inkubators-detailed-outline-inkubators.png" alt="Other"> Other Controls</strong>
        <div class="category-controls">
            <button class="ac-btn" id="screenReaderBtn" onclick="toggleScreenReader()" title="Screen Reader with Text-to-Speech">
                <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/high-volume--v1.png" alt="Screen Reader">
                Screen Reader
                <div class="status-indicator"></div>
            </button>
            <button class="ac-btn" id="speechSettingsBtn" onclick="toggleSpeechSettings(event)" title="Speech Settings">
                <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/settings.png" alt="Speech Settings">
                Speech Settings
            </button>
            <button class="ac-btn" id="hideImagesBtn" onclick="toggleHideImages()" title="Hide Images">
                <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/16/no-image.png" alt="Hide Images">
                Hide Images
                <div class="status-indicator"></div>
            </button>
        </div>
        <div id="speechControls" style="display: none; padding: 10px 0; font-size: 12px;" onclick="event.stopPropagation();">
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
        </div>
    `;
    
    var resetSection = document.createElement('div');
    resetSection.className = 'section-group';
    resetSection.innerHTML = `
        <div class="divider"></div>
        <button class="ac-btn reset-btn full-width" onclick="resetAllSettings()" title="Reset All Settings" style="background: #dc3545 !important; color: #fff !important; margin-top: 5px;">
            <img width="16" height="16" src="https://img.icons8.com/ios-filled/16/recurring-appointment.png" alt="Reset">
            Reset All Settings
        </button>
    `;
    
    // Add sections to dropdown
    dropdownMenu.appendChild(colorSection);
    dropdownMenu.appendChild(textSection);
    dropdownMenu.appendChild(otherSection);
    dropdownMenu.appendChild(resetSection);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    var dropdown = document.querySelector('.accessibility-dropdown');
    var dropdownMenu = document.querySelector('.accessibility-dropdown .dropdown-menu');
    
    if (dropdown && dropdownMenu && !dropdown.contains(event.target)) {
        // Hide speech controls when dropdown closes
        var speechControls = document.getElementById('speechControls');
        if (speechControls) {
            speechControls.style.display = 'none';
        }
        var speechBtn = document.getElementById('speechSettingsBtn');
        if (speechBtn) {
            speechBtn.classList.remove('active');
        }
    }
});