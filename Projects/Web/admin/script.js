import { allProducts } from '../common/data/productArray.js'; // Import mảng sản phẩm từ file productArray.js
import { customerArray } from '../common/data/customerArray.js'; // Import class Customer và Address từ file customerArray.js
import { orderArray, addOrderToArray, filterOrderByStatus, filterOrdersBetweenTwoDate, sortOrderByDistrict, addTestOrderToArray, createStatisticsProductArray, createStatisticsCustomerArray } from '../common/data/orderArray.js'; 

localStorage.removeItem('productArray');
// localStorage.removeItem('customerArray')


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

// Hàm thông báo tự thiết kế
function customAlert(message, type) {
    // Tạo phần tử div cho thông báo
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert custom-alert-${type}`;
    alertDiv.innerText = message;

    // Thêm thông báo vào body
    document.body.appendChild(alertDiv);

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

/* MAIN__PRODUCTS */
let filteredProducts = []; // Lấy productArray từ localStorage đã được import từ productArray.js

// *** Bắt đầu thêm các biến phân trang cho Products và Customers ***
// Phân trang cho Products với 8 sản phẩm mỗi trang
let currentProductPage = 1;
let totalProductPages = 1;
const itemsPerPageProduct = 8;

// Phân trang cho Customers với 10 khách hàng mỗi trang
let currentCustomerPage = 1;
let totalCustomerPages = 1;
const itemsPerPageCustomer = 10;

// Phân trang cho Orders với 5 đơn hàng mỗi trang
let currentOrderPage = 1;
let totalOrderPages = 1;
const itemsPerPageOrder = 5;

// Phân trang cho Statistics với 10 thống kê mỗi trang
let currentStatisticsPage = 1;
let totalStatisticsPages = 1;
const itemsPerPageStatistics = 10;
// *** Kết thúc thêm các biến phân trang ***

// Chức năng tìm kiếm sản phẩm
const searchInput = document.getElementById('product-name');
const brandFilter = document.getElementById('brand');
if (searchInput && brandFilter) {
    searchInput.addEventListener('input', filterProducts);
    brandFilter.addEventListener('change', filterProducts);
}

// Hàm lọc sản phẩm
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
    var s = '<tr><th>#ID</th><th>Ảnh</th><th>Tên sản phẩm</th><th>Thương hiệu</th><th>Giá</th><th>Thông tin</th><th>Hành động</th></tr>';
    var dem = 0;
    var start = (page - 1) * itemsPerPageProduct;
    var end = start + itemsPerPageProduct;
    for (var i = start; i < filteredProducts.length && i < end; i++) {
        s += '<tr>' +
            '<td>' + filteredProducts[i].productId + '</td>' +
            '<td>' +
                '<div class="product-image-container">' +
                '<img src="' + filteredProducts[i].img + '" alt="Sản phẩm"></div></td>' +
            '<td>' + filteredProducts[i].name + '</td>' +
            '<td>' + filteredProducts[i].brandId.toUpperCase() + '</td>' +
            '<td>' + filteredProducts[i].oldPrice + '</td>' +
            '<td>' +
                '<button class="detail-btn" data-index="' + i + '">Chi tiết</button>' +
            '</td>' +
            '<td>' +
                '<button class="delete-btn" data-index="' + i + '">Xóa</button>' +
                '<button id="edit-product-btn" class="edit-btn" data-index="' + i + '">Sửa</button>' +
            '</td>' +
        '</tr>';
        dem++;
        if (dem == itemsPerPageProduct) {
            break; // Nếu đã đủ số sản phẩm trên một trang thì dừng
        }
    }
    document.getElementById('product-table-content__body').innerHTML = s; // Hiển th
    updatePagination('product'); // Cập nhật nút phân trang

    // Thêm event listeners cho các nút xem chi tiết
    document.querySelectorAll('.detail-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productIndex = parseInt(this.getAttribute('data-index'));
            showProductDetails(productIndex);
        });
    });

    // Thêm event listeners cho các nút sửa
    document.querySelectorAll('#main__products .edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productIndex = parseInt(this.getAttribute('data-index'));
            showChangeProductBox(productIndex);
        });
    });

    // Thêm event listeners cho các nút xóa
    document.querySelectorAll('#table_list .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productIndex = parseInt(this.getAttribute('data-index'));
            deleteProduct(productIndex);
        });
    });
}

// Tạo nút phân trang
function createPagination(totalPages, type) {
    let paginationId = '';
    if (type === 'product') {
        paginationId = 'pagination-products';
    } else if (type === 'customer') {
        paginationId = 'pagination-customers';
    } else if (type === 'order') {
        paginationId = 'pagination-orders'; 
    } else if (type === 'statistics') {
        paginationId = 'pagination-statistics';
    } else {
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
        } else if (type === 'order' && currentOrderPage > 1) {
            currentOrderPage--;
            displayOrderPage(currentOrderPage);
            updatePagination('order');
        } else if (type === 'statistics' && currentStatisticsPage > 1) {
            currentStatisticsPage--;
            displayStatisticsPage(currentStatisticsPage);
            updatePagination('statistics');
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
            } else if (type === 'order') {
                currentOrderPage = i;
                displayOrderPage(currentOrderPage);
                updatePagination('order');
            } else if (type === 'statistics') {
                currentStatisticsPage = i;
                displayStatisticsPage(currentStatisticsPage);
                updatePagination('statistics');
            }
        });
        if (
            (type === 'product' && i === currentProductPage) ||
            (type === 'customer' && i === currentCustomerPage) ||
            (type === 'order' && i === currentOrderPage) ||
            (type === 'statistics' && i === currentStatisticsPage)
        ) {
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
        } else if (type === 'order' && currentOrderPage < totalOrderPages) {
            currentOrderPage++;
            displayOrderPage(currentOrderPage);
            updatePagination('order');
        } else if (type === 'statistics' && currentStatisticsPage < totalStatisticsPages) {
            currentStatisticsPage++;
            displayStatisticsPage(currentStatisticsPage);
            updatePagination('statistics');
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
    } else if (type === 'order') {
        paginationId = 'pagination-orders';
    } else if (type === 'statistics') {
        paginationId = 'pagination-statistics';
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
        } else if (type === 'order') {
            if (parseInt(link.textContent) === currentOrderPage) {
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

    // Kiểm tra nếu allProducts rỗng thì tải từ localStorage
    if (allProducts.length === 0) {
        alert('Không có sản phẩm nào trong productArray. Vui lòng kiểm tra lại.');
    } else {
        filteredProducts = allProducts.slice(); // Sao chép mảng sản phẩm
        totalProductPages = Math.ceil(filteredProducts.length / itemsPerPageProduct);
        createPagination(totalProductPages, 'product'); // Tạo nút phân trang cho sản phẩm
        displayProductPage(currentProductPage); // Hiển thị trang đầu tiên của sản phẩm
    }

    // Thêm sự kiện submit cho form thêm sản phẩm 
    const addProductForm = document.getElementById('add-product-form'); 
    if (addProductForm) { 
        addProductForm.addEventListener('submit', addProduct); 
    }

    // Kiểm tra nếu customerArray rỗng thì tải từ localStorage
    if (customerArray.length === 0) {
        alert('Không có khách hàng nào trong customerArray. Vui lòng kiểm tra lại.');
    } else {
        displayCustomerPage(currentCustomerPage);
    }
    // Thêm sự kiện submit cho form thêm khách hàng
    const addCustomerForm = document.getElementById('add-customer-form'); 
    if (addCustomerForm) { 
        addCustomerForm.addEventListener('submit', addCustomer); 
    }
});

function addProduct(event) {
    event.preventDefault(); // Ngăn form tự submit

    // Tạo productId mới
    const productId = allProducts.length > 0 ? (parseInt(allProducts[allProducts.length - 1].productId) + 1).toString() : "1";

    // Lấy giá trị từ các trường nhập liệu
    const productname = document.getElementById('new-product-name').value.trim();
    const brand = document.getElementById('new-brand').value.trim();
    const price = document.getElementById('new-price').value.trim();
    const pb1 = document.getElementById('new-pb1').value.trim();
    const pb2 = document.getElementById('new-pb2').value.trim();
    const chip = document.getElementById('new-chip').value.trim();
    const pin = document.getElementById('new-pin').value.trim();
    const size = document.getElementById('new-size').value.trim();
    const f = document.getElementById('new-f').value.trim();
    const imgInput = document.getElementById('new-image-upload');
    let img = 'img-prd/img-add2.png'; // Ảnh mặc định
    if (imgInput.files && imgInput.files[0]) {
        img = URL.createObjectURL(imgInput.files[0]); // Lấy đường dẫn ảnh
    }

    // Kiểm tra thông tin nhập vào
    if (!brand || !productname || !price || !pb1 || !chip || !pin || !size || !f) {
        customAlert('Bạn chưa nhập đủ thông tin sản phẩm', 'warning');
        return false;
    }

    // Kiểm tra giá nhập vào có phải là số không
    if (isNaN(Number(price))) {
        customAlert('Giá không hợp lệ', 'warning');
        return false;
    }

    // Tạo đối tượng sản phẩm mới
    const newProduct = {
        productId: productId,
        brandId: brand,
        img: img,
        name: productname,
        oldPrice: price,
        pb1: pb1,
        pb2: pb2,
        chip: chip,
        pin: pin,
        size: size,
        f: f
    };

    // Thêm sản phẩm vào mảng và lưu vào localStorage
    allProducts.push(newProduct);
    localStorage.setItem('allProducts', JSON.stringify(allProducts));

    // Cập nhật danh sách sản phẩm và thông báo thành công
    filterProducts();
    customAlert('Thêm sản phẩm thành công', 'success');

    // Reset form
    document.querySelector('.subsection form').reset();
}
// Xóa sản phẩm
function deleteProduct(productIndex) {
    if (productIndex !== -1) {
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
}

// Hiển thị modal chỉnh sửa sản phẩm
function showChangeProductBox(productIndex) {
    // Hiển thị modal
    const modalChangeProduct = document.getElementById('modal-changeproduct');
    if (modalChangeProduct) {
        modalChangeProduct.style.display = 'flex';
    }

    // Lấy thông tin sản phẩm
    const product = allProducts[productIndex];

    // Điền thông tin vào modal
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-price').value = product.oldPrice;
    document.getElementById('imgbefore').src = product.img;
    document.getElementById('imgafter').src = 'img-prd/add-img-phone.webp';

    // // Điền các thông tin khác
    // document.getElementById('edit-pb1').value = product.pb1;
    // document.getElementById('edit-pb2').value = product.pb2;
    // document.getElementById('edit-chip').value = product.chip;
    // document.getElementById('edit-pin').value = product.pin;
    // document.getElementById('edit-size').value = product.size;
    // document.getElementById('edit-f').value = product.f;

    // Cập nhật sự kiện lưu
    const saveProductButton = document.getElementById('save-product');
    saveProductButton.onclick = () => saveProductChanges(productIndex);

    // Thêm sự kiện đóng pop-up
    document.getElementById('close-changeproduct').addEventListener('click', closeChangeProductBox);

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
    if (updatedImageInput.files && updatedImageInput.files[0]) {
        allProducts[productIndex].img = updatedImage;
    }
    // // Cập nhật các thuộc tính khác
    // const updatedPb1 = document.getElementById('edit-pb1').value.trim();
    // const updatedPb2 = document.getElementById('edit-pb2').value.trim();
    // const updatedChip = document.getElementById('edit-chip').value.trim();
    // const updatedPin = document.getElementById('edit-pin').value.trim();
    // const updatedSize = document.getElementById('edit-size').value.trim();
    // const updatedF = document.getElementById('edit-f').value.trim();

    // allProducts[productIndex].pb1 = updatedPb1;
    // allProducts[productIndex].pb2 = updatedPb2;
    // allProducts[productIndex].chip = updatedChip;
    // allProducts[productIndex].pin = updatedPin;
    // allProducts[productIndex].size = updatedSize;
    // allProducts[productIndex].f = updatedF;

    // Kiểm tra thông tin cập nhật
    if (
        !allProducts[productIndex].brandId ||
        !allProducts[productIndex].name ||
        !allProducts[productIndex].oldPrice //||
        // !allProducts[productIndex].pb1 ||
        // !allProducts[productIndex].pb2 ||
        // !allProducts[productIndex].chip ||
        // !allProducts[productIndex].pin ||
        // !allProducts[productIndex].size ||
        // !allProducts[productIndex].f
    ) {
        customAlert('Bạn chưa nhập đủ thông tin sản phẩm', 'warning');
        return false;
    }

    if (isNaN(allProducts[productIndex].oldPrice)) {
        customAlert('Giá không hợp lệ', 'warning');
        return false;
    }

    // Cập nhật localStorage
    localStorage.setItem('productArray', JSON.stringify(allProducts));

    // Cập nhật lại danh sách sản phẩm
    filterProducts();

    // Đóng modal
    closeChangeProductBox();

    // Hiển thị thông báo thành công
    alert('Sản phẩm đã được chỉnh sửa thành công!');
}

// Đóng modal
function closeChangeProductBox() {
    const modalChangeProduct = document.getElementById('modal-changeproduct');
    if (modalChangeProduct) {
        modalChangeProduct.style.display = 'none';
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
    reader.readAsDataURL(input.files[0]); // Đọc file ảnh
    // Thêm reset ảnh khi reset form
    document.getElementById('add-product-form').addEventListener('reset', function() {
        document.getElementById('img-preview').src = './img-prd/img-add2.png';
    });
}
// Hàm hiển thị chi tiết sản phẩm
function showProductDetails(productIndex) {
    const modalProductDetails = document.getElementById('modal-detailproduct');
    if (modalProductDetails) {
        modalProductDetails.style.display = 'flex';
    }
    
    // Lấy thông tin sản phẩm
    const product = allProducts[productIndex];

    // Điền dữ liệu vào pop-up
    document.getElementById('detail-img').src = product.img;
    document.getElementById('detail-name').innerText = product.name;
    document.getElementById('detail-brand').innerText = product.brandId;
    document.getElementById('detail-price').innerText = product.oldPrice;
    document.getElementById('detail-pb1').innerText = product.pb1 || "";
    document.getElementById('detail-pb2').innerText = product.pb2 || "";
    document.getElementById('detail-chip').innerText = product.chip || "";
    document.getElementById('detail-pin').innerText = product.pin || "";
    document.getElementById('detail-size').innerText = product.size || "";
    document.getElementById('detail-f').innerText = product.f || "";

    // Thêm sự kiện đóng pop-up
    document.getElementById('close-detailproduct').addEventListener('click', closeDetailProductBox);

}

// Hàm đóng pop-up
function closeDetailProductBox() {
    const modalProductDetails = document.getElementById('modal-detailproduct');
    if (modalProductDetails) {
        modalProductDetails.style.display = 'none';
    }
}


/* MAIN_CUSTOMERS */

// Hàm Chuyển Pass --> *****
function addPasswordToggleListeners() {
    const passwordCells = document.querySelectorAll('.table-cell-password');
    passwordCells.forEach(cell => {
        cell.addEventListener('click', function() {
            const isMasked = cell.textContent.startsWith('*'); // khai báo biến kiểm tra mật khẩu đã được mask chưa
            if (isMasked) {
                cell.textContent = cell.getAttribute('data-password'); 
                cell.classList.add('active');// hiển thị mật khẩu
            } else {
                cell.textContent = '*'.repeat(cell.getAttribute('data-password').length); // mask mật khẩu * bằng số lượng ký tự
                cell.classList.remove('active');// ẩn mật khẩu
            }
        });
    });
}


// ---CUSTOMER---
// Hiển thị trang khách hàng
function displayCustomerPage(page) {
    var s = '<tr><th>NO.</th><th>Tên đăng nhập</th><th>Mật khẩu</th><th>Số điện thoại</th><th>Địa chỉ</th><th>Hành động</th><th>Trạng thái</th></tr>';
    var dem = 0;
    var start = (page - 1) * itemsPerPageCustomer;
    var end = start + itemsPerPageCustomer;
    for (var i = start; i < customerArray.length && i < end; i++) {
        var customer = customerArray[i];
        s += '<tr data-id="' + i + '"' + (customer.locked ? ' class="locked"' : '') + '>' +  // Thêm class "locked" nếu khách hàng bị khóa
            '<td>' + (i + 1) + '</td>' +
            '<td>' + customer.username + '</td>' +
            '<td class="table-cell-password" data-password="' + customer.password + '">' + '*'.repeat(customer.password.length) + '</td>' +
            '<td>' + customer.phone + '</td>' +
            '<td>' + customer.address.numberAndRoad + ', ' + customer.address.ward + ', Quận ' + customer.address.district + ', ' + customer.address.city + '</td>' +
            '<td>' + '<button class="edit-btn" data-index="' + i + '"' + (customer.locked ? ' disabled' : '') + '>Sửa</button>' + '</td>' +
            '<td>' + '<button class="key-customer-btn">' + (customer.locked ? 'MỞ KHÓA' : 'KHÓA') + '</button>' +'</td>' +
        '</tr>';
        dem++;
        if (dem == itemsPerPageCustomer) {
            break;
        }
    }

    document.getElementById('customer-table-content__body').innerHTML = s;
    updatePagination('customer');

    // Tính toán tổng số trang cho Customers
    totalCustomerPages = Math.ceil(customerArray.length / itemsPerPageCustomer);
    
    // Tạo phân trang cho khách hàng
    createPagination(totalCustomerPages, 'customer');

    // Thêm event listeners cho các nút sửa
    document.querySelectorAll('#main__customers .edit-btn').forEach(button => {
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

// Hàm khóa/mở khóa khách hàng
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

// Hàm kiểm tra username đã tồn tại chưa
function checkExistedUsername(username) {
    for (let customer of customerArray) {
        if (customer.username === username) {
            return true; // Username đã tồn tại
        }
    }
    return false; // Username chưa tồn tại
}

function addCustomer(event) {
    event.preventDefault(); // Ngăn form tự submit

    // Lấy mảng khách hàng từ localStorage
    console.log('Mảng khách hàng trước khi thêm:', customerArray);

    // Lấy giá trị từ các trường nhập liệu
    const username = document.getElementById('new-customer-name').value.trim();
    const password = document.getElementById('new-customer-password').value.trim();
    const phone = document.getElementById('new-customer-phone').value.trim();
    const addressInput = document.getElementById('new-customer-address').value.trim();

    // Kiểm tra thông tin nhập vào
    if (!username || !password || !phone || !addressInput) {
        customAlert('Bạn chưa nhập đủ thông tin khách hàng', 'warning');
        return false;
    }

    // Kiểm tra xem username đã tồn tại chưa
    if (checkExistedUsername(username)) {
        customAlert('Tên tài khoản đã tồn tại', 'warning');
        return false;
    }

    // Tách địa chỉ thành các phần
    const addressParts = addressInput.split(',').map(part => part.trim());

    //Chia thành các phần: Số nhà và đường, Phường, Quận, Thành phố
    const numberAndRoad = addressParts[0] || ''; 
    const ward = addressParts[1] || '';
    let district = addressParts[2] || '';
    district = district.replace(/quận\s*/i, ''); // Xóa chữ "Quận" nếu có
    const city = addressParts[3] || '';

    //Kiểm tra địa chỉ có dạng hợp lệ không
    if (!numberAndRoad || !ward || !district || !city) {
        customAlert('Địa chỉ không hợp lệ. Vui lòng nhập đầy đủ các phần: Số nhà và đường, Phường, Quận, Thành phố', 'warning');
        return false;
    }

    // Tạo đối tượng khách hàng mới
    const newCustomer = {
        username: username,
        password: password,
        phone: phone,
        address: {
            city: city,
            district: district,
            ward: ward,
            numberAndRoad: numberAndRoad
        },
        locked: false // Trạng thái hoạt động
    };

    // Thêm khách hàng vào mảng và lưu vào localStorage
    customerArray.push(newCustomer);
    localStorage.setItem('customerArray', JSON.stringify(customerArray));

    // Cập nhật danh sách khách hàng và thông báo thành công
    displayCustomerPage(currentCustomerPage);
    customAlert('Thêm khách hàng thành công', 'success');

    // Reset form
    document.querySelector('#add-customer-form').reset();
}
function showChangeCustomerBox(customerIndex) {
    // Hiển thị modal
    const modalChangeCustomer = document.getElementById('modal-changecustomer');
    if (modalChangeCustomer) {
        modalChangeCustomer.style.display = 'flex';
    }

    // Lấy thông tin sản phẩm
    const customer = customerArray[customerIndex];

    // Điền thông tin vào modal
    document.getElementById('edit-username').value = customer.username;
    document.getElementById('edit-password').value = customer.password;
    document.getElementById('edit-phone').value = customer.phone;
    document.getElementById('edit-address').value = `${customer.address.numberAndRoad}, ${customer.address.ward}, ${customer.address.district}, ${customer.address.city}`;

    // Cập nhật sự kiện lưu
    const saveCustomerButton = document.getElementById('save-customer');
    saveCustomerButton.onclick = () => saveCustomerChanges(customerIndex);

    // Thêm sự kiện đóng pop-up
    document.getElementById('close-changecustomer').addEventListener('click', closeChangeCustomerBox);
}

// Lưu thay đổi sản phẩm
function saveCustomerChanges(customerIndex) {
    const updatedUsername = document.getElementById('edit-username').value.trim();
    const updatedPassword = document.getElementById('edit-password').value.trim();
    const updatedPhone = document.getElementById('edit-phone').value.trim();
    const updatedAddress = document.getElementById('edit-address').value.trim();

    // Cập nhật thông tin khách hàng trong mảng
    customerArray[customerIndex].username = updatedUsername;
    customerArray[customerIndex].password = updatedPassword;
    customerArray[customerIndex].phone = updatedPhone;

    // Tách địa chỉ thành các phần 
    const addressParts = updatedAddress.split(',').map(part => part.trim());
    customerArray[customerIndex].address = {
        numberAndRoad: addressParts[0] || '',
        ward: addressParts[1] || '',
        district: addressParts[2] || '',
        city: addressParts[3] || ''
    };

    // Kiểm tra thông tin cập nhật
    if (
        !customerArray[customerIndex].username ||
        !customerArray[customerIndex].password ||
        !customerArray[customerIndex].phone ||
        !customerArray[customerIndex].address.numberAndRoad ||
        !customerArray[customerIndex].address.ward ||
        !customerArray[customerIndex].address.district ||
        !customerArray[customerIndex].address.city
    ) {
        customAlert('Bạn chưa nhập đủ thông tin khách hàng', 'warning');
        return false;
    }

    // Cập nhật localStorage
    localStorage.setItem('customerArray', JSON.stringify(customerArray));

    // Cập nhật lại bảng khách hàng
    displayCustomerPage(currentCustomerPage);

    // Đóng modal
    closeChangeCustomerBox();

    // Hiển thị thông báo thành công
    alert('Khách hàng đã được chỉnh sửa thành công!');
}

// Đóng modal
function closeChangeCustomerBox() {
    const modalChangeCustomer = document.getElementById('modal-changecustomer');
    if (modalChangeCustomer) {
        modalChangeCustomer.style.display = 'none';
    }
}

// ORDER
function displayOrderPage(page) {
    // Hiển thị đơn hàng của trang hiện tại
}

// STATISTICS
function displayStatisticsPage(page) {
    // Hiển thị thống kê của trang hiện tại
}


/* MAIN_ORDERS */

// Add test order to order array:
// addTestOrderToArray();

/** Tìm khách hàng theo username */
function findCustomerByUsername(username) {
    return customerArray.find((customer) => customer.username === username);
}
function displayOrdersTable(orderArray){
    let tableHTML = `
                        <tr>
                            <th>Khách hàng</th>
                            <th>Số điện thoại</th>
                            <th>Thời điểm đặt hàng</th>
                            <th>Địa chỉ giao hàng</th>
                            <th>Chi tiết</th>
                            <th>Tình trạng</th>
                        </tr>
                    `;
    orderArray.forEach((order, index) => {

        const matchingCustomer = findCustomerByUsername(order.customerId);
        const formattedDate = new Date(order.date).toLocaleDateString('vi-VN');
        // const formattedAddress = `${matchingCustomer.address.numberAndRoad}, Phường ${matchingCustomer.address.ward}, Quận ${matchingCustomer.address.district}, TP ${matchingCustomer.address.city}`;
        tableHTML += `
                    <tr>
                        <td>${matchingCustomer.username}</td>
                        <td>${matchingCustomer.phone}</td>
                        <td>${formattedDate}</td>
                        <td>Address</td>    
                        <td>
                            <button class="detail-btn" onclick="">Chi tiết</button>
                        </td>
                        <td>
                            <!-- index tại từng order để lấy ra từng order tương ứng khi onchange -->
                            <select id="order-status__selection-${index}" onchange="handleStatusChange(${index}, this.value)">
                                <option value="UNPROCESSED" ${order.status === 'UNPROCESSED' ? 'selected' : ''}>Chưa xử lý</option>
                                <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>Đã xác nhận</option>
                                <option value="SUCCEEDED" ${order.status === 'SUCCEEDED' ? 'selected' : ''}>Thành công</option>
                                <option value="FAILED" ${order.status === 'FAILED' ? 'selected' : ''}>Thất bại</option>
                            </select>
                        </td>
                    </tr> 
        `;
    });
    // console.log(tableHTML);
    document.getElementById('orders-table-content__body').innerHTML = tableHTML;
}
displayOrdersTable(orderArray);



/* CÁC TÍNH NĂNG Ở BỘ LỌC */
// Lọc sản phẩm theo Date
// Kiểm tra 2 input Date hợp lệ: ngày dateStart phải trước dateEnd
//...
//------------------------

/** FUNC: Hiển thị bảng order table với các đơn hàng ở giữa 2 ngày được nhập */
function displayOrdersByDate() {
    const dateStartElem = document.getElementById('order__date-start');
    const dateEndElem = document.getElementById('order__date-end');
    const dateForm = document.getElementById('filter-date-form')
    let dateStart;
    let dateEnd;
    dateForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Ngăn hành động default: reload page
        dateStart = new Date(dateStartElem.value);
        dateEnd = new Date(dateEndElem.value);
        
        // Mảng các order trong 2 date đã chọn
        const filterOrderArray = filterOrdersBetweenTwoDate(dateStart, dateEnd);
        // Hiển thị bảng:
        displayOrdersTable(filterOrderArray);

        console.log("Filter table: ");
        console.log(filterOrderArray);
    });
}

// Gọi hàm để khởi tạo sự kiện
displayOrdersByDate();

/** FUNC: thay đổi status của từng order */
function handleStatusChange(orderIndex, newStatus){
    console.log("New status: " + newStatus);
    // Lấy ra order tương ứng cần thay đổi status
    const order = orderArray[orderIndex];
    if(order){
        // Lưu trạng thái ban đầu của dropdown (select)
        const previousStatus = order.status;
        // Kiểm tra thay đổi có thành công?
        const isChange = order.changeOrderStatus(newStatus);
        if(false === isChange){      // Thay đổi status failed 
            // Giữ nguyên status chũ cho dropdown (select)
            document.getElementById(`order-status__selection-${orderIndex}`).value = previousStatus;
        }
    } else {    // Không tồn tại order tương ứng
        console.log("Error: không tìm thấy order(index) để thay đổi status");
    }
}

/** FUNC: hiển thị order table với status tương ứng.  */
function displayOrderByStatus(){
    const status = document.getElementById('filter__status-selection').value;
    if('ALL' === status){
        // Hiển thị lại toàn bộ orderArray:
        displayOrdersTable(orderArray);
    } else {    
        // Hiển thị orderArray với status tương ứng:
        displayOrdersTable(filterOrderByStatus(status));
    }
}
displayOrderByStatus();

/** FUNC: sort order array theo quận (tạo ra một orderArray mới):
 * 1. Số nhỏ -> số lớn
 * 2. Alphabet
 */
function displaySortOrderArrayByDistrict(){
    // console.log(sortOrderByDistrict());
    document.getElementById('order__sort-by-district').addEventListener('click',(event) => {
        displayOrdersTable(sortOrderByDistrict());
    });
}
displaySortOrderArrayByDistrict();



function resetOrderFilter(){
    const resetBtn = document.getElementById('order__reset-filter-btn');
    resetBtn.addEventListener('click', () => {
        // Reset các trường input type="date"
        document.getElementById('order__date-start').value = '';
        document.getElementById('order__date-end').value = '';

        // Reset trường select về giá trị mặc định
        document.getElementById('filter__status-selection').value = 'ALL';

        displayOrdersTable(orderArray);
    });
}
resetOrderFilter();



/** FUNC: thống kê, tạo ra một array các product đã được bán, trong đó:
 * 1. Tên sản phẩm
 * 2. Số lượng đã bán 
 * 3. Tổng doanh thu
 */
// Mảng statisticsProductArray:
let statisticsProductArray = [];
function displayStatisticsProduct(){
    statisticsProductArray = createStatisticsProductArray();
    console.log('Thống kê sản phẩm: ');
    console.log(statisticsProductArray);

    let tableHTML = ``;
    statisticsProductArray.forEach((product) => {
        tableHTML += `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>${product.quantity * product.price}</td>
                        <td>
                            <button type="button">Hóa đơn</button>
                        </td>
                    </tr>
                    `;
    });
    document.getElementById('statistics-product-table__body').innerHTML = tableHTML;
}
displayStatisticsProduct();

/** Tổng doanh thu trên các đơn hàng */
function calcTotalProductRevenue(){
    let totalRevenue = 0;
    statisticsProductArray.forEach((product) => {
        if(product.name){
            totalRevenue += (product.quantity) * (product.price);        
        }
    });
    document.getElementById('statistics-product__total-revenue').innerHTML = totalRevenue;
    console.log('Tổng doanh thu theo sản phẩm: ' + totalRevenue);
}
calcTotalProductRevenue();

function displaySpecialProduct(){
    let bestProduct = statisticsProductArray[0];
    let worstProduct = statisticsProductArray[0];
    statisticsProductArray.forEach((product) => {
        // Nếu sản phẩm nào có doanh số cao hơn thì gán lại, nếu bằng nhau thì lấy cái nào có giá cao hơn
        if(product.quantity > bestProduct.quantity){
            bestProduct = product;
        } else if(product.quantity === bestProduct.quantity){
            if(product.price > bestProduct.price){
                bestProduct = product;
            }
        }
        // Nếu sản phẩm nào có doanh số thấp hơn thì gán lại, nếu bằng nhau thì lấy cái nào có giá thấp hơn
        if(product.quantity < worstProduct.quantity){
            worstProduct = product;
        } else if(product.quantity === worstProduct.quantity){
            if(product.price < worstProduct.price){
                worstProduct = product;
            }
        }
    });

    let specialProductHTML = `
                                <h2>Sản phẩm chạy nhất</h2>
                                <p>Tên: <span>${bestProduct.name}</span> </p>
                                <p>Doanh số: <span>${bestProduct.quantity}</span> </p>

                                <h2>Sản phẩm ế nhất</h2>
                                <p>Tên: <span>${worstProduct.name}</span> </p>
                                <p>Doanh số: <span>${worstProduct.quantity}</span> </p>
                            `;
    document.getElementById('statistics-product__special-product').innerHTML = specialProductHTML;
}
displaySpecialProduct();

/** FUNC: thống kê, tạo ra một array các customer đã mua hàng, trong đó:
 * 1. Username
 * 2. Họ và tên 
 * 3. Số điện thoại 
 * 4. Doanh thu
 */
let statisticsCustomerArray = [];
/**  FUNC: hiển thị mảng thống kê theo khách hàng đã mua. */
function displayStatisticsCustomer(){
    statisticsCustomerArray = createStatisticsCustomerArray();
    let tableHTML = ``;
    statisticsCustomerArray.forEach((customer) => {
        tableHTML += `
                    <tr>
                        <td>${customer.customerId}</td>
                        <td>${customer.phone}</td>
                        <td>${customer.totalRevenue}</td>
                        <td>
                            <button type="button">Hóa đơn</button>
                        </td>
                    </tr>
        `;
    });

    document.getElementById('statistics-customer-table__body').innerHTML = tableHTML;
    console.log(statisticsCustomerArray);
}
displayStatisticsCustomer();

/** Tổng doanh thu theo khách hàng */
function calcTotalCustomerRevenue(){
    let total = 0;
    statisticsCustomerArray.forEach((customer) => {
        total += customer.totalRevenue;
    });
    document.getElementById('statistics-customer__total-revenue').innerHTML = total;
    console.log("Tổng doanh thu theo khách hàng: " + total);
}
calcTotalCustomerRevenue();

/** FUNC: hiển thị top khách hàng có doanh thu cao nhất */
/** FUNC: hiển thị top khách hàng có doanh thu cao nhất */
function displayTopCustomer() {
    // Nhận giá trị người dùng nhập vào input -> top
    const topInput = document.getElementById('statistics-customer__top-input');
    // Số | 0 (nếu người dùng nhập không phải số)
    const top = parseInt(topInput.value) || 0; 
    const tableBody = document.getElementById('statistics-customer-table__body');

    // Kiểm tra nếu không hợp lệ hoặc nhỏ hơn 1
    if (top < 1 || isNaN(top)) {
        tableBody.innerHTML = '<tr><td colspan="4">Không có dữ liệu</td></tr>';
        return;
    }

    // Hiển thị bảng cho top khách hàng được nhập
    let tableHTML = '';
    for (let i = 0; i < top && i < statisticsCustomerArray.length; i++) {
        tableHTML += `
            <tr>
                <td>${statisticsCustomerArray[i].customerId}</td>
                <td>${statisticsCustomerArray[i].phone}</td>
                <td>${statisticsCustomerArray[i].totalRevenue}</td>
                <td>
                    <button type="button">Hóa đơn</button>
                </td>
            </tr>
        `;
    }

    // Cập nhật nội dung bảng
    tableBody.innerHTML = tableHTML;
}
// Lắng nghe sự kiện khi nhập vào ô input
document.getElementById('statistics-customer__top-input').addEventListener('input', displayTopCustomer);
   






window.showDetailProductBox = showProductDetails;
window.closeDetailProductBox = closeDetailProductBox;
window.showChangeProductBox = showChangeProductBox;
window.closeChangeProductBox = closeChangeProductBox;
window.changeImagePreview = changeImagePreview;
window.previewImage = previewImage;
window.showChangeCustomerBox = showChangeCustomerBox;
window.closeChangeCustomerBox = closeChangeCustomerBox;
window.saveProductChanges = saveProductChanges;

window.displayOrdersTable = displayOrdersTable;
window.handleStatusChange = handleStatusChange;
window.displayOrderByStatus = displayOrderByStatus;
window.displayStatisticsProduct = displayStatisticsProduct;
window.displaySpecialProduct = displaySpecialProduct;
window.displayTopCustomer = displayTopCustomer;
// //--------------KHÔNG CẦN CODE NÀY: WINDOW... CHỈ ÁP DỤNG CHO DOM KHI LOAD HTML------------------
// window.changeActiveSideBar = changeActiveSideBar;
// window.zoomInSideBar = zoomInSideBar;
// window.hideAllMainItems = hideAllMainItems;
// window.showMainItem = showMainItem;
// window.showCorrespondingMain = showCorrespondingMain;
// //--------------------------------