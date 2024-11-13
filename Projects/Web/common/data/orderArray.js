/** ORDER CLASS: đối tượng hóa đơn, sau khi user chọn product trong cart và thanh toán. */
class Order {
    customerId = undefined;
    checkoutCart = undefined;       // Array
    date = undefined;               // Date object
    // Tình trạng đơn hàng: UNPROCESSED | CONFIRMED | SUCCEEDED | FAILED
    status = undefined;             

    constructor(customerId, checkoutCart, date, status = 'UNPROCESSED'){
        this.customerId = customerId;
        this.checkoutCart = checkoutCart;
        this.date = date;
        this.status = status;
    }

    // METHOD:
    // Tính tổng số tiền cần phải thanh toán của đơn hàng.
    calculateTotalPayment(){
        let total = 0;
        this.checkoutCart.forEach((item) => {
            // total += ...
        });
        return total;
    }
    // Admin thay đổi status của order: UNPROCESSED -> CONFIRMED | SUCCEEDED | FAILED
    changeOrderStatus(newStatus){
        switch (this.status) {
            case 'UNPROCESSED':
                // Nếu chưa xử lí -> CONFIRMED | FAILED
                if(newStatus === 'SUCCEEDED'){
                    //...
                    console.log('Failed: Đơn hàng chưa được xác nhận');
                } else {
                    this.status = newStatus;
                }
                break;
            case 'CONFIRMED':
                // Nếu đã xác nhận -> SUCCEEDED | FAILED
                if(newStatus === 'UNPROCESSED'){
                    console.log('Failed: Trạng thái không hợp lệ (Đơn hàng đã được xác nhận)');
                } else {
                    this.status = newStatus;
                }
                break;
            case 'SUCCEEDED':
                console.log('Failed: đơn hàng đã hoàn thành. Trạng thái bị vô hiệu hóa');
                break;
            case 'FAILED':
                console.log('Failed: :đơn hàng đã hoàn thành. Trạng thái bị vô hiệu hóa');
                break;
            default:
                break;
        }
    }
}


/** MẢNG ĐƠN HÀNG */
// Load mảng lên từ localStorage
export let orderArray = JSON.parse(localStorage.getItem('orderArray'));
// Nếu orderArray chưa được tạo:
if(!orderArray){
    orderArray = [];
}
// Lưu orderArray vào localStorage với key: orderArray
function saveOrderArrayToStorage(){
    localStorage.setItem('orderArray', JSON.stringify(orderArray));

}

/** CÁC TÍNH NĂNG BÊN PHÍA ADMIN: 
 * --- Đơn hàng:
 * 1. Lọc đơn hàng theo khoảng thời gian
 * 2. Lọc đơn hàng theo tình trạng
 * 3. Săp xếp đơn hàng theo quận (được giao, trong Customer)
 * 4. *CSS - Đánh dấu đơn hàng theo tình trạng đơn hàng (thể hiện thông qua css)
 * 
 * --- Thống kê:
 * - MỌI TÍNH NĂNG ĐỀU CÓ PHẦN XEM CHI TIẾT HÓA ĐƠN(xuất hóa đơn từ ORDER).
 * - HÓA ĐƠN: được xuất từ Order với status: 'SUCCEEDED'
 * 
 * 1. User: top [n] user mua nhiều nhất (tính theo totalPayment)
 * 2. Product:  bán chạy nhất, ế nhất.
 *              số lượng bán ra, tổng doanh thu.
 */
