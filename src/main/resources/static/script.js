const API_UNIVERSITY_ITEMS = '/api/university/items'; // New API endpoint
const API_PLACES = '/api/places'; // API for places
const API_BUILDINGS = '/api/buildings'; // API for buildings

let currentCategory = '';
let currentSearchQuery = ''; // Track current search query
let currentLang = localStorage.getItem('lang') || 'th';
let favorites = JSON.parse(localStorage.getItem('utcc_favorites') || '[]');
let allUniversityItems = []; // Store all fetched items for client-side filtering

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
// This data is now primarily for map hotspots, actual building data comes from API
const DEFAULT_BUILDING_DATA = {
    'อาคาร 01': {
        title: 'อาคาร 01',
        desc: 'อาคารเรียนรวมสำหรับนักศึกษาชั้นปีต้น มีห้องเรียนขนาดใหญ่สำหรับวิชาพื้นฐาน',
        floors: '5 ชั้น', faculty: 'เรียนรวม / วิชาพื้นฐาน', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียนขนาดใหญ่, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 03': {
        title: 'อาคาร 03',
        desc: 'อาคารเรียนและสำนักงานคณะต่างๆ มีลานกิจกรรมด้านหน้าสำหรับนักศึกษา',
        floors: '6 ชั้น', faculty: 'คณะต่างๆ', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียน, ลานกิจกรรม, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 05': {
        title: 'อาคาร 05',
        desc: 'อาคารสูงฝั่งขวาของแคมปัส ใช้เป็นที่ตั้งของหน่วยงานสนับสนุนการเรียนการสอน',
        floors: '8 ชั้น', faculty: 'หน่วยงานสนับสนุน', hours: '08:00 – 18:00',
        facilities: 'ห้องประชุม, ห้องน้ำ, ลิฟต์',
        image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 07': {
        title: 'อาคาร 07',
        desc: 'อาคารเรียนกลางแคมปัส เชื่อมต่อกับอาคาร 9 ผ่านทางเดินสะพานลอย',
        floors: '6 ชั้น', faculty: 'หลายคณะ', hours: '07:00 – 20:00',
        facilities: 'ห้องเรียน, สะพานลอย, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 08': {
        title: 'อาคาร 08',
        desc: 'อาคารเรียนฝั่งซ้าย มีห้องปฏิบัติการและห้องสัมมนาขนาดย่อม',
        floors: '7 ชั้น', faculty: 'คณะวิทยาศาสตร์และเทคโนโลยี', hours: '07:30 – 19:00',
        facilities: 'Lab คอมพิวเตอร์, ห้องสัมมนา, ห้องน้ำ',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'
    },
    'อาคาร 09': {
        title: 'อาคาร 09',
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

let BUILDING_DATA = JSON.parse(JSON.stringify(DEFAULT_BUILDING_DATA));

// Fetch from API and merge
async function loadBuildingData() {
    try {
        // This now fetches all university items, not just buildings
        const res = await fetch(API_UNIVERSITY_ITEMS);
        if (res.ok) {
            const itemsFromApi = await res.json();
            // Filter for buildings and merge their data into BUILDING_DATA for map hotspots
            itemsFromApi.filter(item => item.type === 'building').forEach(b => {
                // Use buildingKey as the primary key
                if (b.buildingKey) {
                    BUILDING_DATA[b.buildingKey] = { ...BUILDING_DATA[b.buildingKey], ...b };
                }
            });
            updatePhotoBadges();
        }
    } catch (e) {
        console.error('Failed to load buildings from API, falling back to local defaults', e);
    }
}

function updatePhotoBadges() {
    // Update all hotspot-tooltip spans to show photo count badge
    document.querySelectorAll('.map-hotspot').forEach(hotspot => {
        const tooltip = hotspot.querySelector('.hotspot-tooltip');
        if (!tooltip) return;
        // get the building key from the onclick attribute
        const onclick = hotspot.getAttribute('onclick') || '';
        const match = onclick.match(/openBuildingInfo\('([^']+)'\)/);
        if (!match) return;
        const key = match[1];
        const d = BUILDING_DATA[key];
        if (!d) return;
        const count = (d.images && d.images.length > 0) ? d.images.length : (d.image ? 1 : 0);
        // Remove existing badge
        const existingBadge = tooltip.querySelector('.hotspot-photo-badge');
        if (existingBadge) existingBadge.remove();
        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'hotspot-photo-badge';
            badge.innerHTML = `🖼️${count}`;
            tooltip.appendChild(badge);
        }
    });
}
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
            image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600',
            images: []
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
    document.getElementById('panelBldgDesc').textContent = d.description || d.desc || 'ยังไม่มีข้อมูล กดปุ่มแก้ไขเพื่อเพิ่มรายละเอียด';
    
    // Render Gallery
    const gallery = document.getElementById('panelBldgGallery');
    gallery.innerHTML = '';
    const imagesToRender = [];
    if (d.images && d.images.length > 0) {
        imagesToRender.push(...d.images);
    } else if (d.image) {
        imagesToRender.push(d.image);
    }
    
    if (imagesToRender.length > 0) {
        imagesToRender.forEach((imgUrl, idx) => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'panel-gallery-img';
            img.title = 'กดเพื่อดูรูปขนาดใหญ่';
            img.onerror = function() { this.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'; };
            img.onclick = () => openLightbox(imagesToRender, idx);
            gallery.appendChild(img);
        });
    }

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
        document.getElementById('peDesc').value = d.description || d.desc || '';
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

async function saveBuildingEdit() {
    const key = currentSelectedBuilding;
    const btn = document.getElementById('panelEditBtn');
    const originalIcon = btn.innerHTML;
    btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i>";
    
    const updated = {
        title: document.getElementById('peTitle').value.trim() || key,
        description: document.getElementById('peDesc').value.trim(),
        floors: document.getElementById('peFloors').value.trim(),
        hours: document.getElementById('peHours').value.trim(),
        faculty: document.getElementById('peFaculty').value.trim(),
        facilities: document.getElementById('peFacilities').value.trim()
    };
    
    try {
        const res = await fetch(`/api/buildings/key/${encodeURIComponent(key)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        
        if (res.ok) {
            BUILDING_DATA[key] = { ...BUILDING_DATA[key], ...updated };
            populateBuildingPanel(key);
            showBuildingViewMode();
            
            // Success toast
            btn.innerHTML = "<i class='bx bx-check'></i>";
            btn.style.color = '#10b981';
            setTimeout(() => { btn.innerHTML = "<i class='bx bx-edit'></i>"; btn.style.color = ''; }, 2000);
        } else {
            alert('บันทึกข้อมูลไม่สำเร็จ');
            btn.innerHTML = originalIcon;
        }
    } catch (error) {
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
        btn.innerHTML = originalIcon;
    }
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
document.addEventListener('DOMContentLoaded', async () => {
    await loadBuildingData(); // Load building data for map hotspots
    await fetchAllUniversityItems(); // Fetch all items for the main grid
    updateFavBadge();
    applyStoredSettings();
});

// Update the search functionality to use AI endpoint
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
        applyFiltersAndSearch(); // Apply filters and search query
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

// ====== UI LANGUAGE STRINGS ======
const UI_STRINGS = {
    th: {
        // Navbar
        navFav: 'รายการโปรด',
        navSettings: 'ตั้งค่า',
        navAdd: 'เพิ่มสถานที่',
        // Settings panel
        settingsTitle: 'การตั้งค่า',
        settingsSub: 'ปรับแต่งการแสดงผลตามต้องการ',
        labelTheme: '🎨 ธีม',
        labelDarkMode: 'โหมดมืด',
        descDarkMode: 'เปลี่ยนธีมเป็นสีเข้ม',
        labelLang: '🌐 ภาษา',
        labelDisplayLang: 'ภาษาแสดงผล',
        labelDisplay: '📐 การแสดงผล',
        labelLayout: 'รูปแบบ Grid',
        descLayout: 'สลับระหว่าง Grid / List',
        labelHideImg: 'ซ่อนภาพ',
        descHideImg: 'โหลดเร็วขึ้น ประหยัดข้อมูล',
        labelFavSection: '❤️ รายการโปรด',
        labelFavCount: 'บันทึกไว้แล้ว',
        labelFavPlaces: 'สถานที่',
        labelClearFav: 'ล้าง',
        labelAbout: 'ℹ️ เกี่ยวกับ',
        labelVersion: 'เวอร์ชัน',
        labelDev: 'พัฒนาโดย',
        labelUniv: 'มหาวิทยาลัย',
        // Search & Filter
        searchPlaceholder: 'ค้นหาสถานที่, ตึกเรียน, ร้านอาหาร, คาเฟ่...',
        searchBtn: 'ค้นหา',
        filterAll: 'ทั้งหมด',
        filterRestaurant: 'ร้านอาหาร',
        filterCafe: 'คาเฟ่',
        filterStudy: 'ที่อ่านหนังสือ',
        // Hero
        heroBadge: 'มหาวิทยาลัยหอการค้าไทย',
        heroTitle1: 'ค้นพบสถานที่น่าสนใจ',
        heroTitle2: 'รอบ ม.หอการค้าไทย',
        heroSub: 'แนะนำร้านอาหาร คาเฟ่ และสถานที่ต่างๆ ภายในและรอบแคมปัส สำหรับนักศึกษา UTCC โดยเฉพาะ',
        statBuilding: 'อาคาร',
        statPlace: 'สถานที่แนะนำ',
        statCat: 'หมวดหมู่',
        ctaMap: 'ดูแผนผังมหาวิทยาลัย',
        ctaNearby: 'สถานที่รอบมหาลัย',
        scrollDown: 'เลื่อนลงดูแผนที่',
        // Section
        sectionTitle: '🗺️ แผนผังมหาวิทยาลัยหอการค้าไทย',
        sectionSub: 'คลิกที่หมุดอาคารเพื่อดูรายละเอียดและร้านค้าในบริเวณนั้น',
        placesTitle: 'สถานที่แนะนำ',
        placesSub: 'ร้านอาหาร คาเฟ่ และสถานที่เรียนภายในมหาวิทยาลัยหอการค้าไทย',
        // Fav panel
        favPanelTitle: 'รายการโปรดของฉัน',
        favEmpty: 'ยังไม่มีรายการโปรด',
        favEmptySub: 'กดไอคอน ♡ บนการ์ดสถานที่เพื่อบันทึก',
        confirmClearFav: 'ยืนยันลบรายการโปรดทั้งหมด?',
    },
    en: {
        // Navbar
        navFav: 'Favorites',
        navSettings: 'Settings',
        navAdd: 'Add Place',
        // Settings panel
        settingsTitle: 'Settings',
        settingsSub: 'Customize your display preferences',
        labelTheme: '🎨 Theme',
        labelDarkMode: 'Dark Mode',
        descDarkMode: 'Switch to dark theme',
        labelLang: '🌐 Language',
        labelDisplayLang: 'Display Language',
        labelDisplay: '📐 Display',
        labelLayout: 'Grid Layout',
        descLayout: 'Switch between Grid / List',
        labelHideImg: 'Hide Images',
        descHideImg: 'Faster load, save data',
        labelFavSection: '❤️ Favorites',
        labelFavCount: 'Saved',
        labelFavPlaces: 'places',
        labelClearFav: 'Clear',
        labelAbout: 'ℹ️ About',
        labelVersion: 'Version',
        labelDev: 'Developed by',
        labelUniv: 'University',
        // Search & Filter
        searchPlaceholder: 'Search places, buildings, restaurants, cafés...',
        searchBtn: 'Search',
        filterAll: 'All',
        filterRestaurant: 'Restaurant',
        filterCafe: 'Café',
        filterStudy: 'Study Area',
        // Hero
        heroBadge: 'University of the Thai Chamber of Commerce',
        heroTitle1: 'Discover Interesting Places',
        heroTitle2: 'Around UTCC',
        heroSub: 'Restaurants, cafés, and more on and around campus — curated for UTCC students.',
        statBuilding: 'Buildings',
        statPlace: 'Recommended',
        statCat: 'Categories',
        ctaMap: 'View Campus Map',
        ctaNearby: 'Nearby Places',
        scrollDown: 'Scroll to map',
        // Section
        sectionTitle: '🗺️ UTCC Campus Map',
        sectionSub: 'Click a building pin to view details and nearby shops',
        placesTitle: 'Recommended Places',
        placesSub: 'Restaurants, cafés and study spots at UTCC',
        // Fav panel
        favPanelTitle: 'My Favorites',
        favEmpty: 'No favorites yet',
        favEmptySub: 'Tap ♡ on a place card to save it',
        confirmClearFav: 'Clear all favorites?',
    }
};

function applyUILanguage(lang) {
    const s = UI_STRINGS[lang] || UI_STRINGS['th'];

    // Nav buttons
    const navFavLabel = document.querySelector('#favNavBtn .nav-btn-label');
    const navSettingsLabel = document.querySelector('#settingsNavBtn .nav-btn-label');
    if (navFavLabel) navFavLabel.textContent = s.navFav;
    if (navSettingsLabel) navSettingsLabel.textContent = s.navSettings;
    const addBtn = document.getElementById('addPlaceBtn');
    if (addBtn) addBtn.innerHTML = `<i class='bx bx-plus'></i> ${s.navAdd}`;

    // Settings panel labels
    const ids = [
        'settingsTitle','settingsSub','labelTheme','labelDarkMode','descDarkMode',
        'labelLang','labelDisplayLang','labelDisplay','labelLayout','descLayout',
        'labelHideImg','descHideImg','labelFavSection','labelFavCount','labelFavPlaces',
        'labelClearFav','labelAbout','labelVersion','labelDev','labelUniv'
    ];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && s[id] !== undefined) el.textContent = s[id];
    });

    // Search bar
    const si = document.getElementById('searchInput');
    if (si) si.placeholder = s.searchPlaceholder;
    const sb = document.getElementById('searchBtn');
    if (sb) sb.textContent = s.searchBtn;

    // Filter tags
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        const cat = tag.dataset.category;
        const icon = tag.querySelector('i');
        if (cat === '') tag.innerHTML = `${icon ? icon.outerHTML : ''} ${s.filterAll}`;
        else if (cat === 'Restaurant') tag.innerHTML = `${icon ? icon.outerHTML : ''} ${s.filterRestaurant}`;
        else if (cat === 'Cafe') tag.innerHTML = `${icon ? icon.outerHTML : ''} ${s.filterCafe}`;
        else if (cat === 'Study Area') tag.innerHTML = `${icon ? icon.outerHTML : ''} ${s.filterStudy}`;
    });

    // Hero section
    const heroBadgeEl = document.querySelector('.hero-badge');
    if (heroBadgeEl) heroBadgeEl.innerHTML = `<i class='bx bxs-star'></i> ${s.heroBadge}`;
    const heroTitle = document.querySelector('.hero-landing-title');
    if (heroTitle) heroTitle.innerHTML = `${s.heroTitle1}<br><span class="hero-highlight">${s.heroTitle2}</span>`;
    const heroSub = document.querySelector('.hero-landing-subtitle');
    if (heroSub) heroSub.textContent = s.heroSub;

    // Hero stats labels
    const statLabels = document.querySelectorAll('.hero-stat-label');
    if (statLabels[0]) statLabels[0].textContent = s.statBuilding;
    if (statLabels[1]) statLabels[1].textContent = s.statPlace;
    if (statLabels[2]) statLabels[2].textContent = s.statCat;

    // Hero CTA buttons
    const ctaBtns = document.querySelectorAll('.hero-cta-btn');
    if (ctaBtns[0]) ctaBtns[0].innerHTML = `<i class='bx bx-map-alt'></i> ${s.ctaMap}`;
    if (ctaBtns[1]) ctaBtns[1].innerHTML = `<i class='bx bx-current-location'></i> ${s.ctaNearby}`;

    // Scroll indicator
    const scrollEl = document.querySelector('.hero-scroll-indicator span');
    if (scrollEl) scrollEl.textContent = s.scrollDown;

    // Map section header
    const mapTitle = document.querySelector('.section-title-map');
    if (mapTitle) mapTitle.textContent = s.sectionTitle;
    const mapSub = document.querySelector('.section-sub-map');
    if (mapSub) mapSub.textContent = s.sectionSub;

    // Places section header
    const pTitle = document.querySelector('.places-section-title h2');
    if (pTitle) pTitle.textContent = s.placesTitle;
    const pSub = document.querySelector('.places-section-title p');
    if (pSub) pSub.textContent = s.placesSub;

    // Favorites panel title
    const favPanelTitle = document.querySelector('#favPanel .side-panel-title');
    if (favPanelTitle) favPanelTitle.innerHTML = `<i class='bx bxs-heart' style="color:#ef4444"></i> ${s.favPanelTitle}`;

    // Update settings fav count
    updateSettingsFavCount();
}

// ====== SETTINGS SYSTEM ======
function toggleSettingsPanel() {
    const panel = document.getElementById('settingsPanel');
    const back = document.getElementById('panelBackdrop');
    document.getElementById('favPanel').classList.remove('active');
    panel.classList.toggle('active');
    back.classList.toggle('active', panel.classList.contains('active'));
    updateSettingsFavCount();
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
    applyUILanguage(lang);
    applyFiltersAndSearch();
}

function toggleListView(enabled) {
    const grid = document.getElementById('placesGrid');
    grid.classList.toggle('list-view', enabled);
    localStorage.setItem('listView', enabled ? '1' : '0');
}

function toggleHideImages(enabled) {
    document.body.classList.toggle('hide-images', enabled);
    localStorage.setItem('hideImages', enabled ? '1' : '0');
}

function clearAllFavorites() {
    const s = UI_STRINGS[currentLang] || UI_STRINGS['th'];
    if (!confirm(s.confirmClearFav)) return;
    favorites = [];
    localStorage.setItem('utcc_favorites', '[]');
    updateFavBadge();
    renderFavList();
    updateSettingsFavCount();
}

function updateSettingsFavCount() {
    const el = document.getElementById('settingsFavCount');
    if (el) el.textContent = favorites.length;
}

function setCardSize(size) {
    const grid = document.getElementById('placesGrid');
    grid.classList.remove('size-small', 'size-large');
    if (size === 'small') grid.classList.add('size-small');
    if (size === 'large') grid.classList.add('size-large');
    localStorage.setItem('cardSize', size);
}

function applyStoredSettings() {
    const dark = localStorage.getItem('darkMode');
    if (dark === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('darkModeToggle').checked = true;
    }
    const listView = localStorage.getItem('listView') === '1';
    if (listView) {
        document.getElementById('listViewToggle').checked = true;
        toggleListView(true);
    }
    const hideImages = localStorage.getItem('hideImages') === '1';
    if (hideImages) {
        document.getElementById('hideImagesToggle').checked = true;
        toggleHideImages(true);
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
        if(cat === 'หอพัก') return 'Dormitory';
        if(cat === 'Other') return 'Other';
        if(cat === 'Transport') return 'Transport';
        return 'General';
    }
    if(cat === 'Restaurant') return 'ร้านอาหาร';
    if(cat === 'Cafe') return 'คาเฟ่';
    if(cat === 'Study Area') return 'ที่อ่านหนังสือ';
    if(cat === 'หอพัก') return 'หอพัก';
    if(cat === 'Other') return 'ร้านสะดวกซื้อ';
    if(cat === 'Transport') return 'ขนส่ง / MRT';
    return 'ทั่วไป';
}

// API Calls — main page (CAMPUS places only)
async function fetchAllUniversityItems() {
    showLoading();
    try {
        const res = await fetch(API_UNIVERSITY_ITEMS);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        allUniversityItems = await res.json();
        applyFiltersAndSearch(); // Apply filters and search query after fetching all items
    } catch (err) {
        showError('ไม่สามารถดึงข้อมูลได้ กรุณาลองตรวจสอบเซิร์ฟเวอร์');
        console.error(err);
    }
}

function applyFiltersAndSearch() {
    let filteredItems = [...allUniversityItems];

    // Apply category filter
    if (currentCategory && currentCategory !== 'all') {
        filteredItems = filteredItems.filter(item => {
            // For buildings, use faculty as category. For places, use category.
            const itemCategory = item.type === 'building' ? item.faculty : item.category;
            return itemCategory && itemCategory.toLowerCase().includes(currentCategory.toLowerCase());
        });
    }

    // Apply search query filter
    if (currentSearchQuery) {
        const query = currentSearchQuery.toLowerCase();
        filteredItems = filteredItems.filter(item => {
            const name = item.name || item.title || '';
            const description = item.description || item.desc || '';
            const tags = (item.tags || []).join(' ');
            const faculty = item.faculty || '';
            const facilities = item.facilities || '';

            return name.toLowerCase().includes(query) ||
                   description.toLowerCase().includes(query) ||
                   tags.toLowerCase().includes(query) ||
                   faculty.toLowerCase().includes(query) ||
                   facilities.toLowerCase().includes(query);
        });
    }

    // Sort data A-Z by name/title
    const sortedData = filteredItems.sort((a, b) => {
        const nameA = a.name || a.title || '';
        const nameB = b.name || b.title || '';
        return nameA.localeCompare(nameB, 'th');
    });

    renderPlaces(sortedData);
}


async function handleSearch() {
    currentSearchQuery = searchInput.value.trim();
    applyFiltersAndSearch();
}


async function handleAddPlace(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('#addPlaceForm button[type="submit"]');
    const origText = submitBtn.innerHTML;
    submitBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> กำลังบันทึกข้อมูล...";
    submitBtn.disabled = true;

    // Convert tags string to array
    const tagsRaw = document.getElementById('pTags').value;
    const tagsArray = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const newPlace = {
        name: document.getElementById('pName').value,
        description: document.getElementById('pDesc').value,
        address: document.getElementById('pAddress').value,
        category: document.getElementById('pCategory').value,
        tags: tagsArray,
        // Add default values for other fields in Place entity
        latitude: 0.0,
        longitude: 0.0,
        distance: '~0 ม.',
        rating: 0.0,
        mapsUrl: 'https://maps.google.com/?q=' + encodeURIComponent(document.getElementById('pName').value)
    };

    try {
        const res = await fetch(API_PLACES, { // Use the correct API for places
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlace)
        });
        
        if(res.ok) {
            addModal.classList.remove('active');
            addPlaceForm.reset();
            // Refresh all items after adding a new one
            await fetchAllUniversityItems();
        } else {
            const errorData = await res.json();
            alert('เพิ่มข้อมูลไม่สำเร็จ: ' + (errorData.message || 'เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์'));
        }
    } catch (err) {
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่');
    } finally {
        submitBtn.innerHTML = origText;
        submitBtn.disabled = false;
    }
}

// Delete Data
async function deletePlace(id, type) {
    if (!confirm('ยืนยันที่จะลบข้อมูลสถานที่นี้?')) return;
    let apiUrl = '';
    if (type === 'building') {
        apiUrl = `${API_BUILDINGS}/${id}`; // API for deleting buildings
    } else if (type === 'place') {
        apiUrl = `${API_PLACES}/${id}`; // API for deleting places
    } else {
        alert('ไม่สามารถระบุประเภทที่จะลบได้');
        return;
    }

    try {
        const res = await fetch(apiUrl, {
            method: 'DELETE'
        });
        if(res.ok) {
            // Refresh list
            await fetchAllUniversityItems();
        } else {
            alert('ลบข้อมูลไม่สำเร็จ');
        }
    } catch (err) {
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    }
}

// UI Rendering - Updated to handle the UniversityItem object format
function renderPlaces(places) {
    if (!places || places.length === 0) {
        placesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #475569; padding: 4rem;">
                <i class='bx bx-news' style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>ไม่พบข้อมูลในระบบ</p>
                <p style="font-size:0.85rem; margin-top:0.5rem">ลองค้นหาด้วยคำอื่น</p>
            </div>
        `;
        return;
    }

    placesGrid.innerHTML = places.map((item, index) => {
        const imagesList = (item.images && item.images.length > 0) ? item.images : (item.imageUrl ? [item.imageUrl] : ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600']);
        const img = imagesList[0];
        
        // Build gallery HTML string
        let galleryHtml = '';
        if (imagesList.length > 1) {
            // Escape URLs for JS onclick strings
            const jsonArray = JSON.stringify(imagesList).replace(/"/g, '&quot;');
            galleryHtml = `
                <div class="card-gallery-slider">
                    ${imagesList.map((url, i) => `<img src="${url}" class="card-img slide-item" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600';" onclick="openLightbox(${jsonArray}, ${i})" title="กดเพื่อดูรูปขนาดใหญ่">`).join('')}
                </div>
                <div class="card-photo-count"><i class='bx bx-images'></i> ${imagesList.length}</div>
            `;
        } else {
            galleryHtml = `<img src="${img}" alt="${item.title || item.name}" class="card-img single" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600';" onclick="openLightbox(['${img}'], 0)" title="กดเพื่อดูรูปขนาดใหญ่">`;
        }

        const tagsHtml = (item.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
        
        // Handle category logic for both entity types
        let catText = 'ทั่วไป';
        if (item.type === 'building') {
            catText = item.faculty || 'อาคารมหาวิทยาลัย';
        } else if (item.type === 'place') {
            catText = translateCategory(item.category);
        }

        const delay = index * 0.08;
        const isFav = favorites.some(f => f.id === item.id);
        
        return `
            <div class="place-card" style="animation-delay: ${delay}s">
                <div class="card-img-wrapper">
                    ${galleryHtml}
                    <button class="fav-btn ${isFav ? 'is-fav' : ''}" data-id="${item.id}" 
                        onclick="toggleFavorite('${item.id}', '${item.title || item.name}', '${img}', '${item.category || item.faculty}')"
                        title="${isFav ? 'ยกเลิกรายการโปรด' : 'เพิ่มในรายการโปรด'}">
                        <i class='bx ${isFav ? 'bxs-heart' : 'bx-heart'}'></i>
                    </button>
                </div>
                <div class="card-content">
                    <div class="card-category">${catText}</div>
                    <h3 class="card-title">${item.title || item.name}</h3>
                    <p class="card-desc">${item.description || item.desc || '-'}</p>
                    <div class="card-tags">${tagsHtml}</div>
                    <div class="card-footer">
                        <span><i class='bx bx-map'></i> ${item.address || item.floors || 'มหาวิทยาลัยหอการค้าไทย'}</span>
                        <div style="display:flex; gap:0.5rem;">
                            <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="alert('ระบบรีวิวกำลังพัฒนา!')"><i class='bx bx-comment-detail'></i> รีวิว</button>
                            <button class="btn-edit-place" onclick="openEditPlaceModal('${item.id}', '${item.type}')" title="แก้ไขข้อมูล"><i class='bx bx-edit'></i></button>
                            <button class="btn-danger" onclick="deletePlace('${item.id}', '${item.type}')" title="ลบข้อมูล"><i class='bx bx-trash'></i></button>
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

// ── Edit Place Modal ───────────────────────────────────
let _editingPlace = null;  // holds the full place object while editing
let _editingPlaceType = null; // holds the type ('building' or 'place')

async function openEditPlaceModal(id, type) {
    let apiUrl = '';
    if (type === 'building') {
        apiUrl = `${API_BUILDINGS}/${id}`;
    } else if (type === 'place') {
        apiUrl = `${API_PLACES}/${id}`;
    } else {
        alert('ไม่สามารถระบุประเภทที่จะแก้ไขได้');
        return;
    }

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Not found');
        _editingPlace = await res.json();
        _editingPlaceType = type;
    } catch (e) {
        alert('ไม่สามารถโหลดข้อมูลสถานที่ได้');
        return;
    }

    const p = _editingPlace;
    document.getElementById('epId').value = p.id;
    document.getElementById('epName').value = p.name || p.title || '';
    document.getElementById('epDesc').value = p.description || p.desc || '';
    document.getElementById('epAddress').value = p.address || ''; // Only for places
    document.getElementById('epTags').value = (p.tags || []).join(', '); // Only for places

    // Set category select (only for places)
    const catSel = document.getElementById('epCategory');
    if (type === 'place') {
        catSel.style.display = 'block'; // Show category for places
        for (let opt of catSel.options) {
            opt.selected = (opt.value === p.category);
        }
    } else {
        catSel.style.display = 'none'; // Hide category for buildings
    }

    document.getElementById('editPlaceModal').classList.add('active');
}

function closeEditPlaceModal() {
    document.getElementById('editPlaceModal').classList.remove('active');
    _editingPlace = null;
    _editingPlaceType = null;
}

async function saveEditPlace() {
    if (!_editingPlace) return;
    const btn = document.getElementById('epSaveBtn');
    const origText = btn.innerHTML;
    btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> \u0e01\u0e33\u0e25\u0e31\u0e07\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01...";
    btn.disabled = true;

    let payload = {};
    let apiUrl = '';

    if (_editingPlaceType === 'building') {
        apiUrl = `${API_BUILDINGS}/${_editingPlace.id}`;
        payload = {
            ..._editingPlace,
            title: document.getElementById('epName').value.trim() || _editingPlace.title,
            description: document.getElementById('epDesc').value.trim(),
        };
    } else if (_editingPlaceType === 'place') {
        apiUrl = `${API_PLACES}/${_editingPlace.id}`;
        const tagsRaw = document.getElementById('epTags').value;
        const tagsArray = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(t => t) : [];
        payload = {
            ..._editingPlace, // Start with existing data to preserve fields like lat/lng
            name: document.getElementById('epName').value.trim() || _editingPlace.name,
            description: document.getElementById('epDesc').value.trim(),
            category: document.getElementById('epCategory').value,
            address: document.getElementById('epAddress').value.trim(),
            tags: tagsArray
        };
    }

    try {
        const res = await fetch(apiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            closeEditPlaceModal();
            await fetchAllUniversityItems(); // Refresh all items after editing
        } else {
            alert('\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08 \u0e25\u0e2d\u0e07\u0e43\u0e2b\u0e21\u0e48\u0e2d\u0e35\u0e01\u0e04\u0e23\u0e31\u0e49\u0e07');
        }
    } catch (e) {
        alert('\u0e40\u0e0a\u0e37\u0e48\u0e2d\u0e21\u0e15\u0e48\u0e2d\u0e40\u0e0b\u0e34\u0e23\u0e4c\u0e40\u0e27\u0e2d\u0e23\u0e4c\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49');
    } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
    }
}

// ── Lightbox ──────────────────────────────────────────
let _lbImages = [];
let _lbIndex = 0;

function openLightbox(images, startIndex) {
    _lbImages = images;
    _lbIndex = startIndex;
    _renderLightbox();
    document.getElementById('lightboxOverlay').classList.add('active');
    document.addEventListener('keydown', _lightboxKeyHandler);
}

function closeLightbox() {
    document.getElementById('lightboxOverlay').classList.remove('active');
    document.removeEventListener('keydown', _lightboxKeyHandler);
}

function lightboxClickOutside(e) {
    if (e.target === document.getElementById('lightboxOverlay')) closeLightbox();
}

function lightboxNext() {
    _lbIndex = (_lbIndex + 1) % _lbImages.length;
    _renderLightbox();
}

function lightboxPrev() {
    _lbIndex = (_lbIndex - 1 + _lbImages.length) % _lbImages.length;
    _renderLightbox();
}

function _lightboxKeyHandler(e) {
    if (e.key === 'ArrowRight') lightboxNext();
    else if (e.key === 'ArrowLeft') lightboxPrev();
    else if (e.key === 'Escape') closeLightbox();
}

function _renderLightbox() {
    const img = document.getElementById('lightboxImg');
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = _lbImages[_lbIndex];
        img.style.opacity = '1';
    }, 120);
    document.getElementById('lightboxCounter').textContent = `${_lbIndex + 1} / ${_lbImages.length}`;

    const dotsEl = document.getElementById('lightboxDots');
    dotsEl.innerHTML = '';
    _lbImages.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'lightbox-dot' + (i === _lbIndex ? ' active' : '');
        dot.onclick = () => { _lbIndex = i; _renderLightbox(); };
        dotsEl.appendChild(dot);
    });
}
