/**
 * Copyright 2016, jackness.org
 * Creator: Jackness Lau
 * $Author: Jackness Lau $
 * $Date: 2016.01.17 $
 * $Version: 1.1.0 $
 */
(function( global, factory ){
    if ( typeof module === "object" && typeof module.exports === "object" ) {
	
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "fullslide requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

})(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

var document = window.document;

var UA = {
    ie:(!!window.ActiveXObject && /msie (\d*)/i.test(navigator.userAgent) ? RegExp.$1 : false)
};

var $ = window.$ || function(source){
    if(typeof source == 'object' && source.nodeType == 1){
        return source;
        
    } else if(typeof source == 'string'){
        return document.querySelectorAll(source);

    } else {
        return [];
    }
};
var fn = {
    getCssProperty:function(cssProperty){
		var firstLetter = cssProperty.substr(0,1),
	        otherStrs = cssProperty.substr(1),
	        fUpperStrs = firstLetter.toUpperCase() + otherStrs,
	        fLowerStrs = firstLetter.toLowerCase() + otherStrs,
	        privateAttrs = [
	            fLowerStrs,
	            "Webkit" + fUpperStrs,
	            "Moz" + fUpperStrs,
	            "O" + fUpperStrs,
	            "-ms-" + fUpperStrs,
	            "ms" + fUpperStrs
	        ],
	        style = document.documentElement.style;
	    for(var i = 0, len = privateAttrs.length; i < len; i++){
	        var fCssAttr = privateAttrs[i];
	        if(fCssAttr in style){
	            return fCssAttr;
	        }
	    }
	    return null;
	},
    /**
     * 判断对象类别
     * @param {Anything} 对象
     * @return {string}  类型
     */
    type: function (obj) {
        var type,
            toString = Object.prototype.toString;
        if (obj == null) {
            type = String(obj);
        } else {
            type = toString.call(obj).toLowerCase();
            type = type.substring(8, type.length - 1);
        }
        return type;
    },

    isPlainObject: function (obj) {
        var she = this,
            key,
            hasOwn = Object.prototype.hasOwnProperty;

        if (!obj || she.type(obj) !== 'object') {
            return false;
        }

        if (obj.constructor &&
            !hasOwn.call(obj, 'constructor') &&
            !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
            return false;
        }

        for (key in obj) {}
        return key === undefined || hasOwn.call(obj, key);
    },

    /**
     * 扩展方法(来自 jQuery)
     * extend([deep,] target, obj1 [, objN])
     * @base she.isPlainObject
     */
    extend: function () {
        var she = this,
            options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== 'object' && she.type(target) !== 'function') {
            target = {};
        }

        // extend caller itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i<length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (she.isPlainObject(copy) || (copyIsArray = she.type(copy) === 'array'))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && she.type(src) === 'array' ? src : [];
                        } else {
                            clone = src && she.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = she.extend(deep, clone, copy);

                    // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    },

    makeArray: function(obj){
        return Array.prototype.slice.call(obj);
    },

    setTranslate: function(direct, val){
        var iVal = direct == 'x'
                ? val + ',0,0'
                : '0,'+ val +',0'
                ;
        
        return 'translate3d('+ iVal +')';
    }
};
var transformPrep = fn.getCssProperty('transform');
var transitionPrep = fn.getCssProperty('transition');

// + config
var 
    options = {
        // 当前子元素选中状态 className
        currentClass: 'current',
        // 滚动页面时触发的事件
        onchange: function(index){},
        // 当控件不支持时触发的事件
        onerror: function(msg){
            throw new Error(msg);
        },
        // 控件初始化完成后 触发的事件
        ready: function(){},
        // 滚动动画 过度事件
        transition: 500,

        // 是否布满整页面
        fullpage: true,
        // 是否循环
        loop: false,
        // 滚动方向
        direction: 'y',
        // 自动轮播
        auto: false
    };
// - config
// + attributes
var 
    attributes = {
        translateM: 0,
        nowTranslateM: 0,
        target: undefined,
        items: [],
        key: {
            // sort for position
            pos: '',
            // sort for direction
            dir: '',
            // width or height
            wh: ''
        },
        isSupport: !UA.ie || UA.ie > 9,
        __data: {
            current: 0,
            itemWh: 0
        }
    };
// - attributes

var fullslide = function(target, op){
    return new fullslide.fn.init(target, op);
};

fullslide.fn = fullslide.prototype = {
    // 循环
    auto: {
        init: function(she){
            var o = she.options,
                self = this;

            self.clear(she);

            she.autoKey = setInterval(function(){
                she.current += 1;
            }, o.auto);
            
        },
        clear: function(she){
            var o = she.options;
            clearInterval(she.autoKey);

        }
    },
    
    slide: function(){
        var she = this,
            o = she.options;

        var current = she.current,
            tarItemWh = she.__data.itemWh,
            tar = she.target,
            tarItems = she.items,
            translateM = -current * tarItemWh / 100 * tar['offset' + she.key.wh2],
            iVal;

        tar.style[transitionPrep] = 'none';
        if(o.loop){
            var 
                nowCurrent = Math.floor((-she.nowTranslateM) / tarItems[0]['offset' + she.key.wh2]),
                limitCurrent = she.items.length - 1;
            
            // 0 - n
            if(nowCurrent <= 0 && current == limitCurrent){
                tar.style[transformPrep] = fn.setTranslate(o.direction, she.nowTranslateM - (tarItems[0]['offset' + she.key.wh2] * tarItems.length) + 'px');
            }

            // n - 0
            if(nowCurrent == limitCurrent && current == 0){
                tar.style[transformPrep] = fn.setTranslate(o.direction, she.nowTranslateM + (tarItems[0]['offset' + she.key.wh2] * tarItems.length) + 'px');
            }
        }

        setTimeout(function(){
            tar.style[transitionPrep] = she.options.transition +'ms';
            tar.style[transformPrep] = fn.setTranslate(o.direction, translateM + 'px');
        }, 20);

        she.nowTranslateM = she.translateM = translateM;
        she.options.onchange.call(she.items[current], current);
        
        var currentClass = she.options.currentClass,
            classReg = new RegExp('\\s*' + currentClass + '\\s*', 'g');

        for(var i = 0, myItem, len = tarItems.length; i < len; i++){
            myItem = tarItems[i];
            i == current? (
                !~myItem.className.indexOf(currentClass) && (myItem.className += ' ' + currentClass)
            ):(
                myItem.className = myItem.className.replace(classReg, ' ')
            );
        }
    }

};

Object.defineProperty 
&& Object.defineProperty(fullslide.fn, 'current', {
    configurable: true,
    enumerable: true,
    get: function(){
        return this.__data.current;
    },

    set: function(current){
        var she = this,
            o = she.options;
        if(!isNaN(current)){
            if(o.loop){
                current >= she.items.length && (current = 0);
                current < 0 && (current = she.items.length - 1);

            } else {
                current >= she.items.length && (current = she.items.length - 1);
                current < 0 && (current = 0);

            }
            
            she.__data.current = current;
            this.slide();
        }
    }
});

var init = fullslide.fn.init = function(target, op){
    var 
        she = this,
        tar = $(target)[0],
        o = she.options = fn.extend({}, options, op);

    fn.extend(she, attributes);

    if(!she.isSupport){
        o.onerror('your browser is not supported this widget');

    }
    if(!tar){
        o.onerror('fullslide: ' + target + ' is not defined');
        return;
    }

    if(tar.getAttribute('data-fullslide-init') == 'true'){
        return;
    }


    if(o.direction == 'x'){
        she.key.pos = 'left';
        she.key.dir = 'x';
        she.key.wh = 'width';
        she.key.nwh = 'height';
    } else {
        she.key.pos = 'top';
        she.key.dir = 'y';
        she.key.wh = 'height';
        she.key.nwh = 'width';
    }

    she.key.pos2 = she.key.pos.charAt(0).toUpperCase() + she.key.pos.substr(1);
    she.key.dir2 = she.key.dir.toUpperCase();
    she.key.wh2 = she.key.wh.charAt(0).toUpperCase() + she.key.wh.substr(1);
    she.key.nwh2 = she.key.nwh.charAt(0).toUpperCase() + she.key.nwh.substr(1);

    // 页面初始化
    var 
        domHtml = document.getElementsByTagName('html')[0],
        domBody = document.body,
        domOutset,
        tarItems = fn.makeArray(tar.children),
        tarItemsCount,
        tarItemWh;

    if(o.loop){
        tarItemsCount = tarItems.length + 2;
    } else {
        tarItemsCount = tarItems.length;
    }

    tarItemWh = Math.ceil(100 / tarItemsCount * 1000) / 1000;

    if(o.fullpage){
        domHtml.style.height = '100%';
        domBody.style.height = '100%';
        domBody.style.overflow = 'hidden';
        domHtml.style.overflow = 'hidden';
        tar.style[she.key.nwh] = '100%';

    } else {
        domOutset = tar.parentNode;
        if(!domOutset){
            o.onerror('option.fullpage must setle: true|dom selector');
            return;

        }
        // domOutset.style[she.key.wh] = '100%';

        tar.style[she.key.nwh] = '100%';
        domOutset.style['overflow' + she.key.dir2] = 'hidden';

    }

    tar.style[she.key.wh] = 100 * tarItemsCount +  '%';


    tarItems.forEach(function(item, i){
        item.style[she.key.wh] = tarItemWh + '%';
        item.style[she.key.nwh] = '100%';
        if(o.direction == 'x'){
            item.style.float = 'left';
        }
        
    });
    if(o.loop){
        var iClone = tarItems[tarItems.length - 1].cloneNode(true),
            iVal;

        tar.appendChild(tarItems[0].cloneNode(true));
        tar.appendChild(iClone);
        iClone.style[transformPrep] = fn.setTranslate(o.direction, -(tarItemsCount * 100) + '%');
    }
    

    var touch = {
        translateM: 0,
        posM: 0,
        start: function(e){
            she.nowTranslateM = touch.translateM = she.translateM;
            touch.posM = e.touches[0]['page' + she.key.dir2] - she.translateM;

            document.addEventListener('touchmove', touch.move, false);
            document.addEventListener('touchend', touch.end, false);

            tar.style[transitionPrep] = '';

            e.preventDefault && e.preventDefault();
            e.returnValue = false;
            o.auto && she.auto.clear(she);
        },

        move: function(e){
            e = e || window.event;
            she.nowTranslateM = touch.translateM = e.touches[0]['page' + she.key.dir2] - touch.posM;

            tar.style[transformPrep] = fn.setTranslate(o.direction, touch.translateM + 'px');
            
            e.preventDefault && e.preventDefault();
            e.returnValue = false;
        },

        end: function(){
            // she.translateY = touch.translateY;
            var distance = she.translateM - touch.translateM;

            
            // 无效操作
            if(Math.abs(distance) < 10){ 

            // 上滑
            } else if( distance < 0){
                she.current -= 1;
            
            // 下滑
            } else {
                she.current += 1;
            }

            // she.fn.pageTo(current);
            document.removeEventListener('touchmove', touch.move);
            document.removeEventListener('touchend', touch.end);
            o.auto && she.auto.init(she);
        }
    }
    tar.addEventListener('touchstart', touch.start, false);
    
    tar.setAttribute('data-fullslide-init', 'true');
    
    she.target = tar;
    she.items = tarItems;
    she.__data.itemWh = tarItemWh;

    //初始化完成
    o.ready.call(tar);

    o.auto && she.auto.init(she);
    o.onchange(she.current);
    
    return she;
};

init.prototype = fullslide.fn;


if ( typeof define === "function" && define.amd ) {
	define([], function() {
		return fullslide;
	});
}

if ( typeof noGlobal === 'undefined' ) {
	window.fullslide = fullslide;
}

});
