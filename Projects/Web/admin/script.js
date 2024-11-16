import productArray from '../common/data/productArray.js'; // Import mảng sản phẩm từ file productArray.js

// SIDEBAR 
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

// Thêm sự kiện khi thay đổi kích thước màn hình
window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', handleResize);

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

// TOGGLE SIDEBAR
function zoomInSideBar(){
    const menuBar = document.querySelector('#content nav #hidden-sidebar-btn');
    const sideBar = document.getElementById('sidebar');
    
    if (menuBar && sideBar) {
        menuBar.addEventListener('click', () => {
            sideBar.classList.toggle('hide');
            updateContentWidth(); // Gọi hàm để cập nhật kích thước content
        });
    }
}
zoomInSideBar();
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
localStorage.setItem('productArray', JSON.stringify(productArray));


/* MAIN__PRODUCTS */
// Hiển thị modal và tải thông tin sản phẩm vào modal để chỉnh sửa

// Lấy productArray từ localStorage
let allProducts = JSON.parse(localStorage.getItem('productArray')) || [];
let filteredProducts = [];
const itemsPerPage = 8;
let currentPage = 1;

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
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Hiển thị trang đầu tiên của sản phẩm đã lọc
    currentPage = 1;
    displayPage(currentPage);

    // Tạo lại nút phân trang
    createPagination(totalPages);
}
// Sau khi tạo bảng sản phẩm
function displayPage(page) {
    const tableBody = document.getElementById('product-table__body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
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
                <button class="delete-btn">Xóa</button>
                <button class="change edit-btn" data-index="${id - 1}">Sửa</button>
            </td>
        `;

        fragment.appendChild(row);
    });

    tableBody.appendChild(fragment);
    updatePagination();

    // Thêm event listeners cho các nút sửa
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productIndex = parseInt(this.getAttribute('data-index'));
            showChangeProductBox(productIndex);
        });
    });
}
// Tạo nút phân trang
function createPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    pagination.innerHTML = '';

    const prevButton = document.createElement('a');
    prevButton.href = "#";
    prevButton.innerHTML = "&laquo;";
    prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
            updatePagination();
        }
    });
    pagination.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('a');
        button.href = "#";
        button.textContent = i;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            displayPage(currentPage);
            updatePagination();
        });
        if (i === currentPage) {
            button.classList.add('active');
        }
        pagination.appendChild(button);
    }

    const nextButton = document.createElement('a');
    nextButton.href = "#";
    nextButton.innerHTML = "&raquo;";
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(currentPage);
            updatePagination();
        }
    });
    pagination.appendChild(nextButton);
}

function updatePagination() {
    const paginationLinks = document.querySelectorAll('#pagination a');
    paginationLinks.forEach(link => {
        link.classList.remove('active');
        if (parseInt(link.textContent) === currentPage) {
            link.classList.add('active');
        }
    });
}

// Thêm sự kiện khi trang được tải 
document.addEventListener('DOMContentLoaded', () => { 
    // Kiểm tra nếu allProducts rỗng thì tải
    if (allProducts.length === 0) {
        alert('Không có sản phẩm nào trong productArray. Vui lòng kiểm tra lại.');
    } else {
        filteredProducts = allProducts.slice();
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        createPagination(totalPages);
        displayPage(currentPage);
    }
    
    // Thêm sự kiện submit cho form thêm sản phẩm 
    const addProductForm = document.getElementById('add-product-form'); 
    if (addProductForm) { 
        addProductForm.addEventListener('submit', addNewProduct); 
    } 
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
    brandFilter.value = 'all';

    filterProducts();

    // Hiển thị thông báo thành công
    alert('Sản phẩm đã được thêm thành công!');
}

// Xóa sản phẩm
document.getElementById('product-table__body').addEventListener('click', function(event) {
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
    const modal = document.getElementById('modal1');
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
    closeChangeBox();

    // Hiển thị thông báo thành công
    alert('Sản phẩm đã được chỉnh sửa thành công!');
}

// Đóng modal
function closeChangeBox() {
    const modal = document.getElementById('modal1');
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
window.showChangeProductBox = showChangeProductBox;
window.closeChangeBox = closeChangeBox;
window.changeImagePreview = changeImagePreview;
window.previewImage = previewImage;

window.saveProductChanges = saveProductChanges;

// //--------------KHÔNG CẦN CODE NÀY: WINDOW... CHỈ ÁP DỤNG CHO DOM KHI LOAD HTML------------------
// window.changeActiveSideBar = changeActiveSideBar;
// window.zoomInSideBar = zoomInSideBar;
// window.hideAllMainItems = hideAllMainItems;
// window.showMainItem = showMainItem;
// window.showCorrespondingMain = showCorrespondingMain;
// //--------------------------------
