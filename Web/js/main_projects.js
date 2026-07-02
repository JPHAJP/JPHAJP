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
                technologies: 'Tecnologías',
                achievements: 'Logros',
                documentation: 'Documentación',
                project: 'Proyecto',
                projectTitle: 'Título del Proyecto',
                repo: 'Ver Repositorio',
                explore: 'Explorar Proyecto',
                projectOverview: 'Resumen del Proyecto',
                problem: 'Problema',
                solution: 'Solución',
                impact: 'Impacto',
                gallery: 'Galería Multimedia',
                videos: 'Videos',
                images: 'Imágenes',
                diagrams: 'Diagramas',
                techStack: 'Stack Tecnológico',
                achievementsTitle: 'Logros y Reconocimientos',
                github: 'Ver en GitHub',
                downloadPdf: 'Descargar PDF',
                previous: 'Anterior',
                next: 'Siguiente',
                page: 'Página',
                of: 'de',
                pdfFallback: 'No se pudo cargar el PDF.',
                downloadFile: 'Descargar archivo',
                author: 'Autor',
                institution: 'Institución',
                license: 'Este proyecto está licenciado bajo CC BY-NC-SA 4.0',
                viewMore: 'Ver más',
                playVideo: 'Reproducir video',
                selectedVideo: 'Video seleccionado',
                videoLoadError: 'No se pudo cargar este video. Intenta abrir otro recurso del proyecto.',
                videoNotSupported: 'Tu navegador no soporta video HTML5.',
                mediaUnavailable: 'No hay recursos multimedia disponibles para esta seccion.',
                openImage: 'Abrir imagen',
                openDiagram: 'Abrir diagrama',
                imageLoadError: 'No se pudo cargar la imagen.',
                zoomIn: 'Acercar',
                zoomOut: 'Alejar',
                toggleNavigation: 'Abrir o cerrar navegación',
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
                playVideo: 'Play video',
                selectedVideo: 'Selected video',
                videoLoadError: 'This video could not be loaded. Try another project resource.',
                videoNotSupported: 'Your browser does not support HTML5 video.',
                mediaUnavailable: 'No media resources are available for this section.',
                openImage: 'Open image',
                openDiagram: 'Open diagram',
                imageLoadError: 'The image could not be loaded.',
                zoomIn: 'Zoom in',
                zoomOut: 'Zoom out',
                toggleNavigation: 'Toggle navigation',
                locale: 'en-US'
            },
            de: {
                home: 'Start',
                overview: 'Übersicht',
                media: 'Medien',
                technologies: 'Technologien',
                achievements: 'Erfolge',
                documentation: 'Dokumentation',
                project: 'Projekt',
                projectTitle: 'Projekttitel',
                repo: 'Repository ansehen',
                explore: 'Projekt erkunden',
                projectOverview: 'Projektübersicht',
                problem: 'Problem',
                solution: 'Lösung',
                impact: 'Wirkung',
                gallery: 'Multimedia-Galerie',
                videos: 'Videos',
                images: 'Bilder',
                diagrams: 'Diagramme',
                techStack: 'Technologie-Stack',
                achievementsTitle: 'Erfolge und Auszeichnungen',
                github: 'Auf GitHub ansehen',
                downloadPdf: 'PDF herunterladen',
                previous: 'Zurück',
                next: 'Weiter',
                page: 'Seite',
                of: 'von',
                pdfFallback: 'Das PDF konnte nicht geladen werden.',
                downloadFile: 'Datei herunterladen',
                author: 'Autor',
                institution: 'Institution',
                license: 'Dieses Projekt ist unter CC BY-NC-SA 4.0 lizenziert',
                viewMore: 'Mehr anzeigen',
                playVideo: 'Video abspielen',
                selectedVideo: 'Ausgewähltes Video',
                videoLoadError: 'Dieses Video konnte nicht geladen werden. Versuche eine andere Projektressource.',
                videoNotSupported: 'Dein Browser unterstützt kein HTML5-Video.',
                mediaUnavailable: 'Für diesen Bereich sind keine Medien verfügbar.',
                openImage: 'Bild öffnen',
                openDiagram: 'Diagramm öffnen',
                imageLoadError: 'Das Bild konnte nicht geladen werden.',
                zoomIn: 'Vergrößern',
                zoomOut: 'Verkleinern',
                toggleNavigation: 'Navigation umschalten',
                locale: 'de-DE'
            }
        };

        return labels[this.lang] || labels.es;
    }

    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent)
            || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
            if (this.labels[tab]) btn.setAttribute('aria-label', this.labels[tab]);
        });

        const repoDocsBtn = document.getElementById('repo-docs-btn');
        if (repoDocsBtn) repoDocsBtn.innerHTML = `<i class="fab fa-github me-2"></i>${this.labels.github}`;
        const downloadPdfBtn = document.getElementById('download-pdf-btn');
        if (downloadPdfBtn) downloadPdfBtn.innerHTML = `<i class="fas fa-download me-2"></i>${this.labels.downloadPdf}`;
        const prev = document.querySelector('#prev-page span');
        if (prev) prev.textContent = this.labels.previous;
        document.getElementById('prev-page')?.setAttribute('aria-label', this.labels.previous);
        const next = document.querySelector('#next-page span');
        if (next) next.textContent = this.labels.next;
        document.getElementById('next-page')?.setAttribute('aria-label', this.labels.next);
        document.getElementById('zoom-in')?.setAttribute('aria-label', this.labels.zoomIn);
        document.getElementById('zoom-out')?.setAttribute('aria-label', this.labels.zoomOut);
        document.querySelector('.navbar-toggler')?.setAttribute('aria-label', this.labels.toggleNavigation);
        const pageInfo = document.getElementById('page-info');
        if (pageInfo) pageInfo.innerHTML = `${this.labels.page} <span id="page-num">1</span> ${this.labels.of} <span id="page-count">?</span>`;
        const fallback = document.getElementById('pdf-fallback');
        if (fallback) fallback.innerHTML = `<p>${this.labels.pdfFallback} <a href="#" id="pdf-download-link">${this.labels.downloadFile}</a></p>`;
        const mainVideo = document.getElementById('main-video');
        if (mainVideo) mainVideo.textContent = this.labels.videoNotSupported;
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
        document.body.classList.remove('project-loading');
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
        this.setupPDFViewerWhenVisible();
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
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) metaDescription.setAttribute('content', project.shortDescription || project.subtitle || project.title);
        
        // Hero content
        document.getElementById('hero-status').textContent = project.status;
        document.getElementById('hero-title').textContent = project.title;
        document.getElementById('hero-subtitle').textContent = project.subtitle;
        document.getElementById('hero-description').textContent = project.shortDescription;
        
        // Tags
        const tagsContainer = document.getElementById('hero-tags');
        tagsContainer.innerHTML = project.tags.map(tag => 
            `<span class="hero-tag">${this.escapeHTML(tag)}</span>`
        ).join('');
        
        // Stats
        const statsContainer = document.getElementById('hero-stats');
        statsContainer.innerHTML = this.config.stats.map(stat =>
            `<div class="hero-stat">
                <span class="hero-stat-value">${this.escapeHTML(stat.value)}</span>
                <span class="hero-stat-label">${this.escapeHTML(stat.label)}</span>
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

    escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[char]);
    }

    renderMedia() {
        const media = this.config.media || {};
        const availability = {
            videos: Boolean(media.videos?.length),
            images: Boolean(media.images?.length),
            diagrams: Boolean(media.diagrams?.length)
        };
        const firstAvailable = Object.keys(availability).find(key => availability[key]);

        document.querySelectorAll('.tab-btn').forEach(btn => {
            const isAvailable = availability[btn.dataset.tab];
            btn.hidden = !isAvailable;
            btn.disabled = !isAvailable;
            btn.setAttribute('aria-hidden', String(!isAvailable));
            btn.setAttribute('aria-selected', String(btn.dataset.tab === firstAvailable));
        });

        this.renderVideos();
        this.renderImages();
        this.renderDiagrams();

        if (firstAvailable) {
            this.switchTab(firstAvailable);
        } else {
            const mediaContent = document.querySelector('.media-content');
            if (mediaContent) {
                mediaContent.innerHTML = `<div class="empty-state">${this.escapeHTML(this.labels.mediaUnavailable)}</div>`;
            }
        }
    }

    renderVideos() {
        const videos = this.config.media?.videos || [];

        const mainVideo = document.getElementById('main-video');
        const playlist = document.getElementById('video-playlist');
        if (!mainVideo || !playlist) return;

        if (!videos.length) {
            playlist.innerHTML = '';
            return;
        }

        mainVideo.setAttribute('playsinline', '');
        mainVideo.setAttribute('webkit-playsinline', '');
        mainVideo.preload = 'none';
        mainVideo.controls = true;
        if (!mainVideo.dataset.lazyHandlersBound) {
            const ensureSource = () => this.ensureMainVideoSource();
            mainVideo.addEventListener('pointerdown', ensureSource, { passive: true });
            mainVideo.addEventListener('touchstart', ensureSource, { passive: true });
            mainVideo.addEventListener('click', ensureSource, { passive: true });
            mainVideo.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    ensureSource();
                }
            });
            mainVideo.dataset.lazyHandlersBound = 'true';
        }
        mainVideo.onerror = () => {
            const error = document.getElementById('video-error');
            if (error) error.hidden = false;
        };

        playlist.innerHTML = videos.map((video, index) =>
            `<button type="button" class="video-item" data-video="${index}" aria-pressed="${index === 0}">
                <div class="video-thumb-shell">
                    ${video.poster ? `<img class="video-poster" src="${video.poster}" alt="" loading="lazy" decoding="async" width="480" height="270">` : ''}
                    <div class="video-fallback ${video.poster ? '' : 'is-visible'}">
                        <i class="fas fa-play-circle" aria-hidden="true"></i>
                    </div>
                    <span class="video-play-badge" aria-hidden="true"><i class="fas fa-play"></i></span>
                </div>
                <div class="video-item-info">
                    <div class="video-item-title">${this.escapeHTML(video.title)}</div>
                    <div class="video-item-description">${this.escapeHTML(video.description)}</div>
                </div>
            </button>`
        ).join('');

        playlist.addEventListener('click', (e) => {
            const videoItem = e.target.closest('.video-item');
            if (videoItem) {
                const videoIndex = parseInt(videoItem.dataset.video);
                this.loadVideo(videoIndex);
            }
        });

        document.querySelectorAll('.video-poster').forEach(img => {
            img.addEventListener('error', () => {
                img.hidden = true;
                img.closest('.video-thumb-shell')?.querySelector('.video-fallback')?.classList.add('is-visible');
            });
        });

        this.loadVideo(0);
    }

    ensureMainVideoSource() {
        const mainVideo = document.getElementById('main-video');
        if (!mainVideo?.dataset.src || mainVideo.getAttribute('src')) return;

        mainVideo.src = mainVideo.dataset.src;
        mainVideo.load();
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
        const videoError = document.getElementById('video-error');
        if (!mainVideo || !videoTitle || !videoDescription) return;
        
        mainVideo.pause();
        mainVideo.removeAttribute('src');
        delete mainVideo.dataset.src;
        mainVideo.load();
        mainVideo.poster = video.poster || '';
        mainVideo.preload = 'none';
        mainVideo.dataset.src = video.src;
        videoTitle.textContent = video.title;
        videoDescription.textContent = video.description;
        if (videoError) {
            videoError.hidden = true;
            videoError.textContent = this.labels.videoLoadError;
        }

        this.currentVideo = index;

        document.querySelectorAll('.video-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
            item.setAttribute('aria-pressed', String(i === index));
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
        const images = this.config.media?.images || [];

        const gallery = document.getElementById('image-gallery');
        if (!gallery) return;
        if (!images.length) {
            gallery.innerHTML = '';
            return;
        }

        gallery.innerHTML = images.map((image, index) =>
            `<button type="button" class="image-item media-card-button" data-bs-toggle="modal" data-bs-target="#imageModal" data-image-index="${index}" aria-label="${this.escapeHTML(image.caption || image.alt)} - ${this.escapeHTML(this.labels.openImage)}">
                <img src="${image.src}" alt="${this.escapeHTML(image.alt || image.caption)}" class="media-image" loading="lazy" decoding="async" width="640" height="420">
                <div class="image-caption">${this.escapeHTML(image.caption || image.alt)}</div>
            </button>`
        ).join('');
        
        // Add click handlers for modal
        document.querySelectorAll('.image-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.imageIndex);
                const image = images[index];
                this.showImageModal(image, image.caption, image.alt);
            });
        });
        this.setupMediaImageFallbacks(gallery);
    }

    renderDiagrams() {
        const diagrams = this.config.media?.diagrams || [];

        const diagramsGrid = document.getElementById('diagrams-grid');
        if (!diagramsGrid) return;
        if (!diagrams.length) {
            diagramsGrid.innerHTML = '';
            return;
        }

        diagramsGrid.innerHTML = diagrams.map((diagram, index) =>
            `<button type="button" class="diagram-item media-card-button" data-bs-toggle="modal" data-bs-target="#imageModal" data-diagram-index="${index}" aria-label="${this.escapeHTML(diagram.title || diagram.alt)} - ${this.escapeHTML(this.labels.openDiagram)}">
                <img src="${diagram.src}" alt="${this.escapeHTML(diagram.alt || diagram.title)}" class="diagram-image" loading="lazy" decoding="async" width="900" height="560">
                <h3 class="diagram-title">${this.escapeHTML(diagram.title || diagram.alt)}</h3>
            </button>`
        ).join('');
        
        // Add click handlers for modal
        document.querySelectorAll('.diagram-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.diagramIndex);
                const diagram = diagrams[index];
                this.showImageModal(diagram, diagram.title, diagram.alt);
            });
        });
        this.setupMediaImageFallbacks(diagramsGrid);
    }

    setupMediaImageFallbacks(container) {
        container.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => {
                const fallback = document.createElement('div');
                fallback.className = 'media-image-fallback';
                fallback.textContent = this.labels.imageLoadError;
                img.replaceWith(fallback);
            }, { once: true });
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
                <h3>${this.escapeHTML(this.formatCategoryName(category))}</h3>
                <div class="tech-items">
                    ${techs.map(tech =>
                        `<div class="tech-item">
                            <img src="${tech.icon}" alt="${this.escapeHTML(tech.name)}" class="tech-icon img-fluid" loading="lazy" decoding="async" width="64" height="64">
                            <div class="tech-name">${this.escapeHTML(tech.name)}</div>
                            <div class="tech-description">${this.escapeHTML(tech.description)}</div>
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
                'ai': 'Künstliche Intelligenz',
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
                    <h3 class="achievement-title">${this.escapeHTML(achievement.title)}</h3>
                    <span class="achievement-type">${this.escapeHTML(achievement.type)}</span>
                    ${achievement.image ? `<img src="${achievement.image}" alt="${this.escapeHTML(achievement.title)}" class="achievement-image img-fluid" loading="lazy" decoding="async" width="640" height="360">` : ''}
                    <p>${this.escapeHTML(achievement.description)}</p>
                    ${achievement.link ? `<a href="${achievement.link}" target="_blank" rel="noopener noreferrer" class="achievement-link">${this.escapeHTML(this.labels.viewMore)} <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>` : ''}
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
            `<a href="${url}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="${this.escapeHTML(platform)}">
                <i class="fab fa-${platform}" aria-hidden="true"></i>
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
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (scrollTicking) return;
            scrollTicking = true;
            requestAnimationFrame(() => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
                scrollTicking = false;
            });
        }, { passive: true });
        
        // Smooth scroll for navigation - exclude external links and specific buttons
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // Skip buttons that shouldn't have smooth scroll
            if (!anchor.classList.contains('btn') || anchor.getAttribute('href') !== '#') {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        targetElement.scrollIntoView({
                            behavior: prefersReducedMotion ? 'auto' : 'smooth',
                            block: 'start'
                        });
                        const navbarCollapse = document.querySelector('.navbar-collapse.show');
                        if (navbarCollapse && window.bootstrap) {
                            bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
                        }
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
            btn.setAttribute('aria-selected', String(btn.dataset.tab === tabName));
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

    setupPDFViewerWhenVisible() {
        const docsSection = document.getElementById('docs');
        if (!docsSection) return;

        if (!('IntersectionObserver' in window)) {
            this.setupPDFViewer();
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
                observer.disconnect();
                this.setupPDFViewer();
            }
        }, { rootMargin: '600px 0px' });

        observer.observe(docsSection);
    }

    async setupPDFViewer() {
        const pdfReady = await this.ensurePDFLibrary();
        if (!pdfReady) {
            document.getElementById('pdf-fallback').style.display = 'block';
            document.getElementById('pdf-canvas').style.display = 'none';
            return;
        }
        
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

    async ensurePDFLibrary() {
        if (window.pdfjsLib) return true;

        if (!this.pdfLibraryPromise) {
            this.pdfLibraryPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
                script.async = true;
                script.crossOrigin = 'anonymous';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        try {
            await this.pdfLibraryPromise;
            return Boolean(window.pdfjsLib);
        } catch (error) {
            console.error('Error loading PDF.js:', error);
            return false;
        }
    }

    async renderPDFPage(pageNum) {
        if (!this.pdfDoc) return;
        
        const page = await this.pdfDoc.getPage(pageNum);
        const baseViewport = page.getViewport({ scale: 1 });
        const container = document.querySelector('.pdf-canvas-container');
        const availableWidth = container ? Math.max(container.clientWidth - 32, 280) : baseViewport.width;
        const fitScale = Math.min(availableWidth / baseViewport.width, 1.25);
        const viewport = page.getViewport({ scale: fitScale * this.pdfScale });
        
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
        if (!this.pdfDoc || this.currentPage <= 1) return;
        this.renderPDFPage(this.currentPage - 1);
    }

    nextPage() {
        if (!this.pdfDoc || this.currentPage >= this.pdfDoc.numPages) return;
        this.renderPDFPage(this.currentPage + 1);
    }

    zoomIn() {
        this.pdfScale = Math.min(this.pdfScale + 0.25, 2);
        this.renderPDFPage(this.currentPage);
    }

    zoomOut() {
        if (this.pdfScale <= 0.5) return;
        this.pdfScale = Math.max(this.pdfScale - 0.25, 0.5);
        this.renderPDFPage(this.currentPage);
    }

    addScrollAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.overview-card, .video-player, .video-item, .image-item, .diagram-item, .tech-category, .achievement-item, .docs-actions, .pdf-viewer-container').forEach(el => {
                el.classList.add('fade-in-up');
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

        document.querySelectorAll('.overview-card, .video-player, .video-item, .image-item, .diagram-item, .tech-category, .achievement-item, .docs-actions, .pdf-viewer-container').forEach((el, index) => {
            el.style.setProperty('--animation-delay', `${Math.min(index * 35, 280)}ms`);
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

const initializeProjectTemplate = () => {
    new ProjectTemplate();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProjectTemplate, { once: true });
} else {
    initializeProjectTemplate();
}
