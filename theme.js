// 主题切换功能
document.addEventListener('DOMContentLoaded', function() {
  // 创建主题切换器界面
  createThemeSwitcher();
  
  // 从localStorage加载已保存的主题
  loadSavedTheme();
  
  // 添加主题切换事件监听
  addThemeSwitcherEvents();
});

// 创建主题切换器UI
function createThemeSwitcher() {
  // 创建主题切换器容器
  const themeSwitcher = document.createElement('div');
  themeSwitcher.className = 'theme-switcher';
  
  // 添加三个主题选项
  const themes = [
    { name: 'ink-breeze', label: '墨韵清风' },
    { name: 'neon-nocturne', label: '霓虹夜曲' },
    { name: 'retro-gold', label: '岁月流金' }
  ];
  
  themes.forEach(theme => {
    const option = document.createElement('div');
    option.className = `theme-option ${theme.name}`;
    option.setAttribute('data-theme', theme.name);
    
    const label = document.createElement('span');
    label.textContent = theme.label;
    option.appendChild(label);
    
    themeSwitcher.appendChild(option);
  });
  
  // 将主题切换器插入导航栏旁边
  const navElement = document.querySelector('nav');
  if (navElement) {
    navElement.parentNode.insertBefore(themeSwitcher, navElement.nextSibling);
  } else {
    document.body.appendChild(themeSwitcher);
  }
  
  // 设置主题切换器位置
  adjustThemeSwitcherPosition();
  
  // 窗口大小改变时重新调整位置
  window.addEventListener('resize', adjustThemeSwitcherPosition);
}

// 调整主题切换器位置
function adjustThemeSwitcherPosition() {
  const themeSwitcher = document.querySelector('.theme-switcher');
  const navElement = document.querySelector('nav');
  
  if (themeSwitcher && navElement) {
    // 根据屏幕宽度调整位置
    if (window.innerWidth <= 768) {
      // 移动设备上置于导航栏右侧
      themeSwitcher.style.top = '0.7rem';
      themeSwitcher.style.right = '0.8rem';
    } else {
      // 桌面设备上置于导航栏旁边
      themeSwitcher.style.top = '0.5rem';
      themeSwitcher.style.right = '1rem';
    }
  }
}

// 加载保存的主题设置
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('ylicen-blog-theme') || 'ink-breeze';
  applyTheme(savedTheme);
  
  // 设置对应选项为激活状态
  const activeOption = document.querySelector(`.theme-option[data-theme="${savedTheme}"]`);
  if (activeOption) {
    activeOption.classList.add('active');
  }
}

// 添加主题切换点击事件
function addThemeSwitcherEvents() {
  const themeOptions = document.querySelectorAll('.theme-option');
  
  themeOptions.forEach(option => {
    option.addEventListener('click', function() {
      const theme = this.getAttribute('data-theme');
      
      // 移除所有选项的激活状态
      themeOptions.forEach(opt => opt.classList.remove('active'));
      
      // 设置当前选项为激活状态
      this.classList.add('active');
      
      // 应用主题
      applyTheme(theme);
      
      // 保存设置到localStorage
      localStorage.setItem('ylicen-blog-theme', theme);
      
      // 添加切换动画
      addThemeSwitchAnimation();
      
      // 显示主题已切换提示
      showThemeChangedNotification(theme);
    });
  });
}

// 应用主题到页面
function applyTheme(theme) {
  // 移除已有的主题类
  document.documentElement.classList.remove(
    'theme-ink-breeze',
    'theme-neon-nocturne',
    'theme-retro-gold'
  );
  
  // 添加新主题类
  document.documentElement.classList.add(`theme-${theme}`);
}

// 添加主题切换时的过渡动画
function addThemeSwitchAnimation() {
  // 创建遮罩动画元素
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  overlay.style.zIndex = '9999';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.3s ease';
  
  document.body.appendChild(overlay);
  
  // 触发动画
  setTimeout(() => {
    overlay.style.opacity = '0.5';
    
    setTimeout(() => {
      overlay.style.opacity = '0';
      
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    }, 300);
  }, 10);
}

// 显示主题已切换提示
function showThemeChangedNotification(theme) {
  // 检查页面是否有toast提示功能
  if (typeof showToast === 'function') {
    // 找到对应的主题名称
    const themeLabels = {
      'ink-breeze': '墨韵清风',
      'neon-nocturne': '霓虹夜曲',
      'retro-gold': '岁月流金'
    };
    
    const themeName = themeLabels[theme] || theme;
    showToast(`主题已切换为: ${themeName}`, 'info');
  } else {
    // 创建简单的通知
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '8px 16px';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '10000';
    notification.style.fontSize = '14px';
    notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    notification.style.transition = 'opacity 0.3s ease';
    
    // 找到对应的主题名称
    const themeLabels = {
      'ink-breeze': '墨韵清风',
      'neon-nocturne': '霓虹夜曲',
      'retro-gold': '岁月流金'
    };
    
    const themeName = themeLabels[theme] || theme;
    notification.textContent = `主题已切换为: ${themeName}`;
    
    document.body.appendChild(notification);
    
    // 3秒后自动消失
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2700);
  }
} 