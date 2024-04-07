#include <bits/stdc++.h>    // It include all library in C/C++
#include <iostream>


void getValue(long int arr[], int length) {
    for (int i = 0; i < length; i++) {
        std::cin >> arr[i];
    }
}

int main() {
    int n, q;
    std::cin >> n >> q;
    long int** indexArr = new long int*[n];

    int length;
    long int* ptrArr;
    for (int i = 0; i < q; i++) {
        std::cin >> length;
        ptrArr = new long int[length];
        getValue(ptrArr, length);
        // Save the address of the integer array in indexArr
        indexArr[i] = ptrArr;
    }

    int i;
    int j;
    // Create a pointer and convert the string to an actual address
    long int* indexPtr;
    for (int m = 0; m < q; m++) {
        std::cin >> i >> j;
        // Convert the string to an integer and assign it to indexPtr
        indexPtr = indexArr[i];

        std::cout << *(indexPtr + j) << std::endl;

    }

    // Free the memory for each integer array
    for(int m = 0; m < q; m++){
        delete[] indexArr[i];
    }
    // Free the memory for the array of pointers
    delete[] indexArr;

    return 0;
}
