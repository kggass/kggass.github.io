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
        // Enforce maximum input length and clean inputs (Sentinel 🛡️ Security & Stability Enhancement)
        const cleanedMsg = typeof message === 'string' ? message.trim() : '';
        const finalMsg = cleanedMsg.length >= CONFIG.minMessageLength
            ? cleanedMsg.substring(0, CONFIG.maxCharacters)
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
            // Clean up error state when closing
            const errorElement = document.getElementById('wa-error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
            if (inputElement) {
                inputElement.removeAttribute('aria-invalid');
                inputElement.style.borderColor = '#ccc';
            }
        }
    },
    updateCounter(inputElement, counterElement) {
        counterElement.textContent = inputElement.value.length;
        const errorElement = document.getElementById('wa-error');
        if (inputElement.value.trim().length >= CONFIG.minMessageLength) {
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
            inputElement.removeAttribute('aria-invalid');
            inputElement.style.borderColor = '#ccc';
        }
    },
    handleSend(inputElement, chatBoxElement, counterElement) {
        const msg = inputElement.value.trim();
        const errorElement = document.getElementById('wa-error');
        if (msg.length >= CONFIG.minMessageLength) {
            Utils.sendToWhatsApp(msg);
            Chat.toggle(false, chatBoxElement, inputElement);
            inputElement.value = '';
            Chat.updateCounter(inputElement, counterElement);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        } else {
            inputElement.style.borderColor = 'var(--vermelho)';
            inputElement.setAttribute('aria-invalid', 'true');
            if (errorElement) {
                errorElement.textContent = msg.length === 0
                    ? 'Por favor, digite uma mensagem.'
                    : `A mensagem deve ter pelo menos ${CONFIG.minMessageLength} caracteres.`;
                errorElement.style.display = 'block';
                inputElement.setAttribute('aria-describedby', 'wa-error');
            }
            setTimeout(() => {
                inputElement.style.borderColor = '#ccc';
            }, 1500);
        }
    }
};

/**
 * HEADER
 */
const Header = {
    initScrollEffect(headerElement) {
        // Bolt ⚡ Optimization:
        // 1. Cache the 'scrolled' state in JS memory to avoid redundant DOM writes/classList calls
        //    which trigger style recalculation & layout on every scroll frame.
        // 2. Use `{ passive: true }` listener option to let the browser scroll the page immediately
        //    on the compositor thread without waiting for JS execution, eliminating scroll jank.
        let isScrolled = false;

        window.addEventListener('scroll', () => {
            const shouldBeScrolled = window.scrollY > 50;
            if (shouldBeScrolled !== isScrolled) {
                isScrolled = shouldBeScrolled;
                if (isScrolled) {
                    headerElement.classList.add('scrolled');
                } else {
                    headerElement.classList.remove('scrolled');
                }
            }
        }, { passive: true });
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
