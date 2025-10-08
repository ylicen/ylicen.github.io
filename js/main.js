// =================================================================
// JS IMPLEMENTATION: DESKTOP EFFICIENCY MODEL (State Persistence & Dragging/Resizing)
// =================================================================

const TASKBAR_HEIGHT = 48; // px

// 定义窗口的初始配置。初始位置将在 DOMContentLoaded 时计算居中。
const initialWindowConfigs = [
    { id: 'blog-main', state: 'open', width: 800, height: 700 },
    { id: 'projects-explorer', state: 'closed', width: 700, height: 500 },
    { id: 'about-me', state: 'closed', width: 450, height: 350 },
    { id: 'notepad-app', state: 'closed', width: 500, height: 400 },
    { id: 'calculator-app', state: 'closed', width: 300, height: 450 },
    { id: 'game-2048-app', state: 'closed', width: 480, height: 560 },
    { id: 'game-snake-app', state: 'closed', width: 520, height: 600 }
];

let windows = []; // 运行时窗口数组

// --- 1. 窗口状态管理 (任务回顾与恢复的瞬间性) ---

// 居中计算函数
function centerWindow(element, width, height) {
    const top = (window.innerHeight - height - TASKBAR_HEIGHT) / 2;
    const left = (window.innerWidth - width) / 2;
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
}

function updateTaskbar(windowId, state) {
    const taskItem = document.getElementById(`task-${windowId}-btn`);
    if (taskItem) {
        // 清除所有任务栏项的 active 状态，模拟聚焦
        document.querySelectorAll('.taskbar-item').forEach(item => item.classList.remove('active'));
        
        if (state === 'open') {
            taskItem.classList.add('active');
            bringToFront(document.getElementById(windowId));
        }
    }
}

function toggleWindow(windowId) {
    const win = windows.find(w => w.id === windowId);
    if (!win) return;

    if (win.state === 'open') {
        minimizeWindow(windowId);
    } else {
        // Restore or open
        win.element.classList.remove('hidden');
        win.state = 'open';
        updateTaskbar(windowId, win.state);
        bringToFront(win.element);
    }
}

function minimizeWindow(windowId) {
    const win = windows.find(w => w.id === windowId);
    if (win) {
        win.element.classList.add('hidden');
        win.state = 'minimized';
        updateTaskbar(windowId, win.state);
    }
}

function closeWindow(windowId) {
    const win = windows.find(w => w.id === windowId);
    if (win) {
        win.element.classList.add('hidden');
        win.state = 'closed';
        updateTaskbar(windowId, win.state);
    }
}

function resizeWindow(windowId) {
    const win = windows.find(w => w.id === windowId);
    if (!win) return;
    const el = win.element;

    if (el.dataset.maximized === 'true') {
        // Restore
        el.style.top = win.originalBounds.top + 'px';
        el.style.left = win.originalBounds.left + 'px';
        el.style.width = win.originalBounds.width + 'px';
        el.style.height = win.originalBounds.height + 'px';
        el.dataset.maximized = 'false';
    } else {
        // Maximize and save original bounds
        win.originalBounds = {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
        };
        el.style.top = '0px';
        el.style.left = '0px';
        el.style.width = window.innerWidth + 'px';
        el.style.height = (window.innerHeight - TASKBAR_HEIGHT) + 'px';
        el.dataset.maximized = 'true';
    }
}

// Window Z-index (置顶逻辑)
function bringToFront(element) {
    let maxZ = 10;
    document.querySelectorAll('.window').forEach(win => {
        const z = parseInt(win.style.zIndex) || 10;
        if (z > maxZ) maxZ = z;
    });
    element.style.zIndex = maxZ + 1;
}

// --- 2. 模态管理 (强制性模态解决机制) ---

const modal = document.getElementById('draft-modal');
const desktop = document.getElementById('desktop');
const taskbar = document.getElementById('taskbar');

function showDraftModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    // 禁用所有背景交互
    desktop.style.pointerEvents = 'none';
    taskbar.style.pointerEvents = 'none';
}

function hideDraftModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    // 恢复交互
    desktop.style.pointerEvents = 'auto';
    taskbar.style.pointerEvents = 'auto';
}

// --- 3. Start Menu ---

const startMenu = document.getElementById('start-menu');
function toggleStartMenu() {
    startMenu.classList.toggle('hidden');
}
function hideStartMenu() {
    startMenu.classList.add('hidden');
}
document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && !e.target.closest('#taskbar button')) {
        hideStartMenu();
    }
});


// --- 4. 拖动和调整大小 (Direct Manipulation Causality) ---

const dragHandleClass = 'window-header';

function makeDraggable(element, handle) {
    let pos3 = 0, pos4 = 0;

    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        if (element.dataset.maximized === 'true') return;

        pos3 = e.clientX;
        pos4 = e.clientY;

        // Visual feedback lift
        element.classList.add('scale-[1.005]');
        element.classList.remove('shadow-soft-win');
        element.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        let pos1 = pos3 - e.clientX;
        let pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        // Boundary limits
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight - TASKBAR_HEIGHT));
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    function closeDragElement() {
        element.classList.remove('scale-[1.005]');
        element.classList.add('shadow-soft-win');
        element.style.boxShadow = '';

        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Resizing functionality
function initResize(e, windowId) {
    e.preventDefault();
    const win = windows.find(w => w.id === windowId);
    const element = win.element;
    
    if (element.dataset.maximized === 'true') return;

    let startX = e.clientX;
    let startY = e.clientY;
    let startWidth = element.offsetWidth;
    let startHeight = element.offsetHeight;

    // Visual feedback lift
    element.classList.add('scale-[1.005]');
    element.classList.remove('shadow-soft-win');
    element.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';

    document.onmousemove = (e) => {
        let newWidth = startWidth + (e.clientX - startX);
        let newHeight = startHeight + (e.clientY - startY);

        newWidth = Math.max(300, newWidth);
        newHeight = Math.max(200, newHeight);

        if (element.offsetLeft + newWidth <= window.innerWidth) {
            element.style.width = newWidth + 'px';
        }
        if (element.offsetTop + newHeight <= window.innerHeight - TASKBAR_HEIGHT) {
            element.style.height = newHeight + 'px';
        }
    };
    
    document.onmouseup = () => {
        element.classList.remove('scale-[1.005]');
        element.classList.add('shadow-soft-win');
        element.style.boxShadow = '';

        document.onmousemove = null;
        document.onmouseup = null;
    };
}

// --- 5. System Clock ---
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    document.getElementById('current-time').textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime(); 

// --- 6. Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    windows = initialWindowConfigs.map(config => {
        const element = document.getElementById(config.id);
        // 居中默认窗口
        if (config.id === 'blog-main') {
            centerWindow(element, config.width, config.height);
            element.style.top = element.style.top; // Apply initial calculated position
            element.style.left = element.style.left;
        } else {
            // 对于非默认窗口，使用 CSS 中定义的或配置中的初始位置
            element.style.width = config.width + 'px';
            element.style.height = config.height + 'px';
        }

        // 绑定拖动和置顶事件
        const header = element.querySelector(`.${dragHandleClass}`);
        if (header) makeDraggable(element, header);
        
        element.addEventListener('mousedown', (e) => {
            if (modal.classList.contains('hidden')) {
                bringToFront(element);
            }
        });

        // 隐藏非默认打开的窗口
        if (config.state !== 'open') {
            element.classList.add('hidden');
        }

        return {
            ...config,
            element: element,
            originalBounds: { top: element.offsetTop, left: element.offsetLeft, width: config.width, height: config.height }
        };
    });
    
    // 激活默认打开的窗口的任务栏
    updateTaskbar('blog-main', 'open');

});

// --- Custom Modal Functions ---
function showCustomAlert(message, title = 'Alert') {
    return new Promise((resolve) => {
        const modalOverlay = document.getElementById('custom-modal-overlay');
        const modalTitle = document.getElementById('custom-modal-title');
        const modalMessage = document.getElementById('custom-modal-message');
        const modalButtons = document.getElementById('custom-modal-buttons');

        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        modalButtons.innerHTML = ''; // Clear previous buttons
        
        const okButton = document.createElement('button');
        okButton.className = 'px-4 py-2 text-sm text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-200';
        okButton.textContent = 'OK';
        
        okButton.onclick = () => {
            modalOverlay.classList.add('hidden');
            resolve(true);
        };
        
        modalButtons.appendChild(okButton);
        modalOverlay.classList.remove('hidden');
    });
}

function showCustomConfirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
        const modalOverlay = document.getElementById('custom-modal-overlay');
        const modalTitle = document.getElementById('custom-modal-title');
        const modalMessage = document.getElementById('custom-modal-message');
        const modalButtons = document.getElementById('custom-modal-buttons');

        modalTitle.textContent = title;
        modalMessage.textContent = message;

        modalButtons.innerHTML = ''; // Clear previous buttons

        const confirmButton = document.createElement('button');
        confirmButton.className = 'px-4 py-2 text-sm text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-200';
        confirmButton.textContent = 'Confirm';
        confirmButton.onclick = () => {
            modalOverlay.classList.add('hidden');
            resolve(true);
        };

        const cancelButton = document.createElement('button');
        cancelButton.className = 'px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200';
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => {
            modalOverlay.classList.add('hidden');
            resolve(false);
        };

        modalButtons.appendChild(cancelButton);
        modalButtons.appendChild(confirmButton);
        modalOverlay.classList.remove('hidden');
    });
}