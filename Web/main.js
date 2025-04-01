// Inicialización AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navbar scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Cerrar navbar en móvil
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // Cerrar navbar en móvil al hacer clic fuera
    document.addEventListener('click', function(e) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show') && 
            !e.target.closest('.navbar')) {
            document.querySelector('.navbar-toggler').click();
        }
    });

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Aquí puedes agregar la lógica para enviar el formulario
            // Por ahora, solo mostraremos un alerta
            alert(`Gracias ${nombre} por tu mensaje. Te responderé pronto a ${email}.`);
            
            // Limpiar formulario
            contactForm.reset();
        });
    }

    // Animación de habilidades
    function animateSkills() {
        const skillsSection = document.getElementById('habilidades');
        if (!skillsSection) return;
        
        const progressBars = skillsSection.querySelectorAll('.progress-bar');
        
        // Verificar si las barras de progreso están en el viewport
        const isInViewport = function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= window.innerHeight &&
                rect.bottom >= 0
            );
        };
        
        if (isInViewport(skillsSection)) {
            progressBars.forEach(bar => {
                const width = bar.style.width;
                
                // Reset al principio
                bar.style.width = '0%';
                
                // Animar al ancho original
                setTimeout(() => {
                    bar.style.transition = 'width 1s ease-in-out';
                    bar.style.width = width;
                }, 200);
            });
            
            // Remover el listener una vez que las habilidades se han animado
            window.removeEventListener('scroll', animateSkills);
        }
    }
    
    // Agregar listener para detectar cuando la sección de habilidades está en vista
    window.addEventListener('scroll', animateSkills);
    
    // Llamar una vez al cargar para verificar si ya está en vista
    animateSkills();

    // Efecto hover para proyectos (fallback para navegadores que no soportan :hover)
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.project-overlay').style.opacity = '1';
            this.querySelector('.project-link').style.transform = 'translateY(0)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.project-overlay').style.opacity = '0';
            this.querySelector('.project-link').style.transform = 'translateY(20px)';
        });
    });

    // Año actual para el footer
    const yearElement = document.querySelector('.footer .text-lg-start p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `&copy; ${currentYear} José Pablo Hernández Alonso`;
    }
});

// Preloader (opcional)
window.addEventListener('load', function() {
    // Aquí podrías agregar un preloader si lo deseas
    // Por ejemplo:
    /*
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
    */
});

// Mantener activo el enlace de navegación según la sección visible
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        if (window.pageYOffset >= (sectionTop - navbarHeight - 50)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});