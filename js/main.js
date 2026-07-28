/**
 * Configurações Centrais do Sistema
 */
const CONFIG = {
    phone: "5527992790796",
    whatsappURL: "https://wa.me/",
    maxCharacters: 250,
    minMessageLength: 3,
    defaultMessage: "Olá! Gostaria de solicitar uma entrega."
};

/**
 * Função utilitária para formatar e codificar mensagens
 */
const encodeMessage = (msg) => {
    return encodeURIComponent(msg.trim());
};

/**
 * Abre o WhatsApp com a mensagem especificada
 */
const sendToWhatsApp = (message) => {
    const finalMsg = message && message.length >= CONFIG.minMessageLength 
        ? message 
        : CONFIG.defaultMessage;
        
    const url = `${CONFIG.whatsappURL}${CONFIG.phone}?text=${encodeMessage(finalMsg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Controla a exibição da caixa de chat flutuante
 */
const toggleChat = (forceState, chatBoxElement, inputElement) => {
    const isActive = chatBoxElement.classList.contains('active');
    const newState = typeof forceState === 'boolean' ? forceState : !isActive;
    
    if (newState) {
        chatBoxElement.classList.add('active');
        chatBoxElement.setAttribute('aria-hidden', 'false');
        if (inputElement) inputElement.focus();
    } else {
        chatBoxElement.classList.remove('active');
        chatBoxElement.setAttribute('aria-hidden', 'true');
    }
};

/**
 * Atualiza o contador de caracteres na interface
 */
const updateCounter = (inputElement, counterElement) => {
    const currentLength = inputElement.value.length;
    counterElement.textContent = currentLength;
};

/**
 * Configura todos os ouvintes de eventos da página
 */
const setupEvents = () => {
    const header = document.getElementById('main-header');
    const waTrigger = document.getElementById('wa-float-trigger');
    const waChatBox = document.getElementById('wa-chat-box');
    const waCloseBtn = document.getElementById('wa-close-btn');
    const waInput = document.getElementById('wa-input');
    const waSendBtn = document.getElementById('wa-send-btn');
    const charCount = document.getElementById('char-count');
    const chips = document.querySelectorAll('.chip');
    const heroCtaBtn = document.getElementById('hero-cta-btn');
    const productBtns = document.querySelectorAll('.product-btn');

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer para animações de scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Ações do Widget do WhatsApp
    if (waTrigger && waChatBox) {
        waTrigger.addEventListener('click', () => toggleChat(undefined, waChatBox, waInput));
    }

    if (waCloseBtn && waChatBox) {
        waCloseBtn.addEventListener('click', () => toggleChat(false, waChatBox, waInput));
    }

    // Atalhos de Chips (Mensagens prontas)
    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            waInput.value = e.target.dataset.msg;
            updateCounter(waInput, charCount);
            waInput.focus();
        });
    });

    // Contador e input de texto
    if (waInput && charCount) {
        waInput.addEventListener('input', () => updateCounter(waInput, charCount));
        
        waInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleMessageSend(waInput, waChatBox, charCount);
            }
        });
    }

    if (waSendBtn && waInput && waChatBox && charCount) {
        waSendBtn.addEventListener('click', () => handleMessageSend(waInput, waChatBox, charCount));
    }

    // Botões de CTA principais da página
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', () => {
            sendToWhatsApp('Olá, gostaria de solicitar uma entrega!');
        });
    }

    productBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const msg = e.target.dataset.msg || 'Olá, preciso de atendimento!';
            sendToWhatsApp(msg);
        });
    });

    // Fechar ao pressionar ESC ou clicar fora
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && waChatBox && waChatBox.classList.contains('active')) {
            toggleChat(false, waChatBox, waInput);
        }
    });

    document.addEventListener('click', (e) => {
        if (waChatBox && waChatBox.classList.contains('active')) {
            const isClickInside = waChatBox.contains(e.target) || waTrigger.contains(e.target);
            if (!isClickInside) {
                toggleChat(false, waChatBox, waInput);
            }
        }
    });
};

/**
 * Valida e despacha a mensagem do chat flutuante
 */
const handleMessageSend = (inputElement, chatBoxElement, counterElement) => {
    const msg = inputElement.value.trim();
    if (msg.length >= CONFIG.minMessageLength) {
        sendToWhatsApp(msg);
        toggleChat(false, chatBoxElement, inputElement);
        inputElement.value = '';
        updateCounter(inputElement, counterElement);
    } else {
        inputElement.style.borderColor = 'var(--vermelho)';
        setTimeout(() => inputElement.style.borderColor = '#ccc', 1500);
    }
};

/**
 * Inicialização do Sistema
 */
const init = () => {
    setupEvents();
};

document.addEventListener('DOMContentLoaded', init);
