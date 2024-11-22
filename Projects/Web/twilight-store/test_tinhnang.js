//===== NÚT THAY ĐỔI THÔNG TIN THẺ TRONG HÓA ĐƠN =====//  
function updateSummary() 
{  
    const paymentMethods = document.getElementsByName('payment');   
    let selectedPayment;   

    for (const method of paymentMethods) {  
        if (method.checked) {  
            selectedPayment = method.value;  
            break;   
        }  
    }  

    // Update phương thức chuyển khoản  
    switch (selectedPayment) {  
        case "cash":   
            document.getElementById('summary-payment').innerText = "Thanh toán khi nhận hàng";  
            document.getElementById('bank-image-container').style.display = 'none';  
            break;  
        case "bank":   
            document.getElementById('summary-payment').innerText = "Thanh toán bằng chuyển khoản";  
            document.getElementById('bank-image-container').style.display = 'block';   
            break;  
        case "account-card":   
            document.getElementById('summary-payment').innerText = "Thanh toán bằng thẻ từ tài khoản";  
            document.getElementById('bank-image-container').style.display = 'none';  
            break;  
        case "credit-card":  
            document.getElementById('summary-payment').innerText = "Thanh toán qua thẻ tín dụng mới";  
            document.getElementById('bank-image-container').style.display = 'none';   
            break;  
        default:  
            document.getElementById('summary-payment').innerText = "Chưa chọn phương thức thanh toán!";  
            document.getElementById('bank-image-container').style.display = 'none';   
            break;  
    }  
}  

// Ẩn hiện form thẻ mới  
creditCardPaymentOption.addEventListener('change', () => {  
    if (creditCardPaymentOption.checked) {  
        cardPaymentForm.style.display = 'block';  
    }  
});  

accountCardPaymentOption.addEventListener('change', () => {  
    // Kiểm tra người dùng đã nhập thông tin thẻ trước đó chưa  
    if (customer.card === undefined) {  
        alert('Thông tin thẻ của bạn chưa được lưu, vui lòng lưu lại hoặc nhập thông tin mới!');  
        creditCardPaymentOption.checked = true;   // Chuyển qua phương thức nhập thẻ mới
        cardPaymentForm.style.display = 'block'; 
    } else {  
        cardPaymentForm.style.display = 'none'; 
    }  
});  

document.addEventListener('DOMContentLoaded', function() {     
    // Kiểm tra trạng thái ban đầu  
    const initialCheckedRadio = document.querySelector('input[name="payment"]:checked');  
    if (initialCheckedRadio && initialCheckedRadio.value === 'credit-card') {  
        cardPaymentForm.style.display = 'block';  
    } else {  
        cardPaymentForm.style.display = 'none';  
    }  
});  

// Update thông tin thẻ khi thay đổi phương thức  
const paymentOptions = document.getElementsByName('payment');  
paymentOptions.forEach(option => {  
    option.addEventListener('change', updateSummary);   
});  


//===== NÚT THAY ĐỔI THÔNG TIN NGƯỜI DÙNG TRONG HÓA ĐƠN =====//   
function updateAddressSummary() 
{  
    const addressOptions = document.getElementsByName('address');   
    let selectedAddress;   
    
    for (const addressOption of addressOptions) {  
        if (addressOption.checked) {  
            if (addressOption.id === 'default-address') {  
                selectedAddress = {  
                    name: customer.name,  
                    phone: customer.phone,   
                    detail: `${customer.address.numberAndRoad} - ${customer.address.district} - ${customer.address.city}`  
                };   
            } else if (addressOption.id === 'new-address-option') {  
                // Nhập địa chỉ mới  
                const newAddressName = document.querySelector('.new-address-form .form-input[type="text"]').value || 'Chưa có tên';  
                const newAddressPhone = document.querySelector('.new-address-form .form-input[type="text"]:nth-of-type(2)').value || 'Chưa có số điện thoại';  
                const newAddressDetail = document.querySelector('.new-address-form .form-input[type="text"]:nth-of-type(3)').value || 'Chưa có địa chỉ';   
                const province = document.getElementById('province2').value;   
                const district = document.getElementById('district2').value;  

                // Tạo thông tin với địa chỉ mới nhập   
                selectedAddress = {  
                    name: newAddressName,  
                    phone: newAddressPhone,  
                    detail: `${newAddressDetail} - ${district} - ${province}`  
                };  
            }  
            break;   
        }  
    }  

    // Update địa chỉ được chọn   
    if (selectedAddress) {  
        document.getElementById('summary-address').innerText =  
            `${selectedAddress.name}, ${selectedAddress.phone}, ${selectedAddress.detail}`;  
    } else {  
        document.getElementById('summary-address').innerText = 'Chưa có địa chỉ giao hàng!';  
    }  
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
            if (customer.address === undefined) {  
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

document.addEventListener('DOMContentLoaded', function() {  
    // Gọi cập nhật ngay khi trang được tải  
    updateSummary();  
    updateAddressSummary();  
});