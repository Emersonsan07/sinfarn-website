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

/* ===================================
   MELHORIAS PARA MOBILE
   =================================== */

// Detectar dispositivo mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Ajustar altura do viewport em iOS
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

if (isMobile()) {
    window.addEventListener('resize', setViewportHeight);
    setViewportHeight();
}

// Prevenir zoom em inputs no iOS (alternativa)
document.addEventListener('touchstart', function() {}, {passive: true});

// Smooth scroll otimizado para mobile
if (isMobile()) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fechar menu mobile ao clicar fora
document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav ul');
    const hamburger = document.querySelector('.hamburger');
    
    if (nav && hamburger) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && nav.classList.contains('active')) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.querySelector('i').className = 'fas fa-bars';
        }
    }
});

// Lazy loading de imagens otimizado para mobile
if ('IntersectionObserver' in window && isMobile()) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Esconder header ao rolar para baixo (mobile)
if (isMobile()) {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Rolando para baixo
            header.style.transform = 'translateY(-100%)';
        } else {
            // Rolando para cima
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, {passive: true});
}

// Touch events para cards (feedback visual)
if (isMobile()) {
    const cards = document.querySelectorAll('.destaque-card, .documento-card, .noticia-card');
    
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, {passive: true});
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        }, {passive: true});
    });
}

// Otimizar scroll performance no mobile
let ticking = false;

function optimizedScroll() {
    // Suas funções de scroll aqui
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(optimizedScroll);
        ticking = true;
    }
}, {passive: true});

/* ===================================
   CALCULADORA DE PISO SALARIAL
   =================================== */

// Formatação de moeda
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Máscara de dinheiro para input
document.addEventListener('DOMContentLoaded', function() {
    const inputSalario = document.getElementById('salario-atual');
    
    if (inputSalario) {
        inputSalario.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            valor = (parseInt(valor) / 100).toFixed(2);
            e.target.value = 'R$ ' + valor.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        });
    }
});

// Função principal de cálculo
function calcularPiso() {
    // Obter valores dos inputs
    const areaAtuacao = document.getElementById('area-atuacao-calc').value;
    const cargaHoraria = parseInt(document.getElementById('carga-horaria').value);
    const funcaoEspecial = document.getElementById('funcao-especial').value;
    const adicionalNoturno = document.getElementById('adicional-noturno').checked;
    const insalubridade = document.getElementById('insalubridade').checked;
    const salarioAtualInput = document.getElementById('salario-atual').value;
    
    // Validações
    if (!areaAtuacao || !cargaHoraria) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    // Verificar se área está disponível
    if (areaAtuacao === 'farmacia' || areaAtuacao === 'industria') {
        alert('Esta área ainda não tem CCT registrada em 2025. Aguarde as negociações!');
        return;
    }
    
    // Valores base conforme CCT 2025
    const valoresBase = {
        hospitalar: 4567.81,  // 44h semanais - CCT RN000357/2025
        distribuidora: 4567.81 // Usando mesmo valor base
    };
    
    // Piso base para 44h
    let pisoBase = valoresBase[areaAtuacao];
    
    // Calcular proporcional à carga horária
    let pisoCalculado = (pisoBase / 44) * cargaHoraria;
    
    // Aplicar função especial
    let adicionalFuncao = 0;
    if (funcaoEspecial === 'responsavel-tecnico') {
        adicionalFuncao = pisoCalculado * 0.10; // 10%
        pisoCalculado += adicionalFuncao;
    } else if (funcaoEspecial === 'quimioterapico') {
        adicionalFuncao = pisoCalculado * 0.37; // 37%
        pisoCalculado += adicionalFuncao;
    }
    
    // Adicional noturno (35% para hospitais, 20% para outros)
    let adicionalNoturnoValor = 0;
    if (adicionalNoturno) {
        const percentualNoturno = areaAtuacao === 'hospitalar' ? 0.35 : 0.20;
        adicionalNoturnoValor = pisoCalculado * percentualNoturno;
        pisoCalculado += adicionalNoturnoValor;
    }
    
    // Adicional de insalubridade (varia conforme NR-15)
    let adicionalInsalubridade = 0;
    if (insalubridade) {
        // Usar 40% do salário mínimo (exemplo - pode variar)
        const salarioMinimo = 1412; // Atualizar conforme ano
        adicionalInsalubridade = salarioMinimo * 0.40;
        pisoCalculado += adicionalInsalubridade;
    }
    
    // Processar salário atual
    let salarioAtual = 0;
    if (salarioAtualInput) {
        salarioAtual = parseFloat(salarioAtualInput.replace(/[^\d,]/g, '').replace(',', '.'));
    }
    
    // Exibir resultado
    exibirResultado(pisoCalculado, {
        areaAtuacao,
        cargaHoraria,
        funcaoEspecial,
        pisoBase: (pisoBase / 44) * cargaHoraria,
        adicionalFuncao,
        adicionalNoturnoValor,
        adicionalInsalubridade,
        salarioAtual
    });
}

function exibirResultado(valorFinal, detalhes) {
    const resultadoDiv = document.getElementById('resultado-calculo');
    
    // Determinar nome da área
    const nomesAreas = {
        'hospitalar': 'Hospitais e Clínicas',
        'distribuidora': 'Distribuidoras e Atacadistas'
    };
    
    // Determinar nome da função
    const nomesFuncoes = {
        'nenhuma': 'Farmacêutico',
        'responsavel-tecnico': 'Responsável Técnico',
        'quimioterapico': 'Farmacêutico Quimioterápico'
    };
    
    let html = `
        <div class="resultado-dados">
            <div class="resultado-principal">
                <h3>Seu Piso Salarial Mínimo</h3>
                <div class="resultado-valor">${formatarMoeda(valorFinal)}</div>
                <p class="resultado-complemento">Para ${detalhes.cargaHoraria}h semanais em ${nomesAreas[detalhes.areaAtuacao]}</p>
            </div>
            
            <div class="resultado-detalhes">
                <h4><i class="fas fa-list-ul"></i> Composição do Salário</h4>
                
                <div class="detalhe-item">
                    <span class="detalhe-label">Piso Base (${detalhes.cargaHoraria}h)</span>
                    <span class="detalhe-valor">${formatarMoeda(detalhes.pisoBase)}</span>
                </div>
    `;
    
    if (detalhes.adicionalFuncao > 0) {
        html += `
                <div class="detalhe-item">
                    <span class="detalhe-label">${nomesFuncoes[detalhes.funcaoEspecial]}</span>
                    <span class="detalhe-valor">+ ${formatarMoeda(detalhes.adicionalFuncao)}</span>
                </div>
        `;
    }
    
    if (detalhes.adicionalNoturnoValor > 0) {
        html += `
                <div class="detalhe-item">
                    <span class="detalhe-label">Adicional Noturno</span>
                    <span class="detalhe-valor">+ ${formatarMoeda(detalhes.adicionalNoturnoValor)}</span>
                </div>
        `;
    }
    
    if (detalhes.adicionalInsalubridade > 0) {
        html += `
                <div class="detalhe-item">
                    <span class="detalhe-label">Adicional de Insalubridade</span>
                    <span class="detalhe-valor">+ ${formatarMoeda(detalhes.adicionalInsalubridade)}</span>
                </div>
        `;
    }
    
    html += `
                <div class="detalhe-item" style="border-top: 2px solid #009245; padding-top: 1rem; margin-top: 0.5rem;">
                    <span class="detalhe-label"><strong>Total Mínimo</strong></span>
                    <span class="detalhe-valor"><strong>${formatarMoeda(valorFinal)}</strong></span>
                </div>
            </div>
    `;
    
    // Comparação com salário atual
    if (detalhes.salarioAtual > 0) {
        const diferenca = detalhes.salarioAtual - valorFinal;
        let classeComparacao = '';
        let icone = '';
        let mensagem = '';
        
        if (diferenca < 0) {
            classeComparacao = 'abaixo';
            icone = '<i class="fas fa-exclamation-triangle"></i>';
            mensagem = `Atenção! Seu salário está <strong>${formatarMoeda(Math.abs(diferenca))}</strong> abaixo do piso da categoria. Entre em contato com o sindicato!`;
        } else if (diferenca > 0) {
            classeComparacao = 'acima';
            icone = '<i class="fas fa-check-circle"></i>';
            mensagem = `Seu salário está <strong>${formatarMoeda(diferenca)}</strong> acima do piso mínimo. Parabéns!`;
        } else {
            classeComparacao = '';
            icone = '<i class="fas fa-equals"></i>';
            mensagem = `Seu salário está exatamente no piso da categoria.`;
        }
        
        html += `
            <div class="resultado-comparacao ${classeComparacao}">
                <h4>${icone} Comparação com seu salário atual</h4>
                <p>Seu salário: ${formatarMoeda(detalhes.salarioAtual)}</p>
                <p>${mensagem}</p>
            </div>
        `;
    }
    
    html += `
            <div class="resultado-alerta">
                <i class="fas fa-info-circle"></i> <strong>Importante:</strong> Este cálculo é uma estimativa baseada na CCT vigente. Outros benefícios e condições podem se aplicar. Para orientação personalizada, entre em contato com o SINFARN.
            </div>
            
            <button type="button" class="btn" style="margin-top: 1.5rem;" onclick="calcularNovamente()">
                <i class="fas fa-redo"></i> Calcular Novamente
            </button>
        </div>
    `;
    
    resultadoDiv.innerHTML = html;
    
    // Scroll suave até o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calcularNovamente() {
    // Limpar formulário
    document.getElementById('area-atuacao-calc').value = '';
    document.getElementById('carga-horaria').value = '';
    document.getElementById('funcao-especial').value = 'nenhuma';
    document.getElementById('adicional-noturno').checked = false;
    document.getElementById('insalubridade').checked = false;
    document.getElementById('salario-atual').value = '';
    
    // Resetar resultado
    const resultadoDiv = document.getElementById('resultado-calculo');
    resultadoDiv.innerHTML = `
        <div class="resultado-header">
            <i class="fas fa-info-circle"></i>
            <h3>Preencha o formulário ao lado para calcular seu piso salarial</h3>
        </div>
        <p>A calculadora considera os valores estabelecidos nas Convenções Coletivas de Trabalho vigentes para o Rio Grande do Norte.</p>
    `;
}