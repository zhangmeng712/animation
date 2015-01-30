#transition and animation with javascript

## transition

### control by class or style
   - computedStyle and getPropertyValue
   - classList
        
        var computedStyle = document.getElementById('xx').getComputedStyle();
        var marginTop = computedStyle.getProperValue('margin-top');
        
        var classList = document.getElementById('xx').classList;
        if (classList.contains('animate'){
        	classList.remove('className');
        }else {
        	classList.add('className')
        }
               
        
      

### control by event callback
         
    // Function from David Walsh: http://davidwalsh.name/css-animation-callback
    function whichTransitionEvent(){
      var t,
          el = document.createElement("fakeelement");

      var transitions = {
        "transition"      : "transitionend",
        "OTransition"     : "oTransitionEnd",
        "MozTransition"   : "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
      }

      for (t in transitions){
        if (el.style[t] !== undefined){
          return transitions[t];
        }
      }
    }

    var transitionEvent = whichTransitionEvent();

    $(".button").click(function(){
      $(this).addClass("animate");
      $(this).one(transitionEvent,function(event) {
        // Do something when the transition ends
      });
    });



## animation