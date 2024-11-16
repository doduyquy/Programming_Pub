/** CART ĐƯỢC LƯU RỜI RẠC, 
 * TRUY XUẤT THÔNG QUA USERNAME(of CUSTOMER)
 */
export class Cart {
    /* localStorageKey: username của customer tương ứng với cart */
    localStorageKey;        // private
    cartItem = [];          // mảng các products
    counterProducts;         // Tổng số lượng product trong Cart
    
    // Khởi tạo cart ban đầu: load lên từ localStorage
    constructor(localStorageKey){
        this.localStorageKey = localStorageKey;
        this.loadCartFromStorage();

    }

    // Private method
    loadCartFromStorage(){
        /** Get data for cart from localStorage:
         * Lấy cart JSON từ localStorage thông qua key
         * Parse -> array để lưu vào cartItem
         */ 
        // this.cartItem = JSON.parse(localStorage.getItem(this.localStorageKey));
        const localCart = JSON.parse(localStorage.getItem(this.localStorageKey));
        if(localCart){
            // Nếu localCart tồn tại, lấy giá trị từ đó.
            this.cartItem = localCart.cartItem || [];
            this.counterProducts = localCart.counterProducts || 0;
        } else {
            // Nếu ko tồn tại, thì lấy giá trị mặc định:
            this.cartItem = [];
            this.counterProducts = 0;
            console.log('Cart null');
        }

        console.log('Loaded cart of ' + this.localStorageKey);
        console.log('Counter products   : ' + this.counterProducts);
    }
    /** SAVE CART TO localStorage: 
     * Chuyển cartItem về string
     * Lưu vào localStorage
     */
    saveCartToStorage(){
        const cartData = {
            cartItem: this.cartItem,
            counterProducts: this.counterProducts,
        }
        localStorage.setItem(this.localStorageKey, JSON.stringify(cartData));
        // localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItem));

        console.log('Saved cart of ' + this.localStorageKey);
    }
    /** THÊM PRODUCT VÀO CART: tìm trong cart product cần thêm
     * Có: tăng quantity lên
     * Không: thêm product mới vào cart
     */
    addToCart(product){
        // Tìm product với productId và phiên bản tương ứng trong cart
        let matchingProduct;
        this.cartItem.forEach((item) => {
            if(item.productId === product.productId && item.pb === product.pb){
                console.log(item.pb);
                matchingProduct = item;
            }
        });
        // Có sản phẩm với productId và phiên bản tương ứng
        // thì tăng quantity, ngược lại: add
        if(matchingProduct){
            matchingProduct.quantity += product.quantity;
            // matchingProduct.quantity++;
            console.log('Product ' + matchingProduct.productId + ' existed, increase quantity.');
        } else {
            this.cartItem.push(
                product
                // {
                //     productId: product.productId,
                //     quantity: product.quantity,
                //     isPicked: false,
                //     //--------------
                //     brandId: product.brandId,
                //     img: product.img,
                //     name: product.name,
                //     pb: product.pb,
                //     price: product.price,
                //     chip: product.chips,
                //     pin: product.pin,
                //     size: product.size,
                //     f: product.f,
                // }
            );
            console.log('Added product ' + product.productId + ' to cart of ' + this.localStorageKey);
        }
        // Thay đổi counterProducts:
        this.counterProducts += product.quantity;
        // Cập nhật lại cart mới:
        this.saveCartToStorage();
    }
    // addToCart(productId){
    //     // Tìm product trong cart
    //     let matchingProduct;
    //     this.cartItem.forEach((item) => {
    //         if(item.productId === productId){
    //             matchingProduct = item;
    //         }
    //     });
    //     // Có thì tăng quantity, chưa có thì add
    //     if(matchingProduct){
    //         matchingProduct.quantity++;
    //     } else {
    //         this.cartItem.push(
    //             {
    //                 productId: productId,
    //                 quantity: 1,
    //                 isPicked: false,
    //             }
    //         );
    //     }
    //     console.log('Added product ' + productId + 'to cart of ' + this.localStorageKey);
    //     // Cập nhật lại cart mới:
    //     saveCartToStorage();
    // }
    // Xóa product trong cart
    removeFromCart(productId){
        const newCartItem = [];
        this.counterProducts = 0;
        this.cartItem.forEach((item) => {
            // Không phải product cần xóa thì thêm vào newCartItem
            if(productId !== item.productId){
                newCartItem.push(item);
                this.counterProducts += item.quantity;
            }
        });
        this.cartItem = newCartItem;

        console.log('Removed product with ID: ' + productId);
        this.saveCartToStorage();
    }

    /** Chọn các product để mua:
     * Arg: productId
     * Thay đổi trạng thái của isPicked -> true (được chọn)
     */
    markProductToPay(productId){
        this.cartItem.forEach((item) => {
            if(productId === item.productId){
                item.isPicked = true;
            }
        });
        // Lưu vào localStorage sau khi thay đổi:
        this.saveCartToStorage();
    }
}