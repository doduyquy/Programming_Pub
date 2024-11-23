import {customerArray, Address, checkExistedUsername, checkValidAccount, addCustomerToArray, saveCustomerArrayToStorage} from '../common/data/customerArray.js';
import {orderArray, saveOrderArrayToStorage, addOrderToArray} from '../common/data/orderArray.js'
import {Cart } from '../common/data/cart.js';

/////
let currentCart = undefined;
let currentUsername;
let currentCustomer;

const a = document.getElementById('register-form');  // Form đăng ký
const b = document.getElementById('login-form');     // Form đăng nhập
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelectorAll('.modal__overlay-profile');

const creditCardPaymentOption = document.getElementById('credit-card-payment');
const accountCardPaymentOption = document.getElementById('account-card-payment');
const cardPaymentForm = document.getElementById('card-payment-form');
/////

document.addEventListener('DOMContentLoaded', () => 
{  
    const flag = localStorage.getItem('currentUser');  // Lấy username của người dùng hiện tại khi đã đăng nhập
    if (flag) 
    {
        currentUsername = JSON.parse(flag);
        currentCart = new Cart(currentUsername); // Cập nhật giỏ hàng theo người dùng hiện tại
        console.log('Current cart: ');
        console.log(currentCart);
    }
    else 
    {
        currentUsername = '';
        currentCart = new Cart(currentUsername);
    }
    // Tìm khách hàng đang truy cập vào giỏ hàng
    currentCustomer = customerArray.find(p => p.username === currentUsername);  
    document.querySelector('.username').innerText = currentUsername;

    const cardPaymentOption = document.getElementById('card-payment-option');
    const additionalOptions = document.getElementById('additional-options');
    const creditCardPaymentOption = document.getElementById('credit-card-payment');
    const accountCardPaymentOption = document.getElementById('account-card-payment');
    const cardPaymentForm = document.getElementById('card-payment-form');
    const modal = document.querySelector('.modal');
    const filea = document.querySelector('.modal-profile-a');
    const fileb = document.querySelector('.modal-profile-b');
    const modalOverlay = document.querySelectorAll('.modal__overlay-profile');
    const gobackButtons = document.querySelectorAll('.goback');
    const switchButtons = document.querySelectorAll('.auto-form_switch-btn');
    const backButtons = document.querySelectorAll('.auto-form__controls-back');
   
    
    a.style.display = "none";
    b.style.display = "none"; 
    modal.style.display = "none";
    // Nút click form Đăng Ký
    switchButtons[0].addEventListener('click', function(event) 
    {     
        event.preventDefault();   
        a.style.display = "block";  
        b.style.display = "none";  
    });  
    // Nút click form Đăng nhập
    switchButtons[1].addEventListener('click', function(event) 
    {  
        event.preventDefault();  
        a.style.display = "none";  
        b.style.display = "block";  
    });
    // Nút thông tin tài khoản
    document.getElementById('taikhoan').addEventListener('click', () => 
        {
            if(currentUsername !== '') filea.style.display = 'flex';
            else 
            {
                alert("Vui lòng đăng nhập để điền thông tin!");  
                b.style.display = "block";
                modal.style.display = "flex";     
            }
        });
    // Nút thông tin thẻ tín dụng
    document.getElementById('the').addEventListener('click', () => 
        {
            if(currentUsername !== '') fileb.style.display = 'flex';
            else 
            {
                alert("Vui lòng đăng nhập để điền thông tin!");  
                b.style.display = "block";  
                modal.style.display = "flex";
            }
        });
        
    // Quay lại giỏ hàng
    modalOverlay.forEach(button => {  
        button.addEventListener('click', () => {  
            a.style.display = "none";
            b.style.display = "none";
            modal.style.display = "none";
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
    backButtons.forEach(button => 
        {
            button.addEventListener('click', function() {
                modal.style.display = "none";
                a.style.display = "none";
                b.style.display = "none"; 
            });
        });
    document.querySelectorAll('.modal-close-btn').forEach(button => {  
        button.addEventListener('click', function () {  
            document.getElementById('modal-overlay').style.display = 'none';  
        });  
    });
    
    // Hiển thị sản phẩm trong giỏ hàng
    displayProducts();
    // Hiển thị giao diện tổng thanh toán
    updateTotalPrice();
});
    
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);   
}

//HÀM XỬ LÝ ĐĂNG NHẬP
function Dangnhap() 
{
    const username = document.querySelector('.auto-form__input[type="username"]').value;
    const password = document.querySelector('.auto-form__input[type="password"]').value;
    if (!username || !password) 
    {  
        alert("Vui lòng điền đầy đủ thông tin!");  
        return;  
    }  
    
    // Change: kiểm tra đăng nhập đúng với customerArray
    if(true == checkValidAccount(username, password))
    {
        // Khi đăng nhập thành công, cập nhật Cart của khách hàng tưng ứng 
        const temp = currentCart;
        currentCart = new Cart(username);
        temp.cartItem.forEach(product =>
        {
            currentCart.addToCart(product);
        });
        currentCart.saveCartToStorage();
        displayProducts();

        currentUsername = username;
        currentCustomer = customerArray.find(p => p.username === currentUsername);
        localStorage.setItem('currentUser',JSON.stringify(currentUsername));       
        //-----------
        alert("Đã đăng nhập thành công với tài khoản: " + username);
        document.querySelector('.username').innerText = currentUsername;
        a.style.display = 'none';
        b.style.display = 'none';
        modal.style.display = "none";
    } 
    else if(checkExistedUsername(username) == true) 
    {
        alert("Sai mật khẩu!\nVui lòng nhập lại!");
        return; 
    }
    else
    {  
        alert("Tài khoản chưa được đăng ký!\nVui lòng đăng ký tài khoản mới!");  
        b.style.display = "none"; // Ẩn phần thông tin đăng nhập  
        a.style.display = "block"; // Hiển thị phần đăng ký  
    }  
}
//===== HÀM XỬ LÝ ĐĂNG KÝ =====//
function Dangky() 
{
    const username = document.querySelector('#register-form .auto-form__input[type="username"]').value;
    const password = document.querySelector('#register-form .auto-form__input[type="password"]').value;
    const confirmPassword = document.querySelector('#register-form .auto-form__input[placeholder="Nhập lại mật khẩu"]').value;

    // Kiểm tra xem các trường đã được điền chưa  
    if (!username || !password || !confirmPassword)   
        {  
            alert("Vui lòng điền đầy đủ thông tin!");  
            return;  
        }
    // Kiểm tra mật khẩu có khớp hay không  
    if (password !== confirmPassword)   
        {  
            alert('Mật khẩu nhập lại không khớp!');  
            return;  
        }  
    
    // Change: kiểm tra sự tồn tại của username trong customerArray  
    if(checkExistedUsername(username) == true){
        alert("Tên tài khoản " + username +" đã được đăng ký!\nVui lòng đăng nhập hoặc đổi tên tài khoản khác!");   
        return;
    } else 
    {
        alert("Đã đăng ký thành công với tài khoản: " + username + "\nVui lòng đăng nhập lại!");   
        b.style.display = "block"; // Hiển thị phần thông tin  
        a.style.display = "none";  // Ẩn phần đăng ký  

        // Change: thêm new customer vào customerArray khi đăng kí thành công
        addCustomerToArray(username, password);
        console.log('Added to customerArray user: ' + username );

        // Khi đăng kí thành công, tạo Cart obj tương ứng với username
        //cart = new Cart(username);
        console.log('Create Cart with username: ' + username);
        //-----------------
    }
    // Hàm kiểm tra có ký tự in hoa và ký tự đặc biệt
    function containsUppercaseOrSpecialChar(str) 
    {  
        // Biểu thức chính quy để kiểm tra ký tự in hoa và ký tự đặc biệt  
        const inhoa = /[A-Z]/;
        const dacbiet = /[!@#$%^&*(),.?":{}|<>]/;  
        return (inhoa.test(str) && dacbiet.test(str) && str.length>8);  
    }  
    if(username.includes(' ')) 
        {
            alert("Tên đăng nhập không có khoảng trống!");
            return;
        }
    if(!containsUppercaseOrSpecialChar(password))
        {
            alert("Mật khẩu phải dài hơn 8 ký tự, chứa ký tự IN HOA và ký tự ĐẶC BIỆT!")
            return;
        }
}

//===== HIỂN THỊ SẢN PHẨM TRONG GIỎ HÀNG =====//
function displayProducts() 
{   
    const productsContainer = document.getElementById('containProducts');   
    productsContainer.innerHTML = '';
    if (currentCart.cartItem.length > 0) 
    {  
        currentCart.cartItem.forEach(product => {  
            const totalPrice = product.price * product.quantity;  
            const pickedHTML = `  
                <div class="cart-item" data-product-name="${product.name}">   
                    <div class="item-left">   
                        <input type="checkbox" class="item-checkbox" onchange="updateTotalPrice(); updateCheckedProducts(this, '${product.name}', '${product.pb}')" data-price="${product.price}">   
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

//===== HÀM KIỂM TRA ĐIỀU KIỆN CỦA NÚT CHỌN TẤT CẢ =====//
function testAll()
{
    const checkboxes = document.querySelectorAll('.item-checkbox');
    let flag = true;
    checkboxes.forEach((checkbox) => {   
        if (!checkbox.checked) {   
            flag = false;  
        }   
    });
    if(!flag) document.getElementById('select-all-footer').checked = false;
    else document.getElementById('select-all-footer').checked = true;

    if(currentCart.counterProducts === 0) document.getElementById('select-all-footer').checked = false;
}
    
//===== HÀM THAY ĐỔI SỐ LƯỢNG CỦA SẢN PHẨM =====//  
function changeQuantity(productName, productVersion, change) 
{    
    const productElement = document.querySelector(`.cart-item[data-product-name="${productName}"]`);  
    const numberInput = productElement.querySelector('.quantity');  
    let value = parseInt(numberInput.value); 
    if(value > 1 || change === 1) 
    {  
        numberInput.value = value + change;

        currentCart.cartItem = currentCart.cartItem.map(product => {  
            if (product.name === productName && product.pb === productVersion) {  
                return { ...product, quantity: value + change };  
            }  
            return product;  
        });  
        currentCart.counterProducts +=change;
        currentCart.saveCartToStorage(); // Cập nhật localStorage mảng sản phẩm được chọn
        displayProducts();  
        document.getElementById('select-all-footer').checked = false;  
        updateTotalPrice();
    } 
    // !!! Khi số lượng còn 1, người dùng ấn '-' -> không làm gì cả.
    // Sản phẩm chỉ được xóa khi người dùng ấn xóa.
    else {  
        deleteProduct(productName,productVersion);  
    }  
}  
    
//===== HÀM XÓA SẢN PHẨM =====//  
function deleteProduct(productName, productVersion) 
{  
    currentCart.removeFromCart(productName, productVersion); // Gọi hàm xóa trong Cart
  
    displayProducts(); // Cập nhật lại giao diện mới
    updateTotalPrice();   // Cập nhật lại tổng giá trị sản phẩm
    testAll();
}  

//===== HÀM CẬP NHẬT TỔNG GIÁ TRỊ CỦA CÁC SẢN PHẨM ĐƯỢC CHỌN =====//
function updateTotalPrice() 
{          
    /** Do khi tick liên tục các checkbox thì web không thể load kịp và chậm 
      * Dùng phương thức này để lên lịch thực hiện công việc trước khi trình duyệt cập nhật giao diện
    **/
    window.requestAnimationFrame(() => {
        let totalPrice = 0;   
        let selectedItems = 0;
        const checkboxes = document.querySelectorAll('.item-checkbox');   
        checkboxes.forEach((checkbox) => {   
            if (checkbox.checked) {   
                const quantity = parseInt(checkbox.closest('.cart-item').querySelector('.quantity').value);   
                const unitPrice = parseFloat(checkbox.closest('.cart-item').querySelector('.price').dataset.unitPrice);   
                const itemTotal = quantity * unitPrice;   
            
                totalPrice += itemTotal;
                selectedItems += quantity;
            }   
        });
        document.querySelector('.total-price-footer').textContent = formatPrice(totalPrice);   
        const totalInfoSpan = document.querySelector('.total-info2 span:first-child'); // The first span that says 'Tổng thanh toán:'  
        totalInfoSpan.textContent = `Tổng thanh toán (${selectedItems} sản phẩm):`;   
        testAll(); 
    });       
}  
// Mỗi lần thay đổi check là cập nhật lại updateTotalPrice
document.querySelectorAll('.item-checkbox').forEach(checkbox => {  
    checkbox.addEventListener('change', updateTotalPrice); 
    testAll(); 
});

//===== NÚT CHỌN TẤT CẢ =====// 
function toggleSelectAll()
{
    const selectAllCheckbox = document.getElementById('select-all-footer');  
    const productCheckboxes = document.querySelectorAll('.item-checkbox');       
    // Lặp qua tất cả các checkbox sản phẩm và cập nhật trạng thái của chúng  
    productCheckboxes.forEach(checkbox => {  
        checkbox.checked = selectAllCheckbox.checked;

    }); 
    // Cập nhật lại tổng giá trị sau khi thay đổi trạng thái  
    updateTotalPrice(); 
}    

//----------------------------------------------------
// Mảng lưu các products đã được check(item-checkbox) trong Cart
let checkedProductArray = [];
//---------------------------
// Cập nhật mảng checkedProductsArray khi user check|uncheck
function updateCheckedProducts(checkbox, productName, productVersion){
    if(checkbox.checked){
        // Thêm vào mảng nếu product được checked
        checkedProductArray.push({productName, productVersion});
        console.log('Check product: ' + productName);
    } else {
        // Xóa khỏi mảng nếu product bị bỏ checked
        // Hoặc có thể dùng filter()
        const tmpArray = [];
        checkedProductArray.forEach((product) => {
            if(!(product.productName === productName && product.productVersion === productVersion)){
                tmpArray.push(product);
            }
        });
        checkedProductArray = tmpArray;
        console.log('Uncheck product: ' + productName);
    }
    console.log(checkedProductArray);
}
     
//===== NÚT XÓA CÁC SẢN PHẨM ĐƯỢC CHỌN =====//
// Xóa tất cả các sản phẩm đã checked trong Cart = nút deleteAllProductIsPicked-button
function deleteAllProductIsPicked(){
    // const productCheckboxes = document.querySelectorAll('.item-checkbox:checked');  
        
    document.getElementById('select-all-footer').checked = false;
    // Xóa từng sản phẩm trong danh sách đã chọn  
    checkedProductArray.forEach(product => {  
        deleteProduct(product.productName, product.productVersion); // Gọi hàm để xóa sản phẩm  
    }); 
    checkedProductArray = [];
    console.log(checkedProductArray);
}
function deleteAllWhenClickBtn(){
    document.getElementById('delete-button').addEventListener('click', function() {  
        deleteAllProductIsPicked();
    });  
}
deleteAllWhenClickBtn();

// Tạo Order và push vào orderArray khi người dùng hoàn tất việc mua hàng.
function createOrder(){
    const customerId = currentCart.localStorageKey;
    const cartItemChecked = [];
    // Kiểm tra trong mảng cartItem những sản phẩm nào có trong checkedProductArray thì thêm vào.
    checkedProductArray.forEach((checkedProduct) => {
        currentCart.cartItem.forEach((item) => {
            if(checkedProduct.productName === item.name && checkedProduct.productVersion === item.pb){
                cartItemChecked.push(item);
            }
        });
    });
    // Date gồm: ngày tháng năm
    const now = new Date();
    const orderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    addOrderToArray(customerId, cartItemChecked, orderDate, currentUsername.name, currentCustomer.phone, currentCustomer.address);
    console.log('Order: ');
    console.log(orderArray);
}

/** THÊM VÀO ORDER ARRAY KHI NGƯỜI DÙNG NHẤN THANH TOÁN */
/** Sau khi User nhấn hoàn tất thanh toán(hiện tại: ấn nút thanh toán)
 * 1. Tạo Order với các products trong Cart mà user đã chọn
 * 2. Xóa các products đó trong Cart
 * 3. Lưu toàn bộ thông tin mà người dùng đã nhập trước khi thanh toán
 */
function completeUserPurchase(){
    document.getElementById('place-order-btn').addEventListener('click', function(){
        createOrder();                  // Tạo order
        deleteAllProductIsPicked();     // Xóa các sản phẩm được pick, đã mua
                                        // Lưu toàn bộ thông tin người dùng 
        console.log('User click Thanh toán');
        console.log("Current customer: ");
        console.log(currentCustomer);

    });
}
completeUserPurchase();

//----------------------------------------------------



 //===== XÁC ĐỊNH ĐỊA ĐIỂM HOẠT ĐỘNG =====//  
const provinceDistrictMap = {  
    'TP.HCM': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7'],  
    'Long An': ['Thành phố Tân An', 'Huyện Đức Hòa', 'Huyện Cần Đước', 'Huyện Bến Lức'],  
    'Bình Định': ['Thành phố Quy Nhơn', 'Huyện Tây Sơn', 'Huyện Phù Mỹ', 'Huyện Hoài Nhơn'],  
};    


// FORM sửa đổi địa chỉ trong hóa đơn 
const provinceSelect2 = document.getElementById('province2');  
const districtSelect2 = document.getElementById('district2');  
 
provinceSelect2.addEventListener('change', function() 
{  
    const selectedProvince = this.value;  

    districtSelect2.innerHTML = '<option value="">Chọn Quận/Huyện</option>';  

    // Thêm option quận huyện tương ứng với thành phố  
    if (selectedProvince in provinceDistrictMap) {  
        const districts = provinceDistrictMap[selectedProvince];  
        districts.forEach(district => {  
            const option = document.createElement('option');  
            option.value = district;  // Set the value for the option  
            option.text = district;    // Set the display text for the option  
            districtSelect2.add(option); // Add the option to the district select  
        });  
    }  
});
    

// FORM sửa đổi địa chỉ trong thông tin người dùng
const provinceSelect = document.getElementById('province');
const districtSelect = document.getElementById('district');
    
provinceSelect.addEventListener('change', function() {
    const selectedProvince = this.value;
    
    districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
    
    // Thêm option quận huyện tương ứng với thành phố 
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
   

//===== LƯU THÔNG TIN NGƯỜI DÙNG =====// 
function saveCustomerDetails() 
{  
    const fullname = document.getElementById('fullname').value;  
    const phone = document.getElementById('phone').value;  
    const province = document.getElementById('province').value;  
    const district = document.getElementById('district').value;  
    const ward = document.getElementById('ward').value;  
        
    if (!fullname || !phone || !province || !district || !ward) {  
        alert('Vui lòng điền tất cả thông tin khách hàng.');  
        return;  
    }  

    if (currentCustomer) {  
        currentCustomer.phone = phone;  
        currentCustomer.name = fullname;  
        currentCustomer.address = {  
            city: province,  
            district: district,  
            numberAndRoad: ward  
        };  
        saveCustomerArrayToStorage();  
        alert('Thông tin khách hàng đã được lưu.');  
    } else {  
        console.error("Customer not found");  
    }  
} 


//===== LƯU THÔNG TIN THẺ =====//
function saveCardDetails() {  
    const cardNumber = document.getElementById('card-number').value;  
    const expiryDate = document.getElementById('expiry-date').value;  
    const cvv = document.getElementById('cvv').value;  
    const cardholderName = document.getElementById('cardholder-name').value;  
    const billingAddress = document.getElementById('billing-address').value;  
    const zipCode = document.getElementById('zip-code').value;  

    if (currentCustomer) {  
        currentCustomer.card = {
            cardNumber : cardNumber,
            expiryDate : expiryDate,
            cvv : cvv,
            cardholderName : cardholderName,
            billingAddress : billingAddress,
            zipCode : zipCode
        };

        saveCustomerArrayToStorage();  
        alert('Thông tin thẻ đã được lưu.');  
    } else {  
        console.error("Customer not found");  
    }  
} 


//===== NÚT SUMMIT THÔNG TIN =====//
function handleFormSubmit(event, formType) 
{  
    event.preventDefault(); // Prevent default form submission  

    if (formType === 'customer') 
    {  
        saveCustomerDetails();  
        //customerForm.reset();  
    } 
    else if (formType === 'card') 
    {  
        saveCardDetails();  
        //cardForm.reset();  
    }  

    // Print the updated array to the console for debugging  
    console.log('Current Data Array:', customerArray);  
}
document.addEventListener('DOMContentLoaded', () => 
{
    const customerForm = document.getElementById('customer-form');
    const cardForm = document.getElementById('card-form');
    const submitButtons = document.querySelectorAll('.submit-button');
      
    if (!customerForm || !cardForm || submitButtons.length === 0) {
        console.error("Forms or submit buttons not found in the DOM.");
        return;
    }
         
    // Attach event listeners to the forms
    customerForm.addEventListener('submit', (event) => handleFormSubmit(event, 'customer'));
    cardForm.addEventListener('submit', (event) => handleFormSubmit(event, 'card'));
});


//===== NÚT THANH TOÁN HIỆN RA HÓA ĐƠN =====//      
function thanhtoan() 
{  
    // Chọn tất cả các checkbox  
    const checkboxes = document.querySelectorAll('.item-checkbox');  
    const pickedProducts = []; // Mảng để chứa sản phẩm được chọn  
    let totalPrice = 0; // Tổng giá của các sản phẩm đã chọn  
    
    checkboxes.forEach((checkbox) => 
    {   
        if (checkbox.checked) 
        {   
            const cartItem = checkbox.closest('.cart-item'); // Tìm phần tử cha của checkbox  
            const name = cartItem.getAttribute('data-product-name'); // Lấy tên sản phẩm từ data attribute  
            const pb = cartItem.querySelector('.category').getAttribute('data-product-version'); // Lấy phiên bản sản phẩm từ thuộc tính data  
            const price = parseFloat(cartItem.querySelector('.price').getAttribute('data-unit-price')); // Lấy giá sản phẩm từ thuộc tính data  
            const quantity = parseInt(cartItem.querySelector('.quantity').value); // Lấy số lượng của sản phẩm  
            const img = cartItem.querySelector('.product-img').src; // Lấy đường dẫn hình ảnh
                
            /// XXX // Cập nhật trạng thái isPicked cho sản phẩm trong giỏ hàng  
            // currentCart.cartItem = currentCart.cartItem.map(product => {  
            //     if (product.name === name && product.pb === pb) {  
            //         return { ...product, isPicked: true };  
            //     }  
            //     return product;  
            // });  
            
            // Thêm sản phẩm đã chọn vào mảng pickedProducts  
            pickedProducts.unshift({ name, pb, price, quantity, img }); 
    
            // Tính tổng giá sản phẩm đã chọn  
            totalPrice += price * quantity;  
    
            // Lưu giỏ hàng vào storage  
            currentCart.saveCartToStorage();  
        }   
    }); 
    if(currentUsername === '') 
    {
        alert("Vui lòng đăng nhập để thanh toán!");  
        b.style.display = "block";  
        modal.style.display = "flex";
        return;
    }
    else if(pickedProducts.length === 0) { alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!'); return; }
    else
    {
        // Hiện hóa đơn xác nhận thanh toán
        document.querySelector('.modal-overlay').style.display = 'flex';
        
        // Cập nhật thông tin user    
        if(currentCustomer.address) 
        {
            document.querySelector('.address-name').innerText = currentCustomer.name;  
            document.querySelector('.number-phone').innerText = currentCustomer.phone;
            document.querySelector('.address-detail').innerText = `${currentCustomer.address.numberAndRoad} - ${currentCustomer.address.district} - ${currentCustomer.address.city}`;  
            document.getElementById('new-address-option').checked = false;
            document.getElementById('new-address-form').style.display = 'none';
        }
        else 
        {
            document.querySelector('.address-name').innerText = 'Chưa nhập thông tin';
            document.getElementById('new-address-option').checked = true;
            document.getElementById('new-address-form').style.display = 'block';
        }
        
        // Cập nhật tổng thanh toán  
        document.querySelector('.section .total-amount').innerHTML = `Tổng thanh toán: <span id="total-amount">${formatPrice(totalPrice)}</span>`;  
    
        // Cập nhật chi tiết sản phẩm cho phần thanh toán  
        const paymentSection = document.querySelector('.section .product-details');  
        paymentSection.innerHTML = ''; // Xóa nội dung cũ  
        paymentSection.insertAdjacentHTML('beforeend', ` <h4 class="section-header">Chi tiết sản phẩm</h4> `);
        pickedProducts.forEach(product => {  
            paymentSection.insertAdjacentHTML('beforeend', `  
                <div class="payment-section" bis_skin_checked="1">
                    <img src="${product.img}" alt="${product.name}" style="width: 50px; height: 50px; margin-right: 10px; vertical-align: middle;">
                    <strong>${product.name}</strong>
                    <p>Phiên bản: ${product.pb}</p>
                    <p>Giá: ${formatPrice(product.price * product.quantity)}</p>
                    <p>Số lượng: ${product.quantity}</p> 
                </div> 
            `);   
        });
        // Hiển thị sản phẩm trong phần tóm tắt
        const tt_product = document.getElementById('summary-products');
        pickedProducts.forEach(product => {  
            tt_product.insertAdjacentHTML('beforeend', `  
                Tên: ${product.name} - Phiên bản: ${product.pb} - Số lượng: ${product.quantity} - Giá: ${formatPrice(product.price * product.quantity)} <br>
            `);   
        });

        updateSummary(); // Update tóm tắt phương thức thanh toán
        updateAddressSummary(); // Update tóm tắt địa chỉ
    }  
}

//===== HÀM CẬP NHẬT PHƯƠNG THỨC THANH TOÁN KHÁCH CHỌN =====//
function updateSummary() {
    const paymentMethods = document.getElementsByName('payment');
    let selectedPayment = null;

    // Sử dụng Array.find thay cho vòng lặp
    const checkedMethod = Array.from(paymentMethods).find(method => method.checked);
    
    if (checkedMethod) {
        selectedPayment = checkedMethod.value;
    }

    // Chuyển sang sử dụng object mapping để giảm độ phức tạp
    const paymentLabels = {
        'cash': 'Thanh toán khi nhận hàng',
        'bank': 'Thanh toán bằng chuyển khoản',
        'account-card': 'Thanh toán bằng thẻ từ tài khoản',
        'credit-card': 'Thanh toán qua thẻ tín dụng mới'
    };

    const summaryPaymentElement = document.getElementById('summary-payment');
    const bankImageContainer = document.getElementById('bank-image-container');

    // Kiểm tra điều kiện của các phương thức
    summaryPaymentElement.innerText = paymentLabels[selectedPayment] || 'Chưa chọn phương thức thanh toán!';
    bankImageContainer.style.display = selectedPayment === 'bank' ? 'block' : 'none';
    cardPaymentForm.style.display = (selectedPayment === 'cash' || selectedPayment === 'bank' || selectedPayment === 'account-card') ? 'none' : 'block'; 
}

// Nút chọn phương thức thẻ mới  
creditCardPaymentOption.addEventListener('change', () => {  
    if (creditCardPaymentOption.checked) {  
        cardPaymentForm.style.display = 'block';  
    }  
    else cardPaymentForm.style.display = 'none'; 
});  
// Nút chọn phương thức thẻ đã lưu trước đó 
accountCardPaymentOption.addEventListener('change', () => {  
    // Kiểm tra người dùng đã nhập thông tin thẻ trước đó chưa  
    if (currentCustomer.card === undefined) {  
        alert('Thông tin thẻ của bạn chưa được lưu, vui lòng lưu lại hoặc nhập thông tin mới!');  
        creditCardPaymentOption.checked = true;   // Chuyển qua phương thức nhập thẻ mới
        cardPaymentForm.style.display = 'block'; 
    } else {  
        cardPaymentForm.style.display = 'none'; 
    }  
});

//===== HIỆN MÃ QR KHI THANH TOÁN CK =====//
const bankPaymentOption = document.getElementById('bank-payment-option');
const bankImageContainer = document.getElementById('bank-image-container');
bankPaymentOption.addEventListener('change', () => {
    if (bankPaymentOption.checked) {
        bankImageContainer.style.display = 'block';
    }
});

// Update thông tin thẻ khi thay đổi phương thức  
const paymentOptions = document.getElementsByName('payment');  
paymentOptions.forEach(option => {  
    option.addEventListener('change', updateSummary);   
});  


//===== HÀM CẬP NHẬT ĐỊA CHỈ KHÁCH CHỌN =====//
function updateAddressSummary() 
{
    const addressOptions = document.getElementsByName('address');
    const selectedAddressOption = Array.from(addressOptions).find(option => option.checked);
    let selectedAddress = null;

    if (!selectedAddressOption) {
        document.getElementById('summary-address').innerText = 'Chưa có địa chỉ giao hàng!';
        return;
    }

    if (selectedAddressOption.id === 'default-address') {
        // Kiểm tra customer.address có tồn tại không
        if (currentCustomer.address) {
            selectedAddress = {
                name: currentCustomer.name,
                phone: currentCustomer.phone,
                detail: `${currentCustomer.address.numberAndRoad} - ${currentCustomer.address.district} - ${currentCustomer.address.city}`
            };
        }
    } else if (selectedAddressOption.id === 'new-address-option') {
        const newAddressName = document.querySelector('.new-address-form .form-input[type="text"]')?.value || 'Chưa có tên';
        const newAddressPhone = document.querySelectorAll('.new-address-form .form-input[type="text"]')[1]?.value || 'Chưa có số điện thoại';
        const newAddressDetail = document.querySelectorAll('.new-address-form .form-input[type="text"]')[2]?.value || 'Chưa có địa chỉ';
        const province = document.getElementById('province2')?.value || '';
        const district = document.getElementById('district2')?.value || '';
        selectedAddress = {
            name: newAddressName,
            phone: newAddressPhone,
            detail: `${newAddressDetail} - ${district} - ${province}`
        };
        //----- Lưu thông tin người dùng vào currentCustomer để đầy qua orderArray
        currentCustomer.name = newAddressName;
        currentCustomer.phone = newAddressPhone;
        currentCustomer.address = new Address(province, district, newAddressDetail);
        //------------------------------------------------------------------------
    }
    // Cập nhật địa chỉ
    const summaryAddressElement = document.getElementById('summary-address');
    summaryAddressElement.innerText = selectedAddress 
        ? `${selectedAddress.name}, ${selectedAddress.phone}, ${selectedAddress.detail}` 
        : 'Chưa có địa chỉ giao hàng!';
}
// Ẩn hiện Form thông tin mới   
const addressOptions = document.getElementsByName('address');  
addressOptions.forEach(option => {  
    option.addEventListener('change', () => {  
        const newAddressForm = document.getElementById('new-address-form');  
        
        if (option.id === 'new-address-option') {    
            newAddressForm.style.display = 'block';  
        } else if (option.id === 'default-address') {  
            // Kiểm tra người dùng đã nhập thông tin địa chỉ trước đó chưa  
            if (currentCustomer.address === undefined) {  
                alert('Thông tin khách hàng của bạn chưa được lưu, vui lòng lưu lại hoặc nhập thông tin mới!');  
                document.getElementById('new-address-option').checked = true; // Chuyển qua lựa chọn nhập địa chỉ mới  
                newAddressForm.style.display = 'block'; 
            } else {  
                newAddressForm.style.display = 'none'; 
            }  
        } else {  
            newAddressForm.style.display = 'none';  
        }  
        updateAddressSummary(); // Cập nhật lại thông tin mỗi khi thay đổi lựa chọn
    });  
});    
// Update thông tin địa chỉ khi nhập địa chỉ mới  
const newAddressInputs = document.querySelectorAll('.new-address-form .form-input');   
newAddressInputs.forEach(input => {  
    input.addEventListener('input', updateAddressSummary);  
});


//-------------------------------------------
/** MODULE: khi tạo 'module', các file trong js trở thành scope chỉ trong file đó.
 * Dẫn đến: khi dùng DOM để tạo html, không thể dùng 'onclick',
 *          vì chúng không được gán cho window
 * ==> Gán cho 'window' các hàm dùng DOM để tạo html.
 */
window.displayProducts = displayProducts;
window.changeQuantity = changeQuantity;
window.testAll = testAll;
window.updateTotalPrice = updateTotalPrice;
window.deleteProduct = deleteProduct;
window.toggleSelectAll = toggleSelectAll;
window.Dangnhap = Dangnhap;
window.Dangky = Dangky; 
window.handleFormSubmit = handleFormSubmit;
window.saveCardDetails = saveCardDetails;
window.saveCustomerDetails = saveCustomerDetails;
window.thanhtoan = thanhtoan;
window.updateAddressSummary = updateAddressSummary;
window.updateSummary = updateSummary;

window.updateCheckedProducts = updateCheckedProducts;
//-------------------------------------------