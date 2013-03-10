# jQuery.prism();
*version 1.0*

**$.prism()** is a simple plugin that helps you create rectangular prisms without requiring complicated markup.

All you need to start is a single `<div>` to act as a container - $.prism() does all the rest.

There are three ways to call $.prism()

#### Standard:
    $('#element').prism(100);
  This will make a cube with each side equal to 100px

#### Premium:
    $('#element').prism(100, 50, 75);
This will make a rectangular prism from three given dimensions (as ints)

#### Deluxe:
```
$('#element').prism({
  w: 100, h: 50, d: 75,
  p: 500,
  sides: {
     top:    'rgba(115, 127, 216, 0.5)'
    ,bottom: 'rgba(71, 161, 255, 0.5)'
    ,left:   'rgba(255, 136, 172, 0.5)'
    ,right:  'rgba(45, 181, 211, 0.5)'
    ,front:  'blue'
    ,back:   'red'
  },
  transform: [
    { rotateY: 45 }
   ,{ rotateZ: 45 }
   ,{ rotateX: 10 }
  ]
});
```

This last way allows you to define everything about the prism.

- `w`, `h`, `d` set the dimensions
  - `width`, `height`, `depth` will work too (if you're not into the whole brevity thing)
- `p` sets the `perspective` and defaults to 500px
- `sides` sets the CSS `background` property of any number and combination of the prism's sides
  - a (slightly) randomized bluish default color is used for individual sides when unspecified
- `transform` specifies any CSS transforms that should be applied to the to the `.jquery-prism-shape`
  - the `.jquery-prism-shape` div is inserted into the element which $.prism() is called on, and holds all the prism's faces. If you want to apply a transformation yourself to the whole prism, you'd modify this div.
  - `transform` is an array of objects (and not just a simple object) because the order of transforms matters (e.g. for rotation)
  - **Note**: if you don't specify the units of the transform (e.g. `deg`/`%`/`px`), then $.prism() will try to choose the correct type based on the transform

#### Compatability
Currently this should work in any browser that supports 3D CSS. The one exception is (of course) IE10, which supports 3D CSS but does *not* support the necessary `transform-style: preserve-3d` style.

There is a workaround for this, which I plan to add in future versions.

Also, I realize that this plugin can only make *rectangular* prisms. I had originally planned to make a plugin capable of producting n-sided regular prisms, but I couldn't find a clever enough way to create the top and bottom faces (triangles, octogons, etc.) while still allowing arbitrary background properties to be set.

It may be possible in the future when the [shape-outside](http://dev.w3.org/csswg/css3-exclusions/#shape-outside-property) property becomes more well-supported. Or, maybe it's possible now and you know of a clever way. If you do, tell me about it or send a pull request!