// DeepSeek智能对话脚本

// 获取DOM元素
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');

// API密钥
const API_KEY = 'sk-ruzmbpljfnifignspnnrudwttlfmeonmdvmjfmlehuggvxld';

// 系统提示词
const systemPrompt = "你是一个学习心理学和脑科学的女大学生，曾经学习地质学，喜欢刷贴吧和小红书。回复字数尽量不超过30个字";

// 默认欢迎消息
const welcomeMessage = `
  <div class="mai-message-header">
    <img src="source/image/2.jpg" class="mai-message-avatar" alt="麦麦头像">
    <span class="mai-name">麦麦</span>
  </div>
  嗨嗨~我是麦麦！有什么想聊的吗？
`;

// 对话历史
let messages = [
  {
    role: "system",
    content: systemPrompt
  },
  {
    role: "assistant",
    content: welcomeMessage
  }
];

// 是否使用本地响应模式（当API调用失败时自动切换到此模式）
const useLocalResponseOnFailure = true;

// 常见问题的本地回复
const localResponses = {
  "你好": "您好！很高兴与您交流。我是本地模拟的AI助手，有什么我可以帮您解答的吗？",
  "介绍一下你自己": "我是基于DeepSeek-V3架构的AI助手的本地模拟版本。我可以回答一些基本问题，帮助您解决问题。",
  "default": "感谢您的提问。我将尽力为您提供帮助和解答。如果您有更具体的问题，请随时告诉我。"
};

// 生成本地响应
function generateLocalResponse(userMessage) {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // 检查是否匹配预设回复
  for (const key in localResponses) {
    if (key !== "default" && lowerCaseMessage.includes(key.toLowerCase())) {
      return localResponses[key];
    }
  }
  
  // 分析用户消息，尝试提供更智能的回复
  if (lowerCaseMessage.includes("什么") || lowerCaseMessage.includes("如何") || lowerCaseMessage.includes("怎么")) {
    return `您询问的是关于"${userMessage.substring(0, 20)}${userMessage.length > 20 ? '...' : ''}"的问题。我会尽力解答，但可能需要更多细节才能提供准确的回答。`;
  }
  
  if (lowerCaseMessage.includes("谢谢") || lowerCaseMessage.includes("感谢")) {
    return "不客气！很高兴能帮到您。如果您还有其他问题，随时可以向我提问。";
  }
  
  // 默认回复
  return localResponses.default;
}

// 自动调整textarea高度
userInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight > 120 ? 120 : this.scrollHeight) + 'px';
});

// 按下Enter发送消息（Shift+Enter换行）
userInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// 点击按钮发送消息
sendBtn.addEventListener('click', sendMessage);

// 新建对话按钮
newChatBtn.addEventListener('click', function() {
  if (confirm('确定要开始新对话吗？这将清除当前的对话记录。')) {
    // 清空聊天界面
    chatMessages.innerHTML = '';
    
    // 重置消息历史
    messages = [
      { role: "system", content: systemPrompt }
    ];
    
    // 显示欢迎消息
    addMessage('ai', welcomeMessage);
    
    // 添加系统消息到历史
    messages.push({ role: "assistant", content: welcomeMessage });
  }
});

// 清空聊天按钮
clearChatBtn.addEventListener('click', function() {
  if (confirm('确定要清空聊天记录吗？')) {
    // 清空聊天界面但保留历史记录以维持上下文
    chatMessages.innerHTML = '';
    
    // 显示提示消息
    addMessage('ai', '聊天记录已清空，但我仍然记得我们之前的对话内容。');
  }
});

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  // 自动聚焦到输入框
  userInput.focus();
  
  // 给初始消息添加复制功能
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const messageEl = this.closest('.message');
      const messageText = messageEl.childNodes[0].textContent.trim();
      
      navigator.clipboard.writeText(messageText)
        .then(() => {
          const status = document.getElementById('chat-status');
          status.textContent = '已复制到剪贴板';
          setTimeout(() => { status.textContent = ''; }, 2000);
        })
        .catch(err => {
          console.error('无法复制文本: ', err);
        });
    });
  });
  
  // 初始化代码高亮
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
});

// 发送消息函数
async function sendMessage() {
  const userMessage = userInput.value.trim();
  
  if (!userMessage) return;
  
  // 显示用户消息
  addMessage('user', userMessage);
  userInput.value = '';
  userInput.style.height = 'auto';
  
  // 显示加载动画
  const loadingMsgId = showLoadingMessage();
  
  // 更新消息历史
  messages.push({
    role: "user",
    content: userMessage
  });
  
  try {
    // 准备请求参数
    const requestData = {
      model: "deepseek-ai/DeepSeek-V3",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.8,
      stream: true
    };
    
    let useLocal = false;
    
    try {
      // 创建一个消息容器用于流式输出
      removeLoadingMessage(loadingMsgId);
      const messageDiv = createMessageDiv('ai', '');
      chatMessages.appendChild(messageDiv);
      
      // 发送请求到SiliconFlow API
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }
      
      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiReply = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // 解码二进制数据
        const chunk = decoder.decode(value, { stream: true });
        
        // 解析返回的SSE数据
        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (!line.trim() || line.includes('[DONE]')) continue;
          
          try {
            // 尝试提取 data: 后面的JSON
            const jsonStr = line.replace(/^data: /, '').trim();
            if (!jsonStr) continue;
            
            const parsedData = JSON.parse(jsonStr);
            if (parsedData.choices && parsedData.choices[0].delta && parsedData.choices[0].delta.content) {
              const content = parsedData.choices[0].delta.content;
              aiReply += content;
              updateMessageContent(messageDiv, aiReply);
            }
          } catch (e) {
            console.error('解析流式数据出错:', e, line);
          }
        }
      }
      
      // 完成后更新消息历史
      messages.push({
        role: "assistant",
        content: aiReply
      });
      
      console.log('流式响应完成');
      
    } catch (apiError) {
      console.error('API调用失败:', apiError);
      useLocal = true;
      
      // 移除加载消息
      removeLoadingMessage(loadingMsgId);
      
      if (useLocalResponseOnFailure) {
        const aiReply = generateLocalResponse(userMessage);
        console.log('使用本地响应模式');
        
        // 显示AI回复
        addMessage('ai', aiReply);
      } else {
        throw apiError; // 如果不使用本地响应，则抛出错误
      }
    }
    
  } catch (error) {
    console.error('发送消息时出错:', error);
    
    // 移除加载消息
    removeLoadingMessage(loadingMsgId);
    
    // 显示错误消息
    addMessage('ai', `很抱歉，发生了一些错误：${error.message}。请稍后再试或检查控制台获取更多信息。`);
  }
}

// 创建消息div但不添加到DOM
function createMessageDiv(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
  
  // 处理内容中的换行符和代码块
  let formattedContent = content
    .replace(/```(\w+)?\n([\s\S]*?)\n```/g, function(match, language, code) {
      language = language || 'plaintext';
      return `<pre><button class="code-copy-btn">复制</button><code class="language-${language}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    })
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
  
  messageDiv.innerHTML = formattedContent;
  
  // 添加消息控制按钮
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'message-controls';
  
  const copyBtn = document.createElement('button');
  copyBtn.className = 'message-control-btn copy-btn';
  copyBtn.title = '复制';
  copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
  copyBtn.addEventListener('click', function() {
    // 创建临时元素用于复制
    const tempElement = document.createElement('div');
    tempElement.innerHTML = content.replace(/```(\w+)?\n([\s\S]*?)\n```/g, '$2');
    const textToCopy = tempElement.textContent || tempElement.innerText;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        // 显示复制成功提示
        const status = document.getElementById('chat-status');
        status.textContent = '已复制到剪贴板';
        setTimeout(() => { status.textContent = ''; }, 2000);
      })
      .catch(err => {
        console.error('无法复制文本: ', err);
      });
  });
  
  controlsDiv.appendChild(copyBtn);
  messageDiv.appendChild(controlsDiv);
  
  const timeSpan = document.createElement('span');
  timeSpan.className = 'message-time';
  timeSpan.textContent = '刚刚';
  
  messageDiv.appendChild(timeSpan);
  
  return messageDiv;
}

// 更新消息内容
function updateMessageContent(messageDiv, content) {
  // 处理内容中的换行符和代码块
  let formattedContent = content
    .replace(/```(\w+)?\n([\s\S]*?)\n```/g, function(match, language, code) {
      language = language || 'plaintext';
      return `<pre><button class="code-copy-btn">复制</button><code class="language-${language}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    })
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
  
  // 保留控件部分
  const controls = messageDiv.querySelector('.message-controls');
  const timeSpan = messageDiv.querySelector('.message-time');
  
  // 更新内容部分
  messageDiv.innerHTML = formattedContent;
  
  // 添加回控件
  if (controls) messageDiv.appendChild(controls);
  if (timeSpan) messageDiv.appendChild(timeSpan);
  
  // 添加代码高亮
  if (typeof hljs !== 'undefined') {
    messageDiv.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
  
  // 添加代码复制功能
  messageDiv.querySelectorAll('.code-copy-btn').forEach((btn) => {
    if (!btn.hasEventListener) {
      btn.hasEventListener = true;
      btn.addEventListener('click', function() {
        const code = this.nextElementSibling.textContent;
        navigator.clipboard.writeText(code)
          .then(() => {
            const originalText = this.textContent;
            this.textContent = '已复制!';
            setTimeout(() => { this.textContent = originalText; }, 2000);
          })
          .catch(err => {
            console.error('无法复制代码: ', err);
          });
      });
    }
  });
  
  // 滚动到底部
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 添加消息到聊天界面
function addMessage(role, content) {
  const messageDiv = createMessageDiv(role, content);
  chatMessages.appendChild(messageDiv);
  
  // 添加代码高亮
  if (typeof hljs !== 'undefined') {
    messageDiv.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
  
  // 添加头像悬停效果
  if (role === 'ai') {
    const avatar = messageDiv.querySelector('.mai-message-avatar');
    if (avatar) {
      avatar.addEventListener('mouseenter', () => {
        avatar.style.transform = 'scale(1.1)';
      });
      avatar.addEventListener('mouseleave', () => {
        avatar.style.transform = 'scale(1)';
      });
    }
  }
  
  // 滚动到底部
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 显示加载动画
function showLoadingMessage() {
  const loadingId = Date.now();
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message ai-message';
  loadingDiv.id = `loading-${loadingId}`;
  
  const loadingDots = document.createElement('div');
  loadingDots.className = 'loading-dots';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    loadingDots.appendChild(dot);
  }
  
  loadingDiv.appendChild(loadingDots);
  chatMessages.appendChild(loadingDiv);
  
  // 滚动到底部
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return loadingId;
}

// 移除加载动画
function removeLoadingMessage(id) {
  const loadingDiv = document.getElementById(`loading-${id}`);
  if (loadingDiv) {
    loadingDiv.remove();
  }
} 