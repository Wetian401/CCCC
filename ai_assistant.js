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
        bottom: 40px;
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
            <div class="ai-msg">你好！我是诗词意象与比德传统的专属 AI 助手。关于梅、兰、竹的文化内涵，或者如何理解"托物言志"，随时问我吧。</div>
        </div>
        <div id="ai-chat-input-area">
            <input type="text" id="ai-chat-input" placeholder="输入你想探讨的话题...">
            <button id="ai-chat-send">发送</button>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', chatHTML);

// 3. 逻辑绑定与配置
const floatBtn = document.getElementById('ai-float-btn');
const chatWindow = document.getElementById('ai-chat-window');
const closeBtn = document.getElementById('ai-chat-close');
const sendBtn = document.getElementById('ai-chat-send');
const inputField = document.getElementById('ai-chat-input');
const messagesArea = document.getElementById('ai-chat-messages');

// === 窗口开关逻辑 ===
floatBtn.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
    floatBtn.style.display = 'none'; // 隐藏悬浮球，防止遮挡
    inputField.focus();
});

closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
    floatBtn.style.display = 'flex'; // 恢复悬浮球
});

// === DeepSeek API 配置 ===
const API_KEY = "sk-debfa3635b214955ba5f0863e95e3ddf"; // 你提供的 API Key

// 设定 AI 的系统身份，融入了你的网页内容，确保它答题专业
const SYSTEM_PROMPT = `你是一个专门辅助学生学习《诗词中的植物人格图谱》的专属AI助手。
你的知识库内容如下：
1. 梅：林逋的隐逸之姿（疏影横斜水清浅）与陆游的志士之魂（零落成泥碾作尘）。
2. 兰：屈原定义的“高洁自持”（纫秋兰以为佩），不与世俗同流合污。
3. 竹：郑板桥的坚韧担当（咬定青山）与王维的心灵安顿（独坐幽篁）。
4. 比德传统：将自然特性与道德情操相融，“智者乐水，仁者乐山”，托物言志。
请根据上述内容回答学生的问题。语言要亲切、优美、富有文学气息。如果用户问无关内容，请温柔地引导回诗词和植物话题。`;

// === 核心：真实的发送与 API 调用逻辑 ===
async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return; // 输入为空直接返回

    // 1. 显示用户消息
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'user-msg';
    userMsgDiv.textContent = text;
    messagesArea.appendChild(userMsgDiv);

    // 2. 清空输入框并滚动到底部
    inputField.value = '';
    messagesArea.scrollTop = messagesArea.scrollHeight;

    // 3. 显示 AI 正在输入的状态
    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.className = 'ai-msg';
    aiMsgDiv.innerHTML = '<span style="color:#999; font-size: 0.9em;">AI 正在研墨思考中...</span>';
    messagesArea.appendChild(aiMsgDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    // 4. 调用 DeepSeek API
    try {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat", // 使用 DeepSeek 的对话模型
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: text }
                ],
                temperature: 0.7 // 稍微增加一点文学创造性
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP 错误! 状态码: ${response.status}`);
        }

        const data = await response.json();
        const aiReply = data.choices[0].message.content;

        // 5. 替换掉“思考中”的状态，显示真实回答
        aiMsgDiv.innerHTML = '';
        aiMsgDiv.textContent = aiReply;

    } catch (error) {
        console.error("API 调用失败:", error);
        aiMsgDiv.innerHTML = '';
        aiMsgDiv.textContent = "抱歉，由于山高水远，网络似乎断开了。请稍后再试。";
    }

    // 6. 回复完毕后再次滚动到底部
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// 绑定点击发送按钮事件
sendBtn.addEventListener('click', sendMessage);

// 绑定在输入框内按“回车键”发送事件
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});