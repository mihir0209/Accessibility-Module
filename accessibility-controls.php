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

<link rel="stylesheet" href="accessibility-module/accessibility-styles.css">

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

<script src="accessibility-module/accessibility-scripts.js"></script>
