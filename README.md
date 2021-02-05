# Revis-Network
A react based canvas networking visualization pacakage

The basic premis of this component is that you know your data, and can choose how you want it rendered.  Out of the box, revis supports dots with labels in a hierarchical display.  However, it is simple to supply your own node, edge and shape data, and your own layout functions to place them.  

Support is also built in for mouse events like nodeClick, edgeClick, shapeClick, nodeDblClick, nodesDragged, backgroundClicked, shapeUpdated, etc... 

The `graph` property must consist of { nodes: [], edges[] }.  If you want to use shapes, which are generally though of as nodes without data, rendered on a lower level, a separate array of `shapes` can be provided as a prop.

### Nodes: 
An array of json objects that, at the very least have unique .id properties. It may also contain the following supported properties
```
{
  id: a unique string (the only required property),
  label: a string to be printed along with the node,
  image: an svg image to be used with the nade,
  shape: one of "diamond", "hexagon", "square" or "circle", thou you can support this any way you want with your own .nodeDrawingFunction as a property of your RevisNetwork instance,
}
```

Conceptually, the node will call it's nodeDrawingFunction if there is one.  In this way you can support named properties in any way you see fit.

### Images - Node Icons
We find that node icons are often re-used so they can be supplied seperately either as a json map of <Image /> elements or definitions with the following properties
```
{ 
  element: the HTMLElement of the image
  scale: based on the image's actual size being a scale of 1
  offsetX: how may pixels at scale of 1 to move the icon horizontally
  offsetY: how may pixels at scale of 1 to move the icon vertically

}
```

### Edges: 
An arry of json objects that, at the very least have the following properties
```
{ 
  id: a unique string (required),
  from: the id of a node in the nodes array that represents the start point of the edge (required),
  to: the id of a node in the nodes array that represents the end point of the edge (required),
}
```

### Shapes:
Shapes must, at the very least have x, y, height, and width.  If no `shapeRenderingFunction` is supplied


### Hover PopUp / Tooltip
Support for a react component to be used when a node or edge is hovered is supplied through the options.  Revis will call a given function and pass in the hovered item.  This can be used to render a popup of your own design.


### Other Props and Options
Coming Soon

## Install dependencies and run Storybook
`yarn && yarn storybook`
