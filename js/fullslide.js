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
	}
};
var transformPrep = fn.getCssProperty('transform');
var transitionPrep = fn.getCssProperty('transition');





var fullslide = function(target, op){
    return new fullslide.fn.init(target, op);
};

// 值初始化
fullslide.current = 0;
fullslide.translateY = 0;
fullslide.target = undefined;
fullslide.items = [];
fullslide.itemHeight = 0;
fullslide.isSupport = !UA.ie || UA.ie > 9;
fullslide.pageTo = function(current){
    var she = fullslide,
        tarItems = she.items,
        tarItemHeight = she.itemHeight,
        tar = she.target;

    current >= tarItems.length && (current = tarItems.length - 1);
    current < 0 && (current = 0);
    
    var translateY = -current * tarItemHeight / 100 * tar.offsetHeight;


    tar.style[transitionPrep] = she.options.transition +'ms';
    tar.style[transformPrep] = 'translate3d(0,'+ translateY +'px,0)';
    she.translateY = translateY;
    she.current = current;
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
};

// config
fullslide.options = {
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
    transition: 500
};

fullslide.fn = fullslide.prototype = {
    init: function(target, op){
        var she = fullslide;
        var tar = $(target)[0];

        if(!she.isSupport){
            she.options.onerror('your browser is not supported this widget');
        }
        if(!tar){
            she.options.onerror('fullslide: ' + target + ' is not defined');
            return;
        }

        if(tar.getAttribute('data-fullslide-init') == 'true'){
            return;
        }
        she.fn.setOption(op);

        // 页面初始化
        var domHtml = document.getElementsByTagName('html')[0],
            domBody = document.body,
            tarItems = tar.children,
            tarItemHeight = Math.ceil(100 / tarItems.length * 1000) / 1000;
        domHtml.style.height = '100%';
        domBody.style.height = '100%';
        domBody.style.overflow = 'hidden';
        domHtml.style.overflow = 'hidden';
        tar.style.height = 100 * tarItems.length +  '%';
        


        for(var i = 0, len = tarItems.length; i < len; i++){
            tarItems[i].style.height = tarItemHeight + '%';
        }
        
        
        
        var touch = {
            translateY: 0,
            posY: 0,
            start: function(e){
                touch.translateY = she.translateY;
                touch.posY = e.touches[0].pageY - she.translateY;

                document.addEventListener('touchmove', touch.move, false);
                document.addEventListener('touchend', touch.end, false);

                tar.style[transitionPrep] = '';

                e.preventDefault && e.preventDefault();
                e.returnValue = false;
            },

            move: function(e){
                e = e || window.event;
                touch.translateY = e.touches[0].pageY - touch.posY;
                
                tar.style[transformPrep] = 'translate3d(0,'+ touch.translateY +'px,0)';
                
                e.preventDefault && e.preventDefault();
                e.returnValue = false;
            },

            end: function(){
                // she.translateY = touch.translateY;
                var distance = she.translateY - touch.translateY,
                    current = she.current,
                    translateY;
                
                // 无效操作
                if(Math.abs(distance) < 10){ 

                // 上滑
                } else if( distance < 0){
                    current -= 1;
                
                // 下滑
                } else {
                    current += 1;
                }

                she.pageTo(current);

                document.removeEventListener('touchmove', touch.move);
                document.removeEventListener('touchend', touch.end);
            }
        }
        tar.addEventListener('touchstart', touch.start, false);
        
        tar.setAttribute('data-fullslide-init', 'true');
        
        she.target = tar;
        she.items = tarItems;
        she.itemHeight = tarItemHeight;

        //初始化完成
        she.options.ready.call(tar);
        return she;
    },
    // set options
    setOption : function(op){
        she = fullslide;
        op = op || {};

        op.currentClass && (she.options.currentClass = op.currentClass);
        typeof op.onchange == 'function' && (she.options.onchange = op.onchange);
        typeof op.ready == 'function' && (she.options.ready = op.ready);
        typeof op.onerror == 'function' && (she.options.onerror = op.onerror);
        !isNaN(op.transition) && (she.options.transition = op.transition);
    },
    

};


if ( typeof define === "function" && define.amd ) {
	define( "fullslide", [], function() {
		return fullslide;
	});
}

if ( typeof noGlobal === 'undefined' ) {
	window.fullslide = fullslide;
}

});
