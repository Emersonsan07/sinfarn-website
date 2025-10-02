// ===================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// EFEITO DE SCROLL NO HEADER
// ===================================
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Adiciona sombra maior quando rolar a página
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// ANIMAÇÃO DOS CONTADORES (ESTATÍSTICAS)
// ===================================
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect(); // Para a animação após executar uma vez
        }
    });
}, observerOptions);

// Observa a seção de estatísticas
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    observer.observe(heroStats);
}

// Função para animar os contadores
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        const target = originalText.replace(/\+|%/g, '');
        const isPercentage = originalText.includes('%');
        const hasPlus = originalText.includes('+');
        
        let current = 0;
        const increment = parseInt(target) / 50; // Divide em 50 partes para animação suave
        
        const updateCounter = () => {
            if (current < parseInt(target)) {
                current += increment;
                const formattedNumber = Math.ceil(current).toLocaleString('pt-BR');
                stat.textContent = formattedNumber + (hasPlus ? '+' : '') + (isPercentage ? '%' : '');
                setTimeout(updateCounter, 30);
            } else {
                const finalNumber = parseInt(target).toLocaleString('pt-BR');
                stat.textContent = finalNumber + (hasPlus ? '+' : '') + (isPercentage ? '%' : '');
            }
        };
        
        updateCounter();
    });
}

// ===================================
// MENU MOBILE (HAMBURGER)
// ===================================
function createMobileMenu() {
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');
    
    // Cria o botão hamburger se não existir
    if (!document.querySelector('.hamburger')) {
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        hamburger.setAttribute('aria-label', 'Menu');
        
        // Adiciona o hamburger antes do nav
        nav.parentNode.insertBefore(hamburger, nav);
        
        // Toggle do menu mobile
        hamburger.addEventListener('click', () => {
            navUl.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Muda o ícone
            const icon = hamburger.querySelector('i');
            if (hamburger.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Fecha o menu ao clicar em um link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
}

// Ativa menu mobile em telas pequenas
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Recria menu mobile ao redimensionar
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }
});

// ===================================
// LAZY LOADING PARA IMAGENS
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ===================================
// ANIMAÇÃO DE FADE IN AO ROLAR
// ===================================
const fadeElements = document.querySelectorAll('.destaque-card, .documento-card, .noticia-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

fadeElements.forEach(el => fadeObserver.observe(el));

// ===================================
// BOTÃO VOLTAR AO TOPO
// ===================================
function createBackToTop() {
    // Cria o botão se não existir
    if (!document.querySelector('.back-to-top')) {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.setAttribute('aria-label', 'Voltar ao topo');
        document.body.appendChild(backToTop);
        
        // Mostra/esconde o botão baseado no scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Ação de clique
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

createBackToTop();

// ===================================
// VALIDAÇÃO DE FORMULÁRIO (se houver)
// ===================================
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validação básica
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (isValid) {
            alert('Formulário enviado com sucesso! Em breve entraremos em contato.');
            form.reset();
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    });
});

// ===================================
// LOADING SPINNER (Opcional)
// ===================================
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// ===================================
// DESTAQUE DO MENU ATIVO
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===================================
// PROTEÇÃO CONTRA SPAM (Honeypot)
// ===================================
forms.forEach(form => {
    // Cria campo honeypot invisível
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    form.appendChild(honeypot);
});

// ===================================
// CONSOLE LOG PERSONALIZADO
// ===================================
console.log('%c🏥 SINFARN - Website Oficial', 'color: #009245; font-size: 20px; font-weight: bold;');
console.log('%c✨ Desenvolvido com dedicação para a categoria farmacêutica', 'color: #666; font-size: 12px;');
console.log('%c📧 Contato: sinfarn@gmail.com', 'color: #009245; font-size: 14px;');

// ===================================
// PERFORMANCE MONITORING (Opcional)
// ===================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('⚡ Tempo de carregamento:', Math.round(perfData.loadEventEnd), 'ms');
    });
}