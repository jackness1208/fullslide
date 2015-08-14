# 全屏滚动控件 fullslide


本插件主要适用于 手机端 全屏滚动的专题

## 要求 HTML 结构
    ...
    <body>
        <div class="full-body" id="box">
            <div class="full-cnt"><!-- 屏幕1内容 --></div>
            <div class="full-cnt"><!-- 屏幕2内容 --></div>
            <div class="full-cnt"><!-- 屏幕3内容 --></div>
        </div>
        ...
    </body>


## 使用方法
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

## 参数说明
    fullslide(target, option);

|参数|类型|说明|
|----|----|----|
|target|{String &verbar; Object}| 需要进行全屏滚动的对象|
|option|{Object}| 参数设置|

### option 参数说明

|参数|类型|说明|
|----|----|----|
|currentClass|{String}|设置切换屏幕时选中的样式，\n默认为 current|
|onchange(index)|{function}|设置切换屏幕时触发的函数； index - 选中的序号, this 指向 当前选中的屏幕标签|
|onerror(msg)|{function}|设置组件出错时回调的函数； msg - 错误信息|
|ready()|{function}|设置组件初始化后回调的函数|
|transition|{Int}|设置组件动画的时间间隔， 单位是 ms；默认为 500ms|

## 返回方法

|参数|类型|说明|
|----|----|----|
|current|{int}|当前选中的屏幕序号|
|target|{object}|组件初始化的目标对象|
|items|{Array}|组件的内的屏幕集合|
|isSupport|{boolean}|当前 浏览器是否支持 本组件|
|pageTo(current)|{function}|设置翻页到第几个屏幕|

## 例子
* [例子一](examples/demo.html)
* [例子二](examples/demo2.html)
