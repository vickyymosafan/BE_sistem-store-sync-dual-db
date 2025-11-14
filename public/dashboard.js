// Global state
let cart = [];
let currentEditProductId = null;

// Navigation functions
function switchSection(section) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${section}`).classList.add('active');
    
    // Load data for the section
    if (section === 'pusat') {
        loadProducts();
    } else if (section === 'cabang') {
        loadBranchProducts();
    } else if (section === 'logs') {
        loadSyncLogs();
    }
}

function switchPusatPage(page) {
    document.querySelectorAll('#section-pusat .sub-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('#section-pusat .page-content').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-pusat-${page}`).classList.add('active');
    
    if (page === 'products') loadProducts();
    else if (page === 'prices') loadPrices();
    else if (page === 'reports') loadReports();
}

function switchCabangPage(page) {
    document.querySelectorAll('#section-cabang .sub-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('#section-cabang .page-content').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-cabang-${page}`).classList.add('active');
    
    if (page === 'products') loadBranchProducts();
    else if (page === 'inventory') loadInventory();
    else if (page === 'sales') {
        loadBranchSales();
        loadProductsForSale();
    }
    else if (page === 'sync') loadSyncQueue();
}

// Modal functions
function showAddProductModal() {
    currentEditProductId = null;
    document.getElementById('modal-product-title').textContent = 'Tambah Produk';
    document.getElementById('form-product').reset();
    document.getElementById('modal-product').classList.add('active');
}

function showEditProductModal(product) {
    currentEditProductId = product.id;
    document.getElementById('modal-product-title').textContent = 'Edit Produk';
    document.getElementById('product-code').value = product.code;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-unit').value = product.unit;
    document.getElementById('modal-product').classList.add('active');
}

function showAddPriceModal() {
    document.getElementById('form-price').reset();
    loadStoresForPrice();
    loadProductsForPrice();
    document.getElementById('modal-price').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// API: Products
let currentProductFilter = 'all';

async function loadProducts(status = currentProductFilter) {
    try {
        const url = status ? `/central/products?status=${status}` : '/central/products';
        const response = await fetch(url);
        const products = await response.json();
        
        let html = '<table><thead><tr>';
        html += '<th>Kode</th><th>Nama Produk</th><th>Kategori</th><th>Satuan</th><th>Status</th><th>Aksi</th>';
        html += '</tr></thead><tbody>';
        
        if (products.length === 0) {
            const statusText = status === 'active' ? 'aktif' : status === 'inactive' ? 'nonaktif' : '';
            html += `<tr><td colspan="6" class="empty">Tidak ada produk ${statusText}</td></tr>`;
        } else {
            products.forEach(product => {
                html += `<tr>
                    <td>${product.code}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.unit}</td>
                    <td>${product.active ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-danger">Nonaktif</span>'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick='showEditProductModal(${JSON.stringify(product)})'>Edit</button>
                        <button class="btn btn-sm btn-${product.active ? 'warning' : 'success'}" onclick="toggleProductStatus('${product.id}', ${!product.active})">
                            ${product.active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}', '${product.name}')">Hapus</button>
                    </td>
                </tr>`;
            });
        }
        
        html += '</tbody></table>';
        document.getElementById('products-table-container').innerHTML = html;
    } catch (error) {
        document.getElementById('products-table-container').innerHTML = 
            `<div class="alert alert-error">Gagal memuat data: ${error.message}</div>`;
    }
}

function filterProducts(status) {
    currentProductFilter = status;
    
    // Update button states
    document.querySelectorAll('.product-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-status') === status) {
            btn.classList.add('active');
        }
    });
    
    loadProducts(status);
}

async function saveProduct(event) {
    event.preventDefault();
    
    const data = {
        code: document.getElementById('product-code').value,
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        unit: document.getElementById('product-unit').value
    };
    
    try {
        const url = currentEditProductId 
            ? `/central/products/${currentEditProductId}`
            : '/central/products';
        const method = currentEditProductId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            closeModal('modal-product');
            loadProducts();
            showAlert('success', 'Produk berhasil disimpan!');
        } else {
            const error = await response.json();
            showAlert('error', error.message || 'Gagal menyimpan produk');
        }
    } catch (error) {
        showAlert('error', `Error: ${error.message}`);
    }
}

async function toggleProductStatus(id, active) {
    try {
        const response = await fetch(`/central/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active })
        });
        
        if (response.ok) {
            loadProducts(currentProductFilter);
            showAlert('success', `Produk berhasil ${active ? 'diaktifkan' : 'dinonaktifkan'}!`);
        }
    } catch (error) {
        showAlert('error', `Error: ${error.message}`);
    }
}

async function deleteProduct(id, name) {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?\n\nPeringatan: Semua harga, inventory, dan data terkait produk ini akan ikut terhapus!`)) {
        return;
    }
    
    try {
        const response = await fetch(`/central/products/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadProducts(currentProductFilter);
            showAlert('success', `Produk "${name}" berhasil dihapus beserta semua data terkait!`);
        } else {
            const error = await response.json();
            showAlert('error', error.message || 'Gagal menghapus produk');
        }
    } catch (error) {
        showAlert('error', `Error: ${error.message}`);
    }
}

// API: Prices
async function loadPrices() {
    const storeId = document.getElementById('price-store-filter').value;
    
    try {
        let prices = [];
        if (storeId) {
            const response = await fetch(`/central/prices/${storeId}`);
            prices = await response.json();
        } else {
            // Load all stores and their prices
            const storesResponse = await fetch('/central/stores');
            const stores = await storesResponse.json();
            
            for (const store of stores) {
                const response = await fetch(`/central/prices/${store.id}`);
                const storePrices = await response.json();
                prices.push(...storePrices.map(p => ({ ...p, storeName: store.name })));
            }
        }
        
        let html = '<table><thead><tr>';
        html += '<th>Cabang</th><th>Kode Produk</th><th>Nama Produk</th><th>Harga Jual</th><th>Mulai</th><th>Selesai</th><th>Status Harga</th>';
        html += '</tr></thead><tbody>';
        
        if (prices.length === 0) {
            html += '<tr><td colspan="7" class="empty">Tidak ada harga untuk produk aktif</td></tr>';
        } else {
            prices.forEach(price => {
                const now = new Date();
                const start = new Date(price.startDate);
                const end = price.endDate ? new Date(price.endDate) : null;
                const isActive = start <= now && (!end || end >= now);
                
                html += `<tr>
                    <td>${price.storeName || '-'}</td>
                    <td>${price.productCode}</td>
                    <td>${price.productName}</td>
                    <td>Rp ${parseInt(price.salePrice).toLocaleString('id-ID')}</td>
                    <td>${new Date(price.startDate).toLocaleDateString('id-ID')}</td>
                    <td>${price.endDate ? new Date(price.endDate).toLocaleDateString('id-ID') : '-'}</td>
                    <td>${isActive ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-warning">Berakhir</span>'}</td>
                </tr>`;
            });
        }
        
        html += '</tbody></table>';
        document.getElementById('prices-table-container').innerHTML = html;
    } catch (error) {
        document.getElementById('prices-table-container').innerHTML = 
            `<div class="alert alert-error">Gagal memuat data: ${error.message}</div>`;
    }
}

async function loadStoresForPrice() {
    const response = await fetch('/central/stores');
    const stores = await response.json();
    
    let html = '<option value="">Pilih Cabang...</option>';
    stores.forEach(store => {
        html += `<option value="${store.id}">${store.name}</option>`;
    });
    
    document.getElementById('price-store').innerHTML = html;
    document.getElementById('price-store-filter').innerHTML = '<option value="">Semua Cabang</option>' + html;
}

async function loadProductsForPrice() {
    const response = await fetch('/central/products');
    const products = await response.json();
    
    let html = '<option value="">Pilih Produk...</option>';
    products.filter(p => p.active).forEach(product => {
        html += `<option value="${product.id}">${product.code} - ${product.name}</option>`;
    });
    
    document.getElementById('price-product').innerHTML = html;
}

async function savePrice(event) {
    event.preventDefault();
    
    const endDateValue = document.getElementById('price-end').value;
    const data = {
        storeId: document.getElementById('price-store').value,
        productId: document.getElementById('price-product').value,
        salePrice: parseInt(document.getElementById('price-amount').value),
        startDate: document.getElementById('price-start').value
    };
    
    // Only add endDate if it has a value
    if (endDateValue) {
        data.endDate = endDateValue;
    }
    
    try {
        const response = await fetch('/central/prices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            closeModal('modal-price');
            loadPrices();
            showAlert('success', 'Harga berhasil disimpan!');
        } else {
            const error = await response.json();
            showAlert('error', error.message || 'Gagal menyimpan harga');
        }
    } catch (error) {
        showAlert('error', `Error: ${error.message}`);
    }
}

// API: Reports
async function loadReports() {
    const date = document.getElementById('report-date').value || new Date().toISOString().split('T')[0];
    
    try {
        const response = await fetch(`/central/reports/daily-sales?date=${date}`);
        const reports = await response.json();
        
        let html = '<table><thead><tr>';
        html += '<th>Tanggal</th><th>Kode Cabang</th><th>Nama Cabang</th><th>Total Transaksi</th><th>Total Omzet</th>';
        html += '</tr></thead><tbody>';
        
        if (reports.length === 0) {
            html += '<tr><td colspan="5" class="empty">Tidak ada data penjualan untuk tanggal ini</td></tr>';
        } else {
            reports.forEach(report => {
                html += `<tr>
                    <td>${new Date(report.date).toLocaleDateString('id-ID')}</td>
                    <td>${report.storeCode}</td>
                    <td>${report.storeName}</td>
                    <td>${report.totalTransactions}</td>
                    <td>Rp ${parseInt(report.totalSales).toLocaleString('id-ID')}</td>
                </tr>`;
            });
        }
        
        html += '</tbody></table>';
        document.getElementById('reports-table-container').innerHTML = html;
    } catch (error) {
        document.getElementById('reports-table-container').innerHTML = 
            `<div class="alert alert-error">Gagal memuat data: ${error.message}</div>`;
    }
}

// API: Branch Products
async function loadBranchProducts() {
    try {
        const response = await fetch('/branch/bondowoso/products');
        const products = await response.json();
        
        let html = '<table><thead><tr>';
        html += '<th>Kode</th><th>Nama Produk</th><th>Harga Jual</th><th>Status</th><th>Mulai Berlaku</th><th>Selesai Berlaku</th>';
        html += '</tr></thead><tbody>';
        
        if (products.length === 0) {
            html += '<tr><td colspan="6" class="empty">Belum ada data. Klik "Sync dari Pusat" untuk mengambil data.</td></tr>';
        } else {
            products.forEach(product => {
                html += `<tr>
                    <td>${product.code}</td>
                    <td>${product.name}</td>
                    <td>Rp ${product.price ? parseInt(product.price).toLocaleString('id-ID') : '-'}</td>
                    <td>${product.active ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-danger">Nonaktif</span>'}</td>
                    <td>${product.startDate ? new Date(product.startDate).toLocaleDateString('id-ID') : '-'}</td>
                    <td>${product.endDate ? new Date(product.endDate).toLocaleDateString('id-ID') : '-'}</td>
                </tr>`;
            });
        }
        
        html += '</tbody></table>';
        document.getElementById('branch-products-table-container').innerHTML = html;
    } catch (error) {
        document.getElementById('branch-products-table-container').innerHTML = 
            `<div class="alert alert-error">Gagal memuat data: ${error.message}</div>`;
    }
}

async function syncProductsFromCentral() {
    if (!confirm('Sinkronisasi produk dan harga dari pusat? Data lokal akan diperbarui.')) return;
    
    try {
        // Get branch store CODE (not ID, because IDs differ between databases)
        const storesResponse = await fetch('/branch/bondowoso/stores');
        const stores = await storesResponse.json();
        const branchStore = stores.find(s => s.type === 'BRANCH');
        
        if (!branchStore) {
            showAlert('error', 'Toko cabang tidak ditemukan');
            return;
        }
        
        // Use store CODE for sync, not ID
        const response = await fetch(`/central/sync/prices/${branchStore.code}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            showAlert('success', `Berhasil sinkronisasi ${result.count} harga dari pusat!`);
            loadBranchProducts();
        } else {
            const error = await response.json();
            showAlert('error', error.message || 'Gagal sinkronisasi');
        }
    } catch (error) {
        showAlert('error', `Error: ${error.message}`);
    }
}

// API: Inventory
async function loadInventory() {
    try {
        const response = await fetch('/branch/bondowoso/inventory');
        const inventory = await response.json();
        
        let html = '<table><thead><tr>';
        html += '<th>Kode</th><th>Nama Produk</th><th>Stok</th><th>Satuan</th><th>Terakhir Update</th>';
        html += '</tr></thead><tbody>';
        
        inventory.forEach(item => {
            html += `<tr>
                <td>${item.productCode}</td>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>${new Date(item.updatedAt).toLocaleString('id-ID')}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        document.getElementById('inventory-table-container').innerHTML = html;
    } catch (error) {
        document.getElementById('inventory-table-container').innerHTML = 
            `<div class="alert alert-error">Gagal memuat data: ${error.message}</div>`;
    }
}

// API: Sales
async function loadProductsForSale() {
    try {
        const response = await fetch('/branch/bondowoso/products');
        const products = await response.json();
        
        let html = '<option value="">Pilih Produk...</option>';
        products.filter(p => p.active && p.price).forEach(product => {
            html += `<option value="${product.id}" data-price="${product.price}">${product.code} - ${product.name} (Rp ${parseInt(product.price).toLocaleString('id-ID')})</option>`;
        });
        
        document.getElementById('sale-product').innerHTML = html;
        
        document.getElementById('sale-product').addEventListener('change', function() {
            const selected = this.options[this.selectedIndex];
            const price = selected.getAttribute('data-price');
            document.getElementById('sale-price').value = price || '';
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function addSaleItem() {
    const productSelect = document.getElementById('sale-product');
    const quantity = parseInt(document.getElementById('sale-quantity').value);
    const price = parseInt(document.getElementById('sale-price').value);
    
    if (!productSelect.value || !quantity || !price) {
        alert('Lengkapi semua field!');
        return;
    }
    
    const productText = productSelect.options[productSelect.selectedIndex].text;
    const productId = productSelect.value;
    
    cart.push({
        productId,
        productName: productText,
        quantity,
        unitPrice: price,
        subtotal: quantity * price
    });
    
    renderCart();
    
    // Reset form
    document.getElementById('sale-quantity').value = '';
    productSelect.selectedIndex = 0;
    document.getElementById('sale-price').value = '';
}

function renderCart() {
    if (cart.length === 0) {
        document.getElementById('cart-container').style.display = 'none';
        return;
    }
    
    document.getElementById('cart-container').style.display = 'block';
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        html += `<tr>
            <td>${item.productName}</td>
            <td>${item.quantity}</td>
            <td>Rp ${item.unitPrice.toLocaleString('id-ID')}</td>
            <td>Rp ${item.subtotal.toLocaleString('id-ID')}</td>
            <td><button class="btn btn-sm btn-danger" onclick="removeCartItem(${index})">Hapus</button></td>
        </tr>`;
        total += item.subtotal;
    });
    
    document.getElementById('cart-items').innerHTML = html;
    document.getElementById('cart-total').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function removeCartItem(index) {
    cart.splice(index, 1);
    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}

async function saveSale() {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    
    const idempotencyKey = `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const data = {
        idempotencyKey,
        items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        }))
    };
    
    try {
        const response = await fetch('/branch/bondowoso/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showAlert('success', 'Transaksi berhasil disimpan!');
            clearCart();
            loadBranchSales();
        } else {
            const error = await response.json();
            showAlert('error', error.message || 'Gagal menyimpan transaksi');
        }
    } catch (error) {
        showAlert('error', `Error: ${error.message}`);
    }
}

async function loadBranchSales() {
    try {
        const response = await fetch('/branch/bondowoso/sales');
        const sales = await response.json();
        
        let html = '<table><thead><tr>';
        html += '<th>ID Transaksi</th><th>Waktu</th><th>Total</th><th>Status Sync</th><th>Idempotency Key</th>';
        html += '</tr></thead><tbody>';
        
        if (sales.length === 0) {
            html += '<tr><td colspan="5" class="empty">Belum ada transaksi hari ini</td></tr>';
        } else {
            sales.forEach(sale => {
                html += `<tr>
                    <td>${sale.saleId.substr(0, 8)}...</td>
                    <td>${new Date(sale.timestamp).toLocaleString('id-ID')}</td>
                    <td>Rp ${parseInt(sale.grandTotal).toLocaleString('id-ID')}</td>
                    <td>
                        <span class="sync-indicator ${sale.syncStatus.toLowerCase()}"></span>
                        ${sale.syncStatus === 'PENDING' ? '<span class="badge badge-warning">PENDING</span>' : '<span class="badge badge-success">SYNCED</span>'}
                    </td>
                    <td style="font-size: 11px;">${sale.idempotencyKey || '-'}</td>
                </tr>`;
            });
        }
        
        html += '</tbody></table>';
        document.getElementById('sales-table-container').innerHTML = html;
    } catch (error) {
        document.getElementById('sales-table-container').innerHTML = 
            `<div class="alert alert-error">Gagal memuat data: ${error.message}</div>`;
    }
}

// API: Sync Queue
async function loadSyncQueue() {
    loadBranchSales(); // Same as sales list but focused on sync status
    document.getElementById('sync-queue-table-container').innerHTML = 
        document.getElementById('sales-table-container').innerHTML;
}

async function syncSalesToCentral() {
    if (!confirm('Kirim semua transaksi PENDING ke pusat?')) return;
    
    try {
        const response = await fetch('/central/sync/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        if (response.ok) {
            const result = await response.json();
            showAlert('success', `Berhasil sinkronisasi ${result.count} transaksi ke pusat!`);
            loadSyncQueue();
        } else {
            const error = await response.json();
            showAlert('error', error.message || 'Gagal sinkronisasi');
        }
    } catch (error) {
        showAlert('error', `Error: ${error.message}`);
    }
}

// API: Sync Logs
async function loadSyncLogs() {
    try {
        const response = await fetch('/central/sync-logs');
        const logs = await response.json();
        
        let html = '<table><thead><tr>';
        html += '<th>ID Log</th><th>Sumber</th><th>Target</th><th>Jumlah Record</th><th>Waktu</th><th>Catatan</th>';
        html += '</tr></thead><tbody>';
        
        if (logs.length === 0) {
            html += '<tr><td colspan="6" class="empty">Belum ada log sinkronisasi</td></tr>';
        } else {
            logs.forEach(log => {
                html += `<tr>
                    <td>${log.id.substr(0, 8)}...</td>
                    <td>${log.sourceStore?.name || '-'}</td>
                    <td>${log.targetStore?.name || '-'}</td>
                    <td>${log.summaryCount}</td>
                    <td>${new Date(log.syncedAt).toLocaleString('id-ID')}</td>
                    <td>${log.notes || '-'}</td>
                </tr>`;
            });
        }
        
        html += '</tbody></table>';
        document.getElementById('sync-logs-table-container').innerHTML = html;
    } catch (error) {
        document.getElementById('sync-logs-table-container').innerHTML = 
            `<div class="alert alert-error">Gagal memuat data: ${error.message}</div>`;
    }
}

// Utility functions
function showAlert(type, message) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    const alertHtml = `<div class="alert ${alertClass}">${message}</div>`;
    
    // Insert at top of current section
    const activeSection = document.querySelector('.section.active');
    const firstCard = activeSection.querySelector('.card');
    if (firstCard) {
        firstCard.insertAdjacentHTML('beforebegin', alertHtml);
        setTimeout(() => {
            activeSection.querySelector('.alert').remove();
        }, 3000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    document.getElementById('report-date').valueAsDate = new Date();
    
    // Load initial data
    loadProducts();
    loadStoresForPrice();
});
