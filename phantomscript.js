// Article data
const articles = [
    {
        image: 'image1.png',
        category: 'SCIENCE',
        description: 'This article discusses the recent advancements in space exploration...',
        title: 'Test Article 1',
        pages: ['school-news', 'all','news']
    },
    {
        image: 'image2.jpg',
        category: 'SCHOOL',
        description: 'A deep dive into AI and how it is transforming industries...',
        title: 'Test Article 2',
        pages: ['features', 'all']
    },
    {
        image: 'image3.jpg',
        category: 'VANCOUVER',
        description: 'Exploring new breakthroughs in medical research...',
        title: 'Test Article 3',
        pages: ['all', 'features']
    },
    {
        image: 'image4.jpg',
        category: 'SPORTS',
        description: 'A recap of the latest sports events from around the world...',
        title: 'Test Article 4',
        pages: ['local-news', 'all','news']
    }
];

// Function to load content based on page
function loadContent(page) {
    const container = document.getElementById('content-container');
    if (page === 'article') {
        renderArticlePage(container);
        const articleData = JSON.parse(localStorage.getItem('selectedArticle'));
        if (articleData) {
            document.getElementById('article-title').textContent = articleData.title;
            document.getElementById('article-image').src = articleData.image;
            document.getElementById('article-body').textContent = articleData.description;
        } else {
            container.innerHTML = '<p>No article data available.</p>';
        }
    } else {
        loadArticles(page, 'content-container');  // Render the list of articles
    }
}

function loadArticles(page, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear the container before loading articles

    const filteredArticles = articles.filter(article => article.pages.includes(page));

    filteredArticles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');

        // Structure for the article container
        articleDiv.innerHTML = `
            <div class="image-container">
                <img src="${article.image}" alt="${article.title}" class="article-image">
            </div>
            <div class="article-details">
                <h3 class="article-category">${article.category}</h3>
                <h5 class="article-title">${article.title}</h5>
                <p class="article-description">${article.description}</p>
            </div>
        `;

        // Make the entire article container clickable
        articleDiv.addEventListener('click', () => {
            renderArticlePage(article); // Render the article view dynamically
        });

        container.appendChild(articleDiv);
    });
}

// Call loadArticles every time the page loads
window.onload = loadArticles;
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const moreArticlesButton = document.getElementById('more-articles');
    const contentLinks = document.querySelectorAll('.sitemap-link, #more-articles');
    contentLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('href').substring(1);
            loadContent(page);
        });
    });

    // Event listener for hamburger menu toggle
    if (hamburgerButton && mobileMenu) {
        hamburgerButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('visible');
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close the mobile menu when clicking a navigation link
    document.querySelectorAll('#mobile-menu ul li a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            mobileMenu.classList.remove('visible');
            mobileMenu.classList.add('hidden');
            
            const page = this.getAttribute('href').substring(1);
            loadContent(page);
        });
    });

    // Event listener for the "More Articles" button
    if (moreArticlesButton) {
        moreArticlesButton.addEventListener('click', function () {
            loadContent('allarticles');
        });
    }

    // Function to load content dynamically
    function loadContent(page) {
        const mainContent = document.querySelector('.main');

        switch (page) {
            case 'article':
            renderArticlePage(container);
            const articleData = JSON.parse(localStorage.getItem('selectedArticle'));
            if (articleData) {
                document.getElementById('article-title').textContent = articleData.title;
                document.getElementById('article-writer').textContent = articleData.writers;
                document.getElementById('article-image').src = articleData.image;
                document.getElementById('article-body').textContent = articleData.description;
            } else {
                container.innerHTML = '<p>No article data available.</p>';
            }
            break;
            case 'about':
                renderAboutPage(mainContent);
                break;
            case 'contact':
                renderContactPage(mainContent);
                break;
            case 'news':
                renderNewsPage(mainContent);
                break;
            case 'features':
                renderFeaturesPage(mainContent);
                break;
            case 'allarticles':
                renderAllArticlesPage(mainContent);
                break;
            case 'home':
            default:
                renderHomePage(mainContent);
                break;
        }

        updateActiveNavLink(page);
        history.pushState({ page }, '', `/${page}`);
    }

    // Handle browser back button
    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.page) {
            loadContent(event.state.page);
        } else {
            loadContent('home');
        }
    });

    function renderHomePage(container) {
        container.innerHTML = `
            <section>
                <div class="latest" id="latest-news">
                    <hr>
                    <div id="news-articles-container"></div>
                </div>
            </section>
            <br>
            <section>
                <div class="latest" id="latest-features">
                    <hr>
                    <div id="features-articles-container"></div>
                </div>
            </section>
            <br>
            <button class="more-articles" id="more-articles">More Articles</button><br>
            <section>
                <div class="main-contact">
                    <h2>About</h2>
                    <p>The newspaper club is a student-led news outlet where students can publish articles about current events. The club is focused on reporting school and local news with minimal bias. As a club, we want to give our Byng community accurate, trustworthy, and timely news while also giving students a platform and a place to freely express themselves.</p>
                    <br>
                </div>
            </section>
            <section>
                <div class="main-contact">
                    <h2>Contact</h2>
                    <p>Inquiries can be sent to our team via <a href="" target="_blank">email</a>, or through a direct message via <a href="" target="_blank">Instagram</a>.<br>
                    <br>If you have an idea for an article, topic, or story, a suggestion for an article or another piece you'd like to contribute, or a comment or question, Phantom Press would like to hear from you!</p>
                    <br>
                </div>
            </section>
        `;
        
        // Load both news and features articles by default on the homepage
        loadArticles('news', 'news-articles-container');
        loadArticles('features', 'features-articles-container');
    
        // Add event listener for "More Articles" button
        document.getElementById('more-articles').addEventListener('click', function () {
            loadContent('allarticles');
        });
    }

    function renderAboutPage(container) {
        container.innerHTML = `
            <section>
                <div class="about">
                    <h3>About</h3>
                    <br>
                    <h2>Empowering the Voices of Tomorrow</h2>
                    <br>
                    <p>Phantom Press is Lord Byng’s student-run, independent newspaper. The publication aims to publish throughout the year and covers staff and student-related topics objectively and professionally. For distribution to the student body and community, our team of student journalists conducts research, writes, and edits articles on a broad range of subjects and concerns for Byng's newspaper. As a club, we want to give our Byng community accurate, trustworthy, and timely news while also giving journalists a platform and a place to freely express themselves.
                    <br><br>Phantom Press encourages editorials, opinion pieces, and creative works, allowing students to discuss the issues that matter to them. Additionally, participating in Phantom Press provides students with valuable opportunities to develop skills in journalism, including researching, writing, editing, and critical thinking.</p>
                    <br>
                    <h2>Our Team</h2>
                    <div class="team-member">
                        <br><img src = "Charlie.jpeg" alt="pic" height= auto width="300"> <br>
                        <div class = "member-info">
                        <br><p><strong>Charlie Chen</strong></p>
                        <p2>Director</p2><br>
                        <br><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique luctus ante, sed posuere diam. Sed congue nisl ac accumsan auctor. Morbi aliquam dignissim ex a cursus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed sed libero eleifend, dignissim ex vel, fringilla ex. Duis non sem at sem facilisis imperdiet ac ut justo. Cras placerat orci eleifend, sollicitudin magna sed, venenatis turpis. </p>
                        </div><br>
                        <hr>
                        <br><img src = "DD.png" alt="pic" height="auto" width="300px"> <br>
                        <div class = "member-info">
                        <br><p><strong>Dharaneeswar Dadibathina</strong></p>
                        <p2>Web Design and Layout</p2><br>
                        <br><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique luctus ante, sed posuere diam. Sed congue nisl ac accumsan auctor. Morbi aliquam dignissim ex a cursus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed sed libero eleifend, dignissim ex vel, fringilla ex. Duis non sem at sem facilisis imperdiet ac ut justo. Cras placerat orci eleifend, sollicitudin magna sed, venenatis turpis. </p>
                        </div><br>
                        <hr>
                        <br><img src = "Julian.jpeg" alt="pic" height="auto" width="300px"><br>
                        <div class = "member-info">
                        <br><p><strong>Julian Cohen Wood</strong></p>
                        <p2>Social Media and Promotions</p2><br>
                        <br><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique luctus ante, sed posuere diam. Sed congue nisl ac accumsan auctor. Morbi aliquam dignissim ex a cursus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed sed libero eleifend, dignissim ex vel, fringilla ex. Duis non sem at sem facilisis imperdiet ac ut justo. Cras placerat orci eleifend, sollicitudin magna sed, venenatis turpis. </p>
                        </div><br>
                        <hr>
                        <br><img src = "Leo.jpeg" alt="pic" height="auto" width="300px"><br>
                        <div class = "member-info">
                        <br><p><strong>Leo Ke</strong></p>
                        <p2>Editor-in-Chief</p2><br>
                        <br><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique luctus ante, sed posuere diam. Sed congue nisl ac accumsan auctor. Morbi aliquam dignissim ex a cursus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed sed libero eleifend, dignissim ex vel, fringilla ex. Duis non sem at sem facilisis imperdiet ac ut justo. Cras placerat orci eleifend, sollicitudin magna sed, venenatis turpis. </p>
                        </div><br>
                        <hr>
                        <br><img src = "Jayden.jpeg" alt="pic" height="auto" width="300px"><br>
                        <div class = "member-info">
                        <br><p><strong>Jayden Zhang</strong></p>
                        <p2>Executive Editor</p2><br>
                        <br><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique luctus ante, sed posuere diam. Sed congue nisl ac accumsan auctor. Morbi aliquam dignissim ex a cursus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed sed libero eleifend, dignissim ex vel, fringilla ex. Duis non sem at sem facilisis imperdiet ac ut justo. Cras placerat orci eleifend, sollicitudin magna sed, venenatis turpis. </p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function renderContactPage(container) {
        container.innerHTML = `
            <section>
            <br>
                <div class="contact">
                    <h2>Contact Us</h2><br>
                    <p>Inquiries can be sent to our team via <a href = "" target = _blank>email</a>, or through a direct message via <a href = "" target =_blank>Instagram</a>.<br>
                    <br>If you have an idea for an article, topic, or story, a suggestion for an article or another piece you'd like to contribute, or a comment or question, Phantom Press would like to hear from you!</p>
                </div>
            </section>
        `;
    }

    function renderNewsPage(container) {
        container.innerHTML = `
            <section>
                <div class="latest" id="school-news">
                    <h2>School News</h2>
                    <hr>
                    <div id="school-news-articles-container"></div>
                </div>
            </section>
            <br>
            <section>
                <div class="latest" id="local-news">
                    <h2>Local News</h2>
                    <hr>
                    <div id="local-news-articles-container"></div>
                </div>
            </section>
        `;
        loadArticles('school-news', 'school-news-articles-container');  // Load articles for "School News" section
        loadArticles('local-news', 'local-news-articles-container');    // Load articles for "Local News" section
    }
    
    function renderFeaturesPage(container) {
        container.innerHTML = `
            <section>
                <div class="latest" id="latest-features">
                    <h2>Feature Articles</h2>
                    <hr>
                    <div id="features-articles-container"></div> <!-- Unique container ID for feature articles -->
                </div>
            </section>
        `;
        loadArticles('features', 'features-articles-container');  // Load articles for the "Feature Articles" section
    }
    
    function renderAllArticlesPage(container) {
        container.innerHTML = `
            <section>
                <div class="allarticles" id="all-articles">
                    <h2>All Articles</h2>
                    <hr>
                    <div id="all-articles-container"></div> <!-- Unique container ID for all articles -->
                </div>
            </section>
        `;
        loadArticles('all', 'all-articles-container');  // Load all articles for the "All Articles" section
    }

    function renderArticlePage(article) {
        const mainContent = document.querySelector('.main'); // Main content container
        mainContent.innerHTML = `
            <section class="article-fullscreen">
                <h1 class="article-title">${article.title}</h1>
                <img src="${article.image}" alt="${article.title}" class="article-image" style="max-width: 100%; height: auto;">
                <p class="article-body">${article.description}</p>
                <button id="back-button">Back</button>
            </section>
        `;
    
        // Add a back button functionality to return to the previous view
        document.getElementById('back-button').addEventListener('click', () => {
            loadContent('home'); // Or whichever page you want to return to
        });
    }

    // Update active link in navigation
    function updateActiveNavLink(page) {
        document.querySelectorAll('nav ul li a').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`nav ul li a[href='#${page}']`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Add event listeners to sitemap links
    document.querySelectorAll('.sitemap-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('href').substring(1);
            loadContent(page);
        });
    });

    // Load the home page by default
    loadContent('home');
});

// Get the container where articles will be added
const latestNewsContainer = document.getElementById('latest-news');

// Loop through each article in the articles array and create the HTML structure
articles.forEach(article => {
    // Create a div for each article
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('article');
    
    // Add the image
    const img = document.createElement('img');
    img.src = article.image;
    img.alt = article.title;
    img.classList.add('article-img');
    
    // Create the content container
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('article-content');
    
    // Add category
    const category = document.createElement('p');
    category.classList.add('category');
    category.innerText = article.category;
    
    // Add title
    const title = document.createElement('h3');
    title.classList.add('title');
    title.innerText = article.title;
    
    // Add description
    const description = document.createElement('p');
    description.classList.add('description');
    description.innerText = article.description;
    
    // Append all the elements to the content div
    contentDiv.appendChild(category);
    contentDiv.appendChild(title);
    contentDiv.appendChild(description);
    
    // Append image and content div to the article div
    articleDiv.appendChild(img);
    articleDiv.appendChild(contentDiv);
    
    // Append the article div to the latest news container
    latestNewsContainer.appendChild(articleDiv);
});