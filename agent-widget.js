(function () {
  var cfg = (window.__AGENT_CONFIG__ || {});
  var sidebar = document.getElementById('agent-sidebar');
  var bubble = document.getElementById('agent-bubble');
  var closeBtn = document.getElementById('agent-close');
  var messagesEl = document.getElementById('agent-messages');
  var inputEl = document.getElementById('agent-input');
  var sendBtn = document.getElementById('agent-send');

  var conversation = [];

  function openSidebar() {
    sidebar.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    inputEl && inputEl.focus();
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
  }

  function appendMessage(role, content) {
    var div = document.createElement('div');
    div.className = 'agent-message ' + (role === 'user' ? 'user' : 'assistant');
    div.textContent = content;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function sendMessage(text) {
    if (!text) return;
    appendMessage('user', text);
    conversation.push({ role: 'user', content: text });

    // 模拟AI助手回复
    setTimeout(function() {
      var reply = generateMockReply(text);
      appendMessage('assistant', reply);
      conversation.push({ role: 'assistant', content: reply });
    }, 500 + Math.random() * 1000); // 模拟网络延迟
  }

  function generateMockReply(userInput) {
    var input = userInput.toLowerCase();
    
    // 生物医学相关回复
    if (input.includes('biomod') || input.includes('生物') || input.includes('医学')) {
      return '我是Biomod网站的AI助手。这个项目专注于生物医学工程和合成生物学研究。您可以通过导航栏查看项目详情、设计方案、实验方法等内容。';
    }
    
    if (input.includes('项目') || input.includes('project')) {
      return '我们的项目涉及创新的生物医学解决方案。您可以点击导航栏中的"项目"页面了解详细信息，包括项目背景、目标和预期成果。';
    }
    
    if (input.includes('设计') || input.includes('design')) {
      return '设计部分展示了我们的技术方案和系统架构。通过科学的设计方法，我们致力于开发高效、安全的生物医学技术。';
    }
    
    if (input.includes('实验') || input.includes('方法') || input.includes('method')) {
      return '我们采用了多种先进的实验方法和技术手段。详细的实验流程和方法学可以在"方法"和"实验记录本"页面中找到。';
    }
    
    if (input.includes('结果') || input.includes('result')) {
      return '项目取得了令人鼓舞的研究结果。具体的数据分析、图表和结论请查看"结果"页面。';
    }
    
    if (input.includes('团队') || input.includes('关于') || input.includes('about')) {
      return '我们是一支充满激情的生物医学研究团队。团队成员的详细介绍和背景信息可以在"关于我们"页面中了解。';
    }
    
    if (input.includes('帮助') || input.includes('help') || input.includes('怎么')) {
      return '我可以帮助您了解网站内容和项目信息。您可以询问关于项目、设计、实验方法、结果等任何相关问题。也可以直接使用导航栏浏览各个页面。';
    }
    
    // 通用回复
    var genericReplies = [
      '感谢您的提问！这是一个关于生物医学工程的创新项目。您可以通过网站导航了解更多详细信息。',
      '很高兴为您服务！如果您对我们的研究项目有任何疑问，请随时询问。',
      '这是一个很好的问题。我们的项目涵盖了生物医学的多个方面，建议您浏览相关页面获取详细信息。',
      '谢谢您的关注！我们致力于推进生物医学技术的发展。有什么具体想了解的吗？'
    ];
    
    return genericReplies[Math.floor(Math.random() * genericReplies.length)];
   }

  bubble && bubble.addEventListener('click', openSidebar);
  closeBtn && closeBtn.addEventListener('click', closeSidebar);
  document.addEventListener('click', function (e) {
    if (!sidebar.classList.contains('open')) return;
    var clickInside = sidebar.contains(e.target) || bubble.contains(e.target);
    if (!clickInside) closeSidebar();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSidebar(); });

  // 允许首页底部输入条直接把消息发送到侧边栏
  window.addEventListener('agent-send-from-dock', function (e) {
    var text = e && e.detail && e.detail.text;
    if (!text) return;
    if (!sidebar.classList.contains('open')) openSidebar();
    sendMessage(text);
  });

  function handleSend() {
    var text = (inputEl && inputEl.value || '').trim();
    if (!text) return;
    inputEl.value = '';
    sendMessage(text);
  }
  sendBtn && sendBtn.addEventListener('click', handleSend);
  inputEl && inputEl.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter') && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });
})();


