/** ORDER CLASS: đối tượng hóa đơn, sau khi user chọn product trong cart và thanh toán. */
class Order {
    customerId = undefined;
    checkoutCart = [];      // Array
    date = undefined;       // Date object
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
                    alert('Failed: Đơn hàng chưa được xác nhận');
                    console.log('Failed: Đơn hàng chưa được xác nhận');
                } else {
                    this.status = newStatus;
                }
                break;
            case 'CONFIRMED':
                // Nếu đã xác nhận -> SUCCEEDED | FAILED
                if(newStatus === 'UNPROCESSED'){
                    alert('Failed: Đơn hàng đã được xác nhận');
                    console.log('Failed: Trạng thái không hợp lệ (Đơn hàng đã được xác nhận)');
                } else {
                    this.status = newStatus;
                }
                break;
            /** Khi đã ở trạng thái SUCCEEDED | FAILED: trạng thái bị vô hiệu hóa. */
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
// Load mảng lên từ localStorage, nếu chưa được tạo thì gán rỗng:
export let orderArray = JSON.parse(localStorage.getItem('orderArray'));
if (!orderArray) {
    orderArray = [];
} else {
    // Khi lưu Date obj vào local, tự chuyển đổi thành string, khi lấy lên và parse, không được chuyển đổi ngược lại Date obj
    // => Chuyển đổi chuỗi date thành đối tượng Date
    orderArray = orderArray.map(order => ({
        // Toàn bộ property đều giữ nguyên
        ...order,   
        // Ngoại trừ [date]: thay đổi -> Date obj
        date: new Date(order.date),
    }));
}


// Lưu orderArray vào localStorage với key: orderArray
export function saveOrderArrayToStorage(){
    localStorage.setItem('orderArray', JSON.stringify(orderArray));

}
export function addOrderToArray(customerId, checkoutCart, date, status = 'UNPROCESSED'){
    const newOrder = new Order(customerId, checkoutCart, date, status);
    orderArray.push(newOrder);
    saveOrderArrayToStorage();
}


// True: stDate <= checkDate <= ndDate
function isBetweenTwoDate(checkDate, stDate, ndDate){
    // const firstDate = new Date(stDate.getFullYear(), stDate.getMonth(), stDate.getDate());
    // const secondDate = new Date(ndDate.getFullYear(), ndDate.getMonth(), ndDate.getDate());
    // const currentDate = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
    const firstDate = new Date(stDate); // Giữ nguyên thời gian của stDate
    const secondDate = new Date(ndDate); // Giữ nguyên thời gian của ndDate
    const currentDate = new Date(checkDate); // Giữ nguyên thời gian của checkDate


    return (firstDate <= currentDate && currentDate <= secondDate);
}

// Trả vê một order array với date nằm trong khoảng [stDate, ndDate]
export function filterOrdersBetweenTwoDate(stDate, ndDate){
    const filterArray = [];
    orderArray.forEach((order) => {
        if(true === isBetweenTwoDate(order.date, stDate, ndDate)){
            filterArray.push(order);
        }
    });
    return filterArray;
}







export function addTestOrderToArray(){
    addOrderToArray('user1', [], new Date('2024-02-10'));
    // addOrderToArray('user1', [], new Date('2024-05-10'));
    addOrderToArray('user2', [], new Date('2024-07-20'));
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
