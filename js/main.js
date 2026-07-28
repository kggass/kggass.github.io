/**
 * CONFIG
 */
const CONFIG = {
    phone: "5527992790796",
    whatsappURL: "https://wa.me/",
    maxCharacters: 250,
    minMessageLength: 3,
    defaultMessage: "Olá! Gostaria de solicitar uma entrega."
};

/**
 * UTILS
 */
const Utils = {
    encodeMessage(msg) {
        return encodeURIComponent(msg.trim());
    },
    sendToWhatsApp(message) {
        const finalMsg = message && message.length >= CONFIG.minMessageLength 
            ? message 
            : CONFIG.defaultMessage;
        const url = `${CONFIG.whatsappURL}${CONFIG.phone}?text=${Utils.encodeMessage(finalMsg)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }
};

/**
 * CHAT
 */
const Chat = {
    toggle(forceState, chatBoxElement, inputElement) {
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
    },
    updateCounter(inputElement, counterElement) {
        counterElement.textContent = inputElement.value.length;
    },
    handleSend(inputElement, chatBoxElement, counterElement) {
        const msg = inputElement.value.trim();
        if (msg.length >= CONFIG.minMessageLength) {
            Utils.sendToWhatsApp(msg);
            Chat.toggle(false, chatBoxElement, inputElement);
            inputElement.value = '';
            Chat.updateCounter(inputElement, counterElement);
        } else {
            inputElement.style.borderColor = 'var(--vermelho)';
            setTimeout(() => inputElement.style.borderColor = '#ccc', 1500);
        }
    }
};

/**
 * HEADER
 */
const Header = {
    initScrollEffect(headerElement) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                headerElement.classList.add('scrolled');
            } else {
                headerElement.classList.remove('scrolled');
            }
        });
    }
};

/**
 * ANIMAÇÕES
 */
const Animations = {
    initFadeIn() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }
};

/**
 * EVENTOS
 */
const Eventos = {
    setupListeners() {
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

        if (header) Header.initScrollEffect(header);
        Animations.initFadeIn();

        if (waTrigger && waChatBox) {
            waTrigger.addEventListener('click', () => Chat.toggle(undefined, waChatBox, waInput));
        }

        if (waCloseBtn && waChatBox) {
            waCloseBtn.addEventListener('click', () => Chat.toggle(false, waChatBox, waInput));
        }

        chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                waInput.value = e.target.dataset.msg;
                Chat.updateCounter(waInput, charCount);
                waInput.focus();
            });
        });

        if (waInput && charCount) {
            waInput.addEventListener('input', () => Chat.updateCounter(waInput, charCount));
            waInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    Chat.handleSend(waInput, waChatBox, charCount);
                }
            });
        }

        if (waSendBtn && waInput && waChatBox && charCount) {
            waSendBtn.addEventListener('click', () => Chat.handleSend(waInput, waChatBox, charCount));
        }

        if (heroCtaBtn) {
            heroCtaBtn.addEventListener('click', () => Utils.sendToWhatsApp('Olá, gostaria de solicitar uma entrega!'));
        }

        productBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const msg = e.target.dataset.msg || 'Olá, preciso de atendimento!';
                Utils.sendToWhatsApp(msg);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && waChatBox && waChatBox.classList.contains('active')) {
                Chat.toggle(false, waChatBox, waInput);
            }
        });

        document.addEventListener('click', (e) => {
            if (waChatBox && waChatBox.classList.contains('active')) {
                const isClickInside = waChatBox.contains(e.target) || waTrigger.contains(e.target);
                if (!isClickInside) {
                    Chat.toggle(false, waChatBox, waInput);
                }
            }
        });
    }
};

/**
 * INIT
 */
const init = () => {
    Eventos.setupListeners();
};

document.addEventListener("DOMContentLoaded", init);
