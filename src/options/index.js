const options = {
  nodes: {
    showLabels: true,
    defaultSize: 30,
    scaleCompensation: false,
    nodeFillStyle: 'default', // default or bullet
  },
  edges: {
    showLabels: true,
    arrowheads: true,
    lineStyle: 'curved', // straight or curved
  },
  cameraOptions: {
    fitAllPadding: {
      horizontal: 60,
      vertical: 60,
    },
  },
  layoutOptions: {
    fitOnUpdate: true,
  },
  hover: {
    width: 200,
    height: 150,
    edgeRenderer: null,
    nodeRenderer: null,
    delay: 750,
  },
  interaction: {
    allowGraphInteraction: true,
    allowShapeInteraction: false,
  },
  showMutedOverlay: false,
};

export default options;
