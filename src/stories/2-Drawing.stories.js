import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, button } from '@storybook/addon-knobs';
import styled from 'styled-components';
import ReVisNetwork from '..';
import {
  iconMap,
  nodeDrawing,
  shapeDrawing,
  data,
  shapes,
  image1,
} from '../examples/drawing';

const StyledCard = styled.div`
  position: absolute;
  width: 200px;
  max-height: 150px;
  overflow-y: auto;
`;

export default {
  title: 'Drawing',
  component: ReVisNetwork,
  decorators: [withKnobs],
};

const actions = {
  onMouse: action('onMouse'),
};

let shapeData = [...shapes];

const nodeRenderer = () => {
  return (
    <StyledCard>
      <div style={{ height: '600px', width: '100%', background: '#CCCCCC' }}>
        Content goes here
      </div>
    </StyledCard>
  );
};

const edgeRenderer = () => {
  return (
    <StyledCard>
      <div style={{ height: '600px', width: '100%', background: '#CCCCCC' }}>
        Edge goes here
      </div>
    </StyledCard>
  );
};

export const Drawing = () => {
  const editShapes = boolean('Edit Drawings', false);
  const addHandler = () => {
    shapeData = [
      ...shapeData,
      {
        id: new Date().getTime().toString(),
        width: 100,
        height: 100,
        x: 10,
        y: 10,
        shape: 'rectangle',
      },
    ];
  };
  const addImageHandler = () => {
    shapeData = [
      ...shapeData,
      {
        id: new Date().getTime().toString(),
        width: 200,
        height: 200,
        x: 200,
        y: 200,
        shape: 'image',
        image: image1,
      },
    ];
  };
  const deleteHandler = () => {
    shapeData = shapeData.slice(0, shapeData.length - 1);
  };
  const colorHandler = () => {
    const randomHex = () =>
      `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
    const newData = [...shapeData];
    newData[newData.length - 1].style = { background: randomHex() };
  };

  button('Add a shape', addHandler);
  button('Add an image', addImageHandler);
  button('Delete top shape', deleteHandler);
  button('Change top shape color', colorHandler);
  return (
    <div>
      <h3>
        Use the knobs settings to add, delete and allow editing. When editing
        drag shapes around to move and resize.
      </h3>

      <ReVisNetwork
        graph={data}
        shapes={shapeData}
        {...actions}
        images={iconMap}
        nodeDrawingFunction={nodeDrawing}
        options={{
          interaction: {
            allowGraphInteraction: !editShapes,
            allowShapeInteraction: editShapes,
          },
          nodes: {
            defaultSize: 60,
          },
          edges: {
            lineStyle: 'straight',
          },
          hover: {
            edgeRenderer: (n) => edgeRenderer(n),
            nodeRenderer: (n) => nodeRenderer(n),
          },
        }}
        shapeDrawingFunction={shapeDrawing}
      />
    </div>
  );
};
