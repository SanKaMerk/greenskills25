/* eslint-disable prefer-arrow-callback */
import type { CSSProperties, FC } from "react";
import { memo } from "react";

import { Box } from "./Box";

const styles: CSSProperties = {
  display: "flex"
};

export interface BoxDragPreviewProps {
  content: string;
  type: string;
}

export interface BoxDragPreviewState {
  tickTock: any;
}

export const BoxDragPreview: FC<BoxDragPreviewProps> = memo(
  function BoxDragPreview({ content, type }) {
    return (
      <div style={styles}>
        <Box content={content} type={type} preview />
      </div>
    );
  }
);
