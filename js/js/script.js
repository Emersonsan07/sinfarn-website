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
   SISTEMA DE CALCULADORA COM JSON DINÂMICO
   =================================== */

// Variável global para armazenar dados da CCT
let dadosCCT = null;
let carregandoDados = false;

// Carregar dados da CCT ao iniciar
async function carregarDadosCCT() {
    if (carregandoDados) return;
    carregandoDados = true;
    
    try {
        mostrarLoadingCalculadora(true);
        
        const response = await fetch('dados/cct-valores.json');
        
        if (!response.ok) {
            throw new Error('Erro ao carregar dados da CCT');
        }
        
        dadosCCT = await response.json();
        console.log('✅ Dados da CCT carregados com sucesso!', dadosCCT);
        
        // Atualizar interface com informações da CCT
        atualizarInfoCCT();
        mostrarLoadingCalculadora(false);
        
        // Mostrar mensagem de sucesso
        mostrarNotificacao('Dados da CCT carregados com sucesso!', 'success');
        
    } catch (error) {
        console.error('❌ Erro ao carregar CCT:', error);
        mostrarLoadingCalculadora(false);
        
        // Usar valores padrão em caso de erro
        usarValoresPadrao();
        mostrarNotificacao('Usando valores padrão. Verifique sua conexão.', 'warning');
    }
    
    carregandoDados = false;
}

// Mostrar/Ocultar loading na calculadora
function mostrarLoadingCalculadora(mostrar) {
    const btnCalcular = document.querySelector('.btn-calcular');
    
    if (btnCalcular) {
        if (mostrar) {
            btnCalcular.disabled = true;
            btnCalcular.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando dados...';
        } else {
            btnCalcular.disabled = false;
            btnCalcular.innerHTML = '<i class="fas fa-calculator"></i> Calcular Piso Salarial';
        }
    }
}

// Atualizar informações da CCT na interface
function atualizarInfoCCT() {
    if (!dadosCCT) return;
    
    // Formatar data para exibição
    const dataFormatada = new Date(dadosCCT.ultimaAtualizacao).toLocaleDateString('pt-BR');
    
    // Criar banner informativo se não existir
    const calculadoraSection = document.querySelector('.calculadora-section');
    
    if (calculadoraSection && !document.querySelector('.cct-info-banner')) {
        const banner = document.createElement('div');
        banner.className = 'cct-info-banner';
        banner.innerHTML = `
            <div class="info-content">
                <i class="fas fa-check-circle"></i>
                <div class="info-text">
                    <strong>CCT Atualizada:</strong> ${dataFormatada} | 
                    <strong>Data-base:</strong> ${dadosCCT.dataBase} | 
                    <strong>Registro MTE:</strong> ${dadosCCT.registroMTE}
                </div>
            </div>
        `;
        calculadoraSection.insertBefore(banner, calculadoraSection.firstChild);
    }
}

// Mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${mensagem}</span>
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notificacao.classList.remove('show');
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

// Função principal de cálculo (ATUALIZADA)
function calcularPiso() {
    // Verificar se dados foram carregados
    if (!dadosCCT) {
        mostrarNotificacao('Aguarde o carregamento dos dados da CCT...', 'warning');
        carregarDadosCCT();
        return;
    }
    
    // Obter valores dos inputs
    const areaAtuacao = document.getElementById('area-atuacao-calc').value;
    const cargaHoraria = document.getElementById('carga-horaria').value;
    const funcaoEspecial = document.getElementById('funcao-especial').value;
    const adicionalNoturno = document.getElementById('adicional-noturno').checked;
    const insalubridade = document.getElementById('insalubridade').checked;
    const salarioAtualInput = document.getElementById('salario-atual').value;
    
    // Validações
    if (!areaAtuacao || !cargaHoraria) {
        mostrarNotificacao('Por favor, preencha todos os campos obrigatórios!', 'warning');
        return;
    }
    
    // Pegar dados da área selecionada
    const dadosArea = dadosCCT.areas[areaAtuacao];
    
    if (!dadosArea) {
        mostrarNotificacao('Área de atuação não encontrada!', 'error');
        return;
    }
    
    // Verificar status da área
    if (dadosArea.status === 'sem-cct') {
        mostrarNotificacao('Esta área ainda não possui CCT registrada. Aguarde as negociações!', 'warning');
        return;
    }
    
    if (dadosArea.status === 'negociacao') {
        if (!confirm('⚠️ Esta área está em negociação. Os valores apresentados são estimados e podem mudar.\n\nDeseja continuar com o cálculo?')) {
            return;
        }
    }
    
    // Pegar piso base da carga horária
    const colunaPiso = cargaHoraria + 'h';
    let pisoBase = dadosArea.pisos[colunaPiso];
    
    if (!pisoBase || pisoBase === 0) {
        mostrarNotificacao('Piso não definido para esta carga horária!', 'warning');
        return;
    }
    
    let pisoCalculado = pisoBase;
    
    // Aplicar função especial
    let adicionalFuncao = 0;
    let nomeFuncao = 'Farmacêutico';
    const percentuais = dadosArea.adicionais;
    
    if (funcaoEspecial === 'responsavel-tecnico' && percentuais.responsavelTecnico > 0) {
        adicionalFuncao = pisoCalculado * (percentuais.responsavelTecnico / 100);
        pisoCalculado += adicionalFuncao;
        nomeFuncao = 'Responsável Técnico';
    } else if (funcaoEspecial === 'quimioterapico' && percentuais.quimioterapico > 0) {
        adicionalFuncao = pisoCalculado * (percentuais.quimioterapico / 100);
        pisoCalculado += adicionalFuncao;
        nomeFuncao = 'Farmacêutico Quimioterápico';
    }
    
    // Adicional noturno
    let adicionalNoturnoValor = 0;
    if (adicionalNoturno && percentuais.noturno > 0) {
        adicionalNoturnoValor = pisoBase * (percentuais.noturno / 100);
        pisoCalculado += adicionalNoturnoValor;
    }
    
    // Adicional de insalubridade
    let adicionalInsalubridade = 0;
    if (insalubridade && percentuais.insalubridade > 0) {
        const salarioMinimo = dadosCCT.salarioMinimo || 1412;
        adicionalInsalubridade = salarioMinimo * (percentuais.insalubridade / 100);
        pisoCalculado += adicionalInsalubridade;
    }
    
    // Processar salário atual
    let salarioAtual = 0;
    if (salarioAtualInput && salarioAtualInput.trim() !== '') {
        salarioAtual = parseFloat(salarioAtualInput.replace(/[^\d,]/g, '').replace(',', '.'));
    }
    
    // Exibir resultado
    exibirResultado(pisoCalculado, {
        areaAtuacao: dadosArea.nome,
        cargaHoraria: cargaHoraria,
        nomeFuncao: nomeFuncao,
        funcaoEspecial,
        pisoBase: pisoBase,
        adicionalFuncao,
        adicionalNoturnoValor,
        adicionalInsalubridade,
        salarioAtual,
        registroMTE: dadosArea.registroMTE || dadosCCT.registroMTE,
        dataBase: dadosCCT.dataBase,
        vigencia: dadosArea.vigencia,
        status: dadosArea.status,
        observacoes: dadosArea.observacoes,
        percentuais: percentuais
    });
}

// Exibir resultado (ATUALIZADA)
function exibirResultado(valorFinal, detalhes) {
    const resultadoDiv = document.getElementById('resultado-calculo');
    
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}


    let html = `
        <div class="resultado-dados">
            <div class="resultado-principal">
                <h3>Seu Piso Salarial Mínimo</h3>
                <div class="resultado-valor">${formatarMoeda(valorFinal)}</div>
                <p class="resultado-complemento">Para ${detalhes.cargaHoraria}h semanais em ${detalhes.areaAtuacao}</p>
                ${detalhes.status === 'negociacao' ? '<p class="resultado-alerta-status">⚠️ Valores em negociação</p>' : ''}
            </div>
            
            <div class="resultado-detalhes">
                <h4><i class="fas fa-list-ul"></i> Composição do Salário</h4>
                
                <div class="detalhe-item">
                    <span class="detalhe-label">Piso Base (${detalhes.cargaHoraria}h)</span>
                    <span class="detalhe-valor">${formatarMoeda(detalhes.pisoBase)}</span>
                </div>
    `;
    
    if (detalhes.adicionalFuncao > 0) {
        const percent = detalhes.funcaoEspecial === 'responsavel-tecnico' ? 
            detalhes.percentuais.responsavelTecnico : detalhes.percentuais.quimioterapico;
        html += `
                <div class="detalhe-item">
                    <span class="detalhe-label">${detalhes.nomeFuncao} (+${percent}%)</span>
                    <span class="detalhe-valor">+ ${formatarMoeda(detalhes.adicionalFuncao)}</span>
                </div>
        `;
    }
    
    if (detalhes.adicionalNoturnoValor > 0) {
        html += `
                <div class="detalhe-item">
                    <span class="detalhe-label">Adicional Noturno (+${detalhes.percentuais.noturno}%)</span>
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
        const porcentagem = valorFinal > 0 ? ((diferenca / valorFinal) * 100).toFixed(1) : 0;
        
        let classeComparacao = '';
        let icone = '';
        let mensagem = '';
        
        if (diferenca < 0) {
            classeComparacao = 'abaixo';
            icone = '<i class="fas fa-exclamation-triangle"></i>';
            mensagem = `<strong>Atenção!</strong> Seu salário está <strong>${formatarMoeda(Math.abs(diferenca))}</strong> (${Math.abs(porcentagem)}%) abaixo do piso da categoria.<br><br>Entre em contato com o SINFARN para orientações!`;
        } else if (diferenca > 0) {
            classeComparacao = 'acima';
            icone = '<i class="fas fa-check-circle"></i>';
            mensagem = `Seu salário está <strong>${formatarMoeda(diferenca)}</strong> (${porcentagem}%) acima do piso mínimo. Parabéns!`;
        } else {
            classeComparacao = '';
            icone = '<i class="fas fa-equals"></i>';
            mensagem = `Seu salário está exatamente no piso da categoria.`;
        }
        
        html += `
            <div class="resultado-comparacao ${classeComparacao}">
                <h4>${icone} Comparação com seu salário atual</h4>
                <p><strong>Seu salário:</strong> ${formatarMoeda(detalhes.salarioAtual)}</p>
                <p>${mensagem}</p>
            </div>
        `;
    }
    
    // Informações da CCT
    html += `
        <div class="resultado-info-cct">
            <h4><i class="fas fa-file-contract"></i> Informações da CCT</h4>
            <div class="info-cct-grid">
                ${detalhes.registroMTE ? `<p><strong>Registro MTE:</strong> ${detalhes.registroMTE}</p>` : ''}
                <p><strong>Data-base:</strong> ${detalhes.dataBase}</p>
                ${detalhes.vigencia && detalhes.vigencia.inicio ? 
                    `<p><strong>Vigência:</strong> ${detalhes.vigencia.inicio} a ${detalhes.vigencia.fim}</p>` : ''}
            </div>
            ${detalhes.observacoes ? `<p class="observacao-cct"><i class="fas fa-info-circle"></i> ${detalhes.observacoes}</p>` : ''}
        </div>
    `;
    
    html += `
            <div class="resultado-alerta">
                <i class="fas fa-info-circle"></i> <strong>Importante:</strong> Este cálculo é uma estimativa baseada na CCT vigente. Outros benefícios e condições podem se aplicar. Para orientação personalizada, entre em contato com o SINFARN.
            </div>
            
            <div class="resultado-acoes">
                <button type="button" class="btn" onclick="calcularNovamente()">
                    <i class="fas fa-redo"></i> Calcular Novamente
                </button>
                
            </div>
        </div>
    `;
    
    resultadoDiv.innerHTML = html;
    
    // Scroll suave até o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Animação de entrada
    setTimeout(() => {
        resultadoDiv.querySelector('.resultado-dados').classList.add('fade-in');
    }, 100);
}

// Calcular novamente
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
    
    // Scroll para o topo da calculadora
    document.querySelector('.calculadora-section').scrollIntoView({ behavior: 'smooth' });
}

// Imprimir resultado
function imprimirResultado() {
    window.print();
}

// Função de fallback com dados básicos
function usarValoresPadrao() {
    console.warn('⚠️ Usando dados de fallback');
    
    dadosCCT = {
        ultimaAtualizacao: "2025-08-20",
        dataBase: "Agosto/2025",
        registroMTE: "RN000357/2025",
        salarioMinimo: 1412,
        areas: {
            hospitalar: {
                nome: "Hospitais e Clínicas",
                registroMTE: "RN000357/2025",
                pisos: {
                    "44h": 4567.81,
                    "40h": 4152.55,
                    "36h": 3737.29,
                    "30h": 3111.07,
                    "20h": 2074.05
                },
                adicionais: {
                    responsavelTecnico: 10,
                    quimioterapico: 37,
                    noturno: 35,
                    insalubridade: 40
                },
                status: "vigente",
                vigencia: { inicio: "01/08/2025", fim: "31/12/2025" }
            }
        }
    };
}

// Carregar dados ao iniciar página
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('area-atuacao-calc')) {
        carregarDadosCCT();
    }
});

// Recarregar dados a cada 30 minutos (opcional)
setInterval(function() {
    if (document.getElementById('area-atuacao-calc')) {
        console.log('🔄 Atualizando dados da CCT...');
        dadosCCT = null;
        carregarDadosCCT();
    }
}, 30 * 60 * 1000); // 30 minutos