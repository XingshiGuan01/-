// 全局JavaScript文件

// 全局变量
const config = {
    scrollOffset: 100,
    fadeInThreshold: 150,
    carouselInterval: 5000,
    backToTopThreshold: 300
};

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面加载动画
    initPageLoadAnimation();
    
    // 初始化轮播图
    initCarousel();
    
    // 初始化滚动效果
    initScrollEffects();
    
    // 初始化导航栏
    initNavbar();
    
    // 初始化表单验证
    initFormValidation();
    
    // 初始化收藏功能
    initFavorites();
    
    // 初始化回到顶部按钮
    initBackToTop();
    
    // 初始化搜索功能
    initSearch();
    
    // 初始化响应式标签页
    initTabs();
    
    // 加载评论数据
    loadComments();
    
    // 初始化评论功能
    initComments();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 初始化卡片悬停效果
    initCardHoverEffects();
    
    // 初始化滚动进度条
    initScrollProgress();
    
    // 初始化图片懒加载
    initImageLazyLoad();
});

// 轮播图初始化
function initCarousel() {
    // 检查是否有轮播图元素
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    // 使用Bootstrap的轮播图功能
    new bootstrap.Carousel(carousel, {
        interval: config.carouselInterval, // 5秒自动切换
        wrap: true,     // 循环播放
        keyboard: true  // 支持键盘控制
    });
}

// 滚动效果初始化
function initScrollEffects() {
    // 监听滚动事件
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // 初始检查
    handleScroll();
}

// 处理滚动事件
function handleScroll() {
    // 导航栏滚动效果
    updateNavbarOnScroll();
    
    // 元素进入视口时的动画效果
    animateElementsOnScroll();
    
    // 更新回到顶部按钮状态
    updateBackToTopVisibility();
}

// 导航栏滚动效果
function updateNavbarOnScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    if (window.scrollY > config.scrollOffset) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// 元素进入视口动画
function animateElementsOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .bounce-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = config.fadeInThreshold;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// 导航栏初始化
function initNavbar() {
    // 移动端菜单切换
    const navbarToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggle && navbarCollapse) {
        navbarToggle.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // 导航链接点击事件
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 关闭移动端菜单
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
            
            // 平滑滚动到锚点
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                scrollToAnchor(href.substring(1));
            }
        });
    });
    
    // 高亮当前页面的导航链接
    highlightCurrentNavLink();
}

// 高亮当前页面的导航链接
function highlightCurrentNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href') || '';
        
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 表单验证初始化
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // 实时验证
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                }
            });
            
            input.addEventListener('blur', function() {
                if (!this.checkValidity()) {
                    this.classList.add('is-invalid');
                }
            });
        });
        
        // 提交验证
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

// 收藏功能初始化
function initFavorites() {
    updateFavoriteButtons();
    
    // 为所有收藏按钮添加事件监听器
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.dataset.eventId;
            if (eventId) {
                toggleFavorite(eventId);
            }
        });
    });
}

// 收藏功能（使用LocalStorage）
function toggleFavorite(eventId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    const index = favorites.indexOf(eventId);
    if (index > -1) {
        // 移除收藏
        favorites.splice(index, 1);
        showNotification('已取消收藏', 'success');
    } else {
        // 添加收藏
        favorites.push(eventId);
        showNotification('已添加到收藏', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
}

// 更新收藏按钮状态
function updateFavoriteButtons() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    document.querySelectorAll('.favorite-btn').forEach(button => {
        const eventId = button.dataset.eventId;
        if (favorites.includes(eventId)) {
            button.classList.add('btn-primary');
            button.classList.remove('btn-outline-primary');
            button.innerHTML = '<i class="fas fa-star"></i> 已收藏';
        } else {
            button.classList.add('btn-outline-primary');
            button.classList.remove('btn-primary');
            button.innerHTML = '<i class="far fa-star"></i> 收藏';
        }
    });
}

// 回到顶部按钮初始化
function initBackToTop() {
    // 创建回到顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.title = '回到顶部';
    
    // 添加到页面
    document.body.appendChild(backToTopBtn);
    
    // 添加点击事件
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 更新回到顶部按钮可见性
function updateBackToTopVisibility() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    if (window.scrollY > config.backToTopThreshold) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

// 平滑滚动到锚点
function scrollToAnchor(anchorId) {
    const element = document.getElementById(anchorId);
    if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: offsetTop - 80, // 考虑导航栏高度
            behavior: 'smooth'
        });
    }
}

// 搜索功能初始化
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        // 回车键搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchContent();
            }
        });
    }
    
    if (searchBtn) {
        // 点击按钮搜索
        searchBtn.addEventListener('click', searchContent);
    }
}

// 搜索功能
function searchContent() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        showNotification('请输入搜索关键词', 'warning');
        return;
    }
    
    // 根据不同页面执行不同的搜索逻辑
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'schedule.html':
            searchSchedule(searchTerm);
            break;
        case 'events.html':
            searchEvents(searchTerm);
            break;
        case 'athletes.html':
            searchAthletes(searchTerm);
            break;
        case 'news.html':
            searchNews(searchTerm);
            break;
        case 'live.html':
            searchVideos(searchTerm);
            break;
        default:
            showNotification('当前页面不支持搜索功能', 'info');
            break;
    }
}

// 日程搜索
function searchSchedule(term) {
    const scheduleItems = document.querySelectorAll('.schedule-item');
    let foundCount = 0;
    
    scheduleItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
            item.style.display = 'block';
            item.classList.add('fade-in');
            foundCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    showSearchResult(foundCount);
}

// 项目搜索
function searchEvents(term) {
    const eventCards = document.querySelectorAll('.event-card');
    let foundCount = 0;
    
    eventCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    showSearchResult(foundCount);
}

// 运动员搜索
function searchAthletes(term) {
    const athleteCards = document.querySelectorAll('.athlete-card');
    let foundCount = 0;
    
    athleteCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    showSearchResult(foundCount);
}

// 新闻搜索
function searchNews(term) {
    const newsCards = document.querySelectorAll('.news-card');
    let foundCount = 0;
    
    newsCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    showSearchResult(foundCount);
}

// 新闻相关函数
function renderNewsList(newsArray, category = '全部') {
    const newsList = document.getElementById('newsList');
    if (!newsList) return;

    // 清空当前列表
    newsList.innerHTML = '';

    // 筛选新闻
    let filteredNews = category === '全部' ? newsArray : newsArray.filter(news => news.category === category);

    filteredNews.forEach(news => {
        // 创建新闻卡片元素
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <div class="news-card-image">
                <img src="${news.image || 'https://via.placeholder.com/400x200'}" alt="${news.title}">
            </div>
            <div class="news-card-content">
                <div class="news-card-header">
                    <span class="news-category-badge">${news.category}</span>
                    <span class="news-date">${news.date}</span>
                </div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt || news.content.substring(0, 100) + '...'}</p>
                <div class="news-card-footer">
                    <span class="news-author">${news.author}</span>
                    <button class="news-read-more" onclick="openNewsDetailModal(${news.id})">阅读全文</button>
                </div>
            </div>
        `;

        // 添加到新闻列表
        newsList.appendChild(newsCard);
    });
}

// 函数定义已移至文件末尾，包含评论渲染功能

// 生成相关新闻
function generateRelatedNews(currentCategory, currentNewsId) {
    // 筛选同类别但不同ID的新闻作为相关新闻
    const relatedNews = newsItems.filter(news => news.category === currentCategory && news.id !== currentNewsId).slice(0, 3);
    const relatedNewsList = document.getElementById('relatedNewsList');
    
    if (!relatedNewsList) return;
    
    // 清空当前相关新闻列表
    relatedNewsList.innerHTML = '';
    
    if (relatedNews.length === 0) {
        relatedNewsList.innerHTML = '<p class="text-center text-muted">暂无相关新闻</p>';
        return;
    }
    
    // 生成相关新闻卡片
    relatedNews.forEach(news => {
        const relatedNewsCard = document.createElement('div');
        relatedNewsCard.className = 'col-md-4';
        relatedNewsCard.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${news.image || 'https://via.placeholder.com/300x200'}" alt="${news.title}" class="card-img-top" style="height: 180px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${news.title.length > 50 ? news.title.substring(0, 50) + '...' : news.title}</h5>
                    <p class="card-text text-muted small">${news.date}</p>
                    <button class="btn btn-sm btn-primary" onclick="openNewsDetailModal(${news.id})"><i class="fas fa-eye"></i> 查看详情</button>
                </div>
            </div>
        `;
        
        relatedNewsList.appendChild(relatedNewsCard);
    });
}

// 视频搜索
function searchVideos(term) {
    const videoCards = document.querySelectorAll('.video-item');
    let foundCount = 0;
    
    videoCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    showSearchResult(foundCount);
}

// 显示搜索结果
function showSearchResult(count) {
    // 检查是否已有搜索结果提示
    let resultElement = document.getElementById('searchResult');
    
    if (!resultElement) {
        resultElement = document.createElement('div');
        resultElement.id = 'searchResult';
        resultElement.className = 'alert alert-info mt-3';
        resultElement.style.position = 'sticky';
        resultElement.style.top = '80px';
        resultElement.style.zIndex = '1000';
        
        // 添加到搜索框下方
        const searchContainer = document.querySelector('.search-container') || document.querySelector('.form-inline');
        if (searchContainer) {
            searchContainer.parentNode.insertBefore(resultElement, searchContainer.nextSibling);
        }
    }
    
    if (count > 0) {
        resultElement.textContent = `找到 ${count} 条相关结果`;
        resultElement.className = 'alert alert-success mt-3';
    } else {
        resultElement.textContent = '没有找到相关结果';
        resultElement.className = 'alert alert-warning mt-3';
    }
    
    // 3秒后自动隐藏
    setTimeout(() => {
        if (resultElement) {
            resultElement.remove();
        }
    }, 3000);
}

// 响应式标签页初始化
function initTabs() {
    const tabContents = document.querySelectorAll('.tab-content .tab-pane');
    
    tabContents.forEach(pane => {
        if (pane.classList.contains('active')) {
            pane.classList.add('fade-in');
        }
    });
    
    // 标签切换事件
    const tabLinks = document.querySelectorAll('.nav-tabs .nav-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetId = this.getAttribute('href');
            const targetPane = document.querySelector(targetId);
            
            if (targetPane) {
                // 移除所有标签页的动画类
                tabContents.forEach(pane => {
                    pane.classList.remove('fade-in');
                });
                
                // 为目标标签页添加动画类
                setTimeout(() => {
                    targetPane.classList.add('fade-in');
                }, 100);
            }
        });
    });
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '250px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.animation = 'slideInRight 0.3s ease-in-out';
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-in-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 工具函数：获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 评论区功能

// 评论数据存储（模拟数据库）
let comments = [];

// 初始化评论区
function initComments() {
    // 获取评论表单
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        // 评论表单提交事件
        commentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // 获取表单数据
            const name = document.getElementById('commentName').value;
            const email = document.getElementById('commentEmail').value;
            const content = document.getElementById('commentContent').value;
            
            // 创建新评论
            const newComment = {
                id: Date.now(),
                newsId: currentNewsId || 0, // 当前新闻ID
                name: name,
                email: email,
                content: content,
                date: new Date().toLocaleString('zh-CN'),
                likes: 0
            };
            
            // 添加评论
            addComment(newComment);
            
            // 重置表单
            commentForm.reset();
            commentForm.classList.remove('was-validated');
            
            // 清空输入状态
            const inputs = commentForm.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            // 显示成功消息
            showToast('评论提交成功！');
        }, false);
    }
}

// 当前新闻ID（用于关联评论）
let currentNewsId = null;

// 渲染评论列表
function renderComments(newsId) {
    currentNewsId = newsId;
    
    // 获取评论列表容器
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    // 筛选当前新闻的评论
    const newsComments = comments.filter(comment => comment.newsId === newsId);
    
    if (newsComments.length === 0) {
        commentsList.innerHTML = '<p class="text-center text-muted">暂无评论，快来发表您的看法吧！</p>';
        return;
    }
    
    // 渲染评论
    let commentsHtml = '';
    newsComments.forEach(comment => {
        commentsHtml += `
            <div class="comment-item mb-4 p-3 border rounded-lg shadow-sm">
                <div class="comment-header d-flex justify-content-between align-items-center mb-2">
                    <div class="comment-author">
                        <h5 class="mb-0">${comment.name}</h5>
                        <small class="text-muted">${comment.date}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="likeComment(${comment.id})">
                        <i class="fas fa-thumbs-up"></i> <span>${comment.likes}</span>
                    </button>
                </div>
                <div class="comment-content">
                    <p>${comment.content}</p>
                </div>
            </div>
        `;
    });
    
    commentsList.innerHTML = commentsHtml;
}

// 添加评论
function addComment(comment) {
    // 添加到评论数组
    comments.push(comment);
    
    // 保存到本地存储
    localStorage.setItem('newsComments', JSON.stringify(comments));
    
    // 重新渲染评论列表
    renderComments(comment.newsId);
}

// 点赞评论
function likeComment(commentId) {
    // 查找评论
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        // 增加点赞数
        comment.likes++;
        
        // 保存到本地存储
        localStorage.setItem('newsComments', JSON.stringify(comments));
        
        // 重新渲染评论列表
        renderComments(currentNewsId);
    }
}

// 加载评论数据
function loadComments() {
    // 从本地存储加载评论
    const storedComments = localStorage.getItem('newsComments');
    if (storedComments) {
        comments = JSON.parse(storedComments);
    } else {
        // 初始化模拟评论数据
        comments = [
            {
                id: 1,
                newsId: 1,
                name: '张三',
                email: 'zhangsan@example.com',
                content: '这场比赛真是太精彩了！运动员们的表现令人赞叹，期待下一场比赛！',
                date: '2024-05-20 10:30:00',
                likes: 5
            },
            {
                id: 2,
                newsId: 1,
                name: '李四',
                email: 'lisi@example.com',
                content: '感谢组委会的精心安排，让我们能够欣赏到这么高水平的比赛！',
                date: '2024-05-20 11:15:00',
                likes: 3
            },
            {
                id: 3,
                newsId: 2,
                name: '王五',
                email: 'wangwu@example.com',
                content: '运动员们的拼搏精神值得我们学习！',
                date: '2024-05-21 14:20:00',
                likes: 7
            }
        ];
        localStorage.setItem('newsComments', JSON.stringify(comments));
    }
}

// 显示提示消息
function showToast(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'toast show position-fixed top-50 start-50 translate-middle bg-primary text-white p-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 3秒后移除
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 更新openNewsDetailModal函数以包含渲染评论的调用
function openNewsDetailModal(newsId) {
    // 查找对应的新闻
    const news = newsItems.find(n => n.id === newsId);
    if (!news) return;

    // 填充新闻数据到模态框
    document.getElementById('newsDetailTitle').textContent = news.title;
    document.getElementById('newsDetailDate').textContent = news.date;
    document.getElementById('newsDetailAuthor').textContent = news.author;
    document.getElementById('newsDetailCategory').textContent = news.category;
    document.getElementById('newsDetailImage').src = news.image || 'https://via.placeholder.com/800x400';
    document.getElementById('newsDetailImage').alt = news.title;
    
    // 渲染新闻内容（将纯文本转换为带段落的HTML）
    const formattedContent = news.content.split('\n').filter(line => line.trim() !== '').map(line => `<p>${line}</p>`).join('');
    document.getElementById('newsDetailContent').innerHTML = formattedContent;

    // 生成相关新闻
    generateRelatedNews(news.category, newsId);
    
    // 渲染评论列表
    renderComments(newsId);

    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('newsDetailModal'));
    modal.show();
}

// 页面加载动画
function initPageLoadAnimation() {
    // 添加页面加载完成类
    document.body.classList.add('page-loaded');
    
    // 移除页面加载动画
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }
}

// 平滑滚动
function initSmoothScroll() {
    // 为所有锚点链接添加平滑滚动
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 检查是否是页内锚点链接
            if (href && href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // 平滑滚动到目标元素
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// 卡片悬停效果
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.card, .news-item, .event-card, .athlete-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover-lift');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-lift');
        });
    });
}

// 滚动进度条
function initScrollProgress() {
    // 创建滚动进度条元素
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background-color: #3498db;
        z-index: 9999;
        transition: width 0.1s ease-in-out;
    `;
    
    // 添加到页面
    document.body.appendChild(progressBar);
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    });
}

// 图片懒加载
function initImageLazyLoad() {
    // 检查浏览器是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    
                    // 加载图片
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.removeAttribute('data-src');
                    }
                    
                    // 停止观察
                    observer.unobserve(image);
                }
            });
        });
        
        // 观察所有带有data-src属性的图片
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // 降级处理，直接加载所有图片
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(image => {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
        });
    }
}