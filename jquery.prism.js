(function($) {
/*
  $.prism() gives you three ways to make a rectangular prism from a simple <div>

  Standard:
    $('#element').prism(100);
      this will make a cube with each side equal to 100

  Premium:
    $('#element').prism(width, height, depth);
      this will make a rectangular prism from three given dimensions

  Deluxe:
    $('#element').prism({
      w: 50, h: 25, d: 100, p: 500
      sides: {
         top:    'red',
        ,bottom: 'blue'
        ,left:   'green'
        ,right:  'yellow'
        ,front:  'white'
        ,back:   'black'
        ,standard: 'transparent'
      }
      transform: [
        { rotateY: '45deg' }
       ,{ translateX: -100 }
       ,{ anyCSStransform: 1337 }
      ]
    });
      this way allows you define everything about the prism
        - w,h,d for dimensions (width,height,depth will work too)
        - sides lets you set the CSS background property of any number
           and combination of the prism's sides
          - you can specify a `standard` background under `sides` that will fill in 
            any sides that you don't specify (a semi-transparent bluish standard is used when unspecified)
        - transform lets you specify any CSS transforms that should be applied
           to the .jquery-prism-shape (which holds all the prism sides)
           this is an array of objects (and not just a simple object)
           because order of transforms matters (e.g. for rotation)
           Note: if you don't specify the units of the transform (e.g. deg/%/px),
                 then $.prism() will try to choose the correct type based on the transform
*/
$.fn.prism = function(/* args */) {
  if (!this.length) { return this; }

  var prism_spec = {};
  var args = Array.prototype.slice.call(arguments);

  // create a standardized object from multiple argument formats
  if (args.length === 1) {
    if ($.isPlainObject(args[0])) { // full declaration
      prism_spec = args[0];
      prism_spec.w = prism_spec.w || prism_spec.width;
      prism_spec.h = prism_spec.h || prism_spec.height;
      prism_spec.d = prism_spec.d || prism_spec.depth;
      prism_spec.p = prism_spec.p || prism_spec.perspective || prism_defaults.perspective
    } else { // assume it's an int
      prism_spec = { w: args[0], h: args[0], d: args[0] };
    }
  } else if (args.length === 3) { // w, h, d
    prism_spec = { w: args[0], h: args[1], d: args[2] };
  }
  if (!prism_spec.sides) { prism_spec.sides = {}; }

  if (!prism_spec.w || !prism_spec.h || !prism_spec.d) {
    return this; // a dimensionless prism is not a prism
  }

  // remove any old prisms to prevent duplicates
  if (this.find('.jquery-prism-shape').length) {
    // this may not be desired behavior...
    // but it seems strange to create a whole new prism
    // when the intention of calling $.prism() again
    // on the same element was probably to update the current one
    this.find('.jquery-prism-shape').remove();
  }

  this.css({ // static is returned by default and does not enable absolute
     position: this.css('position').replace(/static/, '') || 'relative'
  });

  // the element passed to $.prism() is the container,
  // while .jquery-prism-shape contains the actual faces of the prism.
  // this way, you can position an object on the page by moving the container,
  // and rotate the prism shape by modifying .jquery-prism-shape
  var $prism_shape = $('<div>')
                     .addClass('jquery-prism-shape')
                     .css({ // TODO: IE will need a workaround for preserve-3d
                               'transform-style': 'preserve-3d',
                          '-moz-transform-style': 'preserve-3d',
                       '-webkit-transform-style': 'preserve-3d',
                     })
                     .width(prism_spec.w).height(prism_spec.h)
                     .appendTo(this);

  // this gets set at the end after all transforms have been collected
  var shape_transform = 'perspective(' +prism_spec.p+ 'px)';

  // move the sides into place
  ['front', 'back', 'top', 'bottom', 'left', 'right'].forEach(function(side, i) {
    var $side = $('<div>').addClass('jquery-prism-' + side + ' jquery-prism-side');
    $side.css({
       background: prism_spec.sides[side] || prism_spec.sides['standard'] || prism_defaults.background
      ,position: 'absolute'
      ,top: 0
      ,left: 0
    });

    $side.width( ($.inArray(side, ['left', 'right']) !== -1) ? prism_spec.d : prism_spec.w);
    $side.height(($.inArray(side, ['top', 'bottom']) !== -1) ? prism_spec.d : prism_spec.h);

    var transform = '';
    switch (side) {
      case 'back':
        transform = 'translateZ(-' +prism_spec.d+ 'px)';
      break;
      case 'top':
        transform = 'translateZ(-' +(prism_spec.d / 2)+ 'px) '
                  + 'translateY(-' +(prism_spec.d / 2)+ 'px) '
                  + 'rotateX(90deg)';
      break;
      case 'bottom':
        transform = 'translateZ(-' +(prism_spec.d / 2)+ 'px) '
                  + 'translateY(' +(prism_spec.h - (prism_spec.d / 2))+ 'px) '
                  + 'rotateX(90deg)';
      break;
      case 'left':
        transform = 'translateX(-' +(prism_spec.d / 2)+ 'px) '
                  + 'translateZ(-' +(prism_spec.d / 2)+ 'px) '
                  + 'rotateY(-90deg)'
      break;
      case 'right':
        transform = 'translateX(' +(prism_spec.w - (prism_spec.d / 2))+ 'px) '
                  + 'translateZ(-' +(prism_spec.d / 2)+ 'px) '
                  + 'rotateY(90deg)'
      break;
    }

    $side.css({
              'transform': transform,
           '-o-transform': transform,
          '-ms-transform': transform,
         '-moz-transform': transform,
      '-webkit-transform': transform
    });

    $side.appendTo($prism_shape);
  });

  // apply a custom transform if one was provided
  if (prism_spec.transform) {
    for (var i = 0; i < prism_spec.transform.length; i++) {
      shape_transform += ' ';
      $.each(prism_spec.transform[i], function(property, value) {
        var units = '';
        if ($.isNumeric(value)) {
          while (!units) {
            if (/(scale)/.test(property)) { break; } // special case, unitless transform
            if (/(rotate|skew)/.test(property)) { units = 'deg'; break; }
            units = 'px'; break;
          }
        }

        shape_transform += property + '(' + value + units + ')';
      });
    }

    this.find('.jquery-prism-shape').css({
              'transform': shape_transform,
           '-o-transform': shape_transform,
          '-ms-transform': shape_transform,
         '-moz-transform': shape_transform,
      '-webkit-transform': shape_transform
    });
  }

  return this;
}

var prism_defaults = {
  background: function() {
    var color_range = 100; // randomize the default colors a bit for easier visibility
    var r = 94  + Math.round(Math.random() * color_range - (color_range / 2));
    var g = 152 + Math.round(Math.random() * color_range - (color_range / 2));
    var b = 238 + Math.round(Math.random() * color_range - (color_range / 2));
    return 'rgba(' +r+ ', ' +g+ ', ' +b+ ', 0.44)';
   }
  ,perspective: 500
};

})(jQuery);