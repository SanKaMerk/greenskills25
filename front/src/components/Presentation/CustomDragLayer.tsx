import type { CSSProperties, FC } from "react";
import type { XYCoord } from "react-dnd";
import { useDragLayer } from "react-dnd";

import { BoxDragPreview } from "./BoxDragPreview";
import { ItemTypes } from "./ItemTypes";

const layerStyles: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%"
};

const getItemStyles = (
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
): any => {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none"
    };
  }

  const { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
};

export const CustomDragLayer: FC = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging()
    }));

  const renderItem = (): JSX.Element | null => {
    switch (itemType) {
      case ItemTypes.BOX:
        return <BoxDragPreview content={item.content} type={item.type} />;
      default:
        return null;
    }
  };

  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  );
};
