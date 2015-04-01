


(function (window) {
    //添加事件的方法通用所有
    function addevent(evetname, fn, obj) {
        if (document.attachEvent) {  //ie9一下
            obj.attachEvent("on" + evetname, function () {
                fn.call(obj);
            });
        }
        else {
            obj.addEventListener(evetname, fn, false);


        }
    }

    //通过类名获得元素
    function getbyglass(classname, oparent) {

        var ss = [];
        if (!oparent) {
            oparent = document;
        }

        var elements = oparent.getElementsByTagName("*");

        if (document.getElementsByClassName) {

            ss = oparent.getElementsByClassName(classname);

        } else {
            for (var i = 0; i < elements.length; i++) {
                var obj = elements[i];
                if (obj.className == classname) {

                    ss.push(obj);
                }
            }
        }
        return ss;
    }

    //得到元素的当前某个样式
    function getStyle(element, stylename) {



        if (element.currentStyle) {

            return element.currentStyle[stylename];//ie下独有   不兼容部分

        } else {

            return window.getComputedStyle(element, false)[stylename];
        }


    }

    //得到当前元素的绝对据上边距离 据下边距离
    function getOffset(element) {


        var x = element.offsetLeft;
        var y = element.offsetTop;
        if (element.parentElement != null) {
            x += element.parentElement.offsetLeft;
            y += element.parentElement.offsetTop;
            element = element.parentElement;
        }
        return { x: x, y: y };
    }

    //构造函数
    function DpQuery(context) {


        return new DpQuery.prototype.inint(context);


    }

    DpQuery.prototype.inint = function (context) {
        this.elements = [];//返回值

        var type = typeof context;

        if (type == 'function') {
            addevent('load', context, window);
        } else if (type == 'string') {

            var starts = context.substr(0, 1);//跳过0个去一个

            var svalue = context.substr(1);//跳过一个取所有

            switch (starts) {
                case "#":
                    this.elements.push(document.getElementById(svalue));
                    break;
                case ".":
                    this.elements = getbyglass(svalue);
                    break;
                default:
                    this.elements = document.getElementsByTagName(context);
                    break;

            }

            //return this.elements;
        } else if (type == 'object') {
            this.elements.push(context);
        }
    }

    DpQuery.prototype.inint.prototype = DpQuery.prototype;

    //原型  遍历元素
    DpQuery.prototype.each = function (fn) {

        for (var i = 0; i < this.elements.length; i++) {
            fn(i, this.elements[i]);
        }
    }

    //点击事件
    DpQuery.prototype.click = function (fn) {

        this.each(function (i, ele) {
            addevent('click', fn, ele);
        });
        return this;
    }

    //鼠标按下事件
    DpQuery.prototype.mousedown = function (fn) {
        this.each(function (i, ele) {
            addevent('mousedown', fn, ele);
        });
        return this;
    }

    //鼠标移动事件
    DpQuery.prototype.mousemove = function (fn) {
        this.each(function (i, ele) {
            addevent('mousemove', fn, ele);
        });
        return this;
    }

    //鼠标抬起事件
    DpQuery.prototype.mouseup = function (fn) {
        this.each(function (i, ele) {
            addevent('mouseup', fn, ele);
        });

        return this;
    }

    //鼠标滑上 滑出
    DpQuery.prototype.hover = function (fnover, fnout) {
        this.each(function (i, ele) {
            addevent('mouseover', fnover, ele);
            if (fnout) {
                addevent('mouseout', fnout, ele);
            }
        });
        return this;
    }

    //轮流切换
    DpQuery.prototype.toogage = function () {

        var _arguments = arguments;


        this.each(function (i, ele) {
            addevent('click', (function () {
                var count = 0;
                return function () {
                    _arguments[count % arguments.length]();
                    count++;
                }
            })(), ele);
        });
    }

    //获取元素样式或者设置元素样式
    DpQuery.prototype.css = function (stylename, stylevalue) {
        if (arguments.length == 2) {
            this.each(function (i, ele) {
                ele.style[stylename] = stylevalue;
            });
        } else {
            return getStyle(this.elements[0], stylename);
        }
    }

    //获取或设置属性
    DpQuery.prototype.attr = function (attrname, attrvalue) {
        if (attrvalue) {
            this.each(function (i, ele) {


                ele.setAttribute(attrname, attrvalue);
            });
        } else {

            return this.elements[0].getAttribute(attrname);

        }
    }
    //高
    DpQuery.prototype.Height = function (value) {

        if (value) {
            this.each(function (i, ele) {
                ele.style.Height = value + "px";
            });
        } else {
            return getStyle(this.elements[0], "height");
        }
    }

    //宽
    DpQuery.prototype.Width = function (value) {

        if (value) {
            this.each(function (i, ele) {
                ele.style.width = value + "px";
            });
        } else {
            return getStyle(this.elements[0], "width");
        }
    }

    //距左边距离
    DpQuery.prototype.left = function (value) {
        if (!value) {
            return getOffset(this.elements[0]).x;
        } else {
            this.elements[0].style.left = value + "px";
            return this;
        }

    }

    //距上边距离
    DpQuery.prototype.top = function (value) {
        if (!value) {
            return getOffset(this.elements[0]).y;
        } else {
            this.elements[0].style.top = value + "px";
            return this;
        }

    }

    //拖拽
    DpQuery.prototype.drag = function () {

        this.each(function (i, ele) {
            $(ele).mousedown(function (e) {
                ele.style.position = "absolute";
                ele.style["cursor"] = "pointer";

                var event = e || event;

                var disx = event.clientX - $(ele).left();

                var disy = event.clientY - $(ele).top();

                document.onmousemove = function (e) {
                    var event = e || event;
                    $(ele).left(event.clientX - disx);
                    $(ele).top(event.clientY - disy);
                };

                document.onmouseup = function () {

                    document.onmousemove = null;

                    document.onmouseup = null;
                }

                return false;
            });
        });

        return this;
    }

     

  DpQuery.setCookie= function (name, value, time) {
        var strsec = this.getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec * 1);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
  
  DpQuery.getsec= function(str) {
        
        var str1 = str.substring(1, str.length) * 1;
        var str2 = str.substring(0, 1);
        if (str2 == "s") {
            return str1 * 1000;
        }
        else if (str2 == "h") {
            return str1 * 60 * 60 * 1000;
        }
        else if (str2 == "d") {
            return str1 * 24 * 60 * 60 * 1000;
        }
    }
    
  DpQuery.getCookie= function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg))

            return unescape(arr[2]);
        else
            return null;
    }
 
  	
  	 for(var i in obj){
  	     
  	 	this[i]=obj[i];
  	 }
  };
  
    window.DpQuery = window.$ = DpQuery;



})(window);
