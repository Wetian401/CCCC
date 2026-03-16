// ai_assistant.js

// 1. 注入 CSS 样式
const style = document.createElement('style');
style.innerHTML = `
    /* 悬浮球样式 */
    #ai-float-btn {
        position: fixed;
        bottom: 40px;
        right: 40px;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background-color: #fff;
        border: 3px solid var(--accent-color, #8a3b3b);
        color: white;
        text-align: center;
        line-height: 90px;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(138, 59, 59, 0.25);
        z-index: 9999;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        overflow: hidden;
    }
    #ai-float-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(138, 59, 59, 0.4);
    }
    
    /* 对话框样式 */
    #ai-chat-window {
        position: fixed;
        bottom: 40px; /* 降低底部距离 */
        right: 40px;
        width: 380px;
        height: 550px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        display: none;
        flex-direction: column;
        z-index: 9998;
        overflow: hidden;
        border: 1px solid rgba(138, 59, 59, 0.1);
        font-family: inherit;
        animation: chatFadeIn 0.3s ease-out;
    }

    @keyframes chatFadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    #ai-chat-header {
        background-color: var(--accent-color, #8a3b3b);
        color: white;
        padding: 18px 20px;
        font-size: 1.15em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        letter-spacing: 1px;
    }
    #ai-chat-close {
        cursor: pointer;
        font-size: 1.2em;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    #ai-chat-close:hover {
        opacity: 1;
    }
    #ai-chat-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background: #fdfaf5;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    /* 滚动条美化 */
    #ai-chat-messages::-webkit-scrollbar {
        width: 6px;
    }
    #ai-chat-messages::-webkit-scrollbar-thumb {
        background: rgba(138, 59, 59, 0.2);
        border-radius: 3px;
    }

    .ai-msg, .user-msg {
        max-width: 85%;
        padding: 12px 16px;
        border-radius: 10px;
        font-size: 1em;
        line-height: 1.6;
        word-wrap: break-word;
    }
    .ai-msg {
        background: white;
        color: #333;
        align-self: flex-start;
        border: 1px solid rgba(138, 59, 59, 0.1);
        border-top-left-radius: 2px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }
    .user-msg {
        background: rgba(138, 59, 59, 0.1);
        color: var(--accent-color, #8a3b3b);
        align-self: flex-end;
        border-top-right-radius: 2px;
    }
    #ai-chat-input-area {
        display: flex;
        padding: 15px;
        background: white;
        border-top: 1px solid rgba(138, 59, 59, 0.1);
        gap: 10px;
    }
    #ai-chat-input {
        flex: 1;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
        font-family: inherit;
        font-size: 1em;
        transition: border-color 0.3s;
    }
    #ai-chat-input:focus {
        border-color: var(--accent-color, #8a3b3b);
    }
    #ai-chat-send {
        background: var(--accent-color, #8a3b3b);
        color: white;
        border: none;
        border-radius: 20px;
        padding: 0 20px;
        font-family: inherit;
        font-size: 1em;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    #ai-chat-send:hover {
        background: #6b2c2c;
    }

    /* ================= 手机端自适应缩放调整 ================= */
    @media (max-width: 768px) {
        #ai-float-btn {
            width: 70px;
            height: 70px;
            bottom: 20px;
            right: 20px;
        }
        #ai-chat-window {
            width: 90vw;       /* 手机端占屏幕宽度的 90% */
            height: 70vh;      /* 手机端占屏幕高度的 70% */
            bottom: 5vh;       /* 居中偏下显示 */
            right: 5vw;        /* 左右居中对齐 */
        }
    }
`;
document.head.appendChild(style);

// 2. 注入 HTML 结构
const chatHTML = `
    <div id="ai-float-btn" title="唤醒 AI 助手">
        <img src="花草/古风小人.png" alt="AI助手" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">
    </div>
    <div id="ai-chat-window">
        <div id="ai-chat-header">
            <span>问语草木 · AI助手</span>
            <span id="ai-chat-close" title="关闭">✖</span>
        </div>
        <div id="ai-chat-messages">
            <div class="ai-msg">你好！我是诗词意象与比德传统的专属 AI 助手。关于梅、兰、竹、菊的文化内涵，或者如何理解"托物言志"，随时问我吧。</div>
        </div>
        <div id="ai-chat-input-area">
            <input type="text" id="ai-chat-input" placeholder="输入你想探讨的话题...">
            <button id="ai-chat-send">发送</button>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', chatHTML);

// 3. 逻辑绑定与 DeepSeek API 调用
const floatBtn = document.getElementById('ai-float-btn');
const chatWindow = document.getElementById('ai-chat-window');
const closeBtn = document.getElementById('ai-chat-close');
const sendBtn = document.getElementById('ai-chat-send');
const inputField = document.getElementById('ai-chat-input');
const messagesArea = document.getElementById('ai-chat-messages');

// === 核心修复：点击打开时隐藏悬浮球，点击关闭时恢复悬浮球 ===
floatBtn.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
    floatBtn.style.display = 'none'; // 隐藏悬浮球，防止遮挡
    inputField.focus();
});
closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
    floatBtn.style.display = 'flex'; // 恢复悬浮球
});
