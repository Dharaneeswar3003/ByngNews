let articles = [];

// Fetch articles using XMLHttpRequest
function fetchArticles() {
    try {
        // Check if articles are already cached in localStorage
        const cachedArticles = localStorage.getItem('articles');

        if (cachedArticles) {
            articles = JSON.parse(cachedArticles);
            console.log("Articles loaded from cache.");
            // Call handlePageLoad after articles are fetched and available
            handlePageLoad();
        } else {
            // Create a new XMLHttpRequest object
            const xhr = new XMLHttpRequest();
            
            // Open a GET request to the API endpoint
            xhr.open('GET', "https://script.google.com/macros/s/AKfycbwcuagtwil510vmK3rUieZjkgKwqcjlJOmd1nRBtF8eK5gDdK0hl4sFw2beUTt9ulHv/exec", true);
            
            // Set up the onload event handler for successful response
            xhr.onload = function() {
                if (xhr.status === 200) {
                    articles = JSON.parse(xhr.responseText);
                    // Store the articles in localStorage for future use
                    localStorage.setItem('articles', JSON.stringify(articles));
                    console.log("Articles fetched from server and cached.");
                    // Call handlePageLoad after articles are fetched and available
                    handlePageLoad();
                } else {
                    console.error("Error fetching articles: " + xhr.statusText);
                }
            };

            // Set up the onerror event handler in case of failure
            xhr.onerror = function() {
                console.error("Network error occurred while fetching articles.");
            };

            // Send the request
            xhr.send();
        }

    } catch (error) {
        console.error("Error fetching articles:", error);
    }
}

// Handle loading articles depending on the current page
function handlePageLoad() {
    const currentPage = getCurrentPage();

    if (currentPage === "home") {
        loadArticles("home", "home-articles");
        setupMoreArticlesButton();
    } else if (currentPage === "news") {
        loadArticles("School News", "schoolnews-articles");
        loadArticles("Local News", "localnews-articles");
    } else if (currentPage === "features") {
        loadArticles("Features", "features-articles");
    } else if (currentPage === "allarticles") {
        loadArticles("all", "all-articles");
    } else if (currentPage === "article") {
        loadArticlePage();
    }
}

// Function to determine current page
function getCurrentPage() {
    const path = window.location.pathname.split("/").pop().toLowerCase();
    if (!path || path === "index.html") return "home";
    return path.replace(".html", "");
}

function loadArticles(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }
    container.innerHTML = ''; // Clear existing content

    // Sort articles by ID (latest first)
    const sortedArticles = [...articles].sort((a, b) => b.id - a.id);

    let filteredArticles;
    if (category === "home") {
        filteredArticles = sortedArticles.slice(0, 10);
    } else if (category === "all") {
        filteredArticles = sortedArticles;
    } else {
        filteredArticles = sortedArticles.filter(article => {
            const articleCategories = article.category.split(",").map(cat => cat.trim());
            return articleCategories.includes(category);
        });
    }

    if (filteredArticles.length === 0) {
        container.innerHTML = '<p>No articles found for this section.</p>';
        return;
    }

    filteredArticles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');
    
        // Ensure the image URL is using the export=view format
        let validImageUrl = article.image ? article.image : 'default-image.jpg';
        
        if (validImageUrl.includes("drive.google.com")) {
            validImageUrl = validImageUrl
                .replace("/file/d/", "/thumbnail?id=") // Convert to export format
                .replace("/view", "") // Remove "/view" if it exists
                .replace("/preview", "&sz=s1000"); // Remove "/preview" if it exists
        }

        articleDiv.innerHTML = `
            <div class="image-container">
                <img src="${validImageUrl}" class="article-image" loading="lazy" alt="${article.title}"
                    onerror="this.onerror=null; this.src='default-image.jpg';">
            </div>
            <div class="article-details">
                <h3 class="article-category">${article.category}</h3>
                <h5 class="article-title">${article.title}</h5>
                <p class="article-description">${article.description}</p>
            </div>
        `;
    
        // Add event listener to navigate to the full article page on click
        articleDiv.addEventListener('click', () => {
            const currentPage = window.location.pathname.split("/").pop().toLowerCase();
            const articlePagePath = currentPage === "index.html" || currentPage === ""
                ? `Pages/article.html?id=${article.id}`
                : `article.html?id=${article.id}`;
            window.location.href = articlePagePath;
        });
    
        container.appendChild(articleDiv);
    });    
}

function loadArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const articleId = parseInt(params.get('id'));

    if (!articles.length) {
        setTimeout(loadArticlePage, 100); // Retry if data isn't loaded yet
        return;
    }

    const article = articles.find(a => a.id === articleId);

    if (article) {
        document.querySelector('.article-title').textContent = article.title;
        const imageElement = document.querySelector('.article-image');
        imageElement.src = article.image;  // Use direct API URL
        imageElement.alt = article.title;

        document.querySelector('.article-body').innerHTML = article.content;
    } else {
        window.location.href = '../index.html';
    }
}

// Fetch articles when the page loads
document.addEventListener('DOMContentLoaded', fetchArticles);

// Hamburger Menu Functionality
function setupHamburgerMenu() {
    const hamburgerButton = document.getElementById('hamburger-button');
    const closeButton = document.getElementById('close-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerButton && mobileMenu && closeButton) {
        hamburgerButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('visible');
            mobileMenu.classList.toggle('hidden');
        });

        closeButton.addEventListener('click', () => {
            mobileMenu.classList.remove('visible');
            mobileMenu.classList.add('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const href = link.getAttribute('href');
                mobileMenu.classList.remove('visible');
                mobileMenu.classList.add('hidden');
                window.location.href = href;
            });
        });
    }
}

// 'More Articles' button functionality
function setupMoreArticlesButton() {
    const moreArticlesButton = document.getElementById('more-articles');
    if (!moreArticlesButton) {
        console.error('More Articles button not found.');
        return;
    }

    moreArticlesButton.addEventListener('click', () => {
        window.location.href = "Pages/Allarticles.html";
    });
}

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupHamburgerMenu();
});
