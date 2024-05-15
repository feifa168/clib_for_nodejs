#include <stdio.h>


int add2(int a, int b) {
    printf("++++%d + %d = %d\n", a, b, a+b);
    return a + b + 10;
}

int sub2(int a, int b) {
    return a - b;
}

void test_int_short_return_void(int a, short b) {
    printf("---a is %d, b is %d\n", a, b);
}
