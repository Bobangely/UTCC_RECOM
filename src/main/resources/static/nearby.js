// =============================================
//  UTCC Nearby — nearby.js
//  Admin & Comment system + localStorage
// =============================================

// ─── Admin Config ──────────────────────────
const ADMIN_PASSWORD = 'utcc2024'; // Change this!
let isAdmin = false;
let currentCommentPlaceId = null;
let selectedStars = 0;
let deletePendingId = null;

// ─── Default Place Data ────────────────────
const DEFAULT_PLACES = [
    { id: 'r1', cat: 'restaurant', name: 'สุกี้นายพัน',
      desc: 'ร้านสุกี้ขวัญใจนักศึกษา ม.หอการค้า น้ำจิ้มสูตรกวางตุ้งเด็ดมาก มีหมู ไก่ ทะเล และเมนูทานเล่น ราคานักศึกษา',
      image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&q=80&w=600',
      tags: ['สุกี้', 'ราคาถูก', 'ขวัญใจนักศึกษา'], distance: '~100 ม.', rating: 4.5,
      mapsUrl: 'https://maps.google.com/?q=สุกี้นายพัน+มหาวิทยาลัยหอการค้าไทย' },
    { id: 'r2', cat: 'restaurant', name: 'ลาบเป็ดนายหนอม',
      desc: 'อาหารอีสานเจ้าประจำย่านนี้ เมนูเด็ด: ลาบเป็ดรสจัดจ้าน คอหมูย่าง ไส้อ่อนย่าง ไก่ย่างนมสด และต้มแซ่บ',
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=600',
      tags: ['อีสาน', 'ลาบเป็ด', 'คอหมูย่าง'], distance: '~120 ม.', rating: 4.4,
      mapsUrl: 'https://maps.google.com/?q=ลาบเป็ดนายหนอม+หอการค้าไทย' },
    { id: 'r3', cat: 'restaurant', name: 'ก๋วยเตี๋ยวชาติหน้า 15 เส้น',
      desc: 'ร้านก๋วยเตี๋ยวรถเข็นชื่อดัง คิวยาวเป็นประจำ ชามใหญ่เครื่องแน่น ไก่ตุ๋น หมูสับ กระดูกอ่อน น้ำซุปต้มยำเข้มข้น',
      image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=600',
      tags: ['ก๋วยเตี๋ยว', 'รถเข็น', 'เครื่องแน่น'], distance: '~80 ม.', rating: 4.6,
      mapsUrl: 'https://maps.google.com/?q=ก๋วยเตี๋ยวชาติหน้า+UTCC' },
    { id: 'r4', cat: 'restaurant', name: 'IHere Yakiniku Shabu',
      desc: 'บุฟเฟ่ต์ปิ้งย่างและชาบูในซอยวิภาวดี 2 เหมาะกลุ่มเพื่อน ราคาสบายกระเป๋า เนื้อสด ผักครบ',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
      tags: ['ปิ้งย่าง', 'บุฟเฟ่ต์', 'ชาบู'], distance: '~150 ม.', rating: 4.3,
      mapsUrl: 'https://maps.google.com/?q=IHere+Yakiniku+Shabu+UTCC' },
    { id: 'r5', cat: 'restaurant', name: 'Seonmul Korean Hot Pot',
      desc: 'ร้านหม้อไฟเกาหลียอดนิยม รสชาติจัดจ้านแท้เกาหลี มีเมนูข้าวและของทานเล่นสไตล์เกาหลี',
      image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&q=80&w=600',
      tags: ['เกาหลี', 'หม้อไฟ', 'Hot Pot'], distance: '~200 ม.', rating: 4.2,
      mapsUrl: 'https://maps.google.com/?q=Seonmul+Korean+Hot+Pot+UTCC' },
    { id: 'r6', cat: 'restaurant', name: 'EZEE GRILL',
      desc: 'ร้านสเต็กราคานักศึกษา เมนูหลากหลาย สเต็กเนื้อ สเต็กไก่ ข้าวหน้าต่างๆ บรรยากาศเป็นกันเอง',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      tags: ['สเต็ก', 'ราคานักศึกษา', 'หลากหลาย'], distance: '~250 ม.', rating: 4.1,
      mapsUrl: 'https://maps.google.com/?q=EZEE+GRILL+UTCC+วิภาวดี' },
    { id: 'c1', cat: 'cafe', name: 'เพื่อนแท้ 友義 (Peuan Tae)',
      desc: 'คาเฟ่ชิลล์เปิดดึก เหมาะนั่งคุยหลังเลิกเรียน มีทั้งของคาวและของหวาน ไข่กระทะ ขนมปังปิ้ง เครื่องดื่มราคาย่อมเยา',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
      tags: ['เปิดดึก', 'ขนมปังปิ้ง', 'ชิลล์'], distance: '~100 ม.', rating: 4.4,
      mapsUrl: 'https://maps.google.com/?q=เพื่อนแท้+คาเฟ่+UTCC' },
    { id: 'c2', cat: 'cafe', name: 'ร้านกาแฟพี่แขก',
      desc: 'ร้านเครื่องดื่มเปิดมานาน ราคาเป็นกันเอง เมนูให้เลือกมากมาย เป็นที่นิยมในหมู่นักศึกษามายาวนาน',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
      tags: ['กาแฟ', 'ราคาถูก', 'เก่าแก่'], distance: '~60 ม.', rating: 4.3,
      mapsUrl: 'https://maps.google.com/?q=ร้านกาแฟพี่แขก+หอการค้าไทย' },
    { id: 'c3', cat: 'cafe', name: 'Inthanin Coffee (ปั้มบางจาก)',
      desc: 'กาแฟสดจากดอยอินทนนท์ ราคาเป็นมิตร บรรยากาศสบาย เดินถึงได้จากมหาลัย',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600',
      tags: ['กาแฟไทย', 'อินทนิล', 'ราคาดี'], distance: '~200 ม.', rating: 4.0,
      mapsUrl: 'https://maps.google.com/?q=Inthanin+Coffee+วิภาวดีรังสิต' },
    { id: 'i1', cat: 'internet', name: 'True Space (หน้า ม.หอการค้าไทย)',
      desc: 'Co-working Space ของ True เป็นที่นิยมมาก มีพื้นที่นั่งทำงาน ห้องประชุม และอินเทอร์เน็ตความเร็วสูง',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600',
      tags: ['Co-working', 'Wi-Fi เร็ว', 'ห้องประชุม'], distance: '~50 ม.', rating: 4.2,
      mapsUrl: 'https://maps.google.com/?q=True+Space+มหาวิทยาลัยหอการค้าไทย' },
    { id: 'i2', cat: 'internet', name: 'ร้านถ่ายเอกสาร / Print ใกล้มหาลัย',
      desc: 'ร้านถ่ายเอกสาร พรินต์งาน เข้าเล่มรายงาน มีให้เลือกหลายร้านรอบซอยวิภาวดี 2',
      image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=600',
      tags: ['ถ่ายเอกสาร', 'พรินต์', 'เข้าเล่ม'], distance: '~30 ม.', rating: 4.1,
      mapsUrl: 'https://maps.google.com/?q=ร้านถ่ายเอกสาร+ซอยวิภาวดี+2' },
    { id: 'd1', cat: 'dorm', name: 'หอพักสตรีบ้านวิภาวดี',
      desc: 'หอพักสตรีที่ใกล้มหาวิทยาลัยที่สุดแห่งหนึ่ง ระยะเดินเพียง 36 เมตร มีสิ่งอำนวยความสะดวกพร้อม',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600',
      tags: ['หอพักสตรี', 'ใกล้มาก', '36 เมตร'], distance: '36 ม.', rating: 4.2,
      mapsUrl: 'https://maps.google.com/?q=หอพักสตรีบ้านวิภาวดี+UTCC' },
    { id: 'd2', cat: 'dorm', name: 'หอพักสตรีดวงพร',
      desc: 'หอพักสตรีระยะ 150 เมตรจากมหาวิทยาลัย ปลอดภัย มีรปภ. พร้อมสิ่งอำนวยความสะดวกครบ',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=600',
      tags: ['หอพักสตรี', 'ปลอดภัย', 'รปภ.'], distance: '150 ม.', rating: 4.1,
      mapsUrl: 'https://maps.google.com/?q=หอพักสตรีดวงพร+UTCC' },
    { id: 'd3', cat: 'dorm', name: 'หอพักสตรีกรีนเฮ้าส์',
      desc: 'หอพักสตรีในระยะ 200 เมตร บรรยากาศร่มรื่น สะอาด มีระบบรักษาความปลอดภัย',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
      tags: ['หอพักสตรี', 'สะอาด', 'ร่มรื่น'], distance: '200 ม.', rating: 4.0,
      mapsUrl: 'https://maps.google.com/?q=หอพักกรีนเฮ้าส์+วิภาวดี+UTCC' },
    { id: 'd4', cat: 'dorm', name: 'หอพักสตรีสามัคคี 99',
      desc: 'หอพักสตรีที่ได้รับใบรับรองจากมหาวิทยาลัย ระยะ 250 เมตร มีกล้องวงจรปิดและคีย์การ์ด',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600',
      tags: ['หอพักสตรี', 'คีย์การ์ด', 'CCTV'], distance: '250 ม.', rating: 4.0,
      mapsUrl: 'https://maps.google.com/?q=หอพักสามัคคี+99+UTCC' },
    { id: 'd5', cat: 'dorm', name: 'หอพักสตรีบ้านดวงโรจน์',
      desc: 'หอพักสตรีแนะนำจากมหาวิทยาลัย ระยะ 260 เมตร ราคาย่อมเยา เหมาะนักศึกษาชั้นปีต้นๆ',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600',
      tags: ['หอพักสตรี', 'ราคาย่อมเยา', 'แนะนำ'], distance: '260 ม.', rating: 3.9,
      mapsUrl: 'https://maps.google.com/?q=หอพักบ้านดวงโรจน์+UTCC' },
    { id: 's1', cat: 'convenience', name: '7-Eleven (หน้า ม.หอการค้าไทย)',
      desc: 'เซเว่นอีเลฟเว่นสาขาหน้าซอยวิภาวดี 2 เปิด 24 ชั่วโมง มีตู้ ATM จ่ายบิล ขนม เครื่องดื่มครบ',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=600',
      tags: ['24 ชม.', 'ATM', 'จ่ายบิล'], distance: '~30 ม.', rating: 4.2,
      mapsUrl: 'https://maps.google.com/?q=7-Eleven+ซอยวิภาวดีรังสิต+2' },
    { id: 't1', cat: 'transport', name: 'ป้ายรถเมล์หน้า ม.หอการค้าไทย',
      desc: 'ป้ายรถประจำทางหน้ามหาวิทยาลัย มีหลายสายผ่าน เช่น สาย 26, 52, 114 และ BRT วิภาวดีรังสิต',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600',
      tags: ['รถเมล์', 'BRT', 'สาย 26/52/114'], distance: '~20 ม.', rating: 3.8,
      mapsUrl: 'https://maps.google.com/?q=ป้ายรถเมล์+ถนนวิภาวดีรังสิต' },
    { id: 't2', cat: 'transport', name: 'จุดจอด Grab / รถตู้',
      desc: 'จุดขึ้น-ลงรถ Grab Taxi และรถตู้ ใช้ได้สะดวก บริเวณหน้าซอยวิภาวดี 2',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600',
      tags: ['Grab', 'Taxi', 'รถตู้'], distance: '~50 ม.', rating: 4.0,
      mapsUrl: 'https://maps.google.com/?q=มหาวิทยาลัยหอการค้าไทย+ซอยวิภาวดี+2' }
];

// ─── Category Meta ──────────────────────────
const CAT_COLORS = {
    restaurant: '#ef4444', cafe: '#f59e0b', internet: '#6366f1',
    dorm: '#10b981', convenience: '#ec4899', transport: '#3b82f6'
};
const CAT_LABELS = {
    restaurant: 'ร้านอาหาร', cafe: 'คาเฟ่', internet: 'อินเทอร์เน็ต',
    dorm: 'หอพัก', convenience: 'ร้านสะดวกซื้อ', transport: 'ขนส่ง'
};

// ─── API Config ──────────────────────────────
const NEARBY_API      = '/api/nearby-places';
const CATEGORIES_API  = '/api/nearby-categories';

// ─── Convert API Place → local format ────────
function apiToLocal(p) {
    return {
        id: p.id,
        cat: p.category || 'restaurant',
        name: p.name || '',
        desc: p.description || '',
        image: (p.images && p.images.length > 0) ? p.images[0] : '',
        images: p.images || [],
        tags: p.tags || [],
        distance: p.distance || 'N/A',
        rating: p.rating || 4.0,
        mapsUrl: p.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(p.name || '')}`
    };
}

// ─── Convert local format → API payload ─────
function localToApi(data, existingImages) {
    return {
        name: data.name,
        description: data.desc,
        category: data.cat,
        distance: data.distance,
        rating: data.rating,
        mapsUrl: data.mapsUrl,
        tags: data.tags,
        images: existingImages || (data.image ? [data.image] : [])
    };
}

// ─── Comments still in localStorage ─────────
function loadComments() {
    const saved = localStorage.getItem('utcc_nearby_comments');
    return saved ? JSON.parse(saved) : {};
}
function saveComments(comments) {
    localStorage.setItem('utcc_nearby_comments', JSON.stringify(comments));
}

let PLACES = [];   // filled after DOMContentLoaded
let COMMENTS = loadComments();
let currentCat = 'all';
<<<<<<< Xkaroy
let currentSearchTerm = '';
=======
let searchQuery = '';
>>>>>>> master

// ─── Load & Render Category Filter Buttons ──────────────────
async function loadCategories() {
    const bar = document.getElementById('categoryBar');
    try {
        const res = await fetch(CATEGORIES_API);
        if (!res.ok) throw new Error('categories API error');
        const cats = await res.json();   // sorted by sortOrder

        bar.innerHTML = cats.map((c, i) => {
            const isAll  = c.name === 'all';
            const active = isAll ? ' active' : '';
            const icon   = c.icon ? `<i class='bx ${c.icon}'></i> ` : '';
            return `<span class="filter-tag${active}" data-cat="${c.name}"
                        onclick="filterCat('${c.name}', this)">
                        ${icon}${c.label}
                    </span>`;
        }).join('');
    } catch (e) {
        console.error('Failed to load categories, using fallback', e);
        // Hardcoded fallback so UI doesn't break if API is down
        bar.innerHTML = `
            <span class="filter-tag active" data-cat="all" onclick="filterCat('all',this)"><i class='bx bx-grid-alt'></i> ทั้งหมด</span>
            <span class="filter-tag" data-cat="Restaurant" onclick="filterCat('Restaurant',this)"><i class='bx bx-restaurant'></i> ร้านอาหาร</span>
            <span class="filter-tag" data-cat="Cafe" onclick="filterCat('Cafe',this)"><i class='bx bx-coffee'></i> คาเฟ่</span>
            <span class="filter-tag" data-cat="หอพัก" onclick="filterCat('หอพัก',this)"><i class='bx bx-building-house'></i> หอพัก</span>
        `;
    }
}

// ─── Fetch Places from API ───────────────────
// cat = 'all' | any category name stored in DB (e.g. 'Restaurant', 'Cafe', 'หอพัก')
async function fetchPlacesFromApi(cat) {
    try {
        const url = (!cat || cat === 'all')
            ? NEARBY_API
            : `${NEARBY_API}/category/${encodeURIComponent(cat)}`; // Corrected URL
        const res = await fetch(url);
        if (!res.ok) throw new Error('API error ' + res.status);
        const data = await res.json();
        PLACES = data.map(apiToLocal);
    } catch (e) {
        console.error('Failed to load from API, using defaults', e);
        PLACES = DEFAULT_PLACES.map(p => ({ ...p }));
    }
}

// ─── Render ─────────────────────────────────
function renderCards(places) {
    // เรียงลำดับข้อมูลตามชื่อ ก-ฮ
    const sortedPlaces = [...places].sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB, 'th');
    });

    const grid = document.getElementById('nearbyGrid');
    const count = document.getElementById('resultCount');
    count.textContent = `${sortedPlaces.length} สถานที่`;

    if (sortedPlaces.length === 0) {
        grid.innerHTML = `<div class="empty-state"><i class='bx bx-search-alt'></i><p>ไม่พบสถานที่ที่คุณค้นหา</p></div>`;
        return;
    }

    grid.innerHTML = sortedPlaces.map((p, i) => {
        const ratings = getAverageRating(p.id, p.rating);
        const stars = renderStars(ratings.avg);
        const color = CAT_COLORS[p.cat] || '#64748b';
        const label = CAT_LABELS[p.cat] || p.cat;
        const tagsHtml = (p.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
        const commentCount = (COMMENTS[p.id] || []).length;
        const adminBtns = isAdmin ? `
            <div class="admin-card-btns">
                <button class="admin-card-btn edit" onclick="openEditPlace('${p.id}')" title="แก้ไข">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="admin-card-btn delete" onclick="openDeleteModal('${p.id}')" title="ลบ">
                    <i class='bx bx-trash'></i>
                </button>
            </div>` : '';

        return `
        <div class="nearby-card" style="animation-delay:${i * 0.05}s" data-cat="${p.cat}">
            ${adminBtns}
            <div class="card-img-wrap">
                <img src="${p.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'}"
                     alt="${p.name}" loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'">
                <span class="card-cat-badge" style="background:${color}">${label}</span>
                <span class="card-dist-badge"><i class='bx bx-walk'></i>${p.distance}</span>
            </div>
            <div class="card-body">
                <div class="card-name">${p.name}</div>
                <p class="card-desc">${p.desc}</p>
                <div class="card-tags">${tagsHtml}</div>
                <div class="card-footer">
                    <span class="card-rating">
                        <span class="stars">${stars}</span>
                        <span>${ratings.avg.toFixed(1)}</span>
                        ${ratings.count > 0 ? `<span style="color:var(--muted);font-size:0.78rem">(${ratings.count} รีวิว)</span>` : ''}
                    </span>
                    <button class="comment-btn" onclick="openCommentModal('${p.id}', \`${p.name.replace(/`/g, "&#96;")}\`)">
                        <i class='bx bx-chat'></i>
                        ${commentCount > 0 ? `<span class="comment-count">${commentCount}</span>` : ''}
                    </button>
                    <a href="${p.mapsUrl || '#'}" target="_blank" class="nav-btn">
                        <i class='bx bx-navigation'></i> นำทาง
                    </a>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = (rating % 1) >= 0.5;
    let s = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= full) s += '★';
        else if (i === full + 1 && half) s += '⯨';
        else s += '☆';
    }
    return s;
}

function getAverageRating(placeId, defaultRating) {
    const comms = COMMENTS[placeId] || [];
    const rated = comms.filter(c => c.stars > 0);
    if (rated.length === 0) return { avg: defaultRating, count: 0 };
    const avg = rated.reduce((a, b) => a + b.stars, 0) / rated.length;
    return { avg: Math.round(avg * 10) / 10, count: rated.length };
}

function filterCat(cat, btn) {
    currentCat = cat;
    document.querySelectorAll('.filter-tag').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    fetchPlacesFromApi(cat).then(() => reRender());
}

function doSearch() {
    const input = document.getElementById('searchInput');
    if (input) {
        searchQuery = input.value.trim().toLowerCase();
        reRender();
    }
}

function reRender() {
<<<<<<< Xkaroy
    let filtered = PLACES; // Start with all places fetched for the current category
    
    // Apply text search if there is a search term
    if (currentSearchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(currentSearchTerm) || 
            p.desc.toLowerCase().includes(currentSearchTerm) ||
            (p.tags && p.tags.some(tag => tag.toLowerCase().includes(currentSearchTerm)))
=======
    let filtered = currentCat === 'all' ? PLACES : PLACES.filter(p => p.cat === currentCat);
    
    if (searchQuery) {
        filtered = filtered.filter(p => 
            (p.name && p.name.toLowerCase().includes(searchQuery)) || 
            (p.desc && p.desc.toLowerCase().includes(searchQuery)) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery)))
>>>>>>> master
        );
    }
    
    renderCards(filtered);
}

// ─── Admin Auth ─────────────────────────────
let logoClickCount = 0;
function showAdminEntry(e) {
    if (e) e.preventDefault();
    document.getElementById('adminLoginBtn').style.display = 'flex';
    openAdminLogin();
}

function openAdminLogin() {
    if (isAdmin) return; // already admin, badge handles logout
    document.getElementById('adminPass').value = '';
    document.getElementById('adminLoginErr').style.display = 'none';
    showModal('adminLoginModal');
}
function closeAdminLogin() { closeAllModals(); }

function doAdminLogin() {
    const pass = document.getElementById('adminPass').value;
    if (pass === ADMIN_PASSWORD) {
        isAdmin = true;
        closeAllModals();
        activateAdminMode();
    } else {
        document.getElementById('adminLoginErr').style.display = 'flex';
        document.getElementById('adminPass').value = '';
    }
}

function activateAdminMode() {
    document.getElementById('adminBadge').style.display = 'flex';
    document.getElementById('adminLoginBtn').style.display = 'none';
    document.getElementById('adminFab').style.display = 'flex';
    document.body.classList.add('admin-active');
    reRender();
    showToast('🛡️ เข้าสู่ Admin Mode แล้ว', 'success');
}

function toggleAdminOff() {
    isAdmin = false;
    document.getElementById('adminBadge').style.display = 'none';
    document.getElementById('adminLoginBtn').style.display = 'flex';
    document.getElementById('adminFab').style.display = 'none';
    document.body.classList.remove('admin-active');
    reRender();
    showToast('ออกจาก Admin Mode แล้ว', 'info');
}

// ─── Place Modal (Add / Edit) ────────────────
function openAddPlace() {
    document.getElementById('placeModalTitle').innerHTML = "<i class='bx bx-plus-circle'></i> เพิ่มสถานที่ใหม่";
    document.getElementById('placeModalId').value = '';
    ['pm_name','pm_desc','pm_image','pm_distance','pm_maps','pm_tags'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('pm_rating').value = '4.0';
    document.getElementById('pm_cat').value = 'restaurant';
    document.getElementById('pm_img_preview').style.display = 'none';
    showModal('placeModal');
}

function openEditPlace(placeId) {
    const p = PLACES.find(x => x.id === placeId);
    if (!p) return;
    document.getElementById('placeModalTitle').innerHTML = "<i class='bx bx-edit'></i> แก้ไขสถานที่";
    document.getElementById('placeModalId').value = p.id;
    document.getElementById('pm_name').value = p.name;
    document.getElementById('pm_desc').value = p.desc;
    document.getElementById('pm_image').value = p.image || '';
    document.getElementById('pm_distance').value = p.distance;
    document.getElementById('pm_rating').value = p.rating;
    document.getElementById('pm_tags').value = (p.tags || []).join(', ');
    document.getElementById('pm_cat').value = p.cat;
    document.getElementById('pm_maps').value = p.mapsUrl || '';
    previewImage(p.image);
    showModal('placeModal');
}

function closePlaceModal() { closeAllModals(); }

async function savePlaceModal() {
    const name = document.getElementById('pm_name').value.trim();
    const cat = document.getElementById('pm_cat').value;
    if (!name) { showToast('กรุณากรอกชื่อสถานที่', 'error'); return; }

    const id = document.getElementById('placeModalId').value;
    const data = {
        name,
        cat,
        desc: document.getElementById('pm_desc').value.trim(),
        image: document.getElementById('pm_image').value.trim(),
        distance: document.getElementById('pm_distance').value.trim() || 'N/A',
        rating: parseFloat(document.getElementById('pm_rating').value) || 4.0,
        tags: document.getElementById('pm_tags').value.split(',').map(t => t.trim()).filter(Boolean),
        mapsUrl: document.getElementById('pm_maps').value.trim() || `https://maps.google.com/?q=${encodeURIComponent(name)}`
    };

    try {
        if (id) {
            // Edit — PUT to API
            const existing = PLACES.find(p => p.id === id);
            const payload = localToApi(data, existing ? existing.images : undefined);
            const res = await fetch(`${NEARBY_API}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('PUT failed');
            showToast('✅ แก้ไขข้อมูลสำเร็จ', 'success');
        } else {
            // Add — POST to API
            const payload = localToApi(data, data.image ? [data.image] : []);
            const res = await fetch(NEARBY_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('POST failed');
            showToast('✅ เพิ่มสถานที่สำเร็จ', 'success');
        }
        closeAllModals();
        await fetchPlacesFromApi(currentCat);
        reRender();
    } catch (e) {
        showToast('❌ บันทึกไม่สำเร็จ: ' + e.message, 'error');
    }
}

// Image preview
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('pm_image').addEventListener('input', function() {
        previewImage(this.value.trim());
    });
});

function previewImage(url) {
    const prev = document.getElementById('pm_img_preview');
    const img = document.getElementById('pm_img_el');
    if (url) {
        img.src = url;
        prev.style.display = 'block';
    } else {
        prev.style.display = 'none';
    }
}

function openDeleteModal(placeId) {
    const p = PLACES.find(x => x.id === placeId);
    if (!p) return;
    deletePendingId = placeId;
    document.getElementById('deleteModalName').textContent = p.name;
    showModal('deleteModal');
}
function closeDeleteModal() { closeAllModals(); deletePendingId = null; }
async function confirmDelete() {
    if (!deletePendingId) return;
    try {
        const res = await fetch(`${NEARBY_API}/${deletePendingId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('DELETE failed');
        delete COMMENTS[deletePendingId];
        saveComments(COMMENTS);
        closeAllModals();
        await fetchPlacesFromApi(currentCat);
        reRender();
        showToast('🗑️ ลบสถานที่แล้ว', 'info');
    } catch (e) {
        showToast('❌ ลบไม่สำเร็จ', 'error');
    }
    deletePendingId = null;
}

// ─── Comments ────────────────────────────────
function openCommentModal(placeId, placeName) {
    currentCommentPlaceId = placeId;
    selectedStars = 0;
    document.getElementById('commentModalTitle').textContent = placeName;
    document.getElementById('commentAuthor').value = '';
    document.getElementById('commentText').value = '';
    document.getElementById('starLabel').textContent = 'ยังไม่ได้เลือก';
    renderStarSelect(0);
    renderCommentList(placeId);
    showModal('commentModal');
}

function closeCommentModal() { closeAllModals(); }

function renderCommentList(placeId) {
    const list = document.getElementById('commentList');
    const comms = COMMENTS[placeId] || [];

    if (comms.length === 0) {
        list.innerHTML = `<div class="no-comments"><i class='bx bx-comment-dots'></i><p>ยังไม่มีความคิดเห็น เป็นคนแรกที่แชร์!</p></div>`;
        return;
    }

    list.innerHTML = comms.slice().reverse().map(c => {
        const stars = c.stars > 0 ? `<span class="comment-stars">${'★'.repeat(c.stars)}${'☆'.repeat(5-c.stars)}</span>` : '';
        const date = new Date(c.time).toLocaleDateString('th-TH', { day:'numeric', month:'short', year:'numeric' });
        const adminDel = isAdmin ? `<button class="tiny-del-btn" onclick="deleteComment('${placeId}','${c.id}')"><i class='bx bx-x'></i></button>` : '';
        return `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-avatar">${c.author[0].toUpperCase()}</div>
                <div class="comment-meta">
                    <div class="comment-author">${c.author}</div>
                    <div class="comment-date">${date}</div>
                </div>
                ${stars}
                ${adminDel}
            </div>
            <p class="comment-body">${c.text}</p>
        </div>`;
    }).join('');
}

function deleteComment(placeId, commentId) {
    if (!COMMENTS[placeId]) return;
    COMMENTS[placeId] = COMMENTS[placeId].filter(c => c.id !== commentId);
    saveComments(COMMENTS);
    renderCommentList(placeId);
    reRender();
}

function renderStarSelect(val) {
    const spans = document.querySelectorAll('#starSelect span');
    spans.forEach((s, i) => {
        s.textContent = i < val ? '★' : '☆';
        s.style.color = i < val ? '#fbbf24' : '#cbd5e1';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#starSelect span').forEach(s => {
        const v = parseInt(s.dataset.v);
        s.addEventListener('mouseover', () => renderStarSelect(v));
        s.addEventListener('mouseout', () => renderStarSelect(selectedStars));
        s.addEventListener('click', () => {
            selectedStars = v;
            renderStarSelect(v);
            const labels = ['', '★ แย่มาก', '★★ พอใช้', '★★★ ดี', '★★★★ ดีมาก', '★★★★★ ดีเยี่ยม'];
            document.getElementById('starLabel').textContent = labels[v];
        });
    });
});

function submitComment() {
    const author = document.getElementById('commentAuthor').value.trim();
    const text = document.getElementById('commentText').value.trim();
    if (!author) { showToast('กรุณากรอกชื่อผู้แสดงความเห็น', 'error'); return; }
    if (!text) { showToast('กรุณากรอกความคิดเห็น', 'error'); return; }

    const comment = {
        id: 'c_' + Date.now(),
        author,
        text,
        stars: selectedStars,
        time: Date.now()
    };

    if (!COMMENTS[currentCommentPlaceId]) COMMENTS[currentCommentPlaceId] = [];
    COMMENTS[currentCommentPlaceId].push(comment);
    saveComments(COMMENTS);

    document.getElementById('commentAuthor').value = '';
    document.getElementById('commentText').value = '';
    selectedStars = 0;
    renderStarSelect(0);
    document.getElementById('starLabel').textContent = 'ยังไม่ได้เลือก';
    renderCommentList(currentCommentPlaceId);
    reRender();
    showToast('✅ ส่งความคิดเห็นแล้ว!', 'success');
}

// ─── Modal Helpers ───────────────────────────
function showModal(id) {
    document.getElementById(id).classList.add('active');
    document.getElementById('modalBackdrop').classList.add('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.getElementById('modalBackdrop').classList.remove('active');
}

// ─── Toast ───────────────────────────────────
function showToast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

// ─── Dark Mode ───────────────────────────────
function toggleDark() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('darkBtn').innerHTML = isDark ? "<i class='bx bx-moon'></i>" : "<i class='bx bx-sun'></i>";
    localStorage.setItem('nearby_dark', isDark ? 'light' : 'dark');
}

// ─── Init ────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    const saved = localStorage.getItem('nearby_dark') || localStorage.getItem('darkMode');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('darkBtn').innerHTML = "<i class='bx bx-sun'></i>";
    }

    // 1. Load category filter buttons from Supabase
    await loadCategories();

    // 2. Load place cards
    await fetchPlacesFromApi('all');
    reRender();

    // Setup Search input listeners
    const searchInput = document.getElementById('nearbySearchInput');
    const searchBtn = document.getElementById('nearbySearchBtn');
    
    if (searchInput && searchBtn) {
        // Trigger search on input change (live search)
        searchInput.addEventListener('input', () => {
            currentSearchTerm = searchInput.value.toLowerCase().trim();
            reRender();
        });
        // Trigger search on button click
        searchBtn.addEventListener('click', () => {
            currentSearchTerm = searchInput.value.toLowerCase().trim();
            reRender();
        });
        // Trigger search on Enter key
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                currentSearchTerm = searchInput.value.toLowerCase().trim();
                reRender();
            }
        });
    }

    // FAB color: flip to accent when overlapping dark footer
    const fab = document.getElementById('adminFab');
    const footer = document.querySelector('.nearby-footer');
    if (fab && footer) {
        window.addEventListener('scroll', () => {
            const footerTop = footer.getBoundingClientRect().top;
            const winH = window.innerHeight;
            fab.classList.toggle('on-dark', footerTop < winH - 88);
        }, { passive: true });
    }
});
