# clib_for_nodejs

用于为nodejs提供c库的演示例子，使用ffi-napi

## 结构说明

```powershell
.
|   cfun.c
|   cfun.h
|   cfun.js
|   CMakeLists.txt
|   README.md
|
\---bin
    \---lib
            libcfun.so
```


## 步骤

### 编译c库

#### 导出函数

```shell
#ifndef __cplusplus
extern "C" {
#endif

int sub2(int a, int b);
int add2(int a, int b);
void test_int_short_return_void(int a, short b);

#ifndef __cplusplus
}
#endif
```

#### 生成动态库

执行cmake编译生成so库到指定的目录 bin/lib/

```shell
/usr/local/bin/cmake --no-warn-unused-cli -DCMAKE_BUILD_TYPE:STRING=Release -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=TRUE -DCMAKE_C_COMPILER:FILEPATH=/usr/bin/gcc -DCMAKE_CXX_COMPILER:FILEPATH=/usr/bin/g++ -S/home/test/workspace/nodejs/cfun -B/home/test/workspace/nodejs/cfun/build -G Ninja

/usr/local/bin/cmake --build /home/test/workspace/nodejs/cfun/build --config Release --target all --
```

### nodejs中使用C库

#### nodejs安装依赖模块

```shell
安装ffi-napi
npm i -g ffi-napi

安装完成后查看安装结果
test@test-virtual-machine:~/workspace/nodejs$ npm ls -g
/home/test/.nvm/versions/node/v20.12.2/lib
├── bindings@1.5.0
├── cnpm@9.4.0
├── corepack@0.25.2
├── electron-rebuild@3.2.9
├── electron@30.0.0
├── ffi-napi@4.0.3
├── node-addon-api@8.0.0
├── node-gyp@10.1.0
├── npm@10.5.0
├── ref-napi@3.0.3
└── spi-device@3.1.2

```

#### 引入依赖库

由于默认不包含全局安装的路径，所以这里需要增加模块的查找路径，否则找不到ffi-napi

```shell
module.paths.push('/home/test/.nvm/versions/node/v20.12.2/lib/node_modules/')
const ffi = require('ffi-napi')
const ref = require('ref-napi')
```

#### 加载动态库和函数

```shell
// 加载动态库
var libPath = path.join(__dirname, 'bin/lib/libcfun.so');
var lib = ffi.Library(libPath,  {
    'add2': ['int', ['int', 'int']],
    'sub2': ['int', ['int', 'int']],
    'test_int_short_return_void': ['void', ['int', 'short']],
});
```

#### 调用函数

##### 函数签名方式

```shell
// 函数签名 
var addFunc = lib.add2;
addFunc.async = false;
addFunc.ret = ref.types.int;

// 调用函数
var result = addFunc(1, 2);  
console.log(result); // Prints 3
```

##### 同步调用

```shell
console.log("sub(4,3) = " + lib.sub2(4, 3));
```

##### 异步调用

```shell
lib.sub2.async(5, 3, (err, result) => {
    console.log("sub(5,3) err is " + err + ", result is " + result);
})
```
