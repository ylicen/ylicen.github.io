document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const promptInput = document.getElementById('prompt-input');
  const generateBtn = document.getElementById('generate-btn');
  const imageGallery = document.getElementById('image-gallery');
  const loadingContainer = document.getElementById('loading-container');
  const progressBar = document.getElementById('progress');
  const progressText = document.getElementById('progress-text');
  const cfgSlider = document.getElementById('cfg-scale');
  const cfgValue = document.getElementById('cfg-value');
  const stepsSlider = document.getElementById('steps');
  const stepsValue = document.getElementById('steps-value');
  
  // 更新滑块值显示
  cfgSlider.addEventListener('input', function() {
    cfgValue.textContent = this.value;
  });
  
  stepsSlider.addEventListener('input', function() {
    stepsValue.textContent = this.value;
  });
  
  // 生成按钮点击事件
  generateBtn.addEventListener('click', generateImage);
  
  // 在文本区域按下Enter键时触发生成
  promptInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  });
  
  // 图像生成函数
  function generateImage() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
      showToast('请输入提示词描述', 'error');
      return;
    }
    
    // 获取选项值
    const model = document.getElementById('model-select').value;
    const size = document.getElementById('size-select').value;
    const style = document.getElementById('style-select').value;
    const cfgScale = cfgSlider.value;
    const steps = stepsSlider.value;
    const negativePrompt = document.getElementById('negative-prompt').value;
    
    // 显示加载状态
    loadingContainer.style.display = 'flex';
    
    // 模拟生成进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // 模拟请求完成后
        setTimeout(() => {
          // 隐藏加载状态
          loadingContainer.style.display = 'none';
          
          // 展示生成的图像
          displayGeneratedImage(prompt, model, size, style);
        }, 500);
      }
      
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${Math.round(progress)}%`;
    }, 200);
    
    // 实际项目中这里应该调用AI模型API生成图像
    // 例如: callImageGenerationAPI(prompt, model, size, style, cfgScale, steps, negativePrompt);
  }
  
  // 显示生成的图像
  function displayGeneratedImage(prompt, model, size, style) {
    // 清除占位消息
    const placeholder = imageGallery.querySelector('.placeholder-message');
    if (placeholder) {
      placeholder.remove();
    }
    
    // 创建图像容器
    const imageContainer = document.createElement('div');
    imageContainer.className = 'generated-image-container';
    
    // 在实际项目中，这里应该使用API返回的真实图像
    // 这里使用随机生成的背景色和样式来模拟
    const colors = ['#ffd6e0', '#c3f0ca', '#bae1ff', '#ffe9c5', '#d4c1ec'];
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    
    // 创建图像元素（在实际项目中，应该设置src为API返回的图像URL）
    const imageElement = document.createElement('div');
    imageElement.className = 'image-placeholder';
    imageElement.style.backgroundColor = colors[randomColorIndex];
    imageElement.style.height = '300px';
    imageElement.style.borderRadius = '10px';
    imageElement.style.display = 'flex';
    imageElement.style.alignItems = 'center';
    imageElement.style.justifyContent = 'center';
    
    // 添加加载中图标
    const imageIcon = document.createElement('i');
    imageIcon.className = 'fas fa-image';
    imageIcon.style.fontSize = '3rem';
    imageIcon.style.color = 'rgba(255, 255, 255, 0.7)';
    
    imageElement.appendChild(imageIcon);
    
    // 创建提示词和元数据显示
    const imageInfo = document.createElement('div');
    imageInfo.className = 'image-info';
    
    const promptDisplay = document.createElement('p');
    promptDisplay.className = 'image-prompt';
    promptDisplay.textContent = `"${prompt}"`;
    
    const metadataDisplay = document.createElement('div');
    metadataDisplay.className = 'image-metadata';
    
    // 添加模型信息
    const modelSpan = document.createElement('span');
    modelSpan.innerHTML = `<i class="fas fa-robot"></i> ${getModelName(model)}`;
    
    // 添加下载和分享按钮
    const actionButtons = document.createElement('div');
    actionButtons.className = 'image-actions';
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'image-action-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> 下载';
    downloadBtn.addEventListener('click', () => {
      showToast('图像下载功能尚未实现', 'info');
    });
    
    const shareBtn = document.createElement('button');
    shareBtn.className = 'image-action-btn';
    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> 分享';
    shareBtn.addEventListener('click', () => {
      showToast('图像分享功能尚未实现', 'info');
    });
    
    actionButtons.appendChild(downloadBtn);
    actionButtons.appendChild(shareBtn);
    
    metadataDisplay.appendChild(modelSpan);
    
    imageInfo.appendChild(promptDisplay);
    imageInfo.appendChild(metadataDisplay);
    imageInfo.appendChild(actionButtons);
    
    // 将所有元素添加到容器中
    imageContainer.appendChild(imageElement);
    imageContainer.appendChild(imageInfo);
    
    // 添加到图库中
    imageGallery.innerHTML = '';
    imageGallery.appendChild(imageContainer);
    
    // 显示生成完成提示
    showToast('图像生成完成！', 'success');
    
    // 为生成的图像添加样式
    applyGeneratedImageStyles();
  }
  
  // 获取模型显示名称
  function getModelName(modelValue) {
    const modelMap = {
      'sd-xl': 'Stable Diffusion XL',
      'sd-v2': 'Stable Diffusion 2.1',
      'dall-e-3': 'DALL-E 3',
      'midjourney': 'Midjourney'
    };
    
    return modelMap[modelValue] || modelValue;
  }
  
  // 为生成的图像应用样式
  function applyGeneratedImageStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .generated-image-container {
        margin: 1rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        overflow: hidden;
        background: white;
        transition: transform 0.3s ease;
      }
      
      .generated-image-container:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }
      
      .image-info {
        padding: 1rem;
      }
      
      .image-prompt {
        font-size: 1rem;
        color: var(--text-color);
        margin-bottom: 0.8rem;
        line-height: 1.5;
        font-style: italic;
      }
      
      .image-metadata {
        display: flex;
        justify-content: space-between;
        color: var(--light-text);
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }
      
      .image-actions {
        display: flex;
        gap: 0.5rem;
      }
      
      .image-action-btn {
        background-color: #f0f0f0;
        border: none;
        border-radius: 5px;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.3rem;
        transition: background-color 0.2s;
      }
      
      .image-action-btn:hover {
        background-color: var(--primary-color);
        color: white;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // 创建和显示提示
  function showToast(message, type = 'info') {
    // 如果已有toast，移除之
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // 添加到body
    document.body.appendChild(toast);
    
    // 添加样式
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
      .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s, bottom 0.3s;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      }
      
      .toast-info {
        background-color: #3498db;
      }
      
      .toast-success {
        background-color: #2ecc71;
      }
      
      .toast-error {
        background-color: #e74c3c;
      }
      
      .toast-show {
        opacity: 1;
        bottom: 30px;
      }
    `;
    
    document.head.appendChild(toastStyle);
    
    // 显示toast
    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);
    
    // 3秒后隐藏
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
  
  // 更新导航栏的当前活动项
  function updateNavActive() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage) {
        link.classList.add('nav-active');
      } else {
        link.classList.remove('nav-active');
      }
    });
  }
  
  // 初始化时调用更新导航
  updateNavActive();
}); 