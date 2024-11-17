/** CUSTOMER ARRAY: lưu toàn bộ thông tin của khách hàng.
 * Mỗi phần từ là một Customer Object, với: 
 * Property: username, password, status, phone, email,
 *           address (obj)   
 * Method:
 *  -
 *  -
 */
class Address {
    city = undefined;           // Thành phố
    district = undefined;       // Quận *
    ward = undefined;           // Phường
    numberAndRoad = undefined;  // Số nhà và tên đường

    constructor(city, district, ward, numberAndRoad) {
        this.city = city;
        this.district = district;
        this.ward = ward;
        this.numberAndRoad = numberAndRoad;
      }

    /* METHOD */
    // Lấy ra district field
    getDistrict(){
        return this.district;
    }
}
class Customer {
    username = '';   // (Work like ID), unique
    password = '';   
    
    /* Information của khách hàng: 
    có thể gộp thành Object nhưng để đơn giản -> không gộp */
    phone = '';      
    email = '';
    Address = undefined;        // Object 
    
    /** status: tình trạng của khách hàng, bị lock hay chưa
     * 0: unavailable (đã bị lock)
     * 1: available (chưa lock, đang hoạt động)
     */
    status = 1;     // Default: 1 
    
    constructor(username, password, phone, email, address, status = 1){
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.status = status;
    }

    /* METHOD */
    lockCustomer(){
        this.status = 0;
    }
    unlockCustomer(){
        if(this.status === 0){
            this.status = 1;
        } else {
            console.log('Failed: Tài khoản người dùng chưa bị khóa.');
        }
    }
}

/* MẢNG KHÁCH HÀNG */
const AllCustomerArray = [
    new Customer("user1", "pass1", "1000000001", "user1@example.com", new Address("City1", "District1", "Ward1", "1 Road A"), 1),
    new Customer("user2", "pass2", "1000000002", "user2@example.com", new Address("City2", "District2", "Ward2", "2 Road B"), 1),
    new Customer("user3", "pass3", "1000000003", "user3@example.com", new Address("City3", "District3", "Ward3", "3 Road C"), 1),
    new Customer("user4", "pass4", "1000000004", "user4@example.com", new Address("City4", "District4", "Ward4", "4 Road D"), 1),
    new Customer("user5", "pass5", "1000000005", "user5@example.com", new Address("City5", "District5", "Ward5", "5 Road E"), 1),
    new Customer("user6", "pass6", "1000000006", "user6@example.com", new Address("City6", "District6", "Ward6", "6 Road F"), 1),
    new Customer("user7", "pass7", "1000000007", "user7@example.com", new Address("City7", "District7", "Ward7", "7 Road G"), 1),
    new Customer("user8", "pass8", "1000000008", "user8@example.com", new Address("City8", "District8", "Ward8", "8 Road H"), 1),
    new Customer("user9", "pass9", "1000000009", "user9@example.com", new Address("City9", "District9", "Ward9", "9 Road I"), 1),
    new Customer("user10", "pass10", "1000000010", "user10@example.com", new Address("City10", "District10", "Ward10", "10 Road J"), 1),
    new Customer("user11", "pass11", "1000000011", "user11@example.com", new Address("City11", "District11", "Ward11", "11 Road K"), 1),
    new Customer("user12", "pass12", "1000000012", "user12@example.com", new Address("City12", "District12", "Ward12", "12 Road L"), 1),
    new Customer("user13", "pass13", "1000000013", "user13@example.com", new Address("City13", "District13", "Ward13", "13 Road M"), 1),
    new Customer("user14", "pass14", "1000000014", "user14@example.com", new Address("City14", "District14", "Ward14", "14 Road N"), 1),
    new Customer("user15", "pass15", "1000000015", "user15@example.com", new Address("City15", "District15", "Ward15", "15 Road O"), 1),
    new Customer("user16", "pass16", "1000000016", "user16@example.com", new Address("City16", "District16", "Ward16", "16 Road P"), 1),
    new Customer("user17", "pass17", "1000000017", "user17@example.com", new Address("City17", "District17", "Ward17", "17 Road Q"), 1),
    new Customer("user18", "pass18", "1000000018", "user18@example.com", new Address("City18", "District18", "Ward18", "18 Road R"), 1),
    new Customer("user19", "pass19", "1000000019", "user19@example.com", new Address("City19", "District19", "Ward19", "19 Road S"), 1),
    new Customer("user20", "pass20", "1000000020", "user20@example.com", new Address("City20", "District20", "Ward20", "20 Road T"), 1),
    new Customer("user21", "pass21", "1000000021", "user21@example.com", new Address("City21", "District21", "Ward21", "21 Road U"), 1),
    new Customer("user22", "pass22", "1000000022", "user22@example.com", new Address("City22", "District22", "Ward22", "22 Road V"), 1),
    new Customer("user23", "pass23", "1000000023", "user23@example.com", new Address("City23", "District23", "Ward23", "23 Road W"), 1),
    new Customer("user24", "pass24", "1000000024", "user24@example.com", new Address("City24", "District24", "Ward24", "24 Road X"), 1),
    new Customer("user25", "pass25", "1000000025", "user25@example.com", new Address("City25", "District25", "Ward25", "25 Road Y"), 1),
    new Customer("user26", "pass26", "1000000026", "user26@example.com", new Address("City26", "District26", "Ward26", "26 Road Z"), 1),
    new Customer("user27", "pass27", "1000000027", "user27@example.com", new Address("City27", "District27", "Ward27", "27 Road A"), 1),
    new Customer("user28", "pass28", "1000000028", "user28@example.com", new Address("City28", "District28", "Ward28", "28 Road B"), 1),
    new Customer("user29", "pass29", "1000000029", "user29@example.com", new Address("City29", "District29", "Ward29", "29 Road C"), 1),
    new Customer("user30", "pass30", "1000000030", "user30@example.com", new Address("City30", "District30", "Ward30", "30 Road D"), 1),
    new Customer("user31", "pass31", "1000000031", "user31@example.com", new Address("City31", "District31", "Ward31", "31 Road E"), 1),
    new Customer("user32", "pass32", "1000000032", "user32@example.com", new Address("City32", "District32", "Ward32", "32 Road F"), 1),
    new Customer("user33", "pass33", "1000000033", "user33@example.com", new Address("City33", "District33", "Ward33", "33 Road G"), 1),
    new Customer("user34", "pass34", "1000000034", "user34@example.com", new Address("City34", "District34", "Ward34", "34 Road H"), 1),
    new Customer("user35", "pass35", "1000000035", "user35@example.com", new Address("City35", "District35", "Ward35", "35 Road I"), 1),
    new Customer("user36", "pass36", "1000000036", "user36@example.com", new Address("City36", "District36", "Ward36", "36 Road J"), 1),
    new Customer("user37", "pass37", "1000000037", "user37@example.com", new Address("City37", "District37", "Ward37", "37 Road K"), 1),
    new Customer("user38", "pass38", "1000000038", "user38@example.com", new Address("City38", "District38", "Ward38", "38 Road L"), 1),
    new Customer("user39", "pass39", "1000000039", "user39@example.com", new Address("City39", "District39", "Ward39", "39 Road M"), 1),
    new Customer("user40", "pass40", "1000000040", "user40@example.com", new Address("City40", "District40", "Ward40", "40 Road N"), 1)
  ];
// Load mảng lên từ localStorage
export let customerArray = JSON.parse(localStorage.getItem('AllCustomerArray'));
// console.log(customerArray);
// Nếu customerArray chưa được tạo:
if(!customerArray){
    customerArray = [];
    console.log(customerArray);
    
}

// Lưu mảng vào localStorage:
export function saveCustomerArrayToStorage(){
    localStorage.setItem('customerArray', JSON.stringify(customerArray));
    console.log('Saved customerArray to localStorage');
}

/** ----- USER ----- */
// Kiểm tra trong mảng customer đã có tồn tại username ?
// Có: return true
// Không: return false
export function checkExistedUsername(username) {
    // !!! forEach: duyệt từ đầu đến cuối mảng không dừng với return.
    // some: dừng lại vòng lặp ngay khi tìm thấy username tương ứng.
    return customerArray.some((customer) => {
        if (username === customer.username) {

            console.log('Exised: pass user: ' + username);
            return true; // Đã tồn tại
        }
        return false;
    });
}

// Kiểm tra đăng nhập đúng:
// false: username không tồn tại hoặc mật khẩu không đúng.
// true: hợp lệ
export function checkValidAccount(username, password){
    const matchingCustomer = customerArray.find(customer => customer.username === username);
    if(!matchingCustomer || matchingCustomer.password !== password){
        return false;
    }    
    return true;
}

// Thêm new customer vào Array
// Chỉ cần truyền username, password (khi customer mới đăng kí)
export function addCustomerToArray(username, password, phone = '', email = '', address = '', status = 1){
    const customer = new Customer(username, password);
    customerArray.push(customer);
    console.log('Added customer to customerArray');

    // Lưu thay đổi vào localStorage:
    saveCustomerArrayToStorage();
}
