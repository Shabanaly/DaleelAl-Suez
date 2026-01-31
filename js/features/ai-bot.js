/**
 * Floating AI Assistant
 * Simple chat bot interface
 */

export function initAIBot() {
    // 1. Create Floating Button
    const btn = document.createElement('button');
    btn.className = 'ai-fab';
    btn.innerHTML = '<i data-lucide="bot"></i>';
    btn.onclick = toggleAIChat;
    document.body.appendChild(btn);

    // 2. Create Chat Modal (Hidden)
    const modal = document.createElement('div');
    modal.id = 'ai-chat-modal';
    modal.className = 'ai-modal hidden';
    modal.innerHTML = `
        <div class="ai-header">
            <span>🤖 مساعد السويس</span>
            <button onclick="toggleAIChat()">✕</button>
        </div>
        <div class="ai-body" id="ai-messages">
            <div class="ai-msg bot">أهلاً! أنا دليلك الذكي، بتدور على إيه؟</div>
        </div>
        <div class="ai-input-area">
            <input type="text" id="ai-input" placeholder="اكتب سؤالك...">
            <button onclick="sendAIMessage()">Send</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Init Icons
    if(window.lucide) lucide.createIcons();
    
    // Bind Enter Key
    setTimeout(() => {
        const input = document.getElementById('ai-input');
        if(input) input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') sendAIMessage();
        });
    }, 500);
}

window.toggleAIChat = function() {
    const modal = document.getElementById('ai-chat-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        document.getElementById('ai-input').focus();
    }
}

window.sendAIMessage = function() {
    const input = document.getElementById('ai-input');
    const msgs = document.getElementById('ai-messages');
    const txt = input.value.trim();
    if (!txt) return;

    // User Msg
    msgs.innerHTML += `<div class="ai-msg user">${txt}</div>`;
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight;

    // Simulate Response
    setTimeout(() => {
        let reply = "أنا لسه بوبي بتعلم 🐶، بس ممكن تجرب البحث!";
        if (txt.includes('مطعم') || txt.includes('أكل')) reply = "جربت تشوف قسم المطاعم؟ فيه حاجات جامدة!";
        if (txt.includes('كافيه') || txt.includes('قهوة')) reply = "عندنا كافيهات رايقة كتير عالبحر.";
        
        msgs.innerHTML += `<div class="ai-msg bot">${reply}</div>`;
        msgs.scrollTop = msgs.scrollHeight;
    }, 1000);
}
