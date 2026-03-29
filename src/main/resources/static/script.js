const API_BASE = '/api/places';
let currentCategory = '';
let currentLang = localStorage.getItem('lang') || 'th';
let favorites = JSON.parse(localStorage.getItem('utcc_favorites') || '[]');

// DOM Elements
const placesGrid = document.getElementById('placesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterTags = document.querySelectorAll('.filter-tag');

// Modal Elements
const addModal = document.getElementById('addModal');
const addPlaceBtn = document.getElementById('addPlaceBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const addPlaceForm = document.getElementById('addPlaceForm');

// Map Building Static Data 
const BUILDING_DATA = {
    'อาคาร 24': {
        title: 'อาคาร 24 (สัญลักษณ์ ม.)',
        desc: 'อาคารเรียนรวมมโหฒาร ศูนย์รวมนักศึกษา คาเฟ่ชื่อดัง และห้องสมุดที่ทันสมัยที่สุดในแคมปัส พิกัดหลักสำหรับการนัดเจอเพื่อนๆ!',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 10': {
        title: 'อาคาร 10 (อเนกประสงค์)',
        desc: 'ตึกเรียนสำหรับวิชาพื้นฐาน มีโรงอาหารขนาดย่อม และจุดนั่งทำงานหรืออ่านหนังสือใต้ตึกที่เย็นสบาย',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 9': {
        title: 'อาคาร 9',
        desc: 'ศูนย์รวมของคณะทางด้านศิลปะและภาษา มีมุมถ่ายรูปสวยๆ เยอะมาก',
        image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=600'
    }
};

let currentSelectedBuilding = '';

// Map Interaction
function openBuildingInfo(buildingKey) {
    const data = BUILDING_DATA[buildingKey];
    if(!data) return;
    
    currentSelectedBuilding = buildingKey;
    document.getElementById('panelBldgName').innerText = data.title;
    document.getElementById('panelBldgDesc').innerText = data.desc;
    document.getElementById('panelBldgImg').src = data.image;
    
    document.getElementById('buildingInfoPanel').classList.add('active');
}

function closeBuildingInfo() {
    document.getElementById('buildingInfoPanel').classList.remove('active');
}

function searchFromPanel() {
    searchInput.value = currentSelectedBuilding;
    handleSearch();
    closeBuildingInfo();
    document.getElementById('placesGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchPlaces();
    updateFavBadge();
    applyStoredSettings();
});
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleSearch(); });

addPlaceBtn.addEventListener('click', () => addModal.classList.add('active'));
closeModalBtn.addEventListener('click', () => addModal.classList.remove('active'));
addModal.addEventListener('click', (e) => { if(e.target === addModal) addModal.classList.remove('active'); });

addPlaceForm.addEventListener('submit', handleAddPlace);

filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        currentCategory = tag.dataset.category;
        
        if (currentCategory) {
            fetchPlacesByCategory(currentCategory);
        } else {
            fetchPlaces();
        }
    });
});

// ====== FAVORITES SYSTEM ======
function toggleFavorite(placeId, placeName, placeImg, placeCategory) {
    const idx = favorites.findIndex(f => f.id === placeId);
    if (idx === -1) {
        favorites.push({ id: placeId, name: placeName, image: placeImg, category: placeCategory });
    } else {
        favorites.splice(idx, 1);
    }
    localStorage.setItem('utcc_favorites', JSON.stringify(favorites));
    updateFavBadge();
    renderFavList();
    // Re-render heart icon state on card
    const btn = document.querySelector(`.fav-btn[data-id="${placeId}"]`);
    if (btn) {
        const isFav = favorites.some(f => f.id === placeId);
        btn.classList.toggle('is-fav', isFav);
        btn.title = isFav ? 'ยกเลิกรายการโปรด' : 'เพิ่มในรายการโปรด';
    }
}

function updateFavBadge() {
    const badge = document.getElementById('favCountBadge');
    if (favorites.length > 0) {
        badge.style.display = 'flex';
        badge.textContent = favorites.length;
    } else {
        badge.style.display = 'none';
    }
}

function renderFavList() {
    const list = document.getElementById('favList');
    if (favorites.length === 0) {
        list.innerHTML = `<div class="fav-empty"><i class='bx bx-heart'></i><p>ยังไม่มีรายการโปรด</p><small>กดไอคอน ♡ บนการ์ดสถานที่เพื่อบันทึก</small></div>`;
        return;
    }
    list.innerHTML = favorites.map(f => `
        <div class="fav-item">
            <img src="${f.image}" alt="${f.name}" class="fav-item-img" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=100'">
            <div class="fav-item-info">
                <div class="fav-item-name">${f.name}</div>
                <div class="fav-item-cat">${translateCategory(f.category)}</div>
            </div>
            <button class="fav-remove-btn" onclick="toggleFavorite('${f.id}', '${f.name}', '${f.image}', '${f.category}')" title="ลบออก"><i class='bx bx-x'></i></button>
        </div>
    `).join('');
}

function toggleFavPanel() {
    renderFavList();
    const panel = document.getElementById('favPanel');
    const back = document.getElementById('panelBackdrop');
    document.getElementById('settingsPanel').classList.remove('active');
    panel.classList.toggle('active');
    back.classList.toggle('active', panel.classList.contains('active'));
}

// ====== SETTINGS SYSTEM ======
function toggleSettingsPanel() {
    const panel = document.getElementById('settingsPanel');
    const back = document.getElementById('panelBackdrop');
    document.getElementById('favPanel').classList.remove('active');
    panel.classList.toggle('active');
    back.classList.toggle('active', panel.classList.contains('active'));
}

function closeAllPanels() {
    document.getElementById('favPanel').classList.remove('active');
    document.getElementById('settingsPanel').classList.remove('active');
    document.getElementById('panelBackdrop').classList.remove('active');
}

function toggleDarkMode(enabled) {
    document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
    localStorage.setItem('darkMode', enabled ? 'dark' : 'light');
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.getElementById('langTH').classList.toggle('active', lang === 'th');
    document.getElementById('langEN').classList.toggle('active', lang === 'en');
    // Re-fetch & re-render to apply language
    if(currentCategory) fetchPlacesByCategory(currentCategory);
    else fetchPlaces();
}

function setCardSize(size) {
    const grid = document.getElementById('placesGrid');
    grid.classList.remove('size-small', 'size-large');
    if (size === 'small') grid.classList.add('size-small');
    if (size === 'large') grid.classList.add('size-large');
    localStorage.setItem('cardSize', size);
    ['sizeNormal', 'sizeSmall', 'sizeLarge'].forEach(id => document.getElementById(id).classList.remove('active'));
    document.getElementById(size === 'normal' ? 'sizeNormal' : size === 'small' ? 'sizeSmall' : 'sizeLarge').classList.add('active');
}

function applyStoredSettings() {
    const dark = localStorage.getItem('darkMode');
    if (dark === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('darkModeToggle').checked = true;
    }
    const size = localStorage.getItem('cardSize');
    if (size) setCardSize(size);
    const lang = localStorage.getItem('lang') || 'th';
    setLanguage(lang);
}

function translateCategory(cat) {
    if (currentLang === 'en') {
        if(cat === 'Restaurant') return 'Restaurant';
        if(cat === 'Cafe') return 'Café';
        if(cat === 'Study Area') return 'Study Area';
        return 'Other';
    }
    if(cat === 'Restaurant') return 'ร้านอาหาร';
    if(cat === 'Cafe') return 'คาเฟ่';
    if(cat === 'Study Area') return 'ที่อ่านหนังสือ';
    return 'ทั่วไป';
}

// API Calls
async function fetchPlaces() {
    showLoading();
    try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        renderPlaces(data);
    } catch (err) {
        showError('ไม่สามารถดึงข้อมูลได้ กรุณาลองตรวจสอบเซิร์ฟเวอร์');
        console.error(err);
    }
}

async function handleSearch() {
    const q = searchInput.value.trim();
    if (!q) return fetchPlaces();
    
    showLoading();
    try {
        const res = await fetch(`${API_BASE}/search?name=${encodeURIComponent(q)}`);
        const data = await res.json();
        renderPlaces(data);
    } catch (err) {
        showError('ค้นหาข้อมูลล้มเหลว');
    }
}

async function fetchPlacesByCategory(cat) {
    showLoading();
    try {
        const res = await fetch(`${API_BASE}/category?category=${encodeURIComponent(cat)}`);
        const data = await res.json();
        renderPlaces(data);
    } catch (err) {
        showError('กรองข้อมูลล้มเหลว');
    }
}

async function handleAddPlace(e) {
    e.preventDefault();
    
    // Convert tags string to array
    const tagsRaw = document.getElementById('pTags').value;
    const tagsArray = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(t => t) : [];
    
    // Provide a default image if empty
    let imageUrl = document.getElementById('pImage').value;
    if(!imageUrl) {
        const cat = document.getElementById('pCategory').value;
        if(cat === 'Restaurant') imageUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600';
        else if(cat === 'Cafe') imageUrl = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600';
        else imageUrl = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600';
    }

    const newPlace = {
        name: document.getElementById('pName').value,
        description: document.getElementById('pDesc').value,
        category: document.getElementById('pCategory').value,
        address: document.getElementById('pAddress').value,
        images: [imageUrl],
        tags: tagsArray
    };

    try {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlace)
        });
        
        if(res.ok) {
            addModal.classList.remove('active');
            addPlaceForm.reset();
            // Refresh list dynamically depending on current view
            if(currentCategory) fetchPlacesByCategory(currentCategory);
            else fetchPlaces();
        } else {
            alert('เพิ่มข้อมูลไม่สำเร็จ อาจเกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์');
        }
    } catch (err) {
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่');
    }
}

// Delete Data
async function deletePlace(id) {
    if (!confirm('ยืนยันที่จะลบข้อมูลสถานที่นี้?')) return;
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        if(res.ok) {
            // Refresh list
            if(currentCategory) fetchPlacesByCategory(currentCategory);
            else fetchPlaces();
        } else {
            alert('ลบข้อมูลไม่สำเร็จ');
        }
    } catch (err) {
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    }
}

// UI Rendering
function renderPlaces(places) {
    if (!places || places.length === 0) {
        placesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #475569; padding: 4rem;">
                <i class='bx bx-news' style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>ไม่พบข้อมูลในระบบ</p>
                <p style="font-size:0.85rem; margin-top:0.5rem">ลองเพิ่มสถานที่ใหม่ผ่านเมนูด้านบน</p>
            </div>
        `;
        return;
    }

    placesGrid.innerHTML = places.map((place, index) => {
        const img = (place.images && place.images.length > 0) ? place.images[0] : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600';
        const tagsHtml = (place.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
        const catText = translateCategory(place.category);
        const delay = index * 0.08;
        const isFav = favorites.some(f => f.id === place.id);
        
        return `
            <div class="place-card" style="animation-delay: ${delay}s">
                <div class="card-img-wrapper">
                    <img src="${img}" alt="${place.name}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600';">
                    <button class="fav-btn ${isFav ? 'is-fav' : ''}" data-id="${place.id}" 
                        onclick="toggleFavorite('${place.id}', '${place.name}', '${img}', '${place.category}')"
                        title="${isFav ? 'ยกเลิกรายการโปรด' : 'เพิ่มในรายการโปรด'}">
                        <i class='bx ${isFav ? 'bxs-heart' : 'bx-heart'}'></i>
                    </button>
                </div>
                <div class="card-content">
                    <div class="card-category">${catText}</div>
                    <h3 class="card-title">${place.name}</h3>
                    <p class="card-desc">${place.description || '-'}</p>
                    <div class="card-tags">${tagsHtml}</div>
                    <div class="card-footer">
                        <span><i class='bx bx-map'></i> ${place.address || 'ไม่ระบุพิกัด'}</span>
                        <div style="display:flex; gap:0.5rem;">
                            <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="alert('ระบบรีวิวกำลังพัฒนา!')"><i class='bx bx-comment-detail'></i> รีวิว</button>
                            <button class="btn-danger" onclick="deletePlace('${place.id}')" title="ลบข้อมูล"><i class='bx bx-trash'></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showLoading() {
    placesGrid.innerHTML = `<div class="loading"><i class='bx bx-loader-alt bx-spin'></i> กำลังโหลดข้อมูล...</div>`;
}

function showError(msg) {
    placesGrid.innerHTML = `<div class="loading" style="color: #ef4444;"><i class='bx bx-error-circle'></i> ${msg}</div>`;
}
