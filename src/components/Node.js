import { drawText, drawImage } from './util';

const DEFAULT_STYLE = {
  background: '#ffffff',
  border: '#333333',
  lineWidth: 2,
  font: '8px lato',
  fontColor: '#555555',
};

const MAX_INNER_LABEL_CHARS = 10;
const MIN_INNER_LABEL_CHARS = 7;
const MAX_OUTER_LABEL_CHARS = 35;
const MIN_OUTER_LABEL_CHARS = 12;
const NODE_SIZE = 30;
/*
instead of having the node support predefined states like selected, hovering, faded, etc...
have animations run from methods like bounce() or even animate(animateFunction => sizeModifier)
have the node call state.getStyleForNode(definition) => {background, border, lineWidth} to get
style information.  The node would not hold status or state properties, those would have to be 
kept in the implementation - a list of selected, faded, etc... to figure out the style
*/
export default class Node {
  constructor(id, definition, options) {
    this.id = id.toString();

    // definition can be set from the outside, and it can change
    this.definition = definition;

    // mass and size properties
    this.size = definition.size || options?.nodes?.defaultSize || NODE_SIZE;
    this.bSize = this.size;
    this.mass = definition.mass || 1;

    // location properties
    this.x = definition.x || 0;
    this.y = definition.y || 0;
    this.fixed = definition.fixed || false;
    this.destination = null;
  }

  destroy() {
    this.delete = true;
  }

  update(definition) {
    this.definition = definition;
    if (definition.fixed === false) {
      this.fixed = false;
    }
  }

  render(state, context, images, drawingFunction) {
    const hovering = state.rolloverItem === this;
    const { destination } = this;
    const style = { ...DEFAULT_STYLE, ...this.definition.style };

    // adjust size
    // NODE SCALEFACTOR and SCALE COEFICIENT SHOULD CHANGE WHEN THE SCREEN.SCALE CHANGES ONLY, then get pass in as part of the state
    let scaleCoeficient = 1;
    if (state.scale > 1.5) {
      scaleCoeficient = 0.5;
    } else if (state.scale < 0.5) {
      scaleCoeficient = 2;
    }

    // NODE BASE SIZE SHOULD CHANGE WHEN node.definition.style.size OR node.definition.size changes only
    const size =
      (style.size ||
        state?.options?.nodes?.defaultSize ||
        this.definition.size ||
        this.size) + (hovering ? 5 : 0); // * scaleCoeficient;

    // this.bSize must be set because it is used publicly by collision detection, but it is still just the node's (baseSize (+5 if hovering)) / scaleFactor
    this.bSize = size;

    // move
    if (destination) {
      if (
        Math.abs(this.x - destination.x) > 1 ||
        Math.abs(this.y - destination.y) > 1
      ) {
        this.x += (destination.x - this.x) * 0.5;
        this.y += (destination.y - this.y) * 0.5;
      } else {
        this.destination = null;
      }
    }

    // calculate styles like css 1. this.style, 2. this.definition.style, 3. DEFAULT_STYLE
    const fill = style.fill || style.background;
    const stroke = style.stroke || style.border;
    const fontColor = style.fontColor;
    const innerLabelColor = style.innerLabelColor || fontColor;
    const lineWidth = style.lineWidth / state.scale;
    const opacity = style.opacity || 1;
    const bulletStyle = state?.options?.nodes?.nodeFillStyle === 'bullet';

    // DRAW the main shape
    const ctx = context;
    const st = state;
    ctx.save();
    ctx.translate(this.x - size / 2, this.y - size / 2); // traslate to a left top that will center the drawing

    ctx.lineWidth = lineWidth;
    ctx.fillStyle = bulletStyle ? stroke : fill;
    ctx.strokeStyle = stroke;

    ctx.beginPath();

    // shape
    if (drawingFunction) {
      drawingFunction(ctx, this.definition, size);
    } else {
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI, false);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // image
    if (state.scale > 0.3 && !bulletStyle) {
      drawImage(ctx, this.definition, images, size);
    }

    // text
    ctx.save(); // saving where we drew the shape
    const fontSize = 6;
    ctx.translate(size * 0.5, size * 0.7 + fontSize * 0.7); // traslate back to the center point horizontally and 80% vertically

    // inner text
    if (this.definition.innerLabel) {
      const lbl = this.definition.innerLabel;
      const allowedCharacters =
        scaleCoeficient < 1 ? MAX_INNER_LABEL_CHARS : MIN_INNER_LABEL_CHARS;
      drawText(ctx, lbl, innerLabelColor, fontSize * 0.7, allowedCharacters);
    }
    ctx.restore();

    ctx.save();
    ctx.translate(size / 2, size + fontSize);

    // outer label
    const lbl = this.definition.label;
    if (
      lbl &&
      st.options &&
      st.options.nodes &&
      st.options.nodes.showLabels &&
      st.scale > 1.75
    ) {
      drawText(
        ctx,
        lbl,
        fontColor,
        fontSize,
        scaleCoeficient < 1 ? MAX_OUTER_LABEL_CHARS : MIN_OUTER_LABEL_CHARS,
      );
    }

    ctx.restore(); // restore to where we drew the shape

    // cover opacity to simulate transparency
    if (state.options.coverColor && opacity !== 1) {
      ctx.fillStyle = state.options.coverColor;
      ctx.strokeStyle = state.options.coverColor;
      ctx.beginPath();
      if (drawingFunction) {
        drawingFunction(ctx, this.definition, size);
      } else {
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI, false);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}
