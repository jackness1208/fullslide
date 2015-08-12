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

// 本插件只支持 ie 9+
if(UA.ie && UA.ie < 9){
    throw new Error('fullslide is not supported ie blow 9');
    return;
}


var fullslide = function(target, op){
    return new fullslide.fn.init(target, op);
};

// 值初始化
fullslide.current = 0;
fullslide.translateY = 0;

fullslide.fn = fullslide.prototype = {
    init: function(target, op){
        var she = fullslide;

        var tar = $(target)[0];
        if(!tar){
            throw new Error('fullslide: ' + target + ' is not defined');
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
        
        var transformPrep = fn.getCssProperty('transform');
        var transitionPrep = fn.getCssProperty('transition');
        
        tar.style[transitionPrep] = '0.2s easein';
        window.tar = tar;
        var touch = {
            translateY: 0,
            posY: 0,
            start: function(e){
                touch.translateY = she.translateY;
                touch.posY = e.touches[0].pageY;
                console.log('start', touch.posY)

                document.addEventListener('touchmove', touch.move, false);
                document.addEventListener('touchend', touch.end, false);
            },

            move: function(e){
                e = e || window.event;
                touch.translateY = touch.posY - e.touch[0].pageY;
                console.log('move', touch.translateY)
                tar.style[transitionPrep] = 'translate3d(0,'+ touch.translateY +'px,0)';
            },

            end: function(){
                console.log('end')
                she.translateY = touch.translateY;
                document.removeEventListener('touchmove', touch.move);
                document.removeEventListener('touchend', touch.end);
            }
        }
        tar.addEventListener('touchstart', touch.start, false);

    },
    // set options
    setOption : function(op){
        
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















if ( typeof define === "function" && define.amd ) {
	define( "fullslide", [], function() {
		return fullslide;
	});
}

if ( typeof noGlobal === 'undefined' ) {
	window.fullslide = fullslide;
}

});
