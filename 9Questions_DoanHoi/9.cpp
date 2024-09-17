// Cau hoi 9: Hay toi uu doan code sau. 
// Tra loi 1: i <= n/2
// Tra loi 2: i <= sqrt(n)       |  Uu tien cau tra loi nay hon.

bool isPrime(int num) {
    if (num <= 1) return false;
    for (int i = 2; i < num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

