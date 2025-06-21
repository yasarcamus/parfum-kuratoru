// app.js - Ana Uygulama Mantığı (URL Düzeltmeleri Yapılmış)

import { perfumeFacts, quizQuestions } from './data.js';
import { getColorForText, showToast } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- DEĞİŞKENLER ve SABİTLER ---
    let parfum_veritabani = {};
    let userLists = {};
    let personalNotes = {};
    let currentPage = 'home-page';
    let lastPage = 'home-page';
    let scrollPositions = {}; 
    let isInitialLoad = true;
    
    const pageContainer = document.getElementById('page-content');
    const pages = {
        'home-page': document.getElementById('home-page'),
        'my-lists-page': document.getElementById('my-lists-page'),
        'detail-page': document.getElementById('detail-page'),
        'quiz-page': document.getElementById('quiz-page'),
        'quiz-results-page': document.getElementById('quiz-results-page')
    };
    const navButtons = {
        'home-page': document.getElementById('nav-home'),
        'my-lists-page': document.getElementById('nav-lists')
    };
    
    let currentQuizSet = [];
    let currentQuestionIndex = 0;
    let userProfileTags = [];

    // --- VERİ YÖNETİMİ ---
    const loadData = () => {
        userLists = JSON.parse(localStorage.getItem('userPerfumeLists')) || { "Favorilerim": [] };
        personalNotes = JSON.parse(localStorage.getItem('perfumePersonalNotes')) || {};
    };
    const saveLists = () => localStorage.setItem('userPerfumeLists', JSON.stringify(userLists));
    const saveNotes = () => localStorage.setItem('perfumePersonalNotes', JSON.stringify(personalNotes));

    // --- SAYFA YÖNETİMİ ---
    const showPage = (pageId, fromHistory = false) => {
        if (currentPage !== 'detail-page' && !fromHistory) {
            lastPage = currentPage;
        }
        currentPage = pageId;
        
        Object.values(pages).forEach(page => page?.classList.remove('active'));
        const newPage = pages[pageId];
        if (newPage) newPage.classList.add('active');
        
        Object.values(navButtons).forEach(button => button?.classList.remove('active'));
        const targetNavButton = navButtons[pageId] || (pageId === 'detail-page' ? navButtons[lastPage] : null);
        if (targetNavButton) {
            targetNavButton.classList.add('active');
        }

        if (!fromHistory) {
            const newPath = (pageId === 'home-page') ? '/' : `/${pageId.replace('-page', '')}`;
            const currentState = history.state ? history.state.page : null;
            if(currentState !== pageId) {
                if (isInitialLoad) {
                    history.replaceState({ page: pageId }, '', newPath);
                } else {
                    history.pushState({ page: pageId }, '', newPath);
                }
            }
        }
        isInitialLoad = false; 

        if (pageId === 'home-page') renderPerfumes();
        if (pageId === 'my-lists-page') renderMyListsPage();
        
        pageContainer.scrollTop = (pageId === 'home-page' || pageId === 'my-lists-page') ? (scrollPositions[pageId] || 0) : 0;
    };

    // --- RENDER FONKSİYONLARI ---
    const renderPerfumes = () => {
        const list = document.getElementById('results-list');
        if (!list) return;
        list.innerHTML = '';
        const perfumesToDisplay = filterPerfumes();
        if (perfumesToDisplay.length === 0) {
            list.innerHTML = '<p style="text-align:center; padding: 20px;">Bu kriterlere uygun parfüm bulunamadı.</p>';
        } else {
            perfumesToDisplay.forEach(name => createPerfumeCard(name, list));
        }
    };

    const renderDetailPage = (perfumeName) => {
        const data = parfum_veritabani[perfumeName];
        if (!data) {
            showPage('home-page');
            return;
        };
        showPage('detail-page');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const page = pages['detail-page'];
        page.querySelector('.perfume-title').textContent = perfumeName;
        page.querySelector('.perfume-stars').textContent = data.yildiz || '';
        page.querySelector('.vibe').textContent = `"${data.vibe || ''}"`;
        page.querySelector('.story').textContent = data.hikaye || 'Hikaye bulunmuyor.';
        page.querySelector('.notes').innerHTML = `<p>${data.notalar || 'Notalar belirtilmemiş.'}</p>`;
        
        const favButton = page.querySelector('#detail-fav-button');
        favButton.classList.toggle('active', userLists["Favorilerim"]?.includes(perfumeName));
        favButton.onclick = () => { toggleFavorite(perfumeName); renderDetailPage(perfumeName); };
        
        page.querySelector('#add-to-list-button').onclick = () => openAddToListModal(perfumeName);
        page.querySelector('#personal-note-input').value = personalNotes[perfumeName] || '';
        page.querySelector('#save-note-button').onclick = () => saveNote(perfumeName);
        page.querySelector('.share-button').onclick = () => sharePerfume(perfumeName);
        page.querySelector('.back-button').onclick = () => history.back();
        page.querySelector('#online-search-button').onclick = () => {
            const searchQuery = encodeURIComponent(`${perfumeName} parfüm satın al`);
            window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
        };
    };

    const renderMyListsPage = () => {
        const page = pages['my-lists-page'];
        page.innerHTML = `<h2 class="accent" style="padding-top:15px;">📚 Listelerim</h2><div id="create-list-form"><input type="text" id="new-list-name-input" placeholder="Yeni Liste Adı..."><button id="create-list-button" class="styled-button primary-button">Oluştur</button></div><div id="custom-lists-container"></div>`;
        const container = page.querySelector('#custom-lists-container');
        const listNames = Object.keys(userLists);
        if (listNames.length === 0) {
            container.innerHTML = `<p style="text-align:center; padding: 20px;">Henüz hiç listeniz yok.</p>`;
        } else {
            listNames.forEach(listName => {
                const listEntry = document.createElement('div');
                listEntry.className = 'list-entry';
                const perfumeCount = userLists[listName].length;
                let actionsHTML = '';
                if (listName !== "Favorilerim") {
                    actionsHTML = `<div class="list-actions"><button class="rename-list-btn" title="Yeniden Adlandır">✏️</button><button class="delete-list-btn" title="Sil">🗑️</button></div>`;
                }
                listEntry.innerHTML = `<div class="list-info"><h3>${listName}</h3><span class="perfume-count">${perfumeCount} parfüm</span></div>${actionsHTML}`;
                container.appendChild(listEntry);
                listEntry.querySelector('.list-info').onclick = () => renderListDetailPage(listName);
                if (listName !== "Favorilerim") {
                    listEntry.querySelector('.rename-list-btn').onclick = (e) => { e.stopPropagation(); renameList(listName); };
                    listEntry.querySelector('.delete-list-btn').onclick = (e) => { e.stopPropagation(); deleteList(listName); };
                }
            });
        }
        page.querySelector('#create-list-button').onclick = createNewList;
    };

    const renderListDetailPage = (listName) => {
        showPage('my-lists-page');
        const page = pages['my-lists-page'];
        page.innerHTML = '';
        const header = document.createElement('div');
        header.className = 'list-detail-header';
        const backButton = document.createElement('button');
        backButton.innerHTML = '&lt; Geri';
        backButton.className = 'action-button list-detail-back-button';
        backButton.onclick = () => {
            isInitialLoad = true;
            renderMyListsPage();
            history.replaceState({ page: 'my-lists-page' }, '', '/my-lists');
        };
        const title = document.createElement('h2');
        title.className = 'accent list-detail-title';
        title.textContent = listName;
        header.appendChild(backButton);
        header.appendChild(title);
        page.appendChild(header);
        const perfumeList = userLists[listName];
        const perfumeContainer = document.createElement('div');
        perfumeContainer.id = 'results-list';
        page.appendChild(perfumeContainer);
        if (perfumeList && perfumeList.length > 0) {
            perfumeList.forEach(perfumeName => {
                if (parfum_veritabani[perfumeName]) createPerfumeCard(perfumeName, perfumeContainer);
            });
        } else {
            perfumeContainer.innerHTML = `<p style="text-align:center; padding: 20px;">Bu listede henüz parfüm yok.</p>`;
        }
    };
    
    const renderRightSidebar = () => {
        const sidebarRight = document.getElementById('desktop-sidebar-right');
        if (!sidebarRight || Object.keys(parfum_veritabani).length === 0) return;

        const multiWordBrands = ["Yves Saint Laurent", "Maison Francis Kurkdjian", "Dolce&Gabbana", "Giorgio Armani", "Carolina Herrera", "Jean Paul Gaultier", "Acqua di Parma", "Creed", "Tom Ford", "Viktor&Rolf", "Parfums de Marly", "Maison Martin Margiela", "L'Artisan Parfumeur"];
        const getBrand = (name) => {
            const foundMulti = multiWordBrands.find(b => name.startsWith(b));
            return foundMulti || name.split(' ')[0];
        };

        const allBrands = [...new Set(Object.keys(parfum_veritabani).map(name => getBrand(name)))];
        let randomBrand, brandPerfumes;
        let attempts = 0;

        do {
            randomBrand = allBrands[Math.floor(Math.random() * allBrands.length)];
            brandPerfumes = Object.keys(parfum_veritabani).filter(name => name.startsWith(randomBrand));
            attempts++;
        } while (brandPerfumes.length < 6 && attempts < allBrands.length)

        let brandSpotlightHTML = '';
        if (brandPerfumes.length >= 6) {
            const types = brandPerfumes.map(p => parfum_veritabani[p].koku_turu);
            const typeCounts = types.reduce((acc, type) => { acc[type] = (acc[type] || 0) + 1; return acc; }, {});
            const sortedTypes = Object.keys(typeCounts).sort((a,b) => typeCounts[b] - typeCounts[a]);
            
            let brandDescription = `${randomBrand}, genellikle ${sortedTypes.slice(0, 2).join(' ve ')} gibi koku ailelerinde eserler sunar. `;
            brandDescription += `Marka, zarafeti ve kaliteyi modern bir yorumla bir araya getirmesiyle tanınır.`;

            const shuffled = brandPerfumes.sort(() => 0.5 - Math.random());
            const selectedPerfumes = shuffled.slice(0, 6);
            
            let recommendationsHTML = '';
            selectedPerfumes.forEach(pName => {
                const pData = parfum_veritabani[pName];
                recommendationsHTML += `
                    <div class="brand-perfume-recommendation" data-perfume="${pName}">
                        <div class="color-swatch" style="background-color: ${getColorForText(pName)};"></div>
                        <div class="recommendation-info">
                            <strong>${pName.replace(randomBrand + ' ', '')}:</strong>
                            <span>${pData.vibe || 'Eşsiz bir deneyim için.'}</span>
                        </div>
                    </div>`;
            });

            brandSpotlightHTML = `
                <div class="sidebar-section">
                    <h3>Marka Odağı: ${randomBrand}</h3>
                    <p>${brandDescription}</p>
                    <div class="recommendations-container">
                        ${recommendationsHTML}
                    </div>
                </div>`;
        }
        
        sidebarRight.innerHTML = brandSpotlightHTML;
        if (brandPerfumes.length >= 6) {
            sidebarRight.querySelectorAll('.brand-perfume-recommendation').forEach(el => {
                el.onclick = () => renderDetailPage(el.dataset.perfume);
            });
        }
    };

    const renderLeftSidebar = () => {
        const sidebarLeft = document.getElementById('desktop-sidebar-left');
        if (!sidebarLeft || Object.keys(parfum_veritabani).length === 0) return;

        const allPerfumes = Object.keys(parfum_veritabani);
        const randomPerfumeName = allPerfumes[Math.floor(Math.random() * allPerfumes.length)];
        const data = parfum_veritabani[randomPerfumeName];
        const discoveryHTML = `
            <div class="sidebar-section">
                <h3>Günün Keşfi</h3>
                <div class="sidebar-perfume-card" data-perfume="${randomPerfumeName}">
                    <h4>${randomPerfumeName}</h4>
                    <p>"${data.vibe || 'Bu kokuyla yeni bir his keşfet.'}"</p>
                    <button class="styled-button secondary-button">Detayları Gör</button>
                </div>
            </div>`;

        const randomFact = perfumeFacts[Math.floor(Math.random() * perfumeFacts.length)];
        const factHTML = `
            <div class="sidebar-section">
                <h3>Biliyor muydun?</h3>
                <p>${randomFact}</p>
            </div>`;

        sidebarLeft.innerHTML = discoveryHTML + factHTML;
        sidebarLeft.querySelector('.sidebar-perfume-card').onclick = () => renderDetailPage(randomPerfumeName);
    };
    
    // --- LİSTE YÖNETİMİ ---
    const createNewList = () => {
        const input = document.getElementById('new-list-name-input');
        const listName = input.value.trim();
        if (listName && !userLists.hasOwnProperty(listName)) {
            userLists[listName] = [];
            saveLists();
            renderMyListsPage();
            input.value = '';
            showToast(`'${listName}' listesi oluşturuldu!`);
        } else if (userLists.hasOwnProperty(listName)) {
            showToast('Bu isimde bir liste zaten var!');
        } else {
            showToast('Lütfen geçerli bir liste adı girin.');
        }
    };

    const deleteList = (listName) => {
        if (confirm(`'${listName}' listesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
            delete userLists[listName];
            saveLists();
            renderMyListsPage();
            showToast(`'${listName}' listesi silindi.`);
        }
    };

    const renameList = (oldName) => {
        const newName = prompt("Liste için yeni bir ad girin:", oldName)?.trim();
        if (!newName || newName === oldName) return;
        if (userLists.hasOwnProperty(newName)) {
            showToast("Bu isimde bir liste zaten mevcut!");
            return;
        }
        userLists[newName] = userLists[oldName];
        delete userLists[oldName];
        saveLists();
        renderMyListsPage();
        showToast(`'${oldName}' listesinin adı '${newName}' olarak değiştirildi.`);
    };

    const addPerfumeToList = (perfumeName, listName) => {
        const list = userLists[listName];
        if (list && !list.includes(perfumeName)) {
            list.push(perfumeName);
            saveLists();
            showToast(`'${perfumeName}' ${listName} listesine eklendi!`);
        } else {
            showToast('Bu parfüm zaten bu listede mevcut.');
        }
        closeAddToListModal();
    };

    const toggleFavorite = (perfumeName) => {
        const favList = userLists["Favorilerim"];
        if (!favList) userLists["Favorilerim"] = [];
        const index = favList.indexOf(perfumeName);
        if (index > -1) {
            favList.splice(index, 1);
        } else {
            favList.push(perfumeName);
        }
        saveLists();
    };

    const saveNote = (perfumeName) => {
        const noteInput = document.getElementById('personal-note-input');
        const noteText = noteInput.value.trim();
        if (noteText) {
            personalNotes[perfumeName] = noteText;
        } else {
            delete personalNotes[perfumeName];
        }
        saveNotes();
        showToast('Not kaydedildi!');
    };

    // --- QUIZ FONKSİYONLARI ---
    const startQuiz = (panel = null) => {
        const shuffled = quizQuestions.sort(() => 0.5 - Math.random());
        currentQuizSet = shuffled.slice(0, 4);
        currentQuestionIndex = 0;
        userProfileTags = [];
        if (panel) {
            renderQuestion(panel);
        } else {
            showPage('quiz-page');
            renderQuestion();
        }
    };
    
    const renderQuestion = (panel = null) => {
        const page = panel || pages['quiz-page'];
        const questionData = currentQuizSet[currentQuestionIndex];
        page.innerHTML = `<h3 class="question-text">${questionData.question}</h3><div class="answer-options"></div>`;
        const optionsContainer = page.querySelector('.answer-options');
        questionData.answers.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'answer-button';
            button.textContent = answer.text;
            button.onclick = () => selectAnswer(answer.tags, panel);
            optionsContainer.appendChild(button);
        });
    };
    const selectAnswer = (tags, panel = null) => {
        userProfileTags.push(...tags);
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuizSet.length) {
            renderQuestion(panel);
        } else {
            showQuizResults(panel);
        }
    };

    const calculateQuizScores = () => {
        const scores = {};
        Object.keys(parfum_veritabani).forEach(perfumeName => {
            scores[perfumeName] = 0;
            const perfume = parfum_veritabani[perfumeName];
            userProfileTags.forEach(tag => {
                if (perfume.koku_turu === tag) scores[perfumeName]++;
                if (perfume.mevsim === tag) scores[perfumeName]++;
                if (perfume.kullanim === tag) scores[perfumeName]++;
                if (perfume.cinsiyet === tag) scores[perfumeName]++;
            });
        });
        return Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 4).map(entry => entry[0]);
    };

    const showQuizResults = (panel = null) => {
        const recommendedPerfumes = calculateQuizScores();
        const isPanelQuiz = !!panel;
        const page = panel || pages['quiz-results-page'];
        
        let resultsHTML = `<h3>${isPanelQuiz ? 'İşte Sana Özel Öneriler!' : '🎉 Sana Özel Önerilerimiz!'}</h3><p>Verdiğin cevaplara göre koku profilinle en uyumlu parfümler:</p><div id="${isPanelQuiz ? 'panel-quiz-results-container' : 'quiz-results-container'}"></div>`;
        
        if (isPanelQuiz) {
            resultsHTML += `<button id="restart-panel-quiz-btn" class="styled-button secondary-button" style="margin-top: 20px;">Testi Yeniden Yap</button>`;
        } else {
            resultsHTML += `<button id="restart-quiz-button" class="styled-button secondary-button" style="margin-top: 20px;">Testi Yeniden Yap</button><button id="back-home-button" class="styled-button primary-button" style="margin-top: 10px;">Ana Sayfaya Dön</button>`;
        }
        
        page.innerHTML = resultsHTML;
        const container = page.querySelector(isPanelQuiz ? '#panel-quiz-results-container' : '#quiz-results-container');

        if (recommendedPerfumes.length > 0) {
            recommendedPerfumes.forEach(perfumeName => createPerfumeCard(perfumeName, container));
        } else {
            container.innerHTML = `<p>Sana uygun bir parfüm bulamadık. İstersen testi yeniden dene!</p>`;
        }

        if(isPanelQuiz){
             page.querySelector('#restart-panel-quiz-btn').onclick = () => setupInteractiveQuiz();
        } else {
            page.querySelector('#restart-quiz-button').onclick = () => startQuiz();
            page.querySelector('#back-home-button').onclick = () => showPage('home-page');
            showPage('quiz-results-page');
        }
    };
    
    // --- YARDIMCI FONKSİYONLAR ---
    const createPerfumeCard = (perfumeName, container) => {
        const data = parfum_veritabani[perfumeName];
        if (!data) return;
        const card = document.createElement('div');
        card.className = 'perfume-card';
        card.onclick = () => renderDetailPage(perfumeName);
        card.innerHTML = `<div class="color-swatch" style="background-color: ${getColorForText(perfumeName)};"></div><div class="perfume-info"><h3>${perfumeName}</h3><p class="stars">${data.yildiz || ''}</p></div>`;
        container.appendChild(card);
    };
    
    const openAddToListModal = (perfumeName) => {
        const modal = document.getElementById('add-to-list-modal');
        const listContainer = document.getElementById('modal-list-container');
        listContainer.innerHTML = '';
        const customLists = Object.keys(userLists).filter(name => name !== "Favorilerim");

        if (customLists.length === 0) {
            listContainer.innerHTML = `<p style="text-align:center;">Önce yeni bir liste oluşturmalısınız.</p>`;
        } else {
            customLists.forEach(listName => {
                const listButton = document.createElement('button');
                listButton.className = 'styled-button';
                listButton.textContent = listName;
                listButton.onclick = () => addPerfumeToList(perfumeName, listName);
                listContainer.appendChild(listButton);
            });
        }
        modal.style.display = 'flex';
    };
    
    const closeAddToListModal = () => document.getElementById('add-to-list-modal').style.display = 'none';
    
    const sharePerfume = (perfumeName) => {
        const url = new URL(window.location);
        url.pathname = `/perfume/${encodeURIComponent(perfumeName.replace(/ /g, '_'))}`;
        url.hash = '';
        const shareData = {
            title: 'Parfüm Küratörü',
            text: `Sana harika bir koku önerim var: ${perfumeName}`,
            url: url.href
        };
        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareData.url).then(() => showToast('Paylaşım linki kopyalandı!'));
        }
    };
    
    const populateSelect = (elementId, data, property, displayName) => {
        const select = document.getElementById(elementId);
        if(!select) return;
        const uniqueValues = [...new Set(Object.values(data).map(p => p[property]).filter(Boolean))];
        const sortedValues = uniqueValues.sort();
        select.innerHTML = `<option value="Tümü">${displayName}: Tümü</option>`;
        sortedValues.forEach(val => { 
            const option = document.createElement('option'); 
            option.value = val; 
            option.textContent = val.charAt(0).toUpperCase() + val.slice(1); 
            select.appendChild(option); 
        });
    };

    const setupThemeToggle = () => {
        const toggleButton = document.getElementById('theme-toggle-button');
        const body = document.body;
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') { 
            body.classList.add('light-mode'); 
            toggleButton.textContent = '☀️'; 
        } else { 
            toggleButton.textContent = '🌙'; 
        }
        toggleButton.addEventListener('click', () => { 
            body.classList.toggle('light-mode'); 
            const isLight = body.classList.contains('light-mode'); 
            localStorage.setItem('theme', isLight ? 'light' : 'dark'); 
            toggleButton.textContent = isLight ? '☀️' : '🌙'; 
        });
    };

    const checkForSharedLink = () => {
        const path = window.location.pathname;
        if (path.startsWith('/perfume/')) {
            const perfumeName = decodeURIComponent(path.substring('/perfume/'.length).replace(/_/g, ' '));
            if (Object.keys(parfum_veritabani).length > 0 && parfum_veritabani[perfumeName]) {
                renderDetailPage(perfumeName);
                return true;
            }
        }
        return false;
    };
    
    const filterPerfumes = () => {
        const searchTermInput = document.getElementById('search-input');
        if(!searchTermInput) return Object.keys(parfum_veritabani);
        
        const searchTerm = searchTermInput.value.toLowerCase();
        const gender = document.getElementById('gender-select').value;
        const season = document.getElementById('season-select').value;
        const usage = document.getElementById('usage-select').value;
        const scentType = document.getElementById('scent-type-select').value;
        
        let filtered = Object.keys(parfum_veritabani).filter(name => {
            const p = parfum_veritabani[name];
            if (!p) return false;
            
            const p_notalar = (typeof p.notalar === 'string' ? p.notalar : (p.notalar ? Object.values(p.notalar).join(' ') : ''));
            const usageMatch = (usage === 'Tümü' || p.kullanim === usage || (p.kullanim === 'her zaman' && (usage === 'gündüz' || usage === 'gece')));
            
            const searchMatch = (searchTerm === '' || 
                               name.toLowerCase().includes(searchTerm) || 
                               p_notalar.toLowerCase().includes(searchTerm) || 
                               (p.hikaye && p.hikaye.toLowerCase().includes(searchTerm)) || 
                               (p.vibe && p.vibe.toLowerCase().includes(searchTerm)));

            return searchMatch && 
                   (gender === 'Tümü' || p.cinsiyet === gender) && 
                   (season === 'Tümü' || p.mevsim === season) && 
                   usageMatch && 
                   (scentType === 'Tümü' || p.koku_turu === scentType);
        });

        const sortValue = document.getElementById('sort-select').value;
        filtered.sort((a, b) => {
            const perfumeA = parfum_veritabani[a];
            const perfumeB = parfum_veritabani[b];

            switch (sortValue) {
                case 'z-a': return b.localeCompare(a);
                case 'star-desc': return (perfumeB.yildiz?.length || 0) - (perfumeA.yildiz?.length || 0);
                case 'star-asc': return (perfumeA.yildiz?.length || 0) - (perfumeB.yildiz?.length || 0);
                default: return a.localeCompare(b);
            }
        });

        return filtered;
    };

    // --- MASAÜSTÜ ÖZELLİKLERİ ---
    const renderWeeklyPicks = () => {
        const picksContainer = document.getElementById('weekly-picks-panel');
        if (!picksContainer) return;

        picksContainer.innerHTML = '<h3>Haftanın Popülerleri</h3><div id="weekly-picks-list"></div>';
        const listElement = document.getElementById('weekly-picks-list');

        const topPerfumes = Object.keys(parfum_veritabani).filter(name => parfum_veritabani[name].yildiz === "★★★★★");
        
        const shuffled = topPerfumes.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 6);

        selected.forEach(perfumeName => createPerfumeCard(perfumeName, listElement));
    };

    const setupInteractiveQuiz = () => {
        const quizPanel = document.getElementById('quiz-promo-panel');
        if (!quizPanel) return;

        quizPanel.innerHTML = `
            <h3>Koku Kimliğini Keşfet</h3>
            <p>Sadece birkaç basit soruyla sana en uygun, ruhunu yansıtan parfümü bulalım. Kişisel koku zevkini keşfetmeye hazır mısın?</p>
            <button id="promo-quiz-start-btn" class="styled-button primary-button">Teste Başla</button>
        `;

        document.getElementById('promo-quiz-start-btn').onclick = () => startQuiz(quizPanel);
    };
    
    // --- BAŞLANGIÇ YÖNETİMİ ---
    const handleInitialLoad = () => {
        if (checkForSharedLink()) {
            return;
        }

        const path = window.location.pathname;
        let pageIdToLoad = 'home-page';

        if (path && path !== '/' && path !== '/index.html') {
            const potentialId = path.substring(1) + '-page';
            if (pages[potentialId]) {
                pageIdToLoad = potentialId;
            }
        }
        showPage(pageIdToLoad);
    };

    const init = () => {
        loadData();

        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                showPage(event.state.page, true);
            } else {
                handleInitialLoad();
            }
        });

        fetch('parfumler.json')
            .then(response => { if (!response.ok) throw new Error('Ağ yanıtı sorunlu'); return response.json(); })
            .then(data => {
                parfum_veritabani = data;
                
                document.getElementById('search-button').onclick = renderPerfumes;
                document.getElementById('surprise-button').onclick = () => {
                    const allPerfumes = Object.keys(parfum_veritabani);
                    const randomPerfume = allPerfumes[Math.floor(Math.random() * allPerfumes.length)];
                    renderDetailPage(randomPerfume);
                };
                document.getElementById('start-quiz-button').onclick = () => {
                    if (window.innerWidth >= 1200) {
                        const quizPanel = document.getElementById('quiz-promo-panel');
                        quizPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        startQuiz(quizPanel);
                    } else {
                        startQuiz();
                    }
                };
                
                document.getElementById('nav-home').onclick = () => showPage('home-page');
                document.getElementById('nav-lists').onclick = () => showPage('my-lists-page');
                document.getElementById('close-modal-button').onclick = closeAddToListModal;
                document.getElementById('add-to-list-modal').onclick = (e) => { if (e.target.id === 'add-to-list-modal') closeAddToListModal(); };
                
                document.getElementById('sort-select').addEventListener('change', renderPerfumes);

                populateSelect('gender-select', parfum_veritabani, 'cinsiyet', 'Cinsiyet');
                populateSelect('season-select', parfum_veritabani, 'mevsim', 'Mevsim');
                populateSelect('usage-select', parfum_veritabani, 'kullanim', 'Kullanım');
                populateSelect('scent-type-select', parfum_veritabani, 'koku_turu', 'Koku Türü');
                renderLeftSidebar();
                renderRightSidebar();
                setupThemeToggle();
                setupInteractiveQuiz();
                renderWeeklyPicks();

                if ('serviceWorker' in navigator) {
                    window.addEventListener('load', () => {
                        navigator.serviceWorker.register('./servis-calisani.js').then(reg => console.log('Servis Çalışanı kaydedildi.')).catch(err => console.log('Servis Çalışanı hatası:', err));
                    });
                }
                
                handleInitialLoad();
            })
            .catch(error => {
                console.error('Veritabanı yüklenemedi:', error);
                const resultsList = document.getElementById('results-list');
                if(resultsList) resultsList.innerHTML = '<p style="text-align:center; padding: 20px; color: red;">Parfüm veritabanı yüklenemedi. Dosyaların doğru yerde olduğundan emin olun.</p>';
            });
    };

    init();
});