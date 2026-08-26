// BITS Achievements Hub - Interactive Guide JavaScript

class GuideApp {
  constructor() {
    this.currentSection = 'home';
    this.currentTab = 'backend';
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setup();
      });
    } else {
      this.setup();
    }
  }

  setup() {
    this.bindEvents();
    this.initializeNavigation();
    this.initializeTabs();
    this.initializeCodeHighlighting();
    this.handleInitialLoad();
    
    // Initialize interactive features
    InteractiveFeatures.init();
    ProgressIndicator.init();
    
    console.log('BITS Achievements Hub Guide initialized successfully! 🚀');
  }

  bindEvents() {
    // Navigation events with proper delegation
    document.body.addEventListener('click', (e) => {
      if (e.target.matches('.nav__link') || e.target.closest('.nav__link')) {
        e.preventDefault();
        const link = e.target.matches('.nav__link') ? e.target : e.target.closest('.nav__link');
        const targetSection = link.getAttribute('href').substring(1);
        this.showSection(targetSection);
      }
    });
    
    // Tab events with proper delegation
    document.body.addEventListener('click', (e) => {
      if (e.target.matches('.tab-btn') || e.target.closest('.tab-btn')) {
        const button = e.target.matches('.tab-btn') ? e.target : e.target.closest('.tab-btn');
        const targetTab = button.getAttribute('data-tab');
        this.showTab(targetTab);
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    
    // Hash change events for direct URL access
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
    
    // Scroll events for smooth animations
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  initializeNavigation() {
    // Ensure all sections are properly set up
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.classList.remove('section--active');
    });
    
    // Show home section by default
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.classList.add('section--active');
    }
  }

  initializeTabs() {
    // Initialize tab system
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
    });
    
    // Show first tab by default
    const firstTab = document.getElementById('backend');
    if (firstTab) {
      firstTab.classList.add('active');
    }
    
    // Set first button as active
    const firstButton = document.querySelector('.tab-btn[data-tab="backend"]');
    if (firstButton) {
      firstButton.classList.add('active');
    }
  }

  initializeCodeHighlighting() {
    // Initialize Prism.js for syntax highlighting
    if (typeof Prism !== 'undefined') {
      // Small delay to ensure all content is loaded
      setTimeout(() => {
        Prism.highlightAll();
      }, 100);
    }
  }

  handleInitialLoad() {
    // Check if there's a hash in the URL
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      this.showSection(hash);
    } else {
      this.showSection('home');
    }
  }

  showSection(sectionId) {
    console.log('Navigating to section:', sectionId);
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.classList.remove('section--active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('section--active');
      this.currentSection = sectionId;
      
      // Update navigation active state
      this.updateNavigationState(sectionId);
      
      // Update URL hash without triggering hashchange
      if (window.location.hash.substring(1) !== sectionId) {
        history.pushState(null, null, `#${sectionId}`);
      }
      
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Re-highlight code blocks in the new section
      setTimeout(() => {
        this.highlightCodeInSection(targetSection);
      }, 100);
      
      console.log('Successfully navigated to:', sectionId);
    } else {
      console.error('Section not found:', sectionId);
    }
  }

  showTab(tabId) {
    console.log('Switching to tab:', tabId);
    
    // Hide all tab panels
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    // Show target tab panel
    const targetPanel = document.getElementById(tabId);
    if (targetPanel) {
      targetPanel.classList.add('active');
      this.currentTab = tabId;
      
      // Update tab button active state
      this.updateTabState(tabId);
      
      // Re-highlight code blocks in the new tab
      setTimeout(() => {
        this.highlightCodeInSection(targetPanel);
      }, 100);
      
      console.log('Successfully switched to tab:', tabId);
    } else {
      console.error('Tab panel not found:', tabId);
    }
  }

  updateNavigationState(activeSectionId) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  updateTabState(activeTabId) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
      button.classList.remove('active');
      if (button.getAttribute('data-tab') === activeTabId) {
        button.classList.add('active');
      }
    });
  }

  highlightCodeInSection(section) {
    if (typeof Prism !== 'undefined') {
      const codeBlocks = section.querySelectorAll('pre code');
      codeBlocks.forEach(block => {
        Prism.highlightElement(block);
      });
    }
  }

  handleKeyboardNavigation(e) {
    // Handle keyboard shortcuts for navigation
    if (e.altKey) {
      const sections = ['home', 'architecture', 'setup', 'api', 'database', 'components', 'security', 'examples'];
      const currentIndex = sections.indexOf(this.currentSection);
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex > 0) {
            this.showSection(sections[currentIndex - 1]);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex < sections.length - 1) {
            this.showSection(sections[currentIndex + 1]);
          }
          break;
      }
    }

    // Handle tab navigation within examples section
    if (this.currentSection === 'examples' && e.ctrlKey) {
      const tabs = ['backend', 'frontend', 'database'];
      const currentTabIndex = tabs.indexOf(this.currentTab);
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (currentTabIndex > 0) {
            this.showTab(tabs[currentTabIndex - 1]);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentTabIndex < tabs.length - 1) {
            this.showTab(tabs[currentTabIndex + 1]);
          }
          break;
      }
    }
  }

  handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      this.showSection(hash);
    }
  }

  handleScroll() {
    // Add scroll-based animations or effects here if needed
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    
    if (header) {
      if (scrolled > 100) {
        header.style.boxShadow = 'var(--shadow-lg)';
      } else {
        header.style.boxShadow = 'var(--shadow-sm)';
      }
    }
  }
}

// Utility functions for enhanced interactivity
class InteractiveFeatures {
  static init() {
    // Add small delay to ensure DOM is ready
    setTimeout(() => {
      this.addCopyCodeButtons();
      this.addExpandableCodeBlocks();
      this.addTooltips();
      this.addSearchFunctionality();
    }, 200);
  }

  static addCopyCodeButtons() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
      // Skip if button already exists
      if (block.querySelector('.copy-btn')) return;
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-btn';
      copyButton.innerHTML = '📋 Copy';
      copyButton.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--color-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 10;
      `;
      
      block.style.position = 'relative';
      block.appendChild(copyButton);
      
      block.addEventListener('mouseenter', () => {
        copyButton.style.opacity = '1';
      });
      
      block.addEventListener('mouseleave', () => {
        copyButton.style.opacity = '0';
      });
      
      copyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = block.querySelector('code').textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code).then(() => {
            copyButton.innerHTML = '✅ Copied!';
            setTimeout(() => {
              copyButton.innerHTML = '📋 Copy';
            }, 2000);
          }).catch(() => {
            // Fallback for older browsers
            this.fallbackCopyText(code, copyButton);
          });
        } else {
          this.fallbackCopyText(code, copyButton);
        }
      });
    });
  }

  static fallbackCopyText(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      button.innerHTML = '✅ Copied!';
    } catch (err) {
      button.innerHTML = '❌ Failed';
    }
    document.body.removeChild(textarea);
    setTimeout(() => {
      button.innerHTML = '📋 Copy';
    }, 2000);
  }

  static addExpandableCodeBlocks() {
    const longCodeBlocks = document.querySelectorAll('.code-block pre');
    
    longCodeBlocks.forEach(block => {
      const lines = block.textContent.split('\n').length;
      if (lines > 15 && !block.nextElementSibling?.classList.contains('expand-btn')) {
        block.style.maxHeight = '300px';
        block.style.overflow = 'hidden';
        
        const expandButton = document.createElement('button');
        expandButton.className = 'expand-btn';
        expandButton.innerHTML = '⬇️ Show More';
        expandButton.style.cssText = `
          display: block;
          margin: 8px auto 0;
          background: var(--color-primary);
          color: var(--color-btn-primary-text);
          border: none;
          border-radius: var(--radius-sm);
          padding: 8px 16px;
          cursor: pointer;
          font-size: 12px;
        `;
        
        block.parentNode.appendChild(expandButton);
        
        expandButton.addEventListener('click', () => {
          if (block.style.maxHeight === '300px') {
            block.style.maxHeight = 'none';
            expandButton.innerHTML = '⬆️ Show Less';
          } else {
            block.style.maxHeight = '300px';
            expandButton.innerHTML = '⬇️ Show More';
          }
        });
      }
    });
  }

  static addTooltips() {
    const techItems = document.querySelectorAll('.tech-item li, .field-type');
    
    techItems.forEach(item => {
      item.style.cursor = 'help';
      if (!item.title) {
        item.title = 'Click for more information about this technology';
      }
    });
  }

  static addSearchFunctionality() {
    // Create search overlay
    const existingOverlay = document.querySelector('.search-overlay');
    if (existingOverlay) return; // Don't create duplicate

    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: none;
      z-index: 1000;
      align-items: center;
      justify-content: center;
    `;

    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    searchBox.style.cssText = `
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: 24px;
      width: 90%;
      max-width: 500px;
      border: 1px solid var(--color-border);
    `;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search documentation...';
    searchInput.className = 'form-control';
    searchInput.style.marginBottom = '16px';

    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `;

    searchBox.appendChild(searchInput);
    searchBox.appendChild(searchResults);
    searchOverlay.appendChild(searchBox);
    document.body.appendChild(searchOverlay);

    // Add keyboard shortcut for search (Ctrl+K)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchOverlay.style.display = 'flex';
        searchInput.focus();
      }
      
      if (e.key === 'Escape') {
        searchOverlay.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
      }
    });

    // Close search when clicking outside
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
      }
    });

    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value, searchResults);
      }, 300);
    });
  }

  static performSearch(query, resultsContainer) {
    if (!query.trim()) {
      resultsContainer.innerHTML = '';
      return;
    }

    const searchableElements = document.querySelectorAll('h2, h3, h4, p, li, code');
    const results = [];

    searchableElements.forEach(element => {
      const text = element.textContent.toLowerCase();
      const queryLower = query.toLowerCase();
      
      if (text.includes(queryLower)) {
        const section = element.closest('.section');
        const sectionId = section ? section.id : 'unknown';
        const sectionTitle = section ? section.querySelector('h2')?.textContent || sectionId : 'Unknown';
        
        results.push({
          element,
          section: sectionId,
          sectionTitle,
          text: element.textContent.trim().substring(0, 100) + '...',
          relevance: this.calculateRelevance(text, queryLower)
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    // Display results
    resultsContainer.innerHTML = results.slice(0, 10).map(result => `
      <div class="search-result" style="
        padding: 12px;
        border-bottom: 1px solid var(--color-border);
        cursor: pointer;
        border-radius: var(--radius-sm);
        margin-bottom: 8px;
        background: var(--color-bg-1);
        transition: background-color 0.2s;
      " data-section="${result.section}">
        <div style="font-weight: 500; color: var(--color-primary); font-size: 14px;">
          ${result.sectionTitle}
        </div>
        <div style="color: var(--color-text-secondary); font-size: 12px; margin-top: 4px;">
          ${result.text}
        </div>
      </div>
    `).join('');

    // Add hover effects and click handlers to results
    resultsContainer.querySelectorAll('.search-result').forEach(result => {
      result.addEventListener('mouseenter', () => {
        result.style.backgroundColor = 'var(--color-bg-2)';
      });
      
      result.addEventListener('mouseleave', () => {
        result.style.backgroundColor = 'var(--color-bg-1)';
      });
      
      result.addEventListener('click', () => {
        const sectionId = result.getAttribute('data-section');
        document.querySelector('.search-overlay').style.display = 'none';
        
        // Use the global app instance to navigate
        if (window.guideApp) {
          window.guideApp.showSection(sectionId);
        }
      });
    });
  }

  static calculateRelevance(text, query) {
    let score = 0;
    
    // Exact match bonus
    if (text.includes(query)) {
      score += 10;
    }
    
    // Word match bonus
    const words = query.split(' ');
    words.forEach(word => {
      if (text.includes(word)) {
        score += 5;
      }
    });
    
    // Position bonus (earlier matches are more relevant)
    const index = text.indexOf(query);
    if (index !== -1) {
      score += Math.max(0, 10 - index / 10);
    }
    
    return score;
  }
}

// Progress indicator
class ProgressIndicator {
  static init() {
    this.createProgressBar();
    this.updateProgress();
    window.addEventListener('scroll', () => this.updateProgress());
  }

  static createProgressBar() {
    // Don't create duplicate progress bars
    if (document.querySelector('.progress-bar')) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: var(--color-primary);
      z-index: 1001;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
  }

  static updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.pageYOffset;
    
    if (documentHeight > 0) {
      const progress = (scrolled / documentHeight) * 100;
      progressBar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
    }
  }
}

// Initialize the application
function initializeApp() {
  // Initialize main app
  window.guideApp = new GuideApp();
  
  // Add keyboard shortcuts info
  const existingShortcuts = document.querySelector('.shortcuts-info');
  if (!existingShortcuts) {
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.className = 'shortcuts-info';
    shortcutsInfo.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        padding: 12px;
        font-size: 12px;
        color: var(--color-text-secondary);
        z-index: 100;
        opacity: 0.7;
        transition: opacity 0.3s;
      ">
        <div>💡 <strong>Shortcuts:</strong></div>
        <div>Ctrl+K: Search</div>
        <div>Alt+←→: Navigate sections</div>
        <div>Ctrl+←→: Switch tabs</div>
      </div>
    `;
    
    // Add hover effect
    const shortcutDiv = shortcutsInfo.firstElementChild;
    shortcutDiv.addEventListener('mouseenter', () => {
      shortcutDiv.style.opacity = '1';
    });
    shortcutDiv.addEventListener('mouseleave', () => {
      shortcutDiv.style.opacity = '0.7';
    });
    
    document.body.appendChild(shortcutsInfo);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GuideApp, InteractiveFeatures, ProgressIndicator };
}