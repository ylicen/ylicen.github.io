document.addEventListener('DOMContentLoaded', () => {
    const projectsWindow = document.getElementById('projects-explorer');
    if (!projectsWindow) return;

    // Views
    const directoryView = document.getElementById('directory-view');
    const editorView = document.getElementById('editor-view');

    // Buttons & Panels
    const backToDirBtn = document.getElementById('back-to-dir-btn');
    const newFileBtn = document.getElementById('new-file-btn');
    const saveFileBtn = document.getElementById('save-file-btn');
    const deleteFileBtn = document.getElementById('delete-file-btn');
    const fileListPanel = document.getElementById('file-list-panel');
    const editorPanel = document.getElementById('editor-panel');
    const fileNameInput = document.getElementById('file-name-input');
    const fileContentTextarea = document.getElementById('file-content-textarea');
    const noFileSelectedPanel = document.getElementById('no-file-selected');

    let files = [];
    let currentFile = null;

    // --- View Management ---
    function showDirectoryView() {
        directoryView.classList.remove('hidden');
        editorView.classList.add('hidden');
        renderDirectoryFiles();
    }

    function showEditorView() {
        directoryView.classList.add('hidden');
        editorView.classList.remove('hidden');
        renderEditorFileList();
        // If no file is selected after switching, show placeholder
        if (!currentFile) {
            hideEditor();
        }
    }

    // --- LocalStorage Interaction ---
    function loadFilesFromStorage() {
        const storedFiles = localStorage.getItem('textFiles');
        files = storedFiles ? JSON.parse(storedFiles) : [];
        showDirectoryView();
    }

    function saveFilesToStorage() {
        localStorage.setItem('textFiles', JSON.stringify(files));
    }

    // --- UI Rendering ---
    function renderDirectoryFiles() {
        directoryView.innerHTML = '';
        const header = document.createElement('h3');
        header.className = 'text-md font-medium text-gray-700 mb-3 px-2';
        header.textContent = 'My Documents';
        directoryView.appendChild(header);

        if (files.length === 0) {
            directoryView.innerHTML += '<p class="text-sm text-gray-500 px-2">No files yet. Go to the editor to create one!</p>';
        } else {
            files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200';
                
                const icon = document.createElement('i');
                icon.className = `fas ${file.name.endsWith('.md') ? 'fa-file-alt' : 'fa-file-lines'} text-gray-500 text-lg mr-3`;
                
                const fileName = document.createElement('span');
                fileName.className = 'text-gray-700 text-sm';
                fileName.textContent = file.name;

                fileItem.appendChild(icon);
                fileItem.appendChild(fileName);

                fileItem.addEventListener('click', () => {
                    selectFile(file.id);
                    showEditorView();
                });
                directoryView.appendChild(fileItem);
            });
        }
         // Add a button to switch to the editor view to create a new file
        const openEditorBtn = document.createElement('button');
        openEditorBtn.className = 'mt-4 ml-2 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-200';
        openEditorBtn.innerHTML = '<i class="fas fa-plus mr-1"></i> New/Open Editor';
        openEditorBtn.onclick = () => {
            currentFile = null; // Ensure no file is selected
            showEditorView();
        };
        directoryView.appendChild(openEditorBtn);
    }

    function renderEditorFileList() {
        fileListPanel.innerHTML = '';
        if (files.length === 0) {
            fileListPanel.innerHTML = '<p class="text-xs text-gray-500 p-2">No files yet.</p>';
            return;
        }
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'p-2 text-sm cursor-pointer hover:bg-gray-200 rounded';
            fileItem.textContent = file.name;
            if (currentFile && file.id === currentFile.id) {
                fileItem.classList.add('bg-blue-200');
            }
            fileItem.addEventListener('click', () => selectFile(file.id));
            fileListPanel.appendChild(fileItem);
        });
    }

    function showEditor() {
        editorPanel.classList.remove('hidden');
        noFileSelectedPanel.classList.add('hidden');
    }

    function hideEditor() {
        editorPanel.classList.add('hidden');
        noFileSelectedPanel.classList.remove('hidden');
        currentFile = null;
    }

    // --- File Operations ---
    function selectFile(id) {
        currentFile = files.find(f => f.id === id) || null;
        if (currentFile) {
            showEditor();
            fileNameInput.value = currentFile.name;
            fileContentTextarea.value = currentFile.content;
        } else {
            hideEditor();
        }
        renderEditorFileList();
    }

    function newFile() {
        const newId = Date.now().toString();
        const newFile = { id: newId, name: 'Untitled.txt', content: '' };
        files.push(newFile);
        selectFile(newId); // Select the new file
        fileNameInput.focus();
        fileNameInput.select();
    }

    async function saveFile() {
        if (!currentFile) return;

        const newName = fileNameInput.value.trim();
        if (!newName) {
            await showCustomAlert('Filename cannot be empty.', 'Save Error');
            return;
        }
        if (!newName.endsWith('.txt') && !newName.endsWith('.md')) {
            await showCustomAlert('Filename must end with .txt or .md', 'Save Error');
            return;
        }

        currentFile.name = newName;
        currentFile.content = fileContentTextarea.value;
        
        saveFilesToStorage();
        renderEditorFileList();
        await showCustomAlert('File saved!', 'Success');
    }

    async function deleteFile() {
        if (!currentFile) return;

        const confirmed = await showCustomConfirm(`Are you sure you want to delete ${currentFile.name}?`, 'Delete File');
        if (confirmed) {
            files = files.filter(f => f.id !== currentFile.id);
            saveFilesToStorage();
            hideEditor();
            renderEditorFileList();
        }
    }

    // --- Event Listeners ---
    backToDirBtn.addEventListener('click', showDirectoryView);
    newFileBtn.addEventListener('click', newFile);
    saveFileBtn.addEventListener('click', saveFile);
    deleteFileBtn.addEventListener('click', deleteFile);

    // --- Initialization ---
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.attributeName === 'class' && !projectsWindow.classList.contains('hidden')) {
                loadFilesFromStorage();
                // No need to observe anymore once it's loaded the first time
                // observer.disconnect(); 
            }
        }
    });

    observer.observe(projectsWindow, { attributes: true });

    // Initial state in case the window is already visible on page load
    if (!projectsWindow.classList.contains('hidden')) {
        loadFilesFromStorage();
    }
});