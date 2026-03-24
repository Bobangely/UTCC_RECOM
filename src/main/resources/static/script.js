const API_BASE = '/api/places';
let currentCategory = '';

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

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchPlaces);
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
        
        // Translating category for ui
        let catText = 'ทั่วไป';
        if(place.category === 'Restaurant') catText = 'ร้านอาหาร';
        if(place.category === 'Cafe') catText = 'คาเฟ่';
        if(place.category === 'Study Area') catText = 'ที่อ่านหนังสือ';
        
        const delay = index * 0.08; // Stagger animation
        
        return `
            <div class="place-card" style="animation-delay: ${delay}s">
                <img src="${img}" alt="${place.name}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600';">
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
