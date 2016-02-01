# 全屏滚动控件 fullslide


本插件主要适用于 手机端 滑动翻页专题、焦点图

## 要求 HTML 结构
```html
...
<body>
    <div class="full-body" id="box">
        <div class="full-cnt"><!-- 屏幕1内容 --></div>
        <div class="full-cnt"><!-- 屏幕2内容 --></div>
        <div class="full-cnt"><!-- 屏幕3内容 --></div>
    </div>
    ...
</body>
```



## 使用方法
```javascript
var ctrl = fullslide('#box', {
    currentClass: 'full-cnt-cur',
    ready: function(){
        this.className += ' full-body-ready';

        var loadingElm = document.getElementById('loading');
        loadingElm.className += ' full-loading-hide';
    },
    onerror: function(){
        alert('sorry， 你的浏览器并不适合人类使用');
    },
    onchange: function(index){
        alert('is slide to ' + index + ' page!');
    }
});
```


## 参数说明
```javascript
/**
 * @param  {String|Object} target  需要进行全屏滚动的对象
 * @param  {Object}        options 参数设置
 *                         - currentClass    [String]      设置切换屏幕时选中的样式, 
 *                                                         默认为 current
 *
 *                         - transition      [Number]      设置组件动画的时间间隔， 单位是 ms；
 *                                                         默认为 500
 *
 *                         - onchange(index) [function]    设置切换屏幕时触发的函数
 *                           ~ index         [Number]      选中的序号, this 指向 当前选中的屏幕标签
 *
 *                         - onerror(msg)    [function]    设置组件出错时回调的函数
 *                           ~ msg           [String]      错误信息
 *
 *                         - ready()         [function]    设置组件初始化后回调的函数
 *
 *                         - fullpage        [Boolean]     是否布满整页面
 *                                                         默认为 true
 *
 *                         - loop            [Boolean]     是否循环滚动
 *                                                         默认为 false
 *
 *                         - auto            [Number]      自动切换频率，单位是 ms， 0则不自动切换
 *                                                         默认为 0
 *
 *                         - direction       [String]      滚动方向 x|y
 *                                                         默认为 y
 *
 *
 * @return {Object}        iFulls  方法句柄
 *                         - current   [Number]  获取 or 设置当前选中的屏幕序号
 *                         - target    [Object]  组件初始化的目标对象
 *                         - items     [Array]   组件的内的屏幕集合
 *                         - isSupport [Boolean] 当前 浏览器是否支持 本组件
 *
 */
fullslide(target, option);
```

## 更新记录
> 1.1.1
> * [FIX] 修复横向滑动添加跳转地址没反应问题

> 1.1.0
> * [ADD] 支持 横向、纵向滚动
> * [ADD] 新增 options.fullpage 属性
> * [ADD] 新增 options.loop 属性
> * [ADD] 新增 options.direction 属性
> * [ADD] 新增 options.auto 属性
> 1.0.0
> * [ADD] 支持 纵向滚动

## 例子
* [例子一 基本](examples/demo.html)
* [例子二 焦点图](examples/demo2.html)
* [例子三 滚动专题](examples/demo3.html)
