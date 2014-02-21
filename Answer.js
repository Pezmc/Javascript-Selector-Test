var $ = function (selector, context) {
  var elements = [];
  
  context = context ? context : document;
  
  // Need to call the match on each element
  if(context instanceof NodeList || context instanceof Array) {
  
    var matches = [].filter.call(context, function (el) {
      return $.matches(el, selector);
    });
    
    return elements.concat(matches);
  }

  // Simple match
  match = $.elementRegex.exec( selector );
  if (match) {
    if(match[1] ) {
      return [context.getElementById(match[1])];
    }
    else if(match[2]) {
      return context.getElementsByTagName(match[2]); 
    }
    else if(match[3]) {
      return context.getElementsByClassName(match[3]);
    }
  }
  
  // We must have a complex selector   
  // Backwards through selectors for right->left parsing
  selectors = []
  remaining = selector;
  while ( remaining ) {
    match = $.trailingElementRegex.exec(remaining);
    
    if ( match ) {
      selectors[selectors.length] = match[0];
			remaining = remaining.slice(0, remaining.length - match[0].length);
		} else {
		  return elements; // Failed, unknown format
		}
    
  }
  
  // Search for each selector
  for(i=0;i<selectors.length;i++) {
    context = $(selectors[i], context);  
  }
  
  return context;
}

// Match #word|tag|.class
$.elementRegex = /^(?:#(\w+)|(\w+)|\.(\w+))$/;
$.trailingElementRegex = /(?:#(\w+)|(\w+)|\.(\w+))$/;

$.matches = function (element, selector) {
  match = $.elementRegex.exec( selector );

  if (match) {
    if(match[1]) {
      return element.id == match[1];
    }
    else if(match[2]) {
      return element.tagName == match[2].toUpperCase();
    }
    else if(match[3]) {
      return element.className.split(' ').indexOf(match[3]) > -1;
    }
  }
  
  return false;
}