module.paths.push('/home/test/.nvm/versions/node/v20.12.2/lib/node_modules/')
const ffi = require('ffi-napi')
const ref = require('ref-napi')
const path = require('path');

// var libs = ffi.Library('add2')

console.log(__dirname)
// 加载动态库
var libPath = path.join(__dirname, 'bin/lib/libcfun.so');  // Windows
var lib = ffi.Library(libPath,  {
    'add2': ['int', ['int', 'int']],
    'sub2': ['int', ['int', 'int']],
    'test_int_short_return_void': ['void', ['int', 'short']],
});

// 函数签名 
var addFunc = lib.add2;
addFunc.async = false;
addFunc.ret = ref.types.int;

// 调用函数
var result = addFunc(1, 2);  
console.log(result); // Prints 3

console.log("sub(4,3) = " + lib.sub2(4, 3));
lib.sub2.async(5, 3, (err, result) => {
    console.log("sub(5,3) err is " + err + ", result is " + result);
})
var subFunc = lib.sub2;

lib.test_int_short_return_void(8, 2);
