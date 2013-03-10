# jQuery.prism();
*version 1.0*

**$.prism()** is a simple plugin that helps you create simple rectangular prisms without any markups. All you need is a simple `<div>` to act as a container - $.prism() does all the rest.

There are three ways to call $.prism()

#### Standard:
    $('#element').prism(100);
  This will make a cube with each side equal to 100px

#### Premium:
    $('#element').prism(width, height, depth);
This will make a rectangular prism from three given dimensions (as ints)

#### Deluxe:
```
$('#element').prism({
  w: 50, h: 25, d: 100,
  p: 500
  sides: {
     top:    'red',
    ,bottom: 'blue'
    ,left:   'green'
    ,right:  'yellow'
    ,front:  'white'
    ,back:   'black'
  }
  transform: [
    { rotateY: '45deg' }
   ,{ translateX: -100 }
   ,{ anyCSStransform: 1337 }
  ]
});
```

This last way allows you define everything about the prism.

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