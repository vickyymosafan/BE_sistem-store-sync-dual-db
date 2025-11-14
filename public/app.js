// State management
let currentDatabase = 'central';
let currentTable = 'stores';

// DOM elements
const databaseSelect = document.getElementById('databaseSelect');
const tabs = document.querySelectorAll('.tab');
const content = document.getElementById('content');

// Event listeners
databaseSelect.addEventListener('change', (e) => {
    currentDatabase = e.target.value;
    loadData();
});

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTable = tab.dataset.table;
        loadData();
    });
});

// Load data function
async function loadData() {
    content.innerHTML = '<div class="loading">Memuat data...</div>';
    
    try {
        const response = await fetch(`/admin/tables/${currentDatabase}/${currentTable}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        content.innerHTML = `<div class="error">Gagal memuat data: ${error.message}</div>`;
    }
}

// Render table function
function renderTable(data) {
    if (!data || data.length === 0) {
        content.innerHTML = '<div class="empty">Tidak ada data</div>';
        return;
    }
    
    // Get all unique keys from data
    const keys = [...new Set(data.flatMap(Object.keys))];
    
    // Create table HTML
    let html = '<table><thead><tr>';
    keys.forEach(key => {
        html += `<th>${formatHeader(key)}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Add rows
    data.forEach(row => {
        html += '<tr>';
        keys.forEach(key => {
            html += `<td>${formatValue(key, row[key])}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    content.innerHTML = html;
}

// Format header text
function formatHeader(key) {
    // Translate common field names to Indonesian
    const translations = {
        'id': 'ID',
        'code': 'Kode',
        'name': 'Nama',
        'type': 'Tipe',
        'city': 'Kota',
        'active': 'Aktif',
        'createdAt': 'Dibuat Pada',
        'updatedAt': 'Diperbarui Pada',
        'category': 'Kategori',
        'unit': 'Satuan',
        'storeId': 'ID Toko',
        'productId': 'ID Produk',
        'salePrice': 'Harga Jual',
        'startDate': 'Tanggal Mulai',
        'endDate': 'Tanggal Selesai',
        'quantity': 'Jumlah',
        'timestamp': 'Waktu',
        'grandTotal': 'Total',
        'syncStatus': 'Status Sinkronisasi',
        'idempotencyKey': 'Kunci Idempotency',
        'saleId': 'ID Penjualan',
        'unitPrice': 'Harga Satuan',
        'subtotal': 'Subtotal',
        'sourceStoreId': 'ID Toko Sumber',
        'targetStoreId': 'ID Toko Tujuan',
        'syncedAt': 'Disinkronkan Pada',
        'notes': 'Catatan',
        'summaryCount': 'Jumlah',
        'store': 'Toko',
        'product': 'Produk',
        'sale': 'Penjualan',
        'sourceStore': 'Toko Sumber',
        'targetStore': 'Toko Tujuan',
        'productCode': 'Kode Produk',
        'productName': 'Nama Produk',
        'storeCode': 'Kode Toko'
    };
    
    return translations[key] || key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

// Format cell value
function formatValue(key, value) {
    if (value === null || value === undefined) {
        return '<span style="color: #95a5a6;">null</span>';
    }
    
    // Handle nested objects (relations)
    if (typeof value === 'object' && !Array.isArray(value)) {
        if (value.name) return value.name;
        if (value.code) return value.code;
        return JSON.stringify(value);
    }
    
    // Handle booleans
    if (typeof value === 'boolean') {
        return value 
            ? '<span class="badge badge-success">✓ Ya</span>'
            : '<span class="badge badge-danger">✗ Tidak</span>';
    }
    
    // Handle dates
    if (key.includes('At') || key.includes('Date') || key === 'timestamp') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date.toLocaleString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    // Handle enums
    if (key === 'type') {
        return value === 'CENTRAL'
            ? '<span class="badge badge-info">PUSAT</span>'
            : '<span class="badge badge-warning">CABANG</span>';
    }
    
    if (key === 'syncStatus') {
        return value === 'SYNCED'
            ? '<span class="badge badge-success">TERSINKRON</span>'
            : '<span class="badge badge-warning">MENUNGGU</span>';
    }
    
    // Handle numbers with decimals (prices)
    if (key.includes('Price') || key.includes('Total') || key === 'subtotal') {
        const num = parseFloat(value);
        if (!isNaN(num)) {
            return 'Rp ' + num.toLocaleString('id-ID', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
        }
    }
    
    // Handle regular numbers
    if (typeof value === 'number') {
        return value.toLocaleString('id-ID');
    }
    
    // Handle strings
    return String(value);
}

// Initial load
loadData();
