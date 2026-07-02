class ProjectTemplate {
    constructor() {
        this.config = null;
        this.currentVideo = 0;
        this.currentPage = 1;
        this.pdfDoc = null;
        this.pdfScale = 1.0;
        this.isIOS = this.detectIOS();
        this.lang = this.getLanguage();
        this.labels = this.getLabels();
        this.configPath = this.getConfigPath();
        this.init();
    }

    getLanguage() {
        const params = new URLSearchParams(window.location.search);
        const queryLang = params.get('lang');
        if (['es', 'en', 'de'].includes(queryLang)) return queryLang;

        const htmlLang = document.documentElement.lang;
        if (['es', 'en', 'de'].includes(htmlLang)) return htmlLang;

        return 'es';
    }

    getLabels() {
        const labels = {
            es: {
                home: 'Inicio',
                overview: 'Resumen',
                media: 'Media',
                technologies: 'Tecnologias',
                achievements: 'Logros',
                documentation: 'Documentacion',
                project: 'Proyecto',
                projectTitle: 'Titulo del Proyecto',
                repo: 'Ver Repositorio',
                explore: 'Explorar Proyecto',
                projectOverview: 'Resumen del Proyecto',
                problem: 'Problema',
                solution: 'Solucion',
                impact: 'Impacto',
                gallery: 'Galeria Multimedia',
                videos: 'Videos',
                images: 'Imagenes',
                diagrams: 'Diagramas',
                techStack: 'Stack Tecnologico',
                achievementsTitle: 'Logros y Reconocimientos',
                github: 'Ver en GitHub',
                downloadPdf: 'Descargar PDF',
                previous: 'Anterior',
                next: 'Siguiente',
                page: 'Pagina',
                of: 'de',
                pdfFallback: 'No se pudo cargar el PDF.',
                downloadFile: 'Descargar archivo',
                author: 'Autor',
                institution: 'Institucion',
                license: 'Este proyecto esta licenciado bajo CC BY-NC-SA 4.0',
                viewMore: 'Ver mas',
                locale: 'es-ES'
            },
            en: {
                home: 'Home',
                overview: 'Overview',
                media: 'Media',
                technologies: 'Technologies',
                achievements: 'Achievements',
                documentation: 'Documentation',
                project: 'Project',
                projectTitle: 'Project Title',
                repo: 'View Repository',
                explore: 'Explore Project',
                projectOverview: 'Project Overview',
                problem: 'Problem',
                solution: 'Solution',
                impact: 'Impact',
                gallery: 'Multimedia Gallery',
                videos: 'Videos',
                images: 'Images',
                diagrams: 'Diagrams',
                techStack: 'Technology Stack',
                achievementsTitle: 'Achievements and Recognition',
                github: 'View on GitHub',
                downloadPdf: 'Download PDF',
                previous: 'Previous',
                next: 'Next',
                page: 'Page',
                of: 'of',
                pdfFallback: 'The PDF could not be loaded.',
                downloadFile: 'Download file',
                author: 'Author',
                institution: 'Institution',
                license: 'This project is licensed under CC BY-NC-SA 4.0',
                viewMore: 'View more',
                locale: 'en-US'
            },
            de: {
                home: 'Start',
                overview: 'Ubersicht',
                media: 'Media',
                technologies: 'Technologien',
                achievements: 'Erfolge',
                documentation: 'Dokumentation',
                project: 'Projekt',
                projectTitle: 'Projekttitel',
                repo: 'Repository ansehen',
                explore: 'Projekt erkunden',
                projectOverview: 'Projektubersicht',
                problem: 'Problem',
                solution: 'Losung',
                impact: 'Wirkung',
                gallery: 'Multimedia-Galerie',
                videos: 'Videos',
                images: 'Bilder',
                diagrams: 'Diagramme',
                techStack: 'Technologie-Stack',
                achievementsTitle: 'Erfolge und Auszeichnungen',
                github: 'Auf GitHub ansehen',
                downloadPdf: 'PDF herunterladen',
                previous: 'Zuruck',
                next: 'Weiter',
                page: 'Seite',
                of: 'von',
                pdfFallback: 'Das PDF konnte nicht geladen werden.',
                downloadFile: 'Datei herunterladen',
                author: 'Autor',
                institution: 'Institution',
                license: 'Dieses Projekt ist unter CC BY-NC-SA 4.0 lizenziert',
                viewMore: 'Mehr anzeigen',
                locale: 'de-DE'
            }
        };

        return labels[this.lang] || labels.es;
    }

    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    getConfigPath() {
        // Buscar la ruta del config desde diferentes fuentes
        
        // 1. Desde un atributo data en el script tag
        const scriptTag = document.querySelector('script[src*="main_projects.js"]');
        if (scriptTag && scriptTag.dataset.config) {
            return this.localizeConfigPath(scriptTag.dataset.config);
        }

        // 2. Desde un meta tag
        const metaTag = document.querySelector('meta[name="project-config"]');
        if (metaTag && metaTag.content) {
            return this.localizeConfigPath(metaTag.content);
        }

        // 3. Desde el body
        if (document.body.dataset.config) {
            return this.localizeConfigPath(document.body.dataset.config);
        }

        // 4. Valor por defecto (relativo al archivo HTML actual)
        return this.localizeConfigPath('./config_project.json');
    }

    localizeConfigPath(configPath) {
        if (this.lang === 'es') return configPath;
        return configPath.replace(/config_project\.json$/, `config_project.${this.lang}.json`);
    }

    async init() {
        try {
            console.log('Initializing ProjectTemplate...');
            console.log('Config path:', this.configPath);
            this.localizeStaticText();
            await this.loadConfig();
            console.log('Config loaded:', this.config);
            this.setupEventListeners();
            this.renderPage();
            this.hideLoader();
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
            this.hideLoader();
        }
    }

    async loadConfig() {
        try {
            const response = await fetch(this.configPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.config = await response.json();
            
            // Aplicar tema personalizado
            if (this.config.settings?.theme) {
                this.applyTheme(this.config.settings.theme);
            }
        } catch (error) {
            console.error('Error cargando configuración desde:', this.configPath, error);
            if (this.lang !== 'es') {
                const fallbackPath = this.configPath.replace(`.${this.lang}.json`, '.json');
                try {
                    const fallbackResponse = await fetch(fallbackPath);
                    if (fallbackResponse.ok) {
                        this.config = await fallbackResponse.json();
                        return;
                    }
                } catch (fallbackError) {
                    console.error('Error cargando configuración de respaldo:', fallbackPath, fallbackError);
                }
            }
            // Configuración por defecto si falla
            this.config = this.getDefaultConfig();
        }
    }

    localizeStaticText() {
        document.documentElement.lang = this.lang;
        document.querySelectorAll('a[href="#hero"]').forEach(el => el.textContent = this.labels.home);
        document.querySelectorAll('a[href="#overview"]').forEach(el => el.textContent = this.labels.overview);
        document.querySelectorAll('a[href="#media"]').forEach(el => el.textContent = this.labels.media);
        document.querySelectorAll('a[href="#tech"]').forEach(el => el.textContent = this.labels.technologies);
        document.querySelectorAll('a[href="#achievements"]').forEach(el => el.textContent = this.labels.achievements);
        document.querySelectorAll('a[href="#docs"]').forEach(el => el.textContent = this.labels.documentation);

        const staticText = {
            'page-title': this.labels.project,
            'nav-title': this.labels.project,
            'hero-title': this.labels.projectTitle,
            'hero-status': this.labels.project,
            'hero-description': ''
        };

        Object.entries(staticText).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el && value) el.textContent = value;
        });

        const repoBtn = document.getElementById('repo-btn');
        if (repoBtn) repoBtn.innerHTML = `<i class="fab fa-github me-2"></i>${this.labels.repo}`;
        const exploreBtn = document.querySelector('a[href="#overview"].btn');
        if (exploreBtn) exploreBtn.textContent = this.labels.explore;

        const titles = document.querySelectorAll('.section-title');
        if (titles[0]) titles[0].textContent = this.labels.projectOverview;
        if (titles[1]) titles[1].textContent = this.labels.gallery;
        if (titles[2]) titles[2].textContent = this.labels.techStack;
        if (titles[3]) titles[3].textContent = this.labels.achievementsTitle;
        if (titles[4]) titles[4].textContent = this.labels.documentation;

        const overviewHeaders = document.querySelectorAll('.overview-card h3');
        if (overviewHeaders[0]) overviewHeaders[0].textContent = this.labels.problem;
        if (overviewHeaders[1]) overviewHeaders[1].textContent = this.labels.solution;
        if (overviewHeaders[2]) overviewHeaders[2].textContent = this.labels.impact;

        document.querySelectorAll('.tab-btn').forEach(btn => {
            const tab = btn.dataset.tab;
            const text = btn.querySelector('span');
            if (text && this.labels[tab]) text.textContent = this.labels[tab];
        });

        const repoDocsBtn = document.getElementById('repo-docs-btn');
        if (repoDocsBtn) repoDocsBtn.innerHTML = `<i class="fab fa-github me-2"></i>${this.labels.github}`;
        const downloadPdfBtn = document.getElementById('download-pdf-btn');
        if (downloadPdfBtn) downloadPdfBtn.innerHTML = `<i class="fas fa-download me-2"></i>${this.labels.downloadPdf}`;
        const prev = document.querySelector('#prev-page span');
        if (prev) prev.textContent = this.labels.previous;
        const next = document.querySelector('#next-page span');
        if (next) next.textContent = this.labels.next;
        const pageInfo = document.getElementById('page-info');
        if (pageInfo) pageInfo.innerHTML = `${this.labels.page} <span id="page-num">1</span> ${this.labels.of} <span id="page-count">?</span>`;
        const fallback = document.getElementById('pdf-fallback');
        if (fallback) fallback.innerHTML = `<p>${this.labels.pdfFallback} <a href="#" id="pdf-download-link">${this.labels.downloadFile}</a></p>`;
        const footerAuthor = document.getElementById('footer-author');
        if (footerAuthor) footerAuthor.textContent = this.labels.author;
        const footerInstitution = document.getElementById('footer-institution');
        if (footerInstitution) footerInstitution.textContent = this.labels.institution;
        const license = document.querySelector('.license-info .small');
        if (license) license.textContent = this.labels.license;

        this.renderLanguageSwitcher();
    }

    renderLanguageSwitcher() {
        const nav = document.querySelector('.navbar-nav');
        if (!nav || nav.querySelector('.project-language-switcher')) return;

        const currentPath = window.location.pathname;
        const baseHref = currentPath.split('/Web/projects/')[0] || '';
        const projectPath = currentPath;
        const makeHref = (lang) => `${projectPath}?lang=${lang}`;
        nav.insertAdjacentHTML('beforeend', `
            <li class="nav-item language-switcher project-language-switcher" aria-label="Language selector">
                <a class="nav-link ${this.lang === 'es' ? 'active' : ''}" href="${makeHref('es')}" lang="es" hreflang="es-MX">ES</a>
                <a class="nav-link ${this.lang === 'en' ? 'active' : ''}" href="${makeHref('en')}" lang="en" hreflang="en">EN</a>
                <a class="nav-link ${this.lang === 'de' ? 'active' : ''}" href="${makeHref('de')}" lang="de" hreflang="de">DE</a>
            </li>
        `);
    }

    applyTheme(theme) {
        const root = document.documentElement;
        if (theme.primaryColor) root.style.setProperty('--primary-color', theme.primaryColor);
        if (theme.secondaryColor) root.style.setProperty('--secondary-color', theme.secondaryColor);
        if (theme.accentColor) root.style.setProperty('--accent-color', theme.accentColor);
    }

    hideLoader() {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    }

    renderPage() {
        this.renderHero();
        this.renderOverview();
        this.renderMedia();
        this.renderTechnologies();
        this.renderAchievements();
        this.renderFooter();
        this.setupPDFViewer();
        this.addScrollAnimations();
        
        // iOS debugging
        if (this.isIOS) {
            console.log('Running on iOS device');
            this.addIOSDebugging();
        }
        
        // Verify buttons after all rendering is done
        setTimeout(() => {
            this.verifyButtons();
        }, 100);
    }

    addIOSDebugging() {
        // Add debugging info for iOS
        console.log('iOS Video debugging enabled');
        console.log('User Agent:', navigator.userAgent);
        console.log('Videos config:', this.config.media.videos.length);
        
        // Create a debug overlay (only in development)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const debugDiv = document.createElement('div');
            debugDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 10000;
            `;
            debugDiv.innerHTML = `iOS Debug: ${this.config.media.videos.length} videos`;
            document.body.appendChild(debugDiv);
        }
    }

    renderHero() {
        const project = this.config.project;
        
        // Título de la página
        document.getElementById('page-title').textContent = project.title;
        document.getElementById('nav-title').textContent = project.title;
        
        // Hero content
        document.getElementById('hero-status').textContent = project.status;
        document.getElementById('hero-title').textContent = project.title;
        document.getElementById('hero-subtitle').textContent = project.subtitle;
        document.getElementById('hero-description').textContent = project.shortDescription;
        
        // Tags
        const tagsContainer = document.getElementById('hero-tags');
        tagsContainer.innerHTML = project.tags.map(tag => 
            `<span class="hero-tag">${tag}</span>`
        ).join('');
        
        // Stats
        const statsContainer = document.getElementById('hero-stats');
        statsContainer.innerHTML = this.config.stats.map(stat =>
            `<div class="hero-stat">
                <span class="hero-stat-value">${stat.value}</span>
                <span class="hero-stat-label">${stat.label}</span>
            </div>`
        ).join('');
        
        // Repository button
        const repoBtn = document.getElementById('repo-btn');
        if (repoBtn) {
            repoBtn.href = project.repository;
            repoBtn.target = '_blank';
            console.log('Repository button configured:', project.repository);
        } else {
            console.error('Repository button not found!');
        }
    }

    renderOverview() {
        const overview = this.config.overview;
        document.getElementById('overview-problem').textContent = overview.problem;
        document.getElementById('overview-solution').textContent = overview.solution;
        document.getElementById('overview-impact').textContent = overview.impact;
    }

    renderMedia() {
        this.renderVideos();
        this.renderImages();
        this.renderDiagrams();
    }

    renderVideos() {
        const videos = this.config.media.videos;
        if (!videos || videos.length === 0) return;

        const mainVideo = document.getElementById('main-video');
        const playlist = document.getElementById('video-playlist');
        
        // Cargar primer video
        this.loadVideo(0);
        
        // Render playlist with iOS-compatible video elements
        playlist.innerHTML = videos.map((video, index) =>
            `<div class="video-item" data-video="${index}">
                <video class="video-thumbnail w-100" muted playsinline webkit-playsinline preload="metadata" style="height: 160px; object-fit: cover;">
                    <source src="${video.src}" type="video/mp4">
                    <div class="video-fallback d-flex align-items-center justify-content-center bg-light" style="height: 160px;">
                        <i class="fas fa-play-circle fa-3x text-primary"></i>
                    </div>
                </video>
                <div class="video-item-info">
                    <div class="video-item-title">${video.title}</div>
                    <div class="video-item-description">${video.description}</div>
                </div>
            </div>`
        ).join('');
        
        // Event listeners para playlist
        playlist.addEventListener('click', (e) => {
            const videoItem = e.target.closest('.video-item');
            if (videoItem) {
                const videoIndex = parseInt(videoItem.dataset.video);
                this.loadVideo(videoIndex);
            }
        });

        // Add error handling for video thumbnails
        document.querySelectorAll('.video-thumbnail').forEach((video, index) => {
            video.addEventListener('error', () => {
                console.error(`Error loading video thumbnail ${index}`);
                const fallback = video.nextElementSibling;
                if (fallback && fallback.classList.contains('video-fallback')) {
                    video.style.display = 'none';
                    fallback.style.display = 'flex';
                }
            });
            
            // iOS-specific handling
            if (this.isIOS) {
                this.setupIOSVideo(video, index);
            } else {
                // Standard video handling
                video.currentTime = 1; // Show frame at 1 second for thumbnail
            }
        });
    }

    setupIOSVideo(video, index) {
        // iOS requires user interaction to load videos
        video.addEventListener('loadstart', () => {
            console.log(`iOS video ${index} loading started`);
        });
        
        video.addEventListener('loadedmetadata', () => {
            // Don't auto-seek on iOS, just show first frame
            console.log(`iOS video ${index} metadata loaded`);
        });
        
        video.addEventListener('error', (e) => {
            console.error(`iOS video ${index} error:`, e);
            // Retry loading after a delay
            setTimeout(() => {
                video.load();
            }, 2000);
        });
        
        // For iOS, we need to handle the video loading more carefully
        video.preload = 'none'; // Don't preload on iOS to save bandwidth
        video.poster = ''; // Clear any poster to avoid conflicts
    }

    loadVideo(index) {
        const videos = this.config.media.videos;
        if (!videos || index >= videos.length) return;
        
        const video = videos[index];
        const mainVideo = document.getElementById('main-video');
        const videoTitle = document.getElementById('video-title');
        const videoDescription = document.getElementById('video-description');
        
        // Clear previous video and reset
        mainVideo.pause();
        mainVideo.src = '';
        mainVideo.load();
        
        // Set new video source with error handling
        mainVideo.src = video.src;
        videoTitle.textContent = video.title;
        videoDescription.textContent = video.description;
        
        // iOS-specific handling
        if (this.isIOS) {
            this.loadVideoForIOS(mainVideo, video);
        } else {
            this.loadVideoStandard(mainVideo, video);
        }
        
        // Load the video
        mainVideo.load();
        
        this.currentVideo = index;
        
        // Update active playlist item
        document.querySelectorAll('.video-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    loadVideoForIOS(mainVideo, video) {
        console.log('Loading video for iOS:', video.title);
        
        // iOS-specific settings
        mainVideo.setAttribute('playsinline', '');
        mainVideo.setAttribute('webkit-playsinline', '');
        mainVideo.preload = 'metadata';
        
        mainVideo.addEventListener('error', (e) => {
            console.error('iOS video error:', e, video.src);
        }, { once: true });
        
        mainVideo.addEventListener('loadstart', () => {
            console.log('iOS video loading started');
        }, { once: true });
        
        mainVideo.addEventListener('canplay', () => {
            console.log('iOS video can play');
        }, { once: true });
    }

    loadVideoStandard(mainVideo, video) {
        mainVideo.addEventListener('error', (e) => {
            console.error('Video error:', e, video.src);
        }, { once: true });
        
        mainVideo.addEventListener('loadstart', () => {
            console.log('Video loading started');
        }, { once: true });
        
        mainVideo.addEventListener('canplay', () => {
            console.log('Video can play');
        }, { once: true });
    }

    renderImages() {
        const images = this.config.media.images;
        if (!images || images.length === 0) return;

        const gallery = document.getElementById('image-gallery');
        gallery.innerHTML = images.map((image, index) =>
            `<div class="image-item" data-bs-toggle="modal" data-bs-target="#imageModal" data-image-index="${index}">
                <img src="${image.src}" alt="${image.alt}" class="img-fluid" loading="lazy" style="width: 100%; height: 250px; object-fit: cover;">
                <div class="image-caption">${image.caption}</div>
            </div>`
        ).join('');
        
        // Add click handlers for modal
        document.querySelectorAll('.image-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.imageIndex);
                const image = images[index];
                this.showImageModal(image, image.caption, image.alt);
            });
        });
    }

    renderDiagrams() {
        const diagrams = this.config.media.diagrams;
        if (!diagrams || diagrams.length === 0) return;

        const diagramsGrid = document.getElementById('diagrams-grid');
        diagramsGrid.innerHTML = diagrams.map((diagram, index) =>
            `<div class="diagram-item" data-bs-toggle="modal" data-bs-target="#imageModal" data-diagram-index="${index}">
                <img src="${diagram.src}" alt="${diagram.alt}" class="img-fluid" loading="lazy" style="width: 100%; height: auto; object-fit: contain; background: #f8f9fa; min-height: 250px;">
                <h4 class="p-3 mb-0">${diagram.title}</h4>
            </div>`
        ).join('');
        
        // Add click handlers for modal
        document.querySelectorAll('.diagram-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.diagramIndex);
                const diagram = diagrams[index];
                this.showImageModal(diagram, diagram.title, diagram.alt);
            });
        });
    }

    showImageModal(imageData, title, caption) {
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalImageTitle');
        const modalCaption = document.getElementById('modalImageCaption');
        
        modalImage.src = imageData.src;
        modalImage.alt = imageData.alt;
        modalTitle.textContent = title;
        modalCaption.textContent = caption;
    }

    renderTechnologies() {
        const technologies = this.config.technologies;
        const container = document.getElementById('tech-categories');
        
        container.innerHTML = Object.entries(technologies).map(([category, techs]) =>
            `<div class="tech-category">
                <h3>${this.formatCategoryName(category)}</h3>
                <div class="tech-items">
                    ${techs.map(tech =>
                        `<div class="tech-item">
                            <img src="${tech.icon}" alt="${tech.name}" class="tech-icon img-fluid" loading="lazy" style="width: 60px; height: 60px; object-fit: contain;">
                            <div class="tech-name">${tech.name}</div>
                            <div class="tech-description">${tech.description}</div>
                        </div>`
                    ).join('')}
                </div>
            </div>`
        ).join('');
    }

    formatCategoryName(category) {
        const names = {
            es: {
                'ai': 'Inteligencia Artificial',
                'robotics': 'Robotica',
                'computer_vision': 'Vision Computacional',
                'development': 'Desarrollo',
                'hardware': 'Hardware',
                'cloud': 'Cloud Computing'
            },
            en: {
                'ai': 'Artificial Intelligence',
                'robotics': 'Robotics',
                'computer_vision': 'Computer Vision',
                'development': 'Development',
                'hardware': 'Hardware',
                'cloud': 'Cloud Computing'
            },
            de: {
                'ai': 'Kunstliche Intelligenz',
                'robotics': 'Robotik',
                'computer_vision': 'Computer Vision',
                'development': 'Entwicklung',
                'hardware': 'Hardware',
                'cloud': 'Cloud Computing'
            }
        };
        return names[this.lang][category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    renderAchievements() {
        const achievements = this.config.achievements;
        const timeline = document.getElementById('achievements-timeline');
        
        timeline.innerHTML = achievements.map(achievement =>
            `<div class="achievement-item">
                <div class="achievement-marker"></div>
                <div class="achievement-content">
                    <div class="achievement-date">${this.formatDate(achievement.date)}</div>
                    <h4 class="achievement-title">${achievement.title}</h4>
                    <span class="achievement-type">${achievement.type}</span>
                    ${achievement.image ? `<img src="${achievement.image}" alt="${achievement.title}" class="achievement-image img-fluid" loading="lazy" style="width: 100%; height: 150px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem;">` : ''}
                    <p>${achievement.description}</p>
                    ${achievement.link ? `<a href="${achievement.link}" target="_blank" class="achievement-link">${this.labels.viewMore} <i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            </div>`
        ).join('');
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString(this.labels.locale, { 
            year: 'numeric', 
            month: 'long' 
        });
    }

    renderFooter() {
        const author = this.config.author;
        
        document.getElementById('footer-author').textContent = author.name;
        document.getElementById('footer-institution').textContent = author.institution;
        document.getElementById('footer-email').textContent = author.email;
        
        const socialLinks = document.getElementById('social-links');
        socialLinks.innerHTML = Object.entries(author.social).map(([platform, url]) =>
            `<a href="${url}" class="social-link" target="_blank">
                <i class="fab fa-${platform}"></i>
            </a>`
        ).join('');
        
        // Update documentation links
        const repoDocsBtn = document.getElementById('repo-docs-btn');
        const downloadPdfBtn = document.getElementById('download-pdf-btn');
        const pdfDownloadLink = document.getElementById('pdf-download-link');
        
        if (repoDocsBtn) {
            repoDocsBtn.href = this.config.project.repository;
        } else {
            console.warn('Repository docs button not found');
        }
        
        if (downloadPdfBtn) {
            downloadPdfBtn.href = this.config.project.documentation;
        } else {
            console.warn('Download PDF button not found');
        }
        
        if (pdfDownloadLink) {
            pdfDownloadLink.href = this.config.project.documentation;
        }
    }

    setupEventListeners() {
        // Media tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
        
        // Smooth scroll for navigation - exclude external links and specific buttons
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // Skip buttons that shouldn't have smooth scroll
            if (!anchor.classList.contains('btn') || anchor.getAttribute('href') !== '#') {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }
        });
        
        // PDF controls
        document.getElementById('prev-page')?.addEventListener('click', () => this.prevPage());
        document.getElementById('next-page')?.addEventListener('click', () => this.nextPage());
        document.getElementById('zoom-in')?.addEventListener('click', () => this.zoomIn());
        document.getElementById('zoom-out')?.addEventListener('click', () => this.zoomOut());
        
        // Modal keyboard navigation
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal.show');
            if (modal) {
                if (e.key === 'Escape') {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance?.hide();
                }
            }
        });
        
        // Prevent modal from closing when clicking on image
        document.getElementById('modalImage').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(`${tabName}-content`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    async setupPDFViewer() {
        if (!window.pdfjsLib) return;
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        
        try {
            const pdfUrl = this.config.project.documentation;
            if (pdfUrl && pdfUrl !== '#') {
                this.pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
                document.getElementById('page-count').textContent = this.pdfDoc.numPages;
                await this.renderPDFPage(1);
            }
        } catch (error) {
            console.error('Error loading PDF:', error);
            document.getElementById('pdf-fallback').style.display = 'block';
            document.getElementById('pdf-canvas').style.display = 'none';
        }
    }

    async renderPDFPage(pageNum) {
        if (!this.pdfDoc) return;
        
        const page = await this.pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: this.pdfScale });
        
        const canvas = document.getElementById('pdf-canvas');
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
        
        document.getElementById('page-num').textContent = pageNum;
        this.currentPage = pageNum;
    }

    prevPage() {
        if (this.currentPage <= 1) return;
        this.renderPDFPage(this.currentPage - 1);
    }

    nextPage() {
        if (this.currentPage >= this.pdfDoc.numPages) return;
        this.renderPDFPage(this.currentPage + 1);
    }

    zoomIn() {
        this.pdfScale += 0.25;
        this.renderPDFPage(this.currentPage);
    }

    zoomOut() {
        if (this.pdfScale <= 0.5) return;
        this.pdfScale -= 0.25;
        this.renderPDFPage(this.currentPage);
    }

    addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.overview-card, .tech-category, .achievement-item').forEach(el => {
            observer.observe(el);
        });
    }

    verifyButtons() {
        // Check hero repository button
        const repoBtn = document.getElementById('repo-btn');
        if (repoBtn) {
            console.log('Hero repository button found, href:', repoBtn.href);
        }

        // Check documentation buttons
        const repoDocsBtn = document.getElementById('repo-docs-btn');
        if (repoDocsBtn) {
            console.log('Documentation repository button found, href:', repoDocsBtn.href);
        }

        const downloadPdfBtn = document.getElementById('download-pdf-btn');
        if (downloadPdfBtn) {
            console.log('Download PDF button found, href:', downloadPdfBtn.href);
        }
    }

    getDefaultConfig() {
        return {
            project: {
                title: "Mi Proyecto",
                subtitle: "Descripción breve",
                shortDescription: "Proyecto de ejemplo",
                repository: "#",
                documentation: "#",
                status: "En desarrollo",
                tags: ["Ejemplo"]
            },
            overview: {
                problem: "Descripción del problema",
                solution: "Descripción de la solución",
                impact: "Descripción del impacto"
            },
            stats: [],
            media: { videos: [], images: [], diagrams: [] },
            technologies: {},
            achievements: [],
            author: {
                name: "Autor",
                institution: "Institución",
                email: "email@example.com",
                social: {}
            }
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProjectTemplate();
});
