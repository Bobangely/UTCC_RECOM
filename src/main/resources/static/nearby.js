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

// --- Leaflet Map ---
let map = null;
let markers = [];

// ─── Default Place Data ────────────────────
const DEFAULT_PLACES = [
    { id: 'r1', cat: 'restaurant', name: 'สุกี้นายพัน',
      desc: 'ร้านสุกี้ขวัญใจนักศึกษา ม.หอการค้า น้ำจิ้มสูตรกวางตุ้งเด็ดมาก มีหมู ไก่ ทะเล และเมนูทานเล่น ราคานักศึกษา',
      image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&q=80&w=600',
      tags: ['สุกี้', 'ราคาถูก', 'ขวัญใจนักศึกษา'], distance: '~100 ม.', rating: 4.5,
      lat: 13.7805, lng: 100.5615, mapsUrl: 'https://maps.google.com/?q=13.7805,100.5615' },
    { id: 'r2', cat: 'restaurant', name: 'ลาบเป็ดนายหนอม',
      desc: 'อาหารอีสานเจ้าประจำย่านนี้ เมนูเด็ด: ลาบเป็ดรสจัดจ้าน คอหมูย่าง ไส้อ่อนย่าง ไก่ย่างนมสด และต้มแซ่บ',
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=600',
      tags: ['อีสาน', 'ลาบเป็ด', 'คอหมูย่าง'], distance: '~120 ม.', rating: 4.4,
      lat: 13.7808, lng: 100.5610, mapsUrl: 'https://maps.google.com/?q=13.7808,100.5610' },
    { id: 'r3', cat: 'restaurant', name: 'ก๋วยเตี๋ยวชาติหน้า 15 เส้น',
      desc: 'ร้านก๋วยเตี๋ยวรถเข็นชื่อดัง คิวยาวเป็นประจำ ชามใหญ่เครื่องแน่น ไก่ตุ๋น หมูสับ กระดูกอ่อน น้ำซุปต้มยำเข้มข้น',
      image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=600',
      tags: ['ก๋วยเตี๋ยว', 'รถเข็น', 'เครื่องแน่น'], distance: '~80 ม.', rating: 4.6,
      lat: 13.7795, lng: 100.5605, mapsUrl: 'https://maps.google.com/?q=13.7795,100.5605' },
    { id: 'r4', cat: 'restaurant', name: 'IHere Yakiniku Shabu',
      desc: 'บุฟเฟ่ต์ปิ้งย่างและชาบูในซอยวิภาวดี 2 เหมาะกลุ่มเพื่อน ราคาสบายกระเป๋า เนื้อสด ผักครบ',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
      tags: ['ปิ้งย่าง', 'บุฟเฟ่ต์', 'ชาบู'], distance: '~150 ม.', rating: 4.3,
      lat: 13.7810, lng: 100.5620, mapsUrl: 'https://maps.google.com/?q=13.7810,100.5620' },
    { id: 'r5', cat: 'restaurant', name: 'Seonmul Korean Hot Pot',
      desc: 'ร้านหม้อไฟเกาหลียอดนิยม รสชาติจัดจ้านแท้เกาหลี มีเมนูข้าวและของทานเล่นสไตล์เกาหลี',
      image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&q=80&w=600',
      tags: ['เกาหลี', 'หม้อไฟ', 'Hot Pot'], distance: '~200 ม.', rating: 4.2,
      lat: 13.7815, lng: 100.5625, mapsUrl: 'https://maps.google.com/?q=13.7815,100.5625' },
    { id: 'r6', cat: 'restaurant', name: 'EZEE GRILL',
      desc: 'ร้านสเต็กราคานักศึกษา เมนูหลากหลาย สเต็กเนื้อ สเต็กไก่ ข้าวหน้าต่างๆ บรรยากาศเป็นกันเอง',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      tags: ['สเต็ก', 'ราคานักศึกษา', 'หลากหลาย'], distance: '~250 ม.', rating: 4.1,
      lat: 13.7820, lng: 100.5630, mapsUrl: 'https://maps.google.com/?q=13.7820,100.5630' },
    { id: 'c1', cat: 'cafe', name: 'เพื่อนแท้ 友義 (Peuan Tae)',
      desc: 'คาเฟ่ชิลล์เปิดดึก เหมาะนั่งคุยหลังเลิกเรียน มีทั้งของคาวและของหวาน ไข่กระทะ ขนมปังปิ้ง เครื่องดื่มราคาย่อมเยา',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
      tags: ['เปิดดึก', 'ขนมปังปิ้ง', 'ชิลล์'], distance: '~100 ม.', rating: 4.4,
      lat: 13.7800, lng: 100.5618, mapsUrl: 'https://maps.google.com/?q=13.7800,100.5618' },
    { id: 'c2', cat: 'cafe', name: 'ร้านกาแฟพี่แขก',
      desc: 'ร้านเครื่องดื่มเปิดมานาน ราคาเป็นกันเอง เมนูให้เลือกมากมาย เป็นที่นิยมในหมู่นักศึกษามายาวนาน',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
      tags: ['กาแฟ', 'ราคาถูก', 'เก่าแก่'], distance: '~60 ม.', rating: 4.3,
      lat: 13.7785, lng: 100.5608, mapsUrl: 'https://maps.google.com/?q=13.7785,100.5608' },
    { id: 'c3', cat: 'cafe', name: 'Inthanin Coffee (ปั้มบางจาก)',
      desc: 'กาแฟสดจากดอยอินทนนท์ ราคาเป็นมิตร บรรยากาศสบาย เดินถึงได้จากมหาลัย',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600',
      tags: ['กาแฟไทย', 'อินทนิล', 'ราคาดี'], distance: '~200 ม.', rating: 4.0,
      lat: 13.7770, lng: 100.5620, mapsUrl: 'https://maps.google.com/?q=13.7770,100.5620' },
    { id: 'i1', cat: 'internet', name: 'True Space (หน้า ม.หอการค้าไทย)',
      desc: 'Co-working Space ของ True เป็นที่นิยมมาก มีพื้นที่นั่งทำงาน ห้องประชุม และอินเทอร์เน็ตความเร็วสูง',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600',
      tags: ['Co-working', 'Wi-Fi เร็ว', 'ห้องประชุม'], distance: '~50 ม.', rating: 4.2,
      lat: 13.7792, lng: 100.5602, mapsUrl: 'https://maps.google.com/?q=13.7792,100.5602' },
    { id: 'i2', cat: 'internet', name: 'ร้านถ่ายเอกสาร / Print ใกล้มหาลัย',
      desc: 'ร้านถ่ายเอกสาร พรินต์งาน เข้าเล่มรายงาน มีให้เลือกหลายร้านรอบซอยวิภาวดี 2',
      image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=600',
      tags: ['ถ่ายเอกสาร', 'พรินต์', 'เข้าเล่ม'], distance: '~30 ม.', rating: 4.1,
      lat: 13.7788, lng: 100.5600, mapsUrl: 'https://maps.google.com/?q=13.7788,100.5600' },
    { id: 'd1', cat: 'dorm', name: 'หอพักสตรีบ้านวิภาวดี',
      desc: 'หอพักสตรีที่ใกล้มหาวิทยาลัยที่สุดแห่งหนึ่ง ระยะเดินเพียง 36 เมตร มีสิ่งอำนวยความสะดวกพร้อม',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600',
      tags: ['หอพักสตรี', 'ใกล้มาก', '36 เมตร'], distance: '36 ม.', rating: 4.2,
      lat: 13.7791, lng: 100.5605, mapsUrl: 'https://maps.google.com/?q=13.7791,100.5605' },
    { id: 'd2', cat: 'dorm', name: 'หอพักสตรีดวงพร',
      desc: 'หอพักสตรีระยะ 150 เมตรจากมหาวิทยาลัย ปลอดภัย มีรปภ. พร้อมสิ่งอำนวยความสะดวกครบ',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=600',
      tags: ['หอพักสตรี', 'ปลอดภัย', 'รปภ.'], distance: '150 ม.', rating: 4.1,
      lat: 13.7800, lng: 100.5595, mapsUrl: 'https://maps.google.com/?q=13.7800,100.5595' },
    { id: 'd3', cat: 'dorm', name: 'หอพักสตรีกรีนเฮ้าส์',
      desc: 'หอพักสตรีในระยะ 200 เมตร บรรยากาศร่มรื่น สะอาด มีระบบรักษาความปลอดภัย',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600',
      tags: ['หอพักสตรี', 'สะอาด', 'ร่มรื่น'], distance: '200 ม.', rating: 4.0,
      lat: 13.7805, lng: 100.5590, mapsUrl: 'https://maps.google.com/?q=13.7805,100.5590' },
    { id: 'd4', cat: 'dorm', name: 'หอพักสตรีสามัคคี 99',
      desc: 'หอพักสตรีที่ได้รับใบรับรองจากมหาวิทยาลัย ระยะ 250 เมตร มีกล้องวงจรปิดและคีย์การ์ด',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600',
      tags: ['หอพักสตรี', 'คีย์การ์ด', 'CCTV'], distance: '250 ม.', rating: 4.0,
      lat: 13.7810, lng: 100.5585, mapsUrl: 'https://maps.google.com/?q=13.7810,100.5585' },
    { id: 'd5', cat: 'dorm', name: 'หอพักสตรีบ้านดวงโรจน์',
      desc: 'หอพักสตรีแนะนำจากมหาวิทยาลัย ระยะ 260 เมตร ราคาย่อมเยา เหมาะนักศึกษาชั้นปีต้นๆ',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600',
      tags: ['หอพักสตรี', 'ราคาย่อมเยา', 'แนะนำ'], distance: '260 ม.', rating: 3.9,
      lat: 13.7815, lng: 100.5580, mapsUrl: 'https://maps.google.com/?q=13.7815,100.5580' },
    { id: 's1', cat: 'convenience', name: '7-Eleven (หน้า ม.หอการค้าไทย)',
      desc: 'เซเว่นอีเลฟเว่นสาขาหน้าซอยวิภาวดี 2 เปิด 24 ชั่วโมง มีตู้ ATM จ่ายบิล ขนม เครื่องดื่มครบ',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=600',
      tags: ['24 ชม.', 'ATM', 'จ่ายบิล'], distance: '~30 ม.', rating: 4.2,
      lat: 13.7789, lng: 100.5603, mapsUrl: 'https://maps.google.com/?q=13.7789,100.5603' },
    { id: 't1', cat: 'transport', name: 'ป้ายรถเมล์หน้า ม.หอการค้าไทย',
      desc: 'ป้ายรถประจำทางหน้ามหาวิทยาลัย มีหลายสายผ่าน เช่น สาย 26, 52, 114 และ BRT วิภาวดีรังสิต',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600',
      tags: ['รถเมล์', 'BRT', 'สาย 26/52/114'], distance: '~20 ม.', rating: 3.8,
      lat: 13.7785, lng: 100.5600, mapsUrl: 'https://maps.google.com/?q=13.7785,100.5600' },
    { id: 't2', cat: 'transport', name: 'จุดจอด Grab / รถตู้',
      desc: 'จุดขึ้น-ลงรถ Grab Taxi และรถตู้ ใช้ได้สะดวก บริเวณหน้าซอยวิภาวดี 2',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600',
      tags: ['Grab', 'Taxi', 'รถตู้'], distance: '~50 ม.', rating: 4.0,
      lat: 13.7793, lng: 100.5600, mapsUrl: 'https://maps.google.com/?q=13.7793,100.5600' }
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
const NEARBY_API = '/api/nearby-places';
const CATEGORIES_API = '/api/nearby-categories';

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
        // If DB has no coordinates, assign a random nearby mock coordinate for demo purposes
        lat: p.latitude || (13.779 + (Math.random() * 0.005 - 0.0025)),
        lng: p.longitude || (100.56 + (Math.random() * 0.005 - 0.0025)),
        mapsUrl: p.mapsUrl || (p.latitude && p.longitude ? `https://maps.google.com/?q=${p.latitude},${p.longitude}` : `https://maps.google.com/?q=${encodeURIComponent(p.name || '')}`)
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
let searchQuery = '';

let mapLayer = null;

// ─── Map Functions ──────────────────────────
function initMap() {
    if (!document.getElementById('leafletMap')) return;
    map = L.map('leafletMap').setView([13.779, 100.56], 16); // UTCC coordinates
    
    // Google Maps Tile Layer
    mapLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; <a href="https://maps.google.com/">Google Maps</a>'
    }).addTo(map);

    const utccIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png', // University icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    L.marker([13.779, 100.56], { icon: utccIcon }).addTo(map)
        .bindPopup('<b>มหาวิทยาลัยหอการค้าไทย</b><br>UTCC Campus')
        .openPopup();
}

function renderMapMarkers(places) {
    if (!map) return;

    // Clear old markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const placeIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // simple pin icon
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
    });

    places.forEach(p => {
        if (p.lat && p.lng) {
            const marker = L.marker([p.lat, p.lng], {
                icon: placeIcon,
                draggable: isAdmin   // Draggable only in Admin Mode
            }).addTo(map);

            const popupContent = isAdmin
                ? `<b>${p.name}</b><br><span style="color:#38bdf8;font-size:0.8rem">📍 ลากหมุดเพื่อย้ายตำแหน่ง</span><br><small>Lat: ${p.lat.toFixed(5)}, Lng: ${p.lng.toFixed(5)}</small>`
                : `<b>${p.name}</b><br><a href="${p.mapsUrl}" target="_blank">เปิดในแผนที่</a>`;

            marker.bindPopup(popupContent);
            marker.placeId = p.id;

            // When Admin drags a marker, save new coords to DB
            if (isAdmin) {
                marker.on('dragend', async function(e) {
                    const newPos = e.target.getLatLng();
                    const newLat = newPos.lat;
                    const newLng = newPos.lng;

                    // Update local data
                    const localPlace = PLACES.find(x => x.id === p.id);
                    if (localPlace) {
                        localPlace.lat = newLat;
                        localPlace.lng = newLng;
                    }

                    // Update popup with new coords
                    marker.setPopupContent(
                        `<b>${p.name}</b><br><span style="color:#38bdf8;font-size:0.8rem">📍 ลากหมุดเพื่อย้ายตำแหน่ง</span><br><small>Lat: ${newLat.toFixed(5)}, Lng: ${newLng.toFixed(5)}</small>`
                    );
                    marker.openPopup();

                    // Save to DB via PUT API
                    try {
                        const res = await fetch(`${NEARBY_API}/${p.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ latitude: newLat, longitude: newLng })
                        });
                        if (res.ok) {
                            showToast(`✅ บันทึกตำแหน่ง "${p.name}" แล้ว`, 'success');
                        } else {
                            showToast('❌ บันทึกตำแหน่งไม่สำเร็จ', 'error');
                        }
                    } catch (err) {
                        console.error('Save coords error:', err);
                        showToast('❌ เกิดข้อผิดพลาดในการบันทึก', 'error');
                    }
                });
            }

            markers.push(marker);
        }
    });
}

let currentRouteLayer = null;

async function drawRouteToPlace(placeId) {
    const place = PLACES.find(p => p.id === placeId);
    if (!place || !place.lat || !place.lng || !map) {
        showToast('ไม่สามารถนำทางได้ (ไม่มีพิกัดร้านค้า)', 'error');
        return;
    }

    // Scroll to map smoothly
    document.getElementById('leafletMap').scrollIntoView({ behavior: 'smooth', block: 'center' });

    // University coordinates (Start Point)
    const startLat = 13.779;
    const startLng = 100.56;
    const endLat = place.lat;
    const endLng = place.lng;

    // Use OSRM public API (walking profile)
    const osrmUrl = `https://router.project-osrm.org/route/v1/foot/${startLng},${startLat};${endLng},${endLat}?overview=simplified&geometries=geojson`;

    try {
        if (currentRouteLayer) {
            map.removeLayer(currentRouteLayer);
        }

        showToast('กำลังค้นหาเส้นทาง...', 'info');

        const response = await fetch(osrmUrl);
        const data = await response.json();

        if (data.code !== 'Ok' || data.routes.length === 0) {
            showToast('ค้นหาเส้นทางไม่สำเร็จ', 'error');
            return;
        }

        // Create GeoJSON layer from the OSRM route geometry
        const routeGeoJSON = data.routes[0].geometry;
        currentRouteLayer = L.geoJSON(routeGeoJSON, {
            style: {
                color: '#38bdf8', /* UTCC blue/sky blue wrapper */
                weight: 6,
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: '1, 10' /* Optional: make it look dotted for walking */
            }
        }).addTo(map);

        // Zoom map to fit both UTCC and the Place
        map.fitBounds(currentRouteLayer.getBounds(), {
            padding: [50, 50],
            maxZoom: 18
        });

        // Find the marker and open its popup
        const marker = markers.find(m => m.placeId === placeId);
        if (marker) {
            marker.openPopup();
        }

    } catch (e) {
        console.error("OSRM Routing Error:", e);
        showToast('เกิดข้อผิดพลาดในการโหลดเส้นทาง', 'error');
    }
}


// ─── Load & Render Category Filter Buttons ──────────────────
async function loadCategories() {
    const bar = document.getElementById('categoryBar');
    if (!bar) return;
    try {
        const res = await fetch(CATEGORIES_API);
        if (!res.ok) throw new Error('categories API error');
        const cats = await res.json();

        bar.innerHTML = cats.map((c) => {
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
        bar.innerHTML = `
            <span class="filter-tag active" data-cat="all" onclick="filterCat('all',this)"><i class='bx bx-grid-alt'></i> ทั้งหมด</span>
            <span class="filter-tag" data-cat="restaurant" onclick="filterCat('restaurant',this)"><i class='bx bx-restaurant'></i> ร้านอาหาร</span>
            <span class="filter-tag" data-cat="cafe" onclick="filterCat('cafe',this)"><i class='bx bx-coffee'></i> คาเฟ่</span>
            <span class="filter-tag" data-cat="dorm" onclick="filterCat('dorm',this)"><i class='bx bx-building-house'></i> หอพัก</span>
        `;
    }
}

// ─── Fetch Places from API ───────────────────
async function fetchPlacesFromApi(cat) {
    try {
        const url = (!cat || cat === 'all')
            ? NEARBY_API
            : `${NEARBY_API}/category/${encodeURIComponent(cat)}`;
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
    const sortedPlaces = [...places].sort((a, b) => a.name.localeCompare(b.name, 'th'));

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
                    ${p.lat && p.lng ? `
                    <button class="nav-btn" onclick="drawRouteToPlace('${p.id}')">
                        <i class='bx bx-navigation'></i> นำทาง
                    </button>` : `
                    <a href="${p.mapsUrl || '#'}" target="_blank" class="nav-btn">
                        <i class='bx bx-navigation'></i> แผนที่
                    </a>`}
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
    const input = document.getElementById('nearbySearchInput');
    if (input) {
        searchQuery = input.value.trim().toLowerCase();
        reRender();
    }
}

function reRender() {
    let filtered = PLACES;
    
    if (searchQuery) {
        filtered = filtered.filter(p => 
            (p.name && p.name.toLowerCase().includes(searchQuery)) || 
            (p.desc && p.desc.toLowerCase().includes(searchQuery)) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery)))
        );
    }
    
    renderCards(filtered);
    renderMapMarkers(filtered);
}

// ─── Admin Auth ─────────────────────────────
function openAdminLogin() {
    if (isAdmin) return;
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

// ─── Nearby Settings Panel UI strings ───────
const NEARBY_STRINGS = {
    th: {
        navFav: 'รายการโปรด',
        navSettings: 'ตั้งค่า',
        settingsTitle: 'การตั้งค่า',
        settingsSub: 'ปรับแต่งการแสดงผลตามต้องการ',
        labelTheme: '🎨 ธีม',
        labelDarkMode: 'โหมดมืด',
        descDarkMode: 'เปลี่ยนธีมเป็นสีเข้ม',
        labelLang: '🌐 ภาษา',
        labelDisplayLang: 'ภาษาแสดงผล',
        labelAbout: 'ℹ️ เกี่ยวกับ',
        labelVersion: 'เวอร์ชัน',
        labelDev: 'พัฒนาโดย',
        labelUniv: 'มหาวิทยาลัย',
        favPanelTitle: 'รายการโปรด',
        heroTag: 'บริเวณรอบมหาวิทยาลัย',
        heroTitle1: 'สถานที่น่าสนใจ',
        heroTitle2: 'รอบ ม.หอการค้าไทย',
        heroSub: 'ร้านอาหาร คาเฟ่ หอพัก และบริการต่างๆ ในระยะเดินถึง',
    },
    en: {
        navFav: 'Favorites',
        navSettings: 'Settings',
        settingsTitle: 'Settings',
        settingsSub: 'Customize your display preferences',
        labelTheme: '🎨 Theme',
        labelDarkMode: 'Dark Mode',
        descDarkMode: 'Switch to dark theme',
        labelLang: '🌐 Language',
        labelDisplayLang: 'Display Language',
        labelAbout: 'ℹ️ About',
        labelVersion: 'Version',
        labelDev: 'Developed by',
        labelUniv: 'University',
        favPanelTitle: 'Favorites',
        heroTag: 'Around the University',
        heroTitle1: 'Interesting Places',
        heroTitle2: 'Around UTCC',
        heroSub: 'Restaurants, cafés, dorms, and services within walking distance',
    }
};

let nearbyLang = localStorage.getItem('lang') || 'th';

function applyNearbyLanguage(lang) {
    const s = NEARBY_STRINGS[lang] || NEARBY_STRINGS['th'];

    // Nav labels
    const favLabel = document.getElementById('nearbyNavFavLabel');
    if (favLabel) favLabel.textContent = s.navFav;
    const setLabel = document.getElementById('nearbyNavSettingsLabel');
    if (setLabel) setLabel.textContent = s.navSettings;

    // Settings panel
    const map = {
        nearbySettingsTitle: 'settingsTitle',
        nearbySettingsSub: 'settingsSub',
        nearbyLabelTheme: 'labelTheme',
        nearbyLabelDarkMode: 'labelDarkMode',
        nearbyDescDarkMode: 'descDarkMode',
        nearbyLabelLang: 'labelLang',
        nearbyLabelDisplayLang: 'labelDisplayLang',
        nearbyLabelAbout: 'labelAbout',
        nearbyLabelVersion: 'labelVersion',
        nearbyLabelDev: 'labelDev',
        nearbyLabelUniv: 'labelUniv',
        nearbyFavPanelTitle: 'favPanelTitle',
    };
    Object.entries(map).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && s[key] !== undefined) el.textContent = s[key];
    });

    // Hero text
    const heroTag = document.querySelector('.hero-tag');
    if (heroTag) heroTag.innerHTML = `<i class='bx bx-current-location'></i> ${s.heroTag}`;
    const heroH1 = document.querySelector('.nearby-hero-content h1');
    if (heroH1) heroH1.innerHTML = `${s.heroTitle1}<br><span class="accent">${s.heroTitle2}</span>`;
    const heroPara = document.querySelector('.nearby-hero-content > p');
    if (heroPara) heroPara.textContent = s.heroSub;

    // Lang buttons
    const thBtn = document.getElementById('nearbyLangTH');
    const enBtn = document.getElementById('nearbyLangEN');
    if (thBtn) thBtn.classList.toggle('active', lang === 'th');
    if (enBtn) enBtn.classList.toggle('active', lang === 'en');
}

// ─── Settings Panel Toggle ───────────────────
function toggleNearbySettings() {
    const settings = document.getElementById('nearbySettingsPanel');
    const back = document.getElementById('panelBackdrop');
    settings.classList.toggle('active');
    back.classList.toggle('active', settings.classList.contains('active'));
}

function closeNearbyPanels() {
    document.getElementById('nearbySettingsPanel').classList.remove('active');
    document.getElementById('panelBackdrop').classList.remove('active');
}

// ─── Dark Mode ───────────────────────────────
function toggleNearbyDarkMode(enabled) {
    document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
    // Share with main page via same key
    localStorage.setItem('darkMode', enabled ? 'dark' : 'light');
}

// ─── Language ────────────────────────────────
function setNearbyLanguage(lang) {
    nearbyLang = lang;
    localStorage.setItem('lang', lang);
    applyNearbyLanguage(lang);
}

// ─── Init ────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    // Restore dark mode — share same key as main page
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const toggle = document.getElementById('nearbyDarkModeToggle');
        if (toggle) toggle.checked = true;
    }

    // Restore language
    nearbyLang = localStorage.getItem('lang') || 'th';
    applyNearbyLanguage(nearbyLang);

    initMap();
    await loadCategories();
    await fetchPlacesFromApi('all');
    reRender();

    const searchInput = document.getElementById('nearbySearchInput');
    const searchBtn = document.getElementById('nearbySearchBtn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', doSearch);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') doSearch();
        });
    }

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
