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
        bottom: 110px;
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

// 切换窗口显示
floatBtn.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    if (chatWindow.style.display === 'flex') {
        inputField.focus();
    }
});
closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

// 简易 Markdown 转 HTML
function simpleMarkdown(text) {
    // 代码块
    text = text.replace(/```([\s\S]*?)```/g, '<pre style="background:#f5f0ea;padding:10px;border-radius:6px;overflow-x:auto;font-size:0.9em;"><code>$1</code></pre>');
    // 行内代码
    text = text.replace(/`([^`]+)`/g, '<code style="background:#f5f0ea;padding:2px 5px;border-radius:3px;font-size:0.9em;">$1</code>');
    // 加粗
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // 标题 (### ## #)
    text = text.replace(/^### (.+)$/gm, '<strong style="display:block;margin:10px 0 5px;font-size:1.05em;">$1</strong>');
    text = text.replace(/^## (.+)$/gm, '<strong style="display:block;margin:12px 0 5px;font-size:1.1em;">$1</strong>');
    text = text.replace(/^# (.+)$/gm, '<strong style="display:block;margin:14px 0 6px;font-size:1.15em;">$1</strong>');
    // 无序列表
    text = text.replace(/^[\-\*] (.+)$/gm, '<div style="padding-left:1em;">• $1</div>');
    // 有序列表
    text = text.replace(/^(\d+)\. (.+)$/gm, '<div style="padding-left:1em;">$1. $2</div>');
    // 段落：连续两个换行变为分段
    text = text.replace(/\n\n+/g, '</p><p style="margin:8px 0;">');
    // 单个换行变为 <br>
    text = text.replace(/\n/g, '<br>');
    // 包裹在 p 标签中
    text = '<p style="margin:0;">' + text + '</p>';
    return text;
}

// 添加消息到面板
function appendMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.className = isUser ? 'user-msg' : 'ai-msg';

    if (isUser) {
        msgDiv.textContent = text;
    } else {
        msgDiv.innerHTML = simpleMarkdown(text);
    }

    messagesArea.appendChild(msgDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// 发送消息处理
async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    appendMessage(text, true);
    inputField.value = '';

    // 显示加载中
    const loadingId = 'loading-' + Date.now();
    const loadDiv = document.createElement('div');
    loadDiv.className = 'ai-msg';
    loadDiv.id = loadingId;
    loadDiv.innerHTML = '<span style="color: #999;">正在思考，请稍候...</span>';
    messagesArea.appendChild(loadDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    try {
        const reply = await callDeepSeekAPI(text);
        document.getElementById(loadingId).remove();
        appendMessage(reply, false);
    } catch (error) {
        document.getElementById(loadingId).remove();
        appendMessage("抱歉，API 连接出现问题，请检查网络或后端的 API 配置是否正确。", false);
        console.error("AI 助手报错:", error);
    }
}

sendBtn.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// ======================================================================
//  请在此处填入DeepSeek API 配置
// ======================================================================

const DEEPSEEK_API_KEY = 'sk-debfa3635b214955ba5f0863e95e3ddf'; // 替换为 DeepSeek API Key (例如 'sk-abcd1234...')
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'; // DeepSeek 官方调用接口

// ======================================================================

async function callDeepSeekAPI(userMessage) {
    // 防呆检测，若未配置则直接返回提示
    if (DEEPSEEK_API_KEY === 'YOUR_API_KEY_HERE' || !DEEPSEEK_API_KEY) {
        return "⚠️ **提示**：目前尚未配置 DeepSeek API Key。<br><br>请用编辑器打开 `ai_assistant.js` 文件，在第 170 行左右找到 `DEEPSEEK_API_KEY` 变量，填入您的真实密钥即可启用 AI 问答功能。";
    }

    const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek-chat", // 使用 deepseek-chat 或 deepseek-reasoner
            messages: [
                {
                    "role": "system",
                    "content": "你是一个知识渊博的 AI 助手，擅长中国古典诗词、植物意象及比德传统相关的知识。请用正常语气回答，条理清晰，适当分段，重点突出。"
                },
                {
                    "role": "user",
                    "content": userMessage
                }
            ],
            temperature: 0.6
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP API 错误 ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
