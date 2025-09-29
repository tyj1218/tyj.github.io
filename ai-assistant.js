// AI助手功能
class AIAssistant {
  constructor(appId) {
    this.appId = appId;
    this.isOpen = false;
    this.messages = [];
    this.isLoading = false;
    this.init();
  }

  init() {
    this.createSidebar();
    this.bindEvents();
  }

  createSidebar() {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'ai-overlay';
    overlay.id = 'ai-overlay';
    document.body.appendChild(overlay);

    // 创建侧边栏
    const sidebar = document.createElement('div');
    sidebar.className = 'ai-sidebar';
    sidebar.id = 'ai-sidebar';
    sidebar.innerHTML = `
      <div class="ai-sidebar-header">
        <h3>AI 助手</h3>
        <button class="ai-close-btn" id="ai-close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="ai-sidebar-content">
        <div class="ai-messages" id="ai-messages">
          <div class="ai-message assistant">
            您好！我是您的AI助手，有什么可以帮助您的吗？
          </div>
        </div>
        <div class="ai-input-container">
          <div class="ai-input-wrapper">
            <textarea class="ai-input" id="ai-input" placeholder="输入您的问题..." rows="1"></textarea>
            <button class="ai-send-btn" id="ai-send-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(sidebar);
  }

  bindEvents() {
    // 关闭按钮
    document.getElementById('ai-close-btn').addEventListener('click', () => {
      this.closeSidebar();
    });

    // 遮罩层点击关闭
    document.getElementById('ai-overlay').addEventListener('click', () => {
      this.closeSidebar();
    });

    // 发送按钮
    document.getElementById('ai-send-btn').addEventListener('click', () => {
      this.sendMessage();
    });

    // 输入框回车发送
    document.getElementById('ai-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // 自动调整输入框高度
    document.getElementById('ai-input').addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
    });
  }

  openSidebar() {
    const sidebar = document.getElementById('ai-sidebar');
    const overlay = document.getElementById('ai-overlay');
    
    sidebar.classList.add('open');
    overlay.classList.add('show');
    this.isOpen = true;

    // 聚焦到输入框
    setTimeout(() => {
      document.getElementById('ai-input').focus();
    }, 300);
  }

  closeSidebar() {
    const sidebar = document.getElementById('ai-sidebar');
    const overlay = document.getElementById('ai-overlay');
    
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    this.isOpen = false;
  }

  async sendMessage() {
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    
    if (!message || this.isLoading) return;

    // 添加用户消息
    this.addMessage(message, 'user');
    input.value = '';
    input.style.height = 'auto';

    // 显示加载状态
    this.setLoading(true);

    try {
      // 调用AI API
      const response = await this.callAI(message);
      this.addMessage(response, 'assistant');
    } catch (error) {
      console.error('AI请求失败:', error);
      this.addMessage('抱歉，我现在无法回答您的问题。请稍后再试。', 'assistant');
    } finally {
      this.setLoading(false);
    }
  }

  addMessage(content, type) {
    const messagesContainer = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;
    messageDiv.textContent = content;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.messages.push({ content, type, timestamp: Date.now() });
  }

  setLoading(loading) {
    this.isLoading = loading;
    const sendBtn = document.getElementById('ai-send-btn');
    
    if (loading) {
      sendBtn.innerHTML = '<div class="ai-loading"></div>';
      sendBtn.disabled = true;
    } else {
      sendBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      `;
      sendBtn.disabled = false;
    }
  }

  async callAI(message) {
    // 使用您提供的AI应用ID调用AI服务
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.appId}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的生物分子设计助手，专门帮助用户解答关于BIOMOD项目、生物分子设计、实验方法等相关问题。请用中文回答。'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`AI服务请求失败: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '抱歉，我无法理解您的问题。';
    } catch (error) {
      console.error('AI请求失败:', error);
      // 如果API调用失败，返回一个模拟回复
      return this.getMockResponse(message);
    }
  }

  getMockResponse(message) {
    // 模拟AI回复，用于演示
    const responses = [
      '这是一个很好的问题！让我为您详细解答...',
      '根据您的描述，我建议您可以考虑以下几个方面...',
      '这个问题涉及到生物分子设计的核心概念，让我来解释一下...',
      '在BIOMOD项目中，这类问题通常可以通过以下方法解决...',
      '感谢您的提问！这是一个很有趣的研究方向...'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// AI气泡组件
class AIBubble {
  constructor(appId) {
    this.appId = appId;
    this.assistant = new AIAssistant(appId);
    this.createBubble();
  }

  createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'ai-assistant';
    bubble.innerHTML = `
      <button class="ai-bubble" id="ai-bubble">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </button>
    `;
    document.body.appendChild(bubble);

    // 绑定点击事件
    document.getElementById('ai-bubble').addEventListener('click', () => {
      this.assistant.openSidebar();
    });
  }
}

// 首页AI输入栏组件
class AIHomeInput {
  constructor(appId) {
    this.appId = appId;
    this.assistant = new AIAssistant(appId);
    this.createHomeInput();
  }

  createHomeInput() {
    const homeInput = document.createElement('div');
    homeInput.className = 'ai-home-input';
    homeInput.innerHTML = `
      <div class="container">
        <div class="ai-home-input-wrapper">
          <input type="text" id="ai-home-input" placeholder="向AI助手提问..." />
          <button class="ai-home-send-btn" id="ai-home-send-btn">发送</button>
        </div>
      </div>
    `;
    document.body.appendChild(homeInput);

    // 绑定事件
    document.getElementById('ai-home-send-btn').addEventListener('click', () => {
      this.sendMessage();
    });

    document.getElementById('ai-home-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  async sendMessage() {
    const input = document.getElementById('ai-home-input');
    const message = input.value.trim();
    
    if (!message) return;

    // 打开侧边栏并发送消息
    this.assistant.openSidebar();
    
    // 添加用户消息
    this.assistant.addMessage(message, 'user');
    input.value = '';

    // 显示加载状态
    this.assistant.setLoading(true);

    try {
      // 调用AI API
      const response = await this.assistant.callAI(message);
      this.assistant.addMessage(response, 'assistant');
    } catch (error) {
      console.error('AI请求失败:', error);
      this.assistant.addMessage('抱歉，我现在无法回答您的问题。请稍后再试。', 'assistant');
    } finally {
      this.assistant.setLoading(false);
    }
  }
}

// 初始化AI助手
function initAIAssistant(appId, type = 'bubble') {
  if (type === 'home') {
    return new AIHomeInput(appId);
  } else {
    return new AIBubble(appId);
  }
}

// 导出到全局
window.initAIAssistant = initAIAssistant;
