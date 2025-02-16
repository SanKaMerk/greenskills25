/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { CSSProperties, FC } from "react";
import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useDrop } from "react-dnd";

import { DraggableBox } from "./DraggableBox";
import type { DragItem } from "./interfaces";
import { ItemTypes } from "./ItemTypes";
import { snapToGrid as doSnapToGrid } from "./snapToGrid";
import { useStore } from "src/stores";
import background1 from "src/assets/background1.jpg";
import background2 from "src/assets/background2.jpeg";
import background3 from "src/assets/background3.jpeg";

export const Container: FC<any> = observer(() => {
  const { data, slideNumber, setActiveElement, setDataEasy } = useStore();

  const getBackground = (): string => {
    switch (data?.background) {
      case 1:
      default:
        return background1;
      case 2:
        return background2;
      case 3:
        return background3;
    }
  };

  const styles: CSSProperties = {
    display: "flex",
    alignSelf: "center",
    width: "1280px",
    height: "720px",
    position: "relative",
    backgroundImage: `url(${getBackground()})`
  };

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      setActiveElement();
      const updBoxes = data?.slides[slideNumber - 1].components.map((box) =>
        box.id === id ? { ...box, left, top } : box
      );
      const tempData = { ...data };
      if (tempData.slides) {
        tempData.slides[slideNumber - 1].components = updBoxes || [];
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setDataEasy(tempData);
    },
    [data?.slides[slideNumber - 1].components]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as {
          x: number;
          y: number;
        };

        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);
        [left, top] = doSnapToGrid(left, top);

        moveBox(item.id, left, top);
        return undefined;
      }
    }),
    [moveBox]
  );

  return (
    <div ref={drop} style={styles}>
      {Object.values(data?.slides[slideNumber - 1].components ?? []).map(
        (box) => (
          <DraggableBox key={box.id} {...box} />
        )
      )}
    </div>
  );
});
