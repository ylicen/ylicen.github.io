document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 复制代码功能 ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.nextElementSibling.querySelector('code');
            const codeToCopy = codeBlock.innerText;

            navigator.clipboard.writeText(codeToCopy).then(() => {
                button.textContent = '已复制!';
                button.classList.add('copied');

                setTimeout(() => {
                    button.textContent = '复制';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('无法复制到剪贴板: ', err);
                button.textContent = '复制失败';
                setTimeout(() => {
                    button.textContent = '复制';
                }, 2000);
            });
        });
    });

    // --- 2. 滚动侦测 (Scroll-spying) 功能 ---
    const sections = document.querySelectorAll('.tutorial-section');
    const navLinks = document.querySelectorAll('.sidebar-nav li a');
    const headerOffset = 120; // 偏移量，用于更精确地确定激活区域

    function highlightNavLink() {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - headerOffset) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // 初始加载时运行一次
    highlightNavLink();

    // 监听滚动事件
    window.addEventListener('scroll', highlightNavLink);
});