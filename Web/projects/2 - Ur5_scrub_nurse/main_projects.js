class ProjectTemplate {
    constructor() {
        this.config = null;
        this.currentVideo = 0;
        this.currentPage = 1;
        this.pdfDoc = null;
        this.pdfScale = 1.0;
        this.isIOS = this.detectIOS();
        this.init();
    }

    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    async init() {
        try {
            console.log('Initializing ProjectTemplate...');
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
            const response = await fetch('config_project.json');
            if (!response.ok) throw new Error('No se pudo cargar la configuración');
            this.config = await response.json();
            
            // Aplicar tema personalizado
            if (this.config.settings?.theme) {
                this.applyTheme(this.config.settings.theme);
            }
        } catch (error) {
            console.error('Error cargando configuración:', error);
            // Configuración por defecto si falla
            this.config = this.getDefaultConfig();
        }
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
                console.warn(`Error loading video thumbnail ${index}`);
                // Hide the video element and show fallback
                video.style.display = 'none';
                const fallback = video.nextElementSibling;
                if (fallback && fallback.classList.contains('video-fallback')) {
                    fallback.style.display = 'flex';
                }
            });
            
            // iOS-specific handling
            if (this.isIOS) {
                this.setupIOSVideo(video, index);
            } else {
                // For non-iOS, load thumbnail normally
                video.addEventListener('loadedmetadata', () => {
                    video.currentTime = 1; // Seek to 1 second for thumbnail
                });
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
            console.error('iOS Video error:', e);
            // Try alternative loading strategy
            setTimeout(() => {
                mainVideo.src = video.src + '?t=' + Date.now(); // Cache bust
                mainVideo.load();
            }, 1500);
        }, { once: true });
        
        mainVideo.addEventListener('loadstart', () => {
            console.log('iOS Video loading started:', video.title);
        }, { once: true });
        
        mainVideo.addEventListener('canplay', () => {
            console.log('iOS Video ready to play:', video.title);
        }, { once: true });
    }

    loadVideoStandard(mainVideo, video) {
        mainVideo.addEventListener('error', (e) => {
            console.error('Error loading video:', e);
            setTimeout(() => {
                mainVideo.load();
            }, 1000);
        }, { once: true });
        
        mainVideo.addEventListener('loadstart', () => {
            console.log('Video loading started for:', video.title);
        }, { once: true });
        
        mainVideo.addEventListener('canplay', () => {
            console.log('Video ready to play:', video.title);
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
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.imageIndex);
                const image = images[index];
                this.showImageModal(image,image.caption);
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
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.diagramIndex);
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
            'ai': 'Inteligencia Artificial',
            'robotics': 'Robótica',
            'computer_vision': 'Visión Computacional',
            'development': 'Desarrollo',
            'hardware': 'Hardware',
            'cloud': 'Cloud Computing'
        };
        return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
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
                    ${achievement.link ? `<a href="${achievement.link}" target="_blank" class="achievement-link">Ver más <i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            </div>`
        ).join('');
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { 
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
            repoDocsBtn.target = '_blank';
            console.log('Repo docs button configured:', repoDocsBtn.href);
        } else {
            console.error('Repo docs button not found!');
        }
        
        if (downloadPdfBtn) {
            downloadPdfBtn.href = this.config.project.documentation;
            downloadPdfBtn.target = '_blank';
            console.log('Download PDF button configured:', downloadPdfBtn.href);
        } else {
            console.error('Download PDF button not found!');
        }
        
        if (pdfDownloadLink) {
            pdfDownloadLink.href = this.config.project.documentation;
            pdfDownloadLink.target = '_blank';
        }
    }

    setupEventListeners() {
        // Media tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
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
            // Skip external links and specific buttons
            if (anchor.id === 'repo-btn' || anchor.id === 'repo-docs-btn' || anchor.id === 'download-pdf-btn') {
                return;
            }
            
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // Only handle internal navigation links
                if (href && href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                    
                    // Close navbar collapse in mobile view
                    const navbarCollapse = document.getElementById('navbarNav');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            });
        });
        
        // Modal keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
                if (modal) modal.hide();
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
            content.classList.toggle('active', content.id === `${tabName}-content`);
        });
    }

    async setupPDFViewer() {
        if (!window.pdfjsLib) return;
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        
        try {
            const pdfUrl = this.config.project.documentation;
            this.pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
            
            document.getElementById('page-count').textContent = this.pdfDoc.numPages;
            this.renderPDFPage(1);
            
            // PDF controls
            document.getElementById('prev-page').addEventListener('click', () => this.prevPage());
            document.getElementById('next-page').addEventListener('click', () => this.nextPage());
            document.getElementById('zoom-in').addEventListener('click', () => this.zoomIn());
            document.getElementById('zoom-out').addEventListener('click', () => this.zoomOut());
            
        } catch (error) {
            console.error('Error cargando PDF:', error);
            document.getElementById('pdf-fallback').style.display = 'block';
            document.querySelector('.pdf-canvas-container').style.display = 'none';
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
            console.log('Hero repo button href:', repoBtn.href);
            console.log('Hero repo button target:', repoBtn.target);
            
            // Force re-assignment if href is empty or incorrect
            if (!repoBtn.href || repoBtn.href === '#' || repoBtn.href.includes('#')) {
                repoBtn.href = this.config.project.repository;
                repoBtn.target = '_blank';
                console.log('Hero repo button fixed to:', repoBtn.href);
            }
        }

        // Check documentation buttons
        const repoDocsBtn = document.getElementById('repo-docs-btn');
        if (repoDocsBtn) {
            console.log('Docs repo button href:', repoDocsBtn.href);
            if (!repoDocsBtn.href || repoDocsBtn.href === '#' || repoDocsBtn.href.includes('#')) {
                repoDocsBtn.href = this.config.project.repository + '/tree/main/Manual_and_docs';
                repoDocsBtn.target = '_blank';
                console.log('Docs repo button fixed to:', repoDocsBtn.href);
            }
        }

        const downloadPdfBtn = document.getElementById('download-pdf-btn');
        if (downloadPdfBtn) {
            console.log('Download PDF button href:', downloadPdfBtn.href);
            if (!downloadPdfBtn.href || downloadPdfBtn.href === '#' || downloadPdfBtn.href.includes('#')) {
                downloadPdfBtn.href = this.config.project.documentation;
                downloadPdfBtn.target = '_blank';
                console.log('Download PDF button fixed to:', downloadPdfBtn.href);
            }
        }
    }

    getDefaultConfig() {
        return {
            project: {
                title: "Mi Proyecto",
                subtitle: "Descripción breve",
                shortDescription: "Proyecto de ejemplo",
                repository: "#",
                documentation: "#"
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