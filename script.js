// 便签应用核心类
class NoteApp {
    constructor() {
        this.notes = this.loadNotes();
        this.currentNote = null;
        this.currentPage = 'write';
        this.fontSize = localStorage.getItem('fontSize') || 'medium';
        this.modalAction = null;
        
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.applyFontSize();
        this.loadNotesToList();
        this.loadDraft();
        
        // 设置初始焦点
        setTimeout(() => {
            const textarea = document.getElementById('note-input');
            if (textarea) {
                textarea.focus();
            }
        }, 300);
    }

    // 绑定事件监听器
    bindEvents() {
        // 保存按钮
        document.getElementById('btn-save').addEventListener('click', () => this.saveNote());
        
        // 历史记录按钮
        document.getElementById('btn-history').addEventListener('click', () => this.showHistory());
        
        // 返回按钮
        document.getElementById('btn-back-to-write').addEventListener('click', () => this.showWrite());
        document.getElementById('btn-back-to-history').addEventListener('click', () => this.showHistory());
        
        // 设置按钮
        document.getElementById('btn-settings').addEventListener('click', () => this.showSettings());
        
        // 搜索功能
        document.getElementById('search-input').addEventListener('input', (e) => this.searchNotes(e.target.value));
        
        // 字体大小设置
        const fontSizeSelect = document.getElementById('font-size-select');
        fontSizeSelect.value = this.fontSize;
        fontSizeSelect.addEventListener('change', (e) => this.changeFontSize(e.target.value));
        
        // 导出功能
        document.getElementById('export-btn').addEventListener('click', () => this.exportNotes());
        
        // 清空功能
        document.getElementById('clear-btn').addEventListener('click', () => this.confirmClearNotes());
        
        // 模态框事件
        document.getElementById('modal-cancel').addEventListener('click', () => this.hideModal());
        document.getElementById('modal-confirm').addEventListener('click', () => this.executeModalAction());
        document.getElementById('confirm-modal').addEventListener('click', (e) => {
            if (e.target.id === 'confirm-modal') this.hideModal();
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // 自动保存草稿
        const textarea = document.getElementById('note-input');
        let saveTimeout;
        textarea.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => this.saveDraft(), 1000);
        });
        
        // 触摸手势支持
        this.initTouchGestures();
    }

    // 初始化触摸手势
    initTouchGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // 水平滑动优先
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) { // 最小滑动距离
                    if (diffX > 0) {
                        // 向左滑动
                        this.handleSwipeLeft();
                    } else {
                        // 向右滑动
                        this.handleSwipeRight();
                    }
                }
            }
            
            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    // 处理左滑
    handleSwipeLeft() {
        if (this.currentPage === 'write') {
            this.showHistory();
        } else if (this.currentPage === 'history') {
            this.showSettings();
        }
    }

    // 处理右滑
    handleSwipeRight() {
        if (this.currentPage === 'settings') {
            this.showHistory();
        } else if (this.currentPage === 'history') {
            this.showWrite();
        }
    }

    // 处理键盘快捷键
    handleKeyboard(e) {
        // Ctrl/Cmd + S 保存
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveNote();
        }
        
        // Ctrl/Cmd + H 历史记录
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            this.showHistory();
        }
        
        // ESC 返回
        if (e.key === 'Escape') {
            if (this.currentPage === 'history') {
                this.showWrite();
            } else if (this.currentPage === 'settings') {
                this.showHistory();
            }
        }
    }

    // 保存便签
    saveNote() {
        const content = document.getElementById('note-input').value.trim();
        if (!content) {
            this.showToast('请输入内容');
            return;
        }

        const note = {
            id: this.currentNote ? this.currentNote.id : Date.now(),
            content: content,
            timestamp: Date.now(),
            createdAt: this.currentNote ? this.currentNote.createdAt : Date.now()
        };

        if (this.currentNote) {
            // 更新现有便签
            const index = this.notes.findIndex(n => n.id === this.currentNote.id);
            if (index !== -1) {
                this.notes[index] = note;
            }
        } else {
            // 新增便签
            this.notes.unshift(note);
        }

        this.saveNotes();
        this.clearInput();
        this.clearDraft();
        this.showToast('保存成功');
        this.addSaveAnimation();
        
        // 重置当前便签
        this.currentNote = null;
    }

    // 清空输入框
    clearInput() {
        document.getElementById('note-input').value = '';
        document.getElementById('note-input').focus();
    }

    // 保存草稿
    saveDraft() {
        const content = document.getElementById('note-input').value;
        if (content.trim()) {
            localStorage.setItem('draft', content);
        } else {
            localStorage.removeItem('draft');
        }
    }

    // 加载草稿
    loadDraft() {
        const draft = localStorage.getItem('draft');
        if (draft && !this.currentNote) {
            document.getElementById('note-input').value = draft;
        }
    }

    // 清除草稿
    clearDraft() {
        localStorage.removeItem('draft');
    }

    // 显示主记录页面
    showWrite() {
        this.switchPage('write');
        setTimeout(() => {
            document.getElementById('note-input').focus();
        }, 100);
    }

    // 显示历史记录页面
    showHistory() {
        this.switchPage('history');
        this.loadNotesToList();
        document.getElementById('search-input').value = '';
    }

    // 显示设置页面
    showSettings() {
        this.switchPage('settings');
    }

    // 页面切换 - 修复显示问题
    switchPage(pageName) {
        const pages = document.querySelectorAll('.page');
        const targetPage = document.getElementById(`page-${pageName}`);
        
        // 立即隐藏其他页面
        pages.forEach(page => {
            if (page !== targetPage) {
                page.classList.remove('active');
                // 强制重置样式
                page.style.cssText = 'opacity: 0; transform: translateX(100%); pointer-events: none;';
            }
        });
        
        // 重置并显示目标页面
        targetPage.style.cssText = 'opacity: 1; transform: translateX(0); pointer-events: auto;';
        targetPage.classList.add('active');
        
        // 更新当前页面状态
        this.currentPage = pageName;
        
        // 确保页面完全渲染
        requestAnimationFrame(() => {
            // 再次确保目标页面完全可见
            targetPage.style.opacity = '1';
            targetPage.style.transform = 'translateX(0)';
            targetPage.style.pointerEvents = 'auto';
            
            // 清理其他页面的内联样式，恢复CSS控制
            setTimeout(() => {
                pages.forEach(page => {
                    if (page !== targetPage) {
                        page.style.cssText = '';
                    }
                });
                targetPage.style.cssText = '';
            }, 100);
        });
    }

    // 加载便签到列表
    loadNotesToList() {
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = '';

        if (this.notes.length === 0) {
            notesList.innerHTML = `
                <div class="empty-state">
                    <p>还没有便签，去记录第一条想法吧</p>
                </div>
            `;
            return;
        }

        this.notes.forEach(note => {
            const noteCard = this.createNoteCard(note);
            notesList.appendChild(noteCard);
        });
    }

    // 创建便签卡片
    createNoteCard(note) {
        const div = document.createElement('div');
        div.className = 'note-card glassmorphism';
        div.dataset.noteId = note.id;

        const timeStr = this.formatTime(note.timestamp);
        const preview = note.content.length > 100 ? 
            note.content.substring(0, 100) + '...' : 
            note.content;

        div.innerHTML = `
            <div class="note-content">${this.escapeHtml(preview)}</div>
            <div class="note-time">${timeStr}</div>
            <div class="note-actions">
                <button onclick="app.editNote(${note.id})" title="编辑">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
                <button onclick="app.deleteNote(${note.id})" title="删除" class="delete-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
        `;

        div.addEventListener('click', (e) => {
            if (!e.target.closest('.note-actions')) {
                this.viewNote(note);
            }
        });

        return div;
    }

    // 查看便签
    viewNote(note) {
        this.currentNote = note;
        document.getElementById('note-input').value = note.content;
        this.showWrite();
    }

    // 编辑便签
    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            this.viewNote(note);
        }
    }

    // 删除便签
    deleteNote(noteId) {
        this.showModal(
            '删除便签',
            '确定要删除这条便签吗？此操作无法撤销。',
            () => {
                this.notes = this.notes.filter(n => n.id !== noteId);
                this.saveNotes();
                this.loadNotesToList();
                this.showToast('删除成功');
            }
        );
    }

    // 搜索便签
    searchNotes(query) {
        const notesList = document.getElementById('notes-list');
        const cards = notesList.querySelectorAll('.note-card');
        
        cards.forEach(card => {
            const content = card.querySelector('.note-content').textContent.toLowerCase();
            const isMatch = content.includes(query.toLowerCase());
            card.style.display = isMatch ? 'block' : 'none';
        });
    }

    // 更改字体大小
    changeFontSize(size) {
        this.fontSize = size;
        localStorage.setItem('fontSize', size);
        this.applyFontSize();
    }

    // 应用字体大小
    applyFontSize() {
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${this.fontSize}`);
    }

    // 导出便签
    exportNotes() {
        if (this.notes.length === 0) {
            this.showToast('没有便签可导出');
            return;
        }

        let exportText = '# 我的便签导出\n\n';
        this.notes.forEach((note, index) => {
            const time = new Date(note.timestamp).toLocaleString('zh-CN');
            exportText += `## ${index + 1}. ${time}\n\n${note.content}\n\n---\n\n`;
        });

        const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `便签导出_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('导出成功');
    }

    // 确认清空便签
    confirmClearNotes() {
        if (this.notes.length === 0) {
            this.showToast('没有便签可清空');
            return;
        }

        this.showModal(
            '清空所有便签',
            `确定要清空所有 ${this.notes.length} 条便签吗？此操作无法撤销。`,
            () => {
                this.notes = [];
                this.saveNotes();
                this.loadNotesToList();
                this.clearDraft();
                this.showToast('清空成功');
            }
        );
    }

    // 显示模态框
    showModal(title, message, action) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        document.getElementById('confirm-modal').classList.add('show');
        this.modalAction = action;
    }

    // 隐藏模态框
    hideModal() {
        document.getElementById('confirm-modal').classList.remove('show');
        this.modalAction = null;
    }

    // 执行模态框操作
    executeModalAction() {
        if (this.modalAction) {
            this.modalAction();
        }
        this.hideModal();
    }

    // 显示提示消息
    showToast(message) {
        // 移除已存在的toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast glassmorphism';
        toast.textContent = message;
        
        // 添加toast样式
        Object.assign(toast.style, {
            position: 'fixed',
            top: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '9999',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 8px 32px var(--glass-shadow)',
            animation: 'fadeIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards'
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    // 添加保存动画
    addSaveAnimation() {
        const saveBtn = document.getElementById('btn-save');
        saveBtn.style.animation = 'glow 0.6s ease-out';
        setTimeout(() => {
            saveBtn.style.animation = '';
        }, 600);
    }

    // 格式化时间
    formatTime(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = now - date;

        if (diff < 60000) { // 1分钟内
            return '刚刚';
        } else if (diff < 3600000) { // 1小时内
            return `${Math.floor(diff / 60000)}分钟前`;
        } else if (diff < 86400000) { // 24小时内
            return `${Math.floor(diff / 3600000)}小时前`;
        } else if (date.toDateString() === now.toDateString()) {
            return '今天';
        } else {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (date.toDateString() === yesterday.toDateString()) {
                return '昨天';
            } else {
                return date.toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric'
                });
            }
        }
    }

    // HTML转义
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // 加载便签数据
    loadNotes() {
        try {
            const saved = localStorage.getItem('notes');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('加载便签失败:', error);
            return [];
        }
    }

    // 保存便签数据
    saveNotes() {
        try {
            localStorage.setItem('notes', JSON.stringify(this.notes));
        } catch (error) {
            console.error('保存便签失败:', error);
            this.showToast('保存失败，存储空间可能不足');
        }
    }
}

// 添加fadeOut动画和其他样式
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
    
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-light);
        font-style: italic;
    }
    
    .delete-btn:hover {
        color: #ff5252 !important;
    }
    
    /* 确保页面切换时不会出现显示问题 */
    .page {
        will-change: transform, opacity;
    }
    
    .page:not(.active) {
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new NoteApp();
});

// 防止意外关闭页面时丢失未保存的内容
window.addEventListener('beforeunload', (e) => {
    const content = document.getElementById('note-input')?.value?.trim();
    if (content && !localStorage.getItem('draft')) {
        e.preventDefault();
        e.returnValue = '有未保存的内容，确定要离开吗？';
    }
});
