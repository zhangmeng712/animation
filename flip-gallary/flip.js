/**
 * @fileOverView flip.js
 * depend zepto
 * later finish without zepto
 * @author zhangmeng on 15/1/25
 */

(function (win, lib) {
    var $ =  win['Zepto'] || win['$'];
    var EMPTY = ' ';
    var FlipCard = function (container, options) {
        if(!container) return null;
        if(options) options.container = container; //container会覆盖options内的container
        else options = typeof container == 'string' ? {'container' : container} : container;
        var defaultOptions = {
            spacing: 10, //用于表示两张图片上方的距离
            autoPlay: false //自动播放false 或者定时时间
        };
        $.extend(this,defaultOptions,options);
        this.init();

    };
    $.extend(FlipCard.prototype, {
        init: function () {
            this.el = $(this.container).find('ul');
            var total = this.el.find('li').length;
            this.scaleUnit = 0.5/total;
            this.opacityUnit = 1/total;
            $(this.container).addClass("fc-wrapper");
            $(this.container).append('<div class="fc-cap" style="opacity:0"></div>');
            this.arrangeCards();
            //设置自动播放
            if (this.autoPlay != 0 && this.autoPlay != false) {
                var that = this;
                var timer = setInterval(function() {
                    that.flipNext();
                }, that.autoPlay);
                this.el.on('mouseover', function () {
                    clearInterval(timer);
                });
                this.el.on('mouseout', function () {
                    timer = setInterval(function() {
                        that.flipNext();
                    }, that.autoPlay);
                })
            }
        },
        arrangeCards: function () {
            //设置css 设置内容
            var that = this;
            var cards = this.el.find('li');
            $.each(cards,function(i, item) {
                var node = $(item);
                if (i === 0) {
                    //设置第一个
                    var cap = $('.fc-cap');
                    cap.html('');
                    var label = node.find('label');
                    cap.html(label.html()).css({
                        opacity: 1
                    });
                    node.addClass('active');
                }
                var new_scale = 1 - (that.scaleUnit * i);
                var new_opacity = 1 - (that.opacityUnit * i);
                var new_spacing = - i * ((that.spacing/new_scale) + that.spacing);
                var new_zIndex = 10-i;
                new_spacing = - i * (that.spacing/new_scale);
                //new_scale = 1
                var new_transform = "scale(" + new_scale + ")" + EMPTY + "translateY(" + new_spacing +  "px)" ;
                //later切换成translate3d > translate > margin-top
                node.addClass('fc-card animate').css({
                    "z-index": new_zIndex,
                    "-webkit-transform": new_transform,
                    "-moz-transform": new_transform,
                    "-o-transform": new_transform,
                    "transform": new_transform,
                    "opacity": new_opacity
                });

            });

        },
        //向后翻
        flipNext: function () {
            var el = this.el;
            var that = this;
            if (!el.hasClass('animating')) {
                el.addClass('animating');//外层增加class代表开始动画
                el.find('.fc-cap').css('opacity',0);//配合翻折时间消失
                var cards = this.el.find('li');
                var firstCard = cards.first();
                var last = cards.last();
                firstCard.addClass("flipping").css("opacity", "0");
                firstCard.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
                    if (!this.animated) {
                        var save_card = firstCard.removeClass("animate active flipping").clone();
                        firstCard.remove();
                        el.append(save_card.hide());
                        that.arrangeCards();
                        this.animated = true;

                    }

                    last.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(e) {
                        if (e.propertyName == 'z-index') {
                            console.log(e.propertyName);
                            el.find('li').show();
                            el.removeClass("animating");
                        }


                    });

                });

            }

        },
        //向前翻
        flipPrev: function () {
            var el = this.el;
            if (!el.hasClass('animating')) {
                var prev_card = el.find("li").last();
                var new_prev_card = prev_card.clone();
                prev_card.remove()
                el.find(".active").removeClass("active");
                el.prepend(new_prev_card.attr("style", "").css({
                    "opacity": "0",
                    "z-index": "99"
                }).hide().addClass("active flipping"));
                el.find("li").addClass("animate").show().removeClass("flipping").css("opacity", "1");
                this.arrangeCards();
                el.find("li").on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(e) {
                    if (e.propertyName == 'z-index') {
                        el.find('li').show();
                        el.removeClass("animating");
                    }
                });
            }
        }


    });

    FlipCard.destroy = function () {

    };

    lib.FlipCard = FlipCard;

})(window, window['lib'] || (window['lib'] = {}))