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

// Map Building Static Data  (merged with localStorage edits)
const DEFAULT_BUILDING_DATA = {
    'อาคาร 1': {
        title: 'อาคาร 1',
        desc: 'อาคารเรียนรวมสำหรับนักศึกษาชั้นปีต้น มีห้องเรียนขนาดใหญ่สำหรับวิชาพื้นฐาน',
        floors: '5 ชั้น', faculty: 'เรียนรวม / วิชาพื้นฐาน', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียนขนาดใหญ่, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 3': {
        title: 'อาคาร 3',
        desc: 'อาคารเรียนและสำนักงานคณะต่างๆ มีลานกิจกรรมด้านหน้าสำหรับนักศึกษา',
        floors: '6 ชั้น', faculty: 'คณะต่างๆ', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียน, ลานกิจกรรม, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 5': {
        title: 'อาคาร 5',
        desc: 'อาคารสูงฝั่งขวาของแคมปัส ใช้เป็นที่ตั้งของหน่วยงานสนับสนุนการเรียนการสอน',
        floors: '8 ชั้น', faculty: 'หน่วยงานสนับสนุน', hours: '08:00 – 18:00',
        facilities: 'ห้องประชุม, ห้องน้ำ, ลิฟต์',
        image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 7': {
        title: 'อาคาร 7',
        desc: 'อาคารเรียนกลางแคมปัส เชื่อมต่อกับอาคาร 9 ผ่านทางเดินสะพานลอย',
        floors: '6 ชั้น', faculty: 'หลายคณะ', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียน, สะพานลอย, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 8': {
        title: 'อาคาร 8',
        desc: 'อาคารเรียนฝั่งซ้าย มีห้องปฏิบัติการและห้องสัมมนาขนาดย่อม',
        floors: '7 ชั้น', faculty: 'คณะวิทยาศาสตร์และเทคโนโลยี', hours: '07:30 – 19:00',
        facilities: 'Lab คอมพิวเตอร์, ห้องสัมมนา, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 9': {
        title: 'อาคาร 9',
        desc: 'ศูนย์รวมของคณะทางด้านศิลปะและภาษา มีมุมถ่ายรูปสวยๆ เยอะมาก',
        floors: '8 ชั้น', faculty: 'คณะมนุษยศาสตร์และประยุกต์ศิลป์', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียน, ลานกิจกรรม, ร้านกาแฟ, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 14': {
        title: 'อาคาร 14',
        desc: 'อาคารฝั่งซ้ายสุดของแคมปัส ใช้สำหรับการเรียนการสอนและที่จอดรถ',
        floors: '4 ชั้น', faculty: 'ที่จอดรถ / หน่วยงาน', hours: '06:00 – 22:00',
        facilities: 'ที่จอดรถ, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 15': {
        title: 'อาคาร 15',
        desc: 'อาคารกีฬาและสระว่ายน้ำ ศูนย์รวมกีฬาของมหาวิทยาลัย',
        floors: '3 ชั้น', faculty: 'ศูนย์กีฬา', hours: '06:00 – 21:00',
        facilities: 'สระว่ายน้ำ, โรงยิม, ห้องฟิตเนส, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 18': {
        title: 'อาคาร 18',
        desc: 'อาคารเรียนและสำนักงานส่วนกลาง มีลานอเนกประสงค์ใต้ตึก',
        floors: '6 ชั้น', faculty: 'สำนักงานส่วนกลาง', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียน, ลาน, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 19': {
        title: 'อาคาร 19',
        desc: 'อาคารฝั่งล่างขวาของแคมปัส ใกล้สระว่ายน้ำและลานกีฬากลางแจ้ง',
        floors: '4 ชั้น', faculty: 'คณะนิติศาสตร์', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียน, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 20': {
        title: 'อาคาร 20',
        desc: 'อาคารจอดรถหลักของมหาวิทยาลัย บริเวณทางเข้าฝั่งซ้าย',
        floors: '8 ชั้น', faculty: 'อาคารจอดรถ', hours: '06:00 – 22:00',
        facilities: 'ที่จอดรถหลายร้อยคัน, บันไดเลื่อน',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 21': {
        title: 'อาคาร 21',
        desc: 'อาคารด้านขวากลาง เชื่อมกับอาคาร 22 มีห้องเรียนและห้องปฏิบัติการ',
        floors: '7 ชั้น', faculty: 'คณะบริหารธุรกิจ', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียน, Lab, ห้องน้ำ, ลิฟต์',
        image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 22': {
        title: 'อาคาร 22',
        desc: 'อาคารฝั่งขวา มีห้องสัมมนา ห้องประชุม และสำนักงานคณาจารย์',
        floors: '6 ชั้น', faculty: 'คณะบัญชี', hours: '07:30 – 19:30',
        facilities: 'ห้องสัมมนา, ห้องประชุม, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 23': {
        title: 'อาคาร 23',
        desc: 'อาคารกลางฝั่งขวา ใช้เป็นที่เรียนและจัดกิจกรรมนักศึกษา',
        floors: '5 ชั้น', faculty: 'คณะเศรษฐศาสตร์', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียน, ลานกิจกรรม, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 24': {
        title: 'อาคาร 24 (ตึกเรือใบ)',
        desc: 'อาคารสัญลักษณ์ของ ม.หอการค้าไทย ทรงเรือใบโดดเด่น เป็นที่ตั้งสำนักทะเบียน ห้องสมุด และคาเฟ่ชื่อดัง',
        floors: '12 ชั้น', faculty: 'สำนักทะเบียน / ห้องสมุด', hours: '07:00 – 21:00',
        facilities: 'ห้องสมุด, คาเฟ่, ATM, สำนักทะเบียน, ลิฟต์',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 25': {
        title: 'อาคาร 25',
        desc: 'อาคารเรียนติดกับตึกเรือใบ ใช้เป็นห้องเรียนบรรยายขนาดใหญ่และห้องสอบ',
        floors: '8 ชั้น', faculty: 'เรียนรวม / ห้องสอบ', hours: '07:00 – 20:00',
        facilities: 'ห้องบรรยาย, ห้องสอบ, ห้องน้ำ, ลิฟต์',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'
    }
};

// Merge with any user-saved edits from localStorage
function loadBuildingData() {
    const saved = localStorage.getItem('utcc_building_data');
    if (!saved) return JSON.parse(JSON.stringify(DEFAULT_BUILDING_DATA));
    const overrides = JSON.parse(saved);
    const merged = JSON.parse(JSON.stringify(DEFAULT_BUILDING_DATA));
    Object.keys(overrides).forEach(k => { merged[k] = { ...merged[k], ...overrides[k] }; });
    return merged;
}

let BUILDING_DATA = loadBuildingData();
let currentSelectedBuilding = '';
let buildingEditMode = false;

// ── Building Panel ─────────────────────────
function openBuildingInfo(buildingKey) {
    const data = BUILDING_DATA[buildingKey];
    currentSelectedBuilding = buildingKey;

    // If no data yet, create a blank entry so user can fill it in
    if (!data) {
        BUILDING_DATA[buildingKey] = {
            title: buildingKey, desc: '', floors: '', faculty: '',
            hours: '', facilities: '',
            image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'
        };
    }

    populateBuildingPanel(buildingKey);
    // Show view mode
    showBuildingViewMode();
    document.getElementById('buildingInfoPanel').classList.add('active');
}

function populateBuildingPanel(key) {
    const d = BUILDING_DATA[key];
    document.getElementById('panelBldgName').textContent = d.title || key;
    document.getElementById('panelBldgDesc').textContent = d.desc || 'ยังไม่มีข้อมูล กดปุ่มแก้ไขเพื่อเพิ่มรายละเอียด';
    document.getElementById('panelBldgImg').src = d.image || '';
    document.getElementById('panelBldgTag').textContent = d.faculty || 'อาคารมหาวิทยาลัย';
    document.getElementById('pdFloors').textContent = d.floors || '—';
    document.getElementById('pdFaculty').textContent = d.faculty || '—';
    document.getElementById('pdHours').textContent = d.hours || '—';
    document.getElementById('pdFacilities').textContent = d.facilities || '—';
}

function showBuildingViewMode() {
    buildingEditMode = false;
    document.getElementById('panelViewMode').style.display = 'flex';
    document.getElementById('panelEditMode').style.display = 'none';
    document.getElementById('panelEditBtn').innerHTML = "<i class='bx bx-edit'></i>";
}

function toggleBuildingEdit() {
    if (!buildingEditMode) {
        // Enter edit mode
        buildingEditMode = true;
        const d = BUILDING_DATA[currentSelectedBuilding];
        document.getElementById('peTitle').value = d.title || '';
        document.getElementById('peDesc').value = d.desc || '';
        document.getElementById('peImage').value = d.image || '';
        document.getElementById('peFloors').value = d.floors || '';
        document.getElementById('peHours').value = d.hours || '';
        document.getElementById('peFaculty').value = d.faculty || '';
        document.getElementById('peFacilities').value = d.facilities || '';
        document.getElementById('panelViewMode').style.display = 'none';
        document.getElementById('panelEditMode').style.display = 'flex';
        document.getElementById('panelEditBtn').innerHTML = "<i class='bx bx-x'></i>";
    } else {
        showBuildingViewMode();
    }
}

function saveBuildingEdit() {
    const key = currentSelectedBuilding;
    const updated = {
        title: document.getElementById('peTitle').value.trim() || key,
        desc: document.getElementById('peDesc').value.trim(),
        image: document.getElementById('peImage').value.trim() || BUILDING_DATA[key].image,
        floors: document.getElementById('peFloors').value.trim(),
        hours: document.getElementById('peHours').value.trim(),
        faculty: document.getElementById('peFaculty').value.trim(),
        facilities: document.getElementById('peFacilities').value.trim()
    };
    BUILDING_DATA[key] = { ...BUILDING_DATA[key], ...updated };

    // Persist overrides
    const saved = JSON.parse(localStorage.getItem('utcc_building_data') || '{}');
    saved[key] = updated;
    localStorage.setItem('utcc_building_data', JSON.stringify(saved));

    populateBuildingPanel(key);
    showBuildingViewMode();
    // Small toast-like feedback
    const btn = document.getElementById('panelEditBtn');
    btn.innerHTML = "<i class='bx bx-check'></i>";
    btn.style.color = '#10b981';
    setTimeout(() => { btn.innerHTML = "<i class='bx bx-edit'></i>"; btn.style.color = ''; }, 2000);
}

function closeBuildingInfo() {
    document.getElementById('buildingInfoPanel').classList.remove('active');
    buildingEditMode = false;
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
