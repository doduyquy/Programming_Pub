import { allProducts } from '../common/data/productArray.js'; // Import mảng sản phẩm từ file productArray.js
import { customerArray } from '../common/data/customerArray.js'; // Import class Customer và Address từ file customerArray.js

// SIDEBAR 
function updateContentWidth() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if (sidebar.classList.contains('hide')) {
        content.style.width = 'calc(100% - 70px)';
        content.style.left = '70px';
    } else {
        content.style.width = 'calc(100% - 250px)';
        content.style.left = '250px';
    }
}
// TOGGLE SIDEBAR
function zoomInSideBar(){
    const menuBars = document.querySelectorAll('#hidden-sidebar-btn');
    const sideBar = document.getElementById('sidebar');

    if (menuBars.length > 0 && sideBar) {
        menuBars.forEach(menuBar => {
            menuBar.addEventListener('click', () => {
                sideBar.classList.toggle('hide');
                updateContentWidth(); // Gọi hàm để cập nhật kích thước content
            });
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    zoomInSideBar();
    handleResize();
});
// Hàm thay đổi kích thước khi thay đổi kích thước màn hình
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const sidebarItems = document.querySelectorAll('#sidebar .side-menu li');
    
    if (window.innerWidth < 1360) {
        sidebar.classList.add('hide');
        content.style.width = 'calc(100% - 70px)';
        content.style.left = '70px';
        sidebarItems.forEach(item => item.classList.add('disable'));
    } else {
        sidebar.classList.remove('hide');
        content.style.width = 'calc(100% - 250px)';
        content.style.left = '250px';
        sidebarItems.forEach(item => item.classList.remove('disable'));
    }
}

// Sự kiện khi thay đổi kích thước màn hình
window.addEventListener('resize', handleResize);

// Thay đổi trạng thái "active | disable" cho các <li>: 
// click -> active, remove active cho các <li> khác
function changeActiveSideBar(){
    const allSideMenuItems = document.querySelectorAll('#sidebar .side-menu li a');
    allSideMenuItems.forEach(item => {
        // Lưu lại <li> muốn show
        const li = item.parentElement;
        item.addEventListener('click', () => {
            // Tất cả <li> bị xóa class item--active khi 'click'
            allSideMenuItems.forEach(i => {
                i.parentElement.classList.remove('item--active');
            });
            // Thêm lớp item--active vào thẻ <li> cha, cái được 'click'
            li.classList.add('item--active');
        });
    });
}
changeActiveSideBar();

/* END SIDEBAR */ 

/** HIỆN TỪNG MAIN-ITEM TƯƠNG ỨNG KHI ẤN VÀO THANH SIDEBAR 
 *  Ấn Dashboard hiện main__dashboard, ẩn các cái khác,...
 * */
// Func: ẩn toàn bộ các main-item
function hideAllMainItems() {
    // Duyệt qua toàn bộ main-item và gán style 'none'
    document.querySelectorAll('.main-item').forEach(item => {
        item.style.display = 'none';
    });
}
// Func: hiển thị cụ thể main-item được 'click' tương ứng tại sidebar
function showMainItem(itemId) {
    hideAllMainItems();
    const item = document.getElementById(itemId);
    if (item) {
        item.style.display = 'block';  // Hiển thị main-item theo id
    }
}
// Đặt event 'click' cho phần main-item tương ứng tại sidebar
function showCorrespondingMain(){
    const sidebarItems = ['sidebar__dashboard', 'sidebar__products', 'sidebar__customers', 'sidebar__orders', 'sidebar__statistics'];
    sidebarItems.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.onclick = () => showMainItem(`main__${id.split('__')[1]}`);
        }
    });
}
showCorrespondingMain();

// Hiển thị main__dashboard mặc định khi tải trang
showMainItem('main__dashboard');

// Lưu mảng sản phẩm vào localStorage
localStorage.setItem('productArray', JSON.stringify(allProducts));


/* MAIN__PRODUCTS */
// Hiển thị modal và tải thông tin sản phẩm vào modal để chỉnh sửa

// Lấy productArray từ localStorage

let filteredProducts = [];

// *** Bắt đầu thêm các biến phân trang cho Products và Customers ***
let currentProductPage = 1;
let totalProductPages = 1;
const itemsPerPageProduct = 8;

let currentCustomerPage = 1;
let totalCustomerPages = 1;
const itemsPerPageCustomer = 10
// *** Kết thúc thêm các biến phân trang ***

// Chức năng tìm kiếm sản phẩm
const searchInput = document.getElementById('product-name');
const brandFilter = document.getElementById('brand');
if (searchInput && brandFilter) {
    searchInput.addEventListener('input', filterProducts);
    brandFilter.addEventListener('change', filterProducts);
}

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedBrand = brandFilter.value.toUpperCase().trim();

    // Lọc sản phẩm dựa trên tiêu chí tìm kiếm
    filteredProducts = allProducts.filter(product => {
        const nameMatches = product.name.toLowerCase().includes(searchTerm);
        const brandMatches = selectedBrand === 'ALL' || product.brandId.toUpperCase() === selectedBrand;

        return nameMatches && brandMatches;
    });

    // Tạo phân trang cho sản phẩm đã lọc
    totalProductPages = Math.ceil(filteredProducts.length / itemsPerPageProduct);

    // Hiển thị trang đầu tiên của sản phẩm đã lọc
    currentProductPage = 1;
    displayProductPage(currentProductPage);

    // Tạo lại nút phân trang cho Products
    createPagination(totalProductPages, 'product');
}
// Sau khi tạo bảng sản phẩm
function displayProductPage(page) {
    const tableBody = document.getElementById('product-table-content__body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const start = (page - 1) * itemsPerPageProduct;
    const end = start + itemsPerPageProduct;
    const pageProducts = filteredProducts.slice(start, end);

    const fragment = document.createDocumentFragment();
    pageProducts.forEach((product, index) => {
        const id = start + index + 1;
        const name = product.name;
        const brand = product.brandId;
        const imagePath = product.img;
        const price = product.oldPrice;

        const row = document.createElement('tr');
        row.setAttribute('data-id', id - 1);  // Sử dụng index làm ID

        row.innerHTML = `
            <td>${id}</td>
            <td>
                <div class="product-image-container">
                <img src="${imagePath}" alt="Sản phẩm">
            </div>
            </td>
            <td>${name}</td>
            <td>${brand}</td>
            <td>${price}</td>
            <td>
                <button class="detail-btn" data-index="${id - 1}">Chi tiết</button>
            </td>
            <td>
                <button class="delete-btn">Xóa</button>
                <button class="edit-btn" data-index="${id - 1}">Sửa</button>
            </td>
        `;

        fragment.appendChild(row);
    });

    tableBody.appendChild(fragment);
    updatePagination('product');

    // Thêm event listeners cho các nút xem chi tiết
    document.querySelectorAll('.detail-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productIndex = parseInt(this.getAttribute('data-index'));
            showProductDetails(productIndex);
        });
    });

    // Thêm event listeners cho các nút sửa
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productIndex = parseInt(this.getAttribute('data-index'));
            showChangeProductBox(productIndex);
        });
    });
}
// Tạo nút phân trang
function createPagination(totalPages, type) { // Thêm tham số 'type'
    let paginationId = '';
    if (type === 'product') {
        paginationId = 'pagination-products'; // Đảm bảo có <div id="pagination-products"></div> trong HTML
    } else if (type === 'customer') {
        paginationId = 'pagination-customers'; // Đảm bảo có <div id="pagination-customers"></div> trong HTML
    } else {
        // Fallback nếu type không xác định
        paginationId = 'pagination';
    }

    const pagination = document.getElementById(paginationId);
    if (!pagination) return;
    pagination.innerHTML = '';

    if (totalPages <= 1) return; // Không cần phân trang nếu chỉ có một trang

    // Nút Trước
    const prevButton = document.createElement('a');
    prevButton.href = "#";
    prevButton.innerHTML = "&laquo;";
    prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (type === 'product' && currentProductPage > 1) {
            currentProductPage--;
            displayProductPage(currentProductPage);
            updatePagination('product');
        } else if (type === 'customer' && currentCustomerPage > 1) {
            currentCustomerPage--;
            displayCustomerPage(currentCustomerPage);
            updatePagination('customer');
        }
    });
    pagination.appendChild(prevButton);

    // Các Nút Số Trang
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('a');
        button.href = "#";
        button.textContent = i;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (type === 'product') {
                currentProductPage = i;
                displayProductPage(currentProductPage);
                updatePagination('product');
            } else if (type === 'customer') {
                currentCustomerPage = i;
                displayCustomerPage(currentCustomerPage);
                updatePagination('customer');
            }
        });
        if ((type === 'product' && i === currentProductPage) || (type === 'customer' && i === currentCustomerPage)) {
            button.classList.add('active');
        }
        pagination.appendChild(button);
    }

    // Nút Tiếp Theo
    const nextButton = document.createElement('a');
    nextButton.href = "#";
    nextButton.innerHTML = "&raquo;";
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (type === 'product' && currentProductPage < totalProductPages) {
            currentProductPage++;
            displayProductPage(currentProductPage);
            updatePagination('product');
        } else if (type === 'customer' && currentCustomerPage < totalCustomerPages) {
            currentCustomerPage++;
            displayCustomerPage(currentCustomerPage);
            updatePagination('customer');
        }
    });
    pagination.appendChild(nextButton);
}

function updatePagination(type) { // Thêm tham số 'type'
    let paginationId = '';
    if (type === 'product') {
        paginationId = 'pagination-products';
    } else if (type === 'customer') {
        paginationId = 'pagination-customers';
    } else {
        paginationId = 'pagination';
    }

    const paginationLinks = document.querySelectorAll(`#${paginationId} a`);
    paginationLinks.forEach(link => {
        link.classList.remove('active');
        if (type === 'product') {
            if (parseInt(link.textContent) === currentProductPage) {
                link.classList.add('active');
            }
        } else if (type === 'customer') {
            if (parseInt(link.textContent) === currentCustomerPage) {
                link.classList.add('active');
            }
        }
    });
}

// Thêm các sự kiện khi trang được tải 
document.addEventListener('DOMContentLoaded', () => {
    showCorrespondingMain();

    // Kiểm tra nếu allProducts rỗng thì tải
    if (allProducts.length === 0) {
        alert('Không có sản phẩm nào trong productArray. Vui lòng kiểm tra lại.');
    } else {
        filteredProducts = allProducts.slice();
        totalProductPages = Math.ceil(filteredProducts.length / itemsPerPageProduct);
        createPagination(totalProductPages, 'product');
        displayProductPage(currentProductPage);
    }

    // Thêm sự kiện submit cho form thêm sản phẩm 
    const addProductForm = document.getElementById('add-product-form'); 
    if (addProductForm) { 
        addProductForm.addEventListener('submit', addNewProduct); 
    }

    // Hiển thị trang khách hàng
    displayCustomerPage(currentCustomerPage);
});

function addNewProduct(e) {
    e.preventDefault();

    const productName = document.getElementById('new-product-name').value.trim();
    const brand = document.getElementById('new-brand').value.trim();
    const price = parseFloat(document.getElementById('price').value.trim()) || 0;
    const imageInput = document.getElementById('image-upload');
    let imageUrl = '';

    if (imageInput.files && imageInput.files[0]) {
        imageUrl = URL.createObjectURL(imageInput.files[0]);
    } else {
        imageUrl = 'default-image.png'; // Đường dẫn đến ảnh mặc định nếu không chọn ảnh
    }

    // Tạo sản phẩm mới dưới dạng object
    const newProduct = {
        brandId: brand,
        img: imageUrl,
        name: productName,
        oldPrice: price,
        // Thêm các thuộc tính khác nếu cần
    };

    allProducts.push(newProduct);

    // Cập nhật localStorage
    localStorage.setItem('productArray', JSON.stringify(allProducts));

    // Đặt lại form và các bộ lọc
    addProductForm.reset();
    searchInput.value = '';
    brandFilter.value = 'ALL';

    filterProducts();

    // Hiển thị thông báo thành công
    alert('Sản phẩm đã được thêm thành công!');
}

// Xóa sản phẩm
document.getElementById('product-table-content__body').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const row = event.target.closest('tr');
        const productIndex = parseInt(row.getAttribute('data-id'));
        if (confirm('Bạn có muốn xóa sản phẩm này không?')) {
            // Xóa sản phẩm khỏi dữ liệu
            allProducts.splice(productIndex, 1);

            // Cập nhật localStorage
            localStorage.setItem('productArray', JSON.stringify(allProducts));

            // Cập nhật lại danh sách sản phẩm
            filterProducts();

            alert('Sản phẩm đã được xóa thành công!');
        }
    }
});

// Hiển thị modal chỉnh sửa sản phẩm
function showChangeProductBox(productIndex) {
    // Hiển thị modal
    const modal = document.getElementById('modal-changeproduct');
    if (modal) {
        modal.style.display = 'flex';
    }

    // Lấy thông tin sản phẩm
    const product = allProducts[productIndex];

    // Điền thông tin vào modal
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-price').value = product.oldPrice;
    document.getElementById('imgbefore').src = product.img;
    document.getElementById('imgafter').src = 'img-prd/add-img-phone.webp';

    // Cập nhật sự kiện lưu
    const saveButton = document.getElementById('save');
    saveButton.onclick = () => saveProductChanges(productIndex);
}

// Lưu thay đổi sản phẩm
function saveProductChanges(productIndex) {
    const updatedName = document.getElementById('edit-name').value.trim();
    const updatedPrice = parseFloat(document.getElementById('edit-price').value.trim()) || 0;
    const updatedImageInput = document.getElementById('edit-image-upload');
    let updatedImage = document.getElementById('imgafter').src;

    if (updatedImageInput.files && updatedImageInput.files[0]) {
        updatedImage = URL.createObjectURL(updatedImageInput.files[0]);
    }

    // Cập nhật thông tin sản phẩm trong mảng
    allProducts[productIndex].name = updatedName;
    allProducts[productIndex].oldPrice = updatedPrice;
    allProducts[productIndex].img = updatedImage;

    // Cập nhật localStorage
    localStorage.setItem('productArray', JSON.stringify(allProducts));

    filterProducts();

    // Đóng modal
    closeChangeProductBox();

    // Hiển thị thông báo thành công
    alert('Sản phẩm đã được chỉnh sửa thành công!');
}

// Đóng modal
function closeChangeProductBox() {
    const modal = document.getElementById('modal-changeproduct');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cập nhật hình ảnh xem trước khi chọn ảnh mới
function changeImagePreview(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imgafter').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
// Hiển thị ảnh ở phần thêm Sản phẩm
function previewImage(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = function() {
        const img = document.getElementById('img-preview');
        img.src = reader.result;
        img.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
}
// Hàm hiển thị chi tiết sản phẩm
function showProductDetails(productIndex) {
    const modal = document.getElementById('modal-detailproduct');
    if (modal) {
        modal.style.display = 'flex';
    }
    
    // Lấy thông tin sản phẩm
    const product = allProducts[productIndex];

    // Điền dữ liệu vào pop-up
    document.getElementById('detail-img').src = product.img;
    document.getElementById('detail-name').innerText = product.name;
    document.getElementById('detail-brand').innerText = product.brandId;
    document.getElementById('detail-price').innerText = product.oldPrice;
    document.getElementById('detail-pb1').innerText = product.pb1;
    document.getElementById('detail-pb2').innerText = product.pb2;
    document.getElementById('detail-chip').innerText = product.chip;
    document.getElementById('detail-pin').innerText = product.pin;
    document.getElementById('detail-size').innerText = product.size;
    document.getElementById('detail-f').innerText = product.f;
}

// Hàm đóng pop-up
function closeDetailProductBox() {
    document.getElementById('modal-detailproduct').style.display = 'none';
}


/* MAIN_CUSTOMERS */
function addPasswordToggleListeners() {
    const passwordCells = document.querySelectorAll('.table-cell-password');
    passwordCells.forEach(cell => {
        cell.addEventListener('click', function() {
            const isMasked = cell.textContent.startsWith('*');
            if (isMasked) {
                cell.textContent = cell.getAttribute('data-password');
                cell.classList.add('active');
            } else {
                cell.textContent = '*'.repeat(cell.getAttribute('data-password').length);
                cell.classList.remove('active');
            }
        });
    });
}

function displayCustomerPage(page) {
    const tableBody = document.getElementById('customer-table-content__body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const start = (page - 1) * itemsPerPageCustomer;
    const end = start + itemsPerPageCustomer;
    const pageCustomers = customerArray.slice(start, end);

    const fragment = document.createDocumentFragment();
    pageCustomers.forEach((customer, index) => {
        const id = start + index + 1;

        const row = document.createElement('tr');
        row.setAttribute('data-id', id - 1);  // Sử dụng index làm ID

        // Thêm lớp 'locked' nếu customer bị khóa
        if (customer.locked) {
            row.classList.add('locked');
        }

        row.innerHTML = `
            <td>${id}</td>
            <td>${customer.username}</td>
            <td class="table-cell-password" data-password="${customer.password}">${'*'.repeat(customer.password.length)}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${customer.address.numberAndRoad}, ${customer.address.ward}, ${customer.address.district}, ${customer.address.city}</td>
            <td class="action-customer">
                <div class="action-customer__left">
                    <button class="edit-btn" data-index="${id - 1}" ${customer.locked ? 'disabled' : ''}>Sửa</button>
                    <button class="add-customer-btn" ${customer.locked ? 'disabled' : ''}>Thêm</button>
                </div>
                <button class="key-customer-btn">${customer.locked ? 'MỞ KHÓA' : 'KHÓA'}</button>
            </td>
        `;

        fragment.appendChild(row);
    });

    tableBody.appendChild(fragment);
    
    // Tính toán tổng số trang cho Customers
    totalCustomerPages = Math.ceil(customerArray.length / itemsPerPageCustomer);
    
    // Tạo phân trang cho khách hàng
    createPagination(totalCustomerPages, 'customer');

    // Thêm event listeners cho các nút sửa
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const customerIndex = parseInt(this.getAttribute('data-index'));
            showChangeCustomerBox(customerIndex);
        });
    });

    // Thêm event listeners cho các nút khóa/mở khóa
    document.querySelectorAll('.key-customer-btn').forEach(button => {
        button.addEventListener('click', function() {
            const customerIndex = parseInt(this.closest('tr').getAttribute('data-id'));
            toggleCustomerLock(customerIndex);
        });
    });

    // Thêm event listeners cho các ô mật khẩu
    addPasswordToggleListeners();
}

function toggleCustomerLock(customerIndex) {
    const customer = customerArray[customerIndex];
    customer.locked = !customer.locked; // Toggle trạng thái khóa

    // Cập nhật localStorage
    localStorage.setItem('customerArray', JSON.stringify(customerArray));

    if (customer.locked) {
        alert('Khách hàng đã bị khóa');
    } else {
        alert('Khách hàng đã được mở khóa');
    }

    // Cập nhật lại bảng khách hàng
    displayCustomerPage(currentCustomerPage);
}

// function showChangeCustomerBox(customerIndex) {
//     const modal = document.getElementById('modal-changecustomer');
//     if (modal) {
//         modal.style.display = 'flex';
//     }

//     const customer = allCustomers[customerIndex];
//     document.getElementById('edit-name').value = customer.name;
//     document.getElementById('edit-phone').value = customer.phone;
//     document.getElementById('edit-email').value = customer.email;
//     document.getElementById('edit-address').value = customer.address;
//     document.getElementById('edit-birthday').value = customer.birthday;
//     document.getElementById
function closeChangeCustomerBox() {
    const modal = document.getElementById('modal2'); // Đổi thành id chính xác nếu cần
    if (modal) {
        modal.style.display = 'none';
    }
}

window.showDetailProductBox = showProductDetails;
window.closeDetailProductBox = closeDetailProductBox;
window.showChangeProductBox = showChangeProductBox;
window.closeChangeProductBox = closeChangeProductBox;
window.changeImagePreview = changeImagePreview;
window.previewImage = previewImage;

window.closeChangeCustomerBox = closeChangeCustomerBox;

window.saveProductChanges = saveProductChanges;

// //--------------KHÔNG CẦN CODE NÀY: WINDOW... CHỈ ÁP DỤNG CHO DOM KHI LOAD HTML------------------
// window.changeActiveSideBar = changeActiveSideBar;
// window.zoomInSideBar = zoomInSideBar;
// window.hideAllMainItems = hideAllMainItems;
// window.showMainItem = showMainItem;
// window.showCorrespondingMain = showCorrespondingMain;
// //--------------------------------