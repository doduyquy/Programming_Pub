// LOAD CART TƯƠNG ỨNG VỚI USERNAME TỪ localStorage
import {Cart} from '../common/data/cart.js'

function loadPage(){
document.addEventListener('DOMContentLoaded', () => 
    {  
        const cardPaymentOption = document.getElementById('card-payment-option');
        const additionalOptions = document.getElementById('additional-options');
        const creditCardPaymentOption = document.getElementById('credit-card-payment');
        const accountCardPaymentOption = document.getElementById('account-card-payment');
        const cardPaymentForm = document.getElementById('card-payment-form');
        const filea = document.querySelector('.modal-profile-a');
        const fileb = document.querySelector('.modal-profile-b');
        const modalOverlay = document.querySelectorAll('.modal__overlay-profile');
        const gobackButtons = document.querySelectorAll('.goback');  
        // Nút thông tin tài khoản
        document.getElementById('taikhoan').addEventListener('click', () => 
        {
            filea.style.display = 'flex';
        });
        // Nút thông tin thẻ tín dụng
        document.getElementById('the').addEventListener('click', () => 
        {
            fileb.style.display = 'flex';
        });
        
        // Quay lại giỏ hàng
        modalOverlay.forEach(button => {  
            button.addEventListener('click', () => {  
                filea.style.display = "none";  
                fileb.style.display = "none";  
            });  
        });
        gobackButtons.forEach(button => {  
            button.addEventListener('click', () => {  
                filea.style.display = "none";  
                fileb.style.display = "none";  
            });  
        });
        
        // Hiển thị sản phẩm trong giỏ hàng
        displayProducts();
    
        // Ensure "Thanh toán qua thẻ tín dụng" is selected by default and additional options are visible
        cardPaymentOption.checked = true;
        additionalOptions.style.display = 'block';
    
        // Show credit card form when "credit-card-payment" is selected
        creditCardPaymentOption.addEventListener('change', () => {
            if (creditCardPaymentOption.checked) {
                cardPaymentForm.style.display = 'block';
            }
        });
    
        // Hide credit card form when "Thẻ từ tài khoản" is selected
        accountCardPaymentOption.addEventListener('change', () => {
            cardPaymentForm.style.display = 'none';
        });
    
        // Ensure other payment methods do not hide options
        cardPaymentOption.addEventListener('change', () => {
            if (cardPaymentOption.checked) {
                additionalOptions.style.display = 'block';
                cardPaymentForm.style.display = 'none'; // Hide form initially
            }
        });
        localStorage.setItem('productPicked', JSON.stringify(productPicked));
    });
}
loadPage();


// Lấy {username, password} của người dùng tương ứng.
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
// Load Cart object của người dùng tương ứng.
const currentCart = new Cart(currentUser.username);

// // Hàm hiển thị sản phẩm giỏ hàng
// let productPicked = [];      
// let slproductPicked = 0;

// Format price currency VND format
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function displayProducts() {  
    
    const productsContainer = document.getElementById('containProducts');   
    productsContainer.innerHTML = '';
    if (currentCart.cartItem.length > 0) {  
        currentCart.cartItem.forEach(product => {  
            console.log(product.name);
            const totalPrice = product.price * product.quantity;  
            const pickedHTML = `  
                <div class="cart-item" data-product-name="${product.name}">   
                    <div class="item-left">   
                        <input type="checkbox" class="item-checkbox" onchange="updateTotalPrice()" data-price="${product.price}">   
                        <img class="product-img" src="${product.img}" alt="${product.name}">   
                        <div class="product-details">   
                            <span>${product.name}</span>   
                        </div>   
                    </div>   
                    <span class="category" data-product-version="${product.pb}">${product.pb}</span>   
                    <span class="price" data-unit-price="${product.price}">${formatPrice(product.price)}</span>   
                    <div class="quantity-control">   
                        <button class="decrease" onclick="changeQuantity('${product.name}','${product.pb}', -1)">-</button>   
                        <input type="text" class="quantity" value="${product.quantity}" readonly>   
                        <button class="increase" onclick="changeQuantity('${product.name}','${product.pb}', 1)">+</button>   
                    </div>   
                    <span class="total-price">${formatPrice(totalPrice)}</span>   
                    <div class="action">   
                        <button class="delete-btn" onclick="deleteProduct('${product.name}','${product.pb}')">Xóa</button>     
                    </div>   
                </div>  
            `;  
            productsContainer.insertAdjacentHTML('beforeend', pickedHTML);  
        });   
    }  
}  

// function displayProducts() {  
//     const picked = localStorage.getItem('productPicked');  
//     if (picked) productPicked = JSON.parse(picked);
//     slproductPicked = 0;
//     productPicked.forEach(product => {
//         slproductPicked+=product.sl;
//     });
//     localStorage.setItem('soluong', JSON.stringify(slproductPicked));
    
//     const productsContainer = document.getElementById('containProducts');   
//     productsContainer.innerHTML = '';
//     if (productPicked.length > 0) {  
//         productPicked.forEach(product => {  
//             const totalPrice = product.price * product.sl;  
//             const pickedHTML = `  
//                 <div class="cart-item" data-product-name="${product.name}">   
//                     <div class="item-left">   
//                         <input type="checkbox" class="item-checkbox" onchange="updateTotalPrice()" data-price="${product.price}">   
//                         <img class="product-img" src="${product.img}" alt="${product.name}">   
//                         <div class="product-details">   
//                             <span>${product.name}</span>   
//                         </div>   
//                     </div>   
//                     <span class="category" data-product-version="${product.pb}">${product.pb}</span>   
//                     <span class="price" data-unit-price="${product.price}">${formatPrice(product.price)}</span>   
//                     <div class="quantity-control">   
//                         <button class="decrease" onclick="changeQuantity('${product.name}','${product.pb}', -1)">-</button>   
//                         <input type="text" class="quantity" value="${product.sl}" readonly>   
//                         <button class="increase" onclick="changeQuantity('${product.name}','${product.pb}', 1)">+</button>   
//                     </div>   
//                     <span class="total-price">${formatPrice(totalPrice)}</span>   
//                     <div class="action">   
//                         <button class="delete-btn" onclick="deleteProduct('${product.name}','${product.pb}')">Xóa</button>     
//                     </div>   
//                 </div>  
//             `;  
//             productsContainer.insertAdjacentHTML('beforeend', pickedHTML);  
//         });   
//     }  
// }  


// Hàm thay đổi số lượng sản phẩm  

function changeQuantity(productName,productVersion, change) {    
    const productElement = document.querySelector(`.cart-item[data-product-name="${productName}"]`);  
    const numberInput = productElement.querySelector('.quantity');  
    let value = parseInt(numberInput.value); 
    if(value > 1 || change === 1) 
    {  
        numberInput.value = value + change;

        productPicked = productPicked.map(product => {  
            if (product.name === productName && product.pb === productVersion) {  
                return { ...product, sl: value + change };  
            }  
            return product;  
        });  
        localStorage.setItem('productPicked', JSON.stringify(productPicked)); // Cập nhật localStorage mảng sản phẩm được chọn
        displayProducts();  
        document.getElementById('select-all-footer').checked = false;  
        updateTotalPrice();
    } 
    else {  
        deleteProduct(productName,productVersion);  
    }  
}  

// Hàm xóa sản phẩm  
function deleteProduct(productName, productVersion) {  
    productPicked = productPicked.filter(product =>   
        !(product.name === productName && product.pb === productVersion)  
    );  
    localStorage.setItem('productPicked', JSON.stringify(productPicked)); // Cập nhật localStorage  
    displayProducts();

    updateTotalPrice();   
}  
// Cập nhật giá trị tổng sản phẩm 
function updateTotalPrice() 
{      
    const checkboxes = document.querySelectorAll('.item-checkbox');   
    let totalPrice = 0;   
    let selectedItems = 0;
    checkboxes.forEach((checkbox) => {   
        if (checkbox.checked) {   
            const quantity = parseInt(checkbox.closest('.cart-item').querySelector('.quantity').value);   
            const unitPrice = parseFloat(checkbox.closest('.cart-item').querySelector('.price').dataset.unitPrice);   
            const itemTotal = quantity * unitPrice;   
            totalPrice += itemTotal;   
            selectedItems += 1;   
        }   
    });   

    document.querySelector('.total-price-footer').textContent = formatPrice(totalPrice);   
    document.querySelector('.total-info2 span').textContent = `Tổng thanh toán (${selectedItems} sản phẩm):`;   
}  
// Nút chọn tất cả
function toggleSelectAll() {  
    const selectAllCheckbox = document.getElementById('select-all-footer');  
    const productCheckboxes = document.querySelectorAll('.item-checkbox');  
    
    // Lặp qua tất cả các checkbox sản phẩm và cập nhật trạng thái của chúng  
    productCheckboxes.forEach(checkbox => {  
        checkbox.checked = selectAllCheckbox.checked;  
    });  

    // Cập nhật lại tổng giá trị sau khi thay đổi trạng thái  
    updateTotalPrice();  
}  

// Nút xóa sản phẩm được chọn
document.getElementById('delete-button').addEventListener('click', function() 
{  
    const productCheckboxes = document.querySelectorAll('.item-checkbox:checked');  
    
    // Tạo một mảng lưu trữ tên và phiên bản sản phẩm cần xóa  
    const productsToDelete = [];  
    
    productCheckboxes.forEach(checkbox => {  
        const productElement = checkbox.closest('.cart-item');  
        const productName = productElement.dataset.productName;  
        const productVersion = productElement.querySelector('.category').dataset.productVersion;  
        productsToDelete.push({ name: productName, version: productVersion });  
    });  
    document.getElementById('select-all-footer').checked = false;
    // Xóa từng sản phẩm trong danh sách đã chọn  
    productsToDelete.forEach(product => {  
        deleteProduct(product.name, product.version); // Gọi hàm để xóa sản phẩm  
    });  
});  

// Show/hide new address form based on user selection
document.getElementById("new-address-option").addEventListener("change", function() {
    document.getElementById("new-address-form").style.display = "block";
});

document.getElementById("default-address").addEventListener("change", function() {
    document.getElementById("new-address-form").style.display = "none";
});



// Get the province and district select elements
const provinceSelect2 = document.getElementById('province2');
const districtSelect2 = document.getElementById('district2');






// Define the province-district mapping
const provinceDistrictMap = {
    'tp-hcm': ['Quận 1', 'Quận 2', 'Quận 7'],
    'long-an': ['Thành phố Tân An', 'Huyện Đức Hòa', 'Huyện Cần Đước'],
    'binh-dinh': ['Thành phố Quy Nhơn', 'Huyện Tây Sơn', 'Huyện Phù Mỹ']
    };



// Add event listener to the province select
provinceSelect2.addEventListener('change', function() {
    const selectedProvince = this.value;

    // Clear the existing options in the district select
    districtSelect2.innerHTML = '<option value="">Chọn Quận/Huyện</option>';

    // Add new options based on the selected province
    if (selectedProvince in provinceDistrictMap) {
    const districts = provinceDistrictMap[selectedProvince];
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.text = district;
        districtSelect2.add(option);
    });
    }
});




// Get the province and district select elements
const provinceSelect = document.getElementById('province');
const districtSelect = document.getElementById('district');


// Add event listener to the province select
provinceSelect.addEventListener('change', function() {
    const selectedProvince = this.value;

    // Clear the existing options in the district select
    districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';

    // Add new options based on the selected province
    if (selectedProvince in provinceDistrictMap) {
    const districts = provinceDistrictMap[selectedProvince];
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.text = district;
        districtSelect.add(option);
    });
    }
});




//-------------------ASSIGN -> WINDOW
window.loadPage = loadPage;
window.changeQuantity = changeQuantity;
window.deleteProduct = deleteProduct;
window.toggleSelectAll = toggleSelectAll;