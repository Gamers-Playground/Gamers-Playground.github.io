// Simple i18n Utility using lang/config.json
const i18n = {
    translations: {},
    supportedLanguages: [], // Will be loaded from config.json
    currentLang: 'en_US', // Default language, will be updated

    async loadConfig() {
        try {
            const pathPrefix = window.location.pathname.includes('/play/') ? '../' : './';
            const response = await fetch(`${pathPrefix}lang/config.json`);
            if (!response.ok) {
                throw new Error('Failed to load lang/config.json');
            }
            this.supportedLanguages = await response.json();
            console.log('Language config loaded:', this.supportedLanguages);
        } catch (error) {
            console.error('Error loading language config:', error);
            // Fallback to hardcoded defaults if config fails
            this.supportedLanguages = [
                { code: 'en_US', name: 'English (US)', file: 'en_US.json' },
                { code: 'zh_CN', name: '简体中文', file: 'zh_CN.json' }
            ];
            console.warn('Using hardcoded language list.');
        }
    },

    async loadTranslations(lang) {
        const langConfig = this.supportedLanguages.find(l => l.code === lang);
        if (!langConfig) {
            console.error(`Language ${lang} not found in config.`);
            // Fallback to default if the requested lang isn't supported
            if (lang !== 'en_US') {
                 console.warn('Falling back to en_US');
                 await this.loadTranslations('en_US');
            }
            return; // Avoid infinite loop if en_US also fails
        }

        try {
            const pathPrefix = window.location.pathname.includes('/play/') ? '../' : './';
            const response = await fetch(`${pathPrefix}lang/${langConfig.file}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${langConfig.file}`);
            }
            this.translations = await response.json();
            this.currentLang = lang;
            document.documentElement.lang = lang.replace('_', '-');
            console.log(`Translations loaded for ${lang}`);
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            if (lang !== 'en_US') {
                console.warn('Falling back to en_US');
                await this.loadTranslations('en_US');
            } else {
                this.translations = {}; // Clear potentially partial translations if English fails
            }
        }
    },

    t(key, replacements = {}) {
        let translation = this.translations[key] || key;
        for (const placeholder in replacements) {
            translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
        }
        return translation;
    },

    async init() {
        await this.loadConfig(); // Load config first

        // 1. Check localStorage
        let preferredLang = localStorage.getItem('preferredLang');

        // 2. If not in localStorage, check browser preferences
        if (!preferredLang) {
            const browserLang = (navigator.language || navigator.userLanguage).replace('-', '_');
             // Check if browser language is directly supported
            if (this.supportedLanguages.some(l => l.code === browserLang)) {
                preferredLang = browserLang;
            } else {
                 // Check if the base language (e.g., 'en' from 'en_US') is supported
                 const baseLang = browserLang.split('_')[0];
                 const supportedBaseLang = this.supportedLanguages.find(l => l.code.startsWith(baseLang));
                 if (supportedBaseLang) {
                    preferredLang = supportedBaseLang.code;
                 }
            }
        }

        // 3. Validate if the preferred language is supported, otherwise default to the first in config or en_US
        if (!preferredLang || !this.supportedLanguages.some(l => l.code === preferredLang)) {
             preferredLang = this.supportedLanguages.length > 0 ? this.supportedLanguages[0].code : 'en_US';
        }

        await this.loadTranslations(preferredLang);
    },

    setLang(lang) {
        if (lang !== this.currentLang && this.supportedLanguages.some(l => l.code === lang)) {
            localStorage.setItem('preferredLang', lang);
            window.location.reload(); // Reload to apply new language
        }
    },

    populateLangSelector(selectorElementId) {
        const selector = document.getElementById(selectorElementId);
        if (!selector) {
            console.error(`Element with ID ${selectorElementId} not found.`);
            return;
        }
        selector.innerHTML = ''; // Clear existing options
        this.supportedLanguages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            if (lang.code === this.currentLang) {
                option.selected = true;
            }
            selector.appendChild(option);
        });

        // Add event listener to change language
        selector.addEventListener('change', (event) => {
            this.setLang(event.target.value);
        });
    }
};

// Expose globally
window.i18n = i18n;

// Initialize i18n on script load (async)
// Call populateLangSelector and applyTranslations after init in the main HTML scripts
i18n.init();