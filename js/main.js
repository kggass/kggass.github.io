/**
 * Configurações Gerais
 */
const CONFIG = {
    phone: '5527992790796',
    minMessageLength: 3
};

/**
 * Módulo WhatsApp API
 */
const whatsappAPI = (() => {
    const formatMessage = (msg) => encodeURIComponent(msg.trim());
    
    const openWhatsApp = (message) => {
        if (!message || message.length < CONFIG.minMessageLength) return;
        
        const url = `https://wa.me/${CONFIG.phone}?text=${formatMessage(message)}`;
        // Prevenção de vulnerabilidades
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return { openWhatsApp };
})();

/**
 * Controle de Interface (UI)
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer (Microanimações) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Anima apenas 1 vez
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- Lógica do Chat Flutuante ---
    const waTrigger = document.getElementById('wa-float-trigger');
    const waChatBox = document.getElementById('wa-chat-box');
    const waCloseBtn = document.getElementById('wa-close-btn');
    const waInput = document.getElementById('wa-input');
    const waSendBtn = document.getElementById('wa-send-btn');
    const charCount = document.getElementById('char-count');
    const chips = document.querySelectorAll('.chip');

    const toggleChat = (forceState) => {
        const isActive = waChatBox.classList.contains('active');
        const newState = typeof forceState === 'boolean' ? forceState : !isActive;
        
        se (novo estado) {
            waChatBox.lista de classes.adicionar('ativo');
            waChatBox.definirAtributo('escondido na arária', 'false');
            entrada wa.foco();
        } outro {
            waChatBox.lista de classes.remover('ativo');
            waChatBox.definirAtributo('escondido na arária', 'true');
        }
    };

    const lidarEnviar = () => {
        const mensagem = entrada wa.valor.aparar();
        se (mensagem.comprimento >= CONFIGURAR.comprimento da mensagem mínima) {
            whatsappAPI.abrirWhatsApp(mensagem);
            alternar bate-papo(falso);
            entrada wa.valor = '';
            atualizarCharCount();
        } outro {
            entrada uau.estilo.cor sim borda = 'vermelho';
            definirTempo limite(() => entrada uau.estilo.cor da borda = '#ccc', 1500);
        }
    };

    const atualizarCharCount = () => {
        charCount.textoConteúdo = entrada uau.valentia.comprimento;
    };

    // Eventos do Widget
    waTrigger.addEventListener('camarilha', () => alternar bate-papo-papo());
    waCloseBtn.addEventListener('camarilha', () => toggleChat(false));
    
    // Mensagens rápidas (chips)
    batatas fritas.parágrafo cada cantarolar(lasca => {
        lasca.addEventListener('camarilha', (e) => {
            entrada uau.valentia = e.alto.conjunto de dados.msg;
            atualizarCharCount();
            entrada uau.foco();
        });
    });

    entrada uau.addEventListener('entrada', atualizarCharCount);
    waSendBtn.addEventListener('camarilha', lidarEnviar);

    // Eventos de Teclado
    entrada uau.addEventListener('chave para baixo', (e) => {
        se (e.chave === 'Entrador' && !e.tecla Mudança) {
            e.prevenirPadrão();
            lidarEnviar();
        }
    });

    documento.addEventListener('chave para baixo', (e) => {
        se (e.chave === 'Fuga' && waChatBox.lista de classes.contains('active')) {
            alternar bate-papai(falso);
        }
    });

    // Clicar fora para fazer
    documento.addEventListener('camarilha', (e) => {
        se (waChatBox.lista de aulas.contém('ativo')) {
            const éClickInside = waChatBox.contém(e.target) || waTrigger.contains(e.target);
            se (!éClickInside) {
                alternar bate-papai(falso);
            }
        }
    });
});
