// 全局变量
let timer;
let isRunning = false;
let isWorkTime = true;
let timeLeft = 25 * 60; // 默认25分钟工作时间
let tasks = [];
let stats = {
    today: 0,
    week: 0,
    total: 0,
    history: []
};

// DOM元素
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const newTaskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const alertSound = document.getElementById('alert-sound');
const themeBtns = document.querySelectorAll('.theme-btn');

// 初始化
function init() {
    loadData();
    loadTheme();
    updateTimerDisplay();
    renderTaskList();
    setupEventListeners();
    updateStatsDisplay();
}

// 加载本地数据
function loadData() {
    const savedTasks = localStorage.getItem('pomodoroTasks');
    const savedStats = localStorage.getItem('pomodoroStats');
    
    if (savedTasks) tasks = JSON.parse(savedTasks);
    if (savedStats) stats = JSON.parse(savedStats);
}

// 加载主题
function loadTheme() {
    const savedTheme = localStorage.getItem('pomodoroTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('light-theme'); // 默认主题
    }
}

// 保存数据到本地存储
function saveData() {
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
    localStorage.setItem('pomodoroStats', JSON.stringify(stats));
}

// 更新计时器显示
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
}

// 开始计时器
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            alertSound.play();
            isRunning = false;
            
            if (isWorkTime) {
                // 完成一个番茄钟
                stats.today++;
                stats.week++;
                stats.total++;
                stats.history.push(new Date().toISOString());
                saveData();
                
                // 切换到休息时间
                isWorkTime = false;
                timeLeft = parseInt(breakTimeInput.value) * 60;
            } else {
                // 休息结束，切换回工作时间
                isWorkTime = true;
                timeLeft = parseInt(workTimeInput.value) * 60;
            }
            
            updateTimerDisplay();
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }, 1000);
}

// 暂停计时器
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// 重置计时器
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkTime = true;
    timeLeft = parseInt(workTimeInput.value) * 60;
    updateTimerDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// 渲染任务列表
function renderTaskList() {
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="delete-btn" data-index="${index}">删除</button>
        `;
        taskList.appendChild(li);
    });
}

// 添加新任务
function addTask() {
    const text = newTaskInput.value.trim();
    if (text) {
        tasks.push({ text, completed: false });
        newTaskInput.value = '';
        saveData();
        renderTaskList();
    }
}

// 更新统计显示
function updateStatsDisplay() {
    if (document.getElementById('today-count')) {
        document.getElementById('today-count').textContent = stats.today;
        document.getElementById('week-count').textContent = stats.week;
        document.getElementById('total-count').textContent = stats.total;
        
        // 渲染图表
        renderChart();
    }
}

// 渲染统计图表
function renderChart() {
    const ctx = document.getElementById('productivity-chart');
    if (!ctx) return;
    
    // 按周分组统计数据
    const weeklyData = groupDataByWeek();
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeklyData.labels,
            datasets: [{
                label: '每周完成的番茄钟',
                data: weeklyData.data,
                backgroundColor: 'rgba(66, 133, 244, 0.7)',
                borderColor: 'rgba(66, 133, 244, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 按周分组数据
function groupDataByWeek() {
    // 实现按周分组逻辑
    // 简化版：返回示例数据
    return {
        labels: ['本周', '上周', '上上周'],
        data: [stats.week, Math.floor(stats.week * 0.8), Math.floor(stats.week * 0.6)]
    };
}

// 设置事件监听器
function setupEventListeners() {
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            tasks.splice(index, 1);
            saveData();
            renderTaskList();
        }
    });
    
    // 主题切换
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.classList.contains('light') ? 'light-theme' : 'dark-theme';
            applyTheme(theme);
            localStorage.setItem('pomodoroTheme', theme);
        });
    });
}

// 应用主题
function applyTheme(theme) {
    document.body.className = theme;
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if ((theme === 'light-theme' && btn.classList.contains('light')) ||
            (theme === 'dark-theme' && btn.classList.contains('dark'))) {
            btn.classList.add('active');
        }
    });
    
    // 设置变化监听
    workTimeInput.addEventListener('change', () => {
        if (!isRunning && isWorkTime) {
            timeLeft = parseInt(workTimeInput.value) * 60;
            updateTimerDisplay();
        }
    });
    
    breakTimeInput.addEventListener('change', () => {
        if (!isRunning && !isWorkTime) {
            timeLeft = parseInt(breakTimeInput.value) * 60;
            updateTimerDisplay();
        }
    });
}

// 初始化应用
document.addEventListener('DOMContentLoaded', init);
// 注册 Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}