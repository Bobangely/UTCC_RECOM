// =============================================
//  UTCC Nearby — nearby.js
//  Admin & Comment system + localStorage
// =============================================

// ─── Admin Config ──────────────────────────
let isAdmin = false; // Default to false
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
    'Restaurant': '#ef4444', 'Cafe': '#f59e0b', 'Study Area': '#6366f1',
    'หอพัก': '#10b981', 'Other': '#ec4899', 'Transport': '#3b82f6',
    restaurant: '#ef4444', cafe: '#f59e0b', internet: '#6366f1',
    dorm: '#10b981', convenience: '#ec4899', transport: '#3b82f6'
};
const CAT_LABELS = {
    'Restaurant': 'ร้านอาหาร', 'Cafe': 'คาเฟ่', 'Study Area': 'อินเทอร์เน็ต',
    'หอพัก': 'หอพัก', 'Other': 'ร้านสะดวกซื้อ', 'Transport': 'ขนส่ง',
    restaurant: 'ร้านอาหาร', cafe: 'คาเฟ่', internet: 'อินเทอร์เน็ต',
    dorm: 'หอพัก', convenience: 'ร้านสะดวกซื้อ', transport: 'ขนส่ง'
};

// ─── API Config ──────────────────────────────
const NEARBY_API = '/api/nearby-places';
const CATEGORIES_API = '/api/nearby-categories';
const REVIEWS_API = '/api/reviews';

const NEARBY_CACHE_KEY = 'utcc_nearby_places';
const NEARBY_CACHE_TTL = 5 * 60 * 1000;

function getNearbyCache(cat) {
    try {
        const raw = sessionStorage.getItem(`${NEARBY_CACHE_KEY}_${cat}`);
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts > NEARBY_CACHE_TTL) {
            sessionStorage.removeItem(`${NEARBY_CACHE_KEY}_${cat}`);
            return null;
        }
        return data;
    } catch { return null; }
}

function setNearbyCache(cat, data) {
    try {
        sessionStorage.setItem(`${NEARBY_CACHE_KEY}_${cat}`, JSON.stringify({ data, ts: Date.now() }));
    } catch {}
}

function clearNearbyCache() {
    Object.keys(sessionStorage)
        .filter(k => k.startsWith(NEARBY_CACHE_KEY))
        .forEach(k => sessionStorage.removeItem(k));
}

// ─── Convert API Place → local format ────────
function apiToLocal(p) {
    const finalLat = p.latitude || (13.779 + (Math.random() * 0.005 - 0.0025));
    const finalLng = p.longitude || (100.56 + (Math.random() * 0.005 - 0.0025));
    
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
        price: p.price || null,
        lat: finalLat,
        lng: finalLng,
        // Use the original Google Maps link if available to show the full place profile.
        // Fallback to coordinates if no link was provided.
        mapsUrl: p.mapsUrl ? p.mapsUrl : `https://www.google.com/maps/search/?api=1&query=${finalLat},${finalLng}`
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
        latitude: data.lat || null,
        longitude: data.lng || null,
        price: data.price,
        tags: data.tags,
        images: data.images ? data.images : (existingImages || (data.image ? [data.image] : []))
    };
}

// ─── Reviews cache (loaded per place from API) ────────────
let REVIEWS_CACHE = {};

let PLACES = [];   // filled after DOMContentLoaded
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
                draggable: false   // Disabled dragging, rely on mapsUrl parsing instead
            }).addTo(map);

            const firstImg = (p.images && p.images.length > 0) ? p.images[0] : (p.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=300');
            const popupContent = `
                <div style="width:160px; font-family: inherit;">
                    <img src="${firstImg}" alt="${p.name}" style="width:100%; height:90px; object-fit:cover; border-radius:6px; margin-bottom:6px;">
                    <strong style="font-size:0.95rem; color:#1e293b; display:block; margin-bottom:4px; line-height:1.2">${p.name}</strong>
                    <p style="font-size:0.75rem; color:#64748b; margin:0 0 8px 0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.desc || 'ไม่มีคำอธิบาย'}</p>
                    <a href="${p.mapsUrl}" target="_blank" style="display:inline-block; background:#0ea5e9; color:white; padding:4px 10px; border-radius:4px; text-decoration:none; font-size:0.8rem; width:100%; text-align:center;">เปิด Google Maps</a>
                </div>
            `;

            marker.bindPopup(popupContent);
            
            // Open popup on hover (mouseover) so the user doesn't have to click
            marker.on('mouseover', function() {
                this.openPopup();
            });
            marker.placeId = p.id;

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

// ─── Show skeleton while loading ─────────────
function showNearbySkeleton() {
    const grid = document.getElementById('nearbyGrid');
    if (!grid) return;
    const card = `
        <div class="nearby-card nearby-skeleton-card">
            <div class="nearby-skeleton-img"></div>
            <div class="card-body" style="gap:0.5rem;display:flex;flex-direction:column">
                <div class="nearby-skeleton-line" style="width:35%;height:0.55rem"></div>
                <div class="nearby-skeleton-line" style="width:80%"></div>
                <div class="nearby-skeleton-line" style="width:65%;height:0.75rem"></div>
                <div class="nearby-skeleton-line" style="width:50%;height:0.55rem;margin-top:0.4rem"></div>
            </div>
        </div>`;
    grid.innerHTML = card.repeat(6);
}

// ─── Fetch Places from API ───────────────────
async function fetchPlacesFromApi(cat) {
    const cached = getNearbyCache(cat || 'all');
    if (cached) {
        PLACES = cached;
        return;
    }
    try {
        const url = (!cat || cat === 'all')
            ? NEARBY_API
            : `${NEARBY_API}/category/${encodeURIComponent(cat)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API error ' + res.status);
        const data = await res.json();
        PLACES = data.map(apiToLocal);
        setNearbyCache(cat || 'all', PLACES);
    } catch (e) {
        console.error('Failed to load from API, using defaults', e);
        PLACES = DEFAULT_PLACES.map(p => ({ ...p }));
    }
}

// ─── Render ─────────────────────────────────
function renderPrice(price) {
    if (!price) return '';
    try {
        const priceData = JSON.parse(price);
        let text = '';

        if (Array.isArray(priceData)) {
            // Handle array of prices
            text = priceData.map(item => {
                switch (item.type) {
                    case 'range': return `฿${item.min}-${item.max}`;
                    case 'fixed': return `฿${item.value}`;
                    case 'starting': return `เริ่มต้น ฿${item.value}`;
                    default: return item.text || '';
                }
            }).join(', ');
        } else {
            // Handle single price object
            switch (priceData.type) {
                case 'range': text = `฿${priceData.min} - ฿${priceData.max}`; break;
                case 'fixed': text = `฿${priceData.value}`; break;
                case 'starting': text = `เริ่มต้น ฿${priceData.value}`; break;
                default: return '';
            }
        }
        return `<div class="card-price"><i class='bx bx-purchase-tag-alt'></i> ${text}</div>`;
    } catch (e) {
        // If not valid JSON, assume it's a raw string
        return `<div class="card-price"><i class='bx bx-purchase-tag-alt'></i> ${price.trim()}</div>`;
    }
}

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
        const priceHtml = renderPrice(p.price);
        const commentCount = (REVIEWS_CACHE[p.id] || []).length;
        const adminBtns = `
            <div class="admin-card-btns admin-only">
                <button class="admin-card-btn edit" onclick="openEditPlace('${p.id}')" title="แก้ไข">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="admin-card-btn delete" onclick="openDeleteModal('${p.id}')" title="ลบ">
                    <i class='bx bx-trash'></i>
                </button>
            </div>`;

        let imgHtml = '';
        const defaultImg = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600';
        if (p.images && p.images.length > 1) {
            imgHtml = `
            <div class="card-carousel-wrapper">
                <button class="carousel-btn prev" onclick="scrollCarousel(event, this, -1)">❮</button>
                <div class="card-carousel-container" onscroll="updateCarouselDots(this)">
                    ${p.images.map(url => `<img class="carousel-img" src="${url}" onerror="this.src='${defaultImg}'" loading="lazy">`).join('')}
                </div>
                <button class="carousel-btn next" onclick="scrollCarousel(event, this, 1)">❯</button>
                <div class="carousel-dots">
                    ${p.images.map((_, idx) => `<span class="dot ${idx === 0 ? 'active' : ''}"></span>`).join('')}
                </div>
            </div>`;
        } else {
            const singleImg = (p.images && p.images.length === 1) ? p.images[0] : (p.image || defaultImg);
            imgHtml = `<img src="${singleImg}" alt="${p.name}" loading="lazy" onerror="this.src='${defaultImg}'" class="carousel-img">`;
        }

        return `
        <div class="nearby-card" style="animation-delay:${i * 0.05}s" data-cat="${p.cat}">
            ${adminBtns}
            <div class="card-img-wrap">
                ${imgHtml}
                <span class="card-cat-badge" style="background:${color}">${label}</span>
                <span class="card-dist-badge"><i class='bx bx-walk'></i>${p.distance}</span>
            </div>
            <div class="card-body">
                <div class="card-name">${p.name}</div>
                <p class="card-desc">${p.desc}</p>
                <div class="card-tags">${tagsHtml}</div>
                ${priceHtml}
                <div class="card-footer">
                    <span class="card-rating">
                        <span class="stars">${stars}</span>
                        <span>${ratings.avg.toFixed(1)}</span>
                    </span>
                    <button class="comment-btn" onclick="openCommentModal('${p.id}', \`${p.name.replace(/`/g, "&#96;")}\`)">
                        <i class='bx bx-chat'></i>
                        ${commentCount > 0 ? `<span class="comment-count">${commentCount}</span>` : ''}
                    </button>
                    ${p.lat && p.lng ? `
                    <button class="nav-btn" onclick="drawRouteToPlace('${p.id}')">
                        <i class='bx bx-navigation'></i> นำทาง
                    </button>` : ''}
                    <a href="${p.mapsUrl || (p.lat && p.lng ? `https://www.google.com/maps?q=${p.lat},${p.lng}` : `https://maps.google.com/?q=${encodeURIComponent(p.name)}`)}" target="_blank" rel="noopener" class="nav-btn gmaps-btn" title="เปิด Google Maps">
                        <img src="https://www.google.com/favicon.ico" width="14" height="14" alt="Google Maps" style="border-radius:2px">
                        Maps
                    </a>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderStars(rating) {
    const full = Math.round(rating);
    let s = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= full) s += '★';
        else s += '☆';
    }
    return s;
}

function getAverageRating(placeId, defaultRating) {
    const reviews = REVIEWS_CACHE[placeId] || [];
    const rated = reviews.filter(r => r.rating > 0);
    if (rated.length === 0) return { avg: defaultRating, count: 0 };
    const avg = rated.reduce((a, b) => a + b.rating, 0) / rated.length;
    return { avg: Math.round(avg * 10) / 10, count: rated.length };
}

async function preloadAllReviews() {
    if (PLACES.length === 0) return;
    await Promise.all(
        PLACES.map(p =>
            fetch(`${REVIEWS_API}/place/${p.id}`)
                .then(r => r.ok ? r.json() : [])
                .then(data => { REVIEWS_CACHE[p.id] = data; })
                .catch(() => { REVIEWS_CACHE[p.id] = REVIEWS_CACHE[p.id] || []; })
        )
    );
}

function filterCat(cat, btn) {
    currentCat = cat;
    document.querySelectorAll('.filter-tag').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    fetchPlacesFromApi(cat).then(() => {
        reRender();
        preloadAllReviews().then(() => reRender());
    });
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

// ─── Admin Mode ──────────────────────────────
const ADMIN_PASSWORD = 'utcc1234';

function toggleAdminMode(enabled) {
    if (enabled) {
        const input = prompt('กรุณากรอกรหัสผ่าน Admin:');
        if (input !== ADMIN_PASSWORD) {
            showToast('❌ รหัสผ่านไม่ถูกต้อง', 'error');
            const toggle = document.getElementById('adminModeToggle');
            if (toggle) toggle.checked = false;
            return;
        }
    }
    setAdminMode(enabled);
}

function setAdminMode(enabled) {
    isAdmin = enabled;
    document.body.classList.toggle('admin-mode', enabled);
    localStorage.setItem('adminMode', enabled ? '1' : '0');
    reRender();
}

// ─── Place Modal (Add / Edit) ────────────────
async function autoParseLatLng(url) {
    if (!url) return;
    // Try local parse first (works for full Google Maps URLs)
    const patterns = [
        /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
        /@(-?\d+\.\d+),(-?\d+\.\d+)/
    ];
    for (const re of patterns) {
        const m = url.match(re);
        if (m) {
            document.getElementById('pm_lat').value = m[1];
            document.getElementById('pm_lng').value = m[2];
            return;
        }
    }
    // Can't parse locally (short URL) — ask backend to resolve redirect
    try {
        const latEl = document.getElementById('pm_lat');
        const lngEl = document.getElementById('pm_lng');
        latEl.placeholder = 'กำลังดึงพิกัด...';
        const res = await fetch(`/api/util/resolve-maps-url?url=${encodeURIComponent(url)}`);
        if (res.ok) {
            const data = await res.json();
            if (data.lat != null) latEl.value = data.lat;
            if (data.lng != null) lngEl.value = data.lng;
        }
        latEl.placeholder = 'เช่น 13.7790';
    } catch(e) { /* silent fail */ }
}

function openAddPlace() {
    document.getElementById('placeModalTitle').innerHTML = "<i class='bx bx-plus-circle'></i> เพิ่มสถานที่ใหม่";
    document.getElementById('placeModalId').value = '';
    ['pm_name','pm_desc','pm_image','pm_distance','pm_maps','pm_tags','pm_lat','pm_lng', 'pm_price'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('pm_rating').value = '4.0';
    document.getElementById('pm_cat').value = 'restaurant';
    document.getElementById('pm_image_files').value = '';
    const urlAdd = document.getElementById('pm_image_url_add');
    if (urlAdd) urlAdd.value = '';
    
    currentPlaceKeptImages = [];
    currentUploadFiles = [];
    renderGalleryPreview();
    showModal('placeModal');
}

function openEditPlace(placeId) {
    const p = PLACES.find(x => x.id === placeId);
    if (!p) return;
    document.getElementById('placeModalTitle').innerHTML = "<i class='bx bx-edit'></i> แก้ไขสถานที่";
    document.getElementById('placeModalId').value = p.id;
    document.getElementById('pm_name').value = p.name;
    document.getElementById('pm_desc').value = p.desc;
    document.getElementById('pm_image').value = '';
    document.getElementById('pm_distance').value = p.distance;
    document.getElementById('pm_rating').value = p.rating;
    
    // Convert price from JSON to simple string for editing
    let priceForEdit = '';
    if (p.price) {
        try {
            const priceData = JSON.parse(p.price);
            if (Array.isArray(priceData)) {
                priceForEdit = priceData.map(item => {
                    if (item.type === 'range') return `${item.min}-${item.max}`;
                    if (item.type === 'fixed') return item.value;
                    if (item.type === 'starting') return `${item.value}+`;
                    return item.text || '';
                }).join(', ');
            } else { // Fallback for old single object format
                if (priceData.type === 'fixed') priceForEdit = priceData.value;
                else if (priceData.type === 'range') priceForEdit = `${priceData.min}-${priceData.max}`;
                else if (priceData.type === 'starting') priceForEdit = `${priceData.value}+`;
            }
        } catch(e) {
            priceForEdit = p.price; // If not valid JSON, display as is
        }
    }
    document.getElementById('pm_price').value = priceForEdit;

    document.getElementById('pm_tags').value = (p.tags || []).join(', ');
    document.getElementById('pm_cat').value = p.cat;
    document.getElementById('pm_maps').value = p.mapsUrl || '';
    document.getElementById('pm_lat').value = p.lat || '';
    document.getElementById('pm_lng').value = p.lng || '';
    const urlAdd = document.getElementById('pm_image_url_add');
    if (urlAdd) urlAdd.value = '';
    
    currentPlaceKeptImages = p.images && p.images.length > 0 ? [...p.images] : (p.image ? [p.image] : []);
    currentUploadFiles = [];
    renderGalleryPreview();
    
    showModal('placeModal');
}

function closePlaceModal() { closeAllModals(); }

// Helper to parse user input for price
function parsePriceInput(input) {
    if (!input || !input.trim()) {
        return null; // No input, no price
    }

    const parts = input.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) return null;

    const priceData = parts.map(part => {
        // Case 1: Range (e.g., "100-500")
        const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
        if (rangeMatch) {
            return { type: 'range', min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
        }

        // Case 2: Starting from (e.g., "4500+")
        const startingMatch = part.match(/^(\d+)\+$/);
        if (startingMatch) {
            return { type: 'starting', value: parseInt(startingMatch[1]) };
        }

        // Case 3: Fixed price (e.g., "500")
        const fixedMatch = part.match(/^(\d+)$/);
        if (fixedMatch) {
            return { type: 'fixed', value: parseInt(fixedMatch[1]) };
        }

        // Fallback: if it doesn't match known patterns, store as raw text
        return { type: 'text', text: part };
    });

    return JSON.stringify(priceData);
}


async function savePlaceModal() {
    const name = document.getElementById('pm_name').value.trim();
    const cat = document.getElementById('pm_cat').value;
    if (!name) { showToast('กรุณากรอกชื่อสถานที่', 'error'); return; }

    const id = document.getElementById('placeModalId').value;
    const existingPlace = id ? PLACES.find(p => p.id === id) : null;
    const latVal = parseFloat(document.getElementById('pm_lat').value) || (existingPlace ? existingPlace.lat : null);
    const lngVal = parseFloat(document.getElementById('pm_lng').value) || (existingPlace ? existingPlace.lng : null);
    const mapsUrlVal = document.getElementById('pm_maps').value.trim() ||
        (latVal && lngVal ? `https://www.google.com/maps?q=${latVal},${lngVal}` : `https://maps.google.com/?q=${encodeURIComponent(name)}`);
    let uploadedUrls = [];
    if (currentUploadFiles.length > 0) {
        const formData = new FormData();
        currentUploadFiles.forEach(f => formData.append('files', f));
        
        try {
            showToast('⏳ กำลังอัปโหลดรูปภาพ...', 'info');
            const uploadRes = await fetch('/api/upload/multiple', {
                method: 'POST',
                body: formData
            });
            if (!uploadRes.ok) throw new Error('Upload failed');
            const out = await uploadRes.json();
            uploadedUrls = out.urls || [];
        } catch (err) {
            showToast('❌ อัปโหลดรูปไม่สำเร็จ', 'error');
            return;
        }
    }
    const finalImageUrls = [...currentPlaceKeptImages, ...uploadedUrls];

    const priceInput = document.getElementById('pm_price').value;
    const priceJson = parsePriceInput(priceInput);

    const data = {
        name,
        cat,
        desc: document.getElementById('pm_desc').value.trim(),
        image: finalImageUrls.length > 0 ? finalImageUrls[0] : '', // fallback for generic single image
        images: finalImageUrls,
        distance: document.getElementById('pm_distance').value.trim() || 'N/A',
        rating: parseFloat(document.getElementById('pm_rating').value) || 4.0,
        price: priceJson,
        tags: document.getElementById('pm_tags').value.split(',').map(t => t.trim()).filter(Boolean),
        mapsUrl: mapsUrlVal,
        lat: latVal,
        lng: lngVal
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
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`PUT failed: ${errorText}`);
            }
            clearNearbyCache();
            showToast('✅ แก้ไขข้อมูลสำเร็จ', 'success');
        } else {
            const payload = localToApi(data, data.images);

            const res = await fetch(NEARBY_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`POST failed: ${errorText}`);
            }
            clearNearbyCache();
            showToast('✅ เพิ่มสถานที่สำเร็จ', 'success');
        }
        closeAllModals();
        await fetchPlacesFromApi(currentCat);
        reRender();
    } catch (e) {
        showToast('❌ บันทึกไม่สำเร็จ: ' + e.message, 'error');
    }
}

let currentPlaceKeptImages = [];
let currentUploadFiles = [];

function renderGalleryPreview() {
    const gallery = document.getElementById('pm_gallery_preview');
    if (!gallery) return;
    gallery.innerHTML = '';
    
    currentPlaceKeptImages.forEach((url, i) => {
        const div = document.createElement('div');
        div.className = 'preview-img-container';
        div.innerHTML = `
            <img src="${url}" alt="kept">
            <button class="preview-remove-btn" type="button" onclick="removeKeptImage(${i})"><i class='bx bx-x'></i></button>
        `;
        gallery.appendChild(div);
    });

    currentUploadFiles.forEach((file, i) => {
        const url = URL.createObjectURL(file);
        const div = document.createElement('div');
        div.className = 'preview-img-container';
        div.style.border = '2px solid var(--primary)';
        div.innerHTML = `
            <img src="${url}" alt="new">
            <button class="preview-remove-btn" type="button" onclick="removeUploadFile(${i})"><i class='bx bx-x'></i></button>
        `;
        gallery.appendChild(div);
    });

    gallery.style.display = (currentPlaceKeptImages.length > 0 || currentUploadFiles.length > 0) ? 'flex' : 'none';
}

function addImageUrl() {
    const input = document.getElementById('pm_image_url_add');
    if (!input) return;
    const url = input.value.trim();
    if (!url) return;
    
    if (!url.startsWith('http')) {
        showToast('กรุณากรอก URL ที่ถูกต้อง (ขึ้นต้นด้วย http)', 'error');
        return;
    }
    
    currentPlaceKeptImages.push(url);
    input.value = '';
    renderGalleryPreview();
}

function removeKeptImage(index) {
    currentPlaceKeptImages.splice(index, 1);
    renderGalleryPreview();
}

function removeUploadFile(index) {
    currentUploadFiles.splice(index, 1);
    renderGalleryPreview();
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('pm_image_files');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            currentUploadFiles = currentUploadFiles.concat(files);
            this.value = ''; // allow selecting same files again
            renderGalleryPreview();
        });
    }
});

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
        delete REVIEWS_CACHE[deletePendingId];
        clearNearbyCache();
        closeAllModals();
        await fetchPlacesFromApi(currentCat);
        reRender();
        showToast('🗑️ ลบสถานที่แล้ว', 'info');
    } catch (e) {
        showToast('❌ ลบไม่สำเร็จ', 'error');
    }
    deletePendingId = null;
}

// ─── Comments / Reviews ──────────────────────
async function openCommentModal(placeId, placeName) {
    currentCommentPlaceId = placeId;
    selectedStars = 0;
    document.getElementById('commentModalTitle').textContent = placeName;
    document.getElementById('commentAuthor').value = '';
    document.getElementById('commentText').value = '';
    document.getElementById('starLabel').textContent = 'ยังไม่ได้เลือก';
    renderStarSelect(0);
    document.getElementById('commentList').innerHTML = `<div class="no-comments"><i class='bx bx-loader-alt bx-spin'></i><p>กำลังโหลด...</p></div>`;

    const myReview = (() => { try { return JSON.parse(localStorage.getItem(`reviewed_${placeId}`)); } catch { return null; } })();
    const alreadyReviewed = !!myReview;
    const addBox = document.querySelector('#commentModal .comment-add-box');
    const submitBtn = document.querySelector('#commentModal .modal-footer .btn-primary');
    let alreadyMsg = document.getElementById('already-reviewed-msg');
    if (!alreadyMsg) {
        alreadyMsg = document.createElement('div');
        alreadyMsg.id = 'already-reviewed-msg';
        alreadyMsg.style.cssText = 'text-align:center;padding:0.75rem;color:var(--muted);font-size:0.9rem;display:flex;gap:0.5rem;justify-content:center;align-items:center;flex-wrap:wrap;';
        addBox.parentNode.insertBefore(alreadyMsg, addBox);
    }
    if (alreadyReviewed) {
        alreadyMsg.innerHTML = `<i class='bx bx-check-circle' style="color:#10b981"></i> คุณได้แสดงความเห็นสถานที่นี้แล้ว
            <button class="btn-secondary" style="padding:0.25rem 0.75rem;font-size:0.8rem" id="alreadyMsg-edit-btn">
                <i class='bx bx-edit'></i> แก้ไข
            </button>
            <button class="btn-secondary" style="padding:0.25rem 0.75rem;font-size:0.8rem;color:#ef4444" onclick="deleteMyComment('${placeId}','${myReview.id}')">
                <i class='bx bx-trash'></i> ลบ
            </button>`;
        addBox.style.display = 'none';
        submitBtn.style.display = 'none';
        alreadyMsg.style.display = 'flex';
    } else {
        addBox.style.display = '';
        submitBtn.style.display = '';
        alreadyMsg.style.display = 'none';
    }

    showModal('commentModal');

    // ปุ่ม AI — ใช้ id คงที่ สร้างครั้งเดียว แค่อัปเดต onclick
    const modalFooter = document.querySelector('#commentModal .modal-footer');
    let analyzeBtn = document.getElementById('ai-analyze-btn');
    let analyzeResult = document.getElementById('ai-analyze-result');
    if (!analyzeBtn) {
        analyzeBtn = document.createElement('button');
        analyzeBtn.className = 'btn-secondary';
        analyzeBtn.id = 'ai-analyze-btn';
        analyzeBtn.innerHTML = `<i class='bx bx-bot'></i> AI สรุปรีวิว`;
        modalFooter.insertBefore(analyzeBtn, modalFooter.firstChild);

        analyzeResult = document.createElement('div');
        analyzeResult.id = 'ai-analyze-result';
        analyzeResult.className = 'ai-review-summary';
        analyzeResult.style.display = 'none';
        document.querySelector('#commentModal .modal-body').appendChild(analyzeResult);
    }
    analyzeBtn.onclick = () => analyzeReviews(placeId);
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = `<i class='bx bx-bot'></i> AI สรุปรีวิว`;
    analyzeResult.style.display = 'none';

    await loadReviewsForPlace(placeId);
    renderCommentList(placeId);

    // ผูก onclick ให้ปุ่มแก้ไขใน alreadyMsg หลังโหลด reviews เสร็จ
    if (alreadyReviewed) {
        const editBtn = document.getElementById('alreadyMsg-edit-btn');
        if (editBtn) {
            const myR = (REVIEWS_CACHE[placeId] || []).find(r => r.id === myReview.id);
            editBtn.onclick = () => editMyComment(placeId, myReview.id, myR ? myR.comment : '', myR ? myR.rating : 0);
        }
    }
}

function closeCommentModal() { closeAllModals(); }

async function loadReviewsForPlace(placeId) {
    try {
        const res = await fetch(`${REVIEWS_API}/place/${placeId}`);
        if (res.ok) {
            REVIEWS_CACHE[placeId] = await res.json();
        } else {
            console.error('loadReviews error:', res.status);
            REVIEWS_CACHE[placeId] = [];
        }
    } catch (e) {
        console.error('Failed to load reviews:', e);
        REVIEWS_CACHE[placeId] = REVIEWS_CACHE[placeId] || [];
    }
}

function buildRatingSummary(reviews) {
    if (reviews.length === 0) return '';

    const rated = reviews.filter(r => r.rating > 0);
    if (rated.length === 0) return '';

    const avg = rated.reduce((s, r) => s + r.rating, 0) / rated.length;
    const fullStars = Math.round(avg);
    const half = (avg % 1) >= 0.5;
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) starsHtml += "<i class='bx bxs-star'></i>";
        else if (i === fullStars + 1 && half) starsHtml += "<i class='bx bxs-star-half'></i>";
        else starsHtml += "<i class='bx bx-star'></i>";
    }

    // count per star level
    const counts = [0, 0, 0, 0, 0];
    rated.forEach(r => { if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++; });

    const barsHtml = [5, 4, 3, 2, 1].map(star => {
        const cnt = counts[star - 1];
        const pct = rated.length > 0 ? Math.round((cnt / rated.length) * 100) : 0;
        return `
        <div class="rating-bar-row">
            <span class="rating-bar-label">${star}★</span>
            <div class="rating-bar-track"><div class="rating-bar-fill" style="width:${pct}%"></div></div>
            <span class="rating-bar-count">${cnt}</span>
        </div>`;
    }).join('');

    const label = avg >= 4.5 ? 'ดีเยี่ยม' : avg >= 3.5 ? 'ดีมาก' : avg >= 2.5 ? 'ดี' : avg >= 1.5 ? 'พอใช้' : 'แย่';

    return `
    <div class="rating-summary">
        <div class="rating-summary-left">
            <div class="rating-big-score">${avg.toFixed(1)}</div>
            <div class="rating-big-stars">${starsHtml}</div>
            <div class="rating-big-label">${label} · ${rated.length} รีวิว</div>
        </div>
        <div class="rating-summary-bars">${barsHtml}</div>
    </div>`;
}

function renderCommentList(placeId) {
    const list = document.getElementById('commentList');
    const reviews = REVIEWS_CACHE[placeId] || [];

    if (reviews.length === 0) {
        list.innerHTML = `<div class="no-comments"><i class='bx bx-comment-dots'></i><p>ยังไม่มีความคิดเห็น เป็นคนแรกที่แชร์!</p></div>`;
        return;
    }

    const summaryHtml = buildRatingSummary(reviews);

    list.innerHTML = summaryHtml + reviews.map(r => {
        const ratingInt = Math.round(r.rating || 0);
        let starIcons = '';
        for (let i = 1; i <= 5; i++) {
            starIcons += i <= ratingInt ? "<i class='bx bxs-star'></i>" : "<i class='bx bx-star'></i>";
        }
        const stars = ratingInt > 0 ? `<span class="comment-stars">${starIcons}</span>` : '';
        const rawDate = r.createdAt ? new Date(r.createdAt) : null;
        const date = rawDate && !isNaN(rawDate) ? rawDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        const author = escapeHtml(r.authorName || 'ไม่ระบุชื่อ');
        const body = escapeHtml(r.comment || '');
        const adminDel = isAdmin ? `<button class="tiny-del-btn" onclick="deleteComment('${placeId}','${r.id}')"><i class='bx bx-x'></i></button>` : '';
        const myReview = (() => { try { return JSON.parse(localStorage.getItem(`reviewed_${placeId}`)); } catch { return null; } })();
        const isMyReview = myReview && myReview.id === r.id;
        const myBtns = isMyReview ? `
            <button class="tiny-del-btn" style="background:#3b82f6" title="แก้ไข" onclick="editMyComment('${placeId}','${r.id}','${(r.comment||'').replace(/'/g,"&#39;")}',${ratingInt})"><i class='bx bx-edit'></i></button>
            <button class="tiny-del-btn" title="ลบ" onclick="deleteMyComment('${placeId}','${r.id}')"><i class='bx bx-trash'></i></button>` : '';
        return `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-avatar">${author[0].toUpperCase()}</div>
                <div class="comment-meta">
                    <div class="comment-author">${author}${isMyReview ? ` <span style="font-size:0.75rem;color:#10b981;font-weight:600">• คุณ</span>` : ''}</div>
                    <div class="comment-date">${date}</div>
                </div>
                ${stars}
                ${myBtns}
                ${adminDel}
            </div>
            <p class="comment-body">${body}</p>
        </div>`;
    }).join('');
}

async function deleteComment(placeId, reviewId) {
    try {
        const res = await fetch(`${REVIEWS_API}/${reviewId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('DELETE failed');
        await loadReviewsForPlace(placeId);
        renderCommentList(placeId);
        reRender();
        showToast('🗑️ ลบความคิดเห็นแล้ว', 'info');
    } catch (e) {
        showToast('❌ ลบไม่สำเร็จ', 'error');
    }
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

    document.querySelectorAll('#editStarSelect span').forEach(s => {
        const v = parseInt(s.dataset.v);
        s.addEventListener('mouseover', () => renderEditStarSelect(v));
        s.addEventListener('mouseout', () => renderEditStarSelect(editSelectedStars));
        s.addEventListener('click', () => {
            editSelectedStars = v;
            renderEditStarSelect(v);
            const labels = ['', '★ แย่มาก', '★★ พอใช้', '★★★ ดี', '★★★★ ดีมาก', '★★★★★ ดีเยี่ยม'];
            document.getElementById('editStarLabel').textContent = labels[v];
        });
    });
});

async function submitComment() {
    const author = document.getElementById('commentAuthor').value.trim();
    const text = document.getElementById('commentText').value.trim();
    if (!author) { showToast('กรุณากรอกชื่อผู้แสดงความเห็น', 'error'); return; }
    if (selectedStars === 0) { showToast('กรุณาเลือกคะแนนดาวก่อนส่ง', 'error'); return; }

    const payload = { authorName: author, comment: text, rating: selectedStars };

    try {
        const res = await fetch(`${REVIEWS_API}/nearby/${currentCommentPlaceId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`Server ${res.status}`);
        const saved = await res.json();
        localStorage.setItem(`reviewed_${currentCommentPlaceId}`, JSON.stringify({ id: saved.id, authorName: author }));
    } catch (e) {
        console.error('submitComment error:', e);
        showToast('❌ ส่งความคิดเห็นไม่สำเร็จ', 'error');
        return;
    }

    document.getElementById('commentAuthor').value = '';
    document.getElementById('commentText').value = '';
    selectedStars = 0;
    renderStarSelect(0);
    document.getElementById('starLabel').textContent = 'ยังไม่ได้เลือก';
    const addBox = document.querySelector('#commentModal .comment-add-box');
    const submitBtn = document.querySelector('#commentModal .modal-footer .btn-primary');
    const alreadyMsg = document.getElementById('already-reviewed-msg');
    if (addBox) addBox.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'none';
    if (alreadyMsg) alreadyMsg.style.display = 'block';
    await loadReviewsForPlace(currentCommentPlaceId);
    renderCommentList(currentCommentPlaceId);
    reRender();
    showToast('✅ ส่งความคิดเห็นแล้ว!', 'success');
}

async function deleteMyComment(placeId, reviewId) {
    if (!confirm('ลบความคิดเห็นของคุณ?')) return;
    try {
        const res = await fetch(`${REVIEWS_API}/${reviewId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('DELETE failed');
        localStorage.removeItem(`reviewed_${placeId}`);
        const addBox = document.querySelector('#commentModal .comment-add-box');
        const submitBtn = document.querySelector('#commentModal .modal-footer .btn-primary');
        const alreadyMsg = document.getElementById('already-reviewed-msg');
        if (addBox) addBox.style.display = '';
        if (submitBtn) submitBtn.style.display = '';
        if (alreadyMsg) alreadyMsg.style.display = 'none';
        await loadReviewsForPlace(placeId);
        renderCommentList(placeId);
        reRender();
        showToast('🗑️ ลบความคิดเห็นแล้ว', 'info');
    } catch (e) {
        showToast('❌ ลบไม่สำเร็จ', 'error');
    }
}

async function editMyComment(placeId, reviewId, currentComment, currentRating) {
    document.getElementById('editReviewId').value = reviewId;
    document.getElementById('editReviewPlaceId').value = placeId;
    document.getElementById('editCommentText').value = currentComment || '';
    editSelectedStars = currentRating || 0;
    renderEditStarSelect(editSelectedStars);
    const labels = ['', '★ แย่มาก', '★★ พอใช้', '★★★ ดี', '★★★★ ดีมาก', '★★★★★ ดีเยี่ยม'];
    document.getElementById('editStarLabel').textContent = labels[editSelectedStars] || 'ยังไม่ได้เลือก';
    showModal('editCommentModal');
}

let editSelectedStars = 0;

function renderEditStarSelect(val) {
    document.querySelectorAll('#editStarSelect span').forEach((s, i) => {
        s.textContent = i < val ? '★' : '☆';
        s.style.color = i < val ? '#fbbf24' : '#cbd5e1';
    });
}

async function saveEditComment() {
    const reviewId = document.getElementById('editReviewId').value;
    const placeId = document.getElementById('editReviewPlaceId').value;
    const text = document.getElementById('editCommentText').value.trim();
    if (editSelectedStars === 0) { showToast('กรุณาเลือกคะแนนดาว', 'error'); return; }

    try {
        const res = await fetch(`${REVIEWS_API}/${reviewId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment: text, rating: editSelectedStars })
        });
        if (!res.ok) throw new Error('PUT failed');
    } catch (e) {
        showToast('❌ แก้ไขไม่สำเร็จ', 'error');
        return;
    }

    closeAllModals();
    await loadReviewsForPlace(placeId);
    renderCommentList(placeId);
    reRender();
    showToast('✅ แก้ไขความคิดเห็นแล้ว', 'success');
}

// ─── Utility ─────────────────────────────────
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
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

// ─── Carousel Logic ─────────────────────────
function scrollCarousel(event, btn, direction) {
    event.stopPropagation(); // prevent clicking the card underneath if any
    const wrapper = btn.closest('.card-carousel-wrapper');
    const container = wrapper.querySelector('.card-carousel-container');
    const scrollAmount = container.clientWidth;
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function updateCarouselDots(container) {
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const index = Math.round(scrollLeft / width);
    const dots = container.parentElement.querySelectorAll('.carousel-dots .dot');
    dots.forEach((dot, i) => {
        if (i === index) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

// ─── Dark Mode ───────────────────────────────
function toggleNearbyDarkMode(enabled) {
    document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
    localStorage.setItem('darkMode', enabled ? 'dark' : 'light');
}

function toggleNearbyHideImages(enabled) {
    document.body.classList.toggle('hide-images', enabled);
    localStorage.setItem('hideImages', enabled ? '1' : '0');
}

function toggleNearbyListView(enabled) {
    document.getElementById('nearbyGrid').classList.toggle('list-view', enabled);
    localStorage.setItem('listView', enabled ? '1' : '0');
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

    // Restore hide images
    const hideImages = localStorage.getItem('hideImages') === '1';
    if (hideImages) {
        document.body.classList.add('hide-images');
        const toggle = document.getElementById('nearbyHideImagesToggle');
        if (toggle) toggle.checked = true;
    }

    // Restore list view
    const listView = localStorage.getItem('listView') === '1';
    if (listView) {
        document.getElementById('nearbyGrid').classList.add('list-view');
        const toggle = document.getElementById('nearbyListViewToggle');
        if (toggle) toggle.checked = true;
    }

    // Restore language
    nearbyLang = localStorage.getItem('lang') || 'th';
    applyNearbyLanguage(nearbyLang);

    // Restore Admin Mode
    const savedAdmin = localStorage.getItem('adminMode') === '1';
    if (savedAdmin) {
        const toggle = document.getElementById('adminModeToggle');
        if (toggle) toggle.checked = true;
        setAdminMode(true);
    }


    initMap();
    await loadCategories();
    showNearbySkeleton();
    await fetchPlacesFromApi('all');
    reRender();
    // Load real ratings in background then refresh cards
    preloadAllReviews().then(() => reRender());

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


// ====== AI CHATBOT ======
let chatbotOpen = false;
let chatHistory = []; // เก็บ history การสนทนา

function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    document.getElementById('chatbotPanel').classList.toggle('active', chatbotOpen);
    document.getElementById('chatbotBubble').classList.toggle('active', chatbotOpen);
    if (chatbotOpen) setTimeout(() => document.getElementById('chatbotInput').focus(), 200);
}

async function sendChat() {
    const input = document.getElementById('chatbotInput');
    const msg = input.value.trim();
    if (!msg) return;
    appendChatMsg(msg, 'user');
    input.value = '';
    const typingId = appendChatTyping();
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, history: chatHistory })
        });
        const data = await res.json();
        removeChatTyping(typingId);
        const reply = data.reply || 'ขออภัย ไม่สามารถตอบได้ในขณะนี้';
        appendChatMsg(reply, 'bot');
        chatHistory.push({ role: 'user', text: msg });
        chatHistory.push({ role: 'model', text: reply });
        if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
    } catch (e) {
        removeChatTyping(typingId);
        appendChatMsg('เกิดข้อผิดพลาด กรุณาลองใหม่', 'bot');
    }
}

function appendChatMsg(text, role) {
    const messages = document.getElementById('chatbotMessages');
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.innerHTML = `<div class="chat-bubble">${text.replace(/\n/g, '<br>')}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function appendChatTyping() {
    const messages = document.getElementById('chatbotMessages');
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.id = id;
    div.innerHTML = `<div class="chat-bubble chat-typing"><span></span><span></span><span></span></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return id;
}

function removeChatTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// ====== AI วิเคราะห์รีวิว ======
function renderMarkdown(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^\*\s+/gm, '• ')
        .replace(/\n{2,}/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

async function analyzeReviews(placeId) {
    const btn = document.getElementById('ai-analyze-btn');
    const resultEl = document.getElementById('ai-analyze-result');
    if (!btn || !resultEl) return;
    btn.disabled = true;
    btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> กำลังวิเคราะห์...`;
    resultEl.style.display = 'none';
    try {
        const res = await fetch(`/api/reviews/analyze/${placeId}`);
        const data = await res.json();
        resultEl.innerHTML = `<i class='bx bx-bot'></i> <strong>AI สรุป</strong><hr style="margin:0.5rem 0;opacity:0.3"><p>${renderMarkdown(data.summary)}</p>`;
        resultEl.style.display = 'block';
    } catch (e) {
        resultEl.innerHTML = `<i class='bx bx-error'></i> ไม่สามารถวิเคราะห์ได้`;
        resultEl.style.display = 'block';
    }
    btn.innerHTML = `<i class='bx bx-bot'></i> AI สรุปรีวิว`;
    btn.disabled = false;
}
