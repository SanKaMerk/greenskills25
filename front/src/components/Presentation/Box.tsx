/* eslint-disable prefer-arrow-callback */
import { Typography } from "antd";
import { observer } from "mobx-react-lite";
import type { CSSProperties, FC } from "react";
import { memo } from "react";
import { useStore } from "src/stores";

const styles: CSSProperties = {
  padding: "0.5rem 1rem",
  whiteSpace: "pre-wrap",
  cursor: "move"
};

export interface BoxProps {
  id?: string;
  content: string;
  type: string;
  preview?: boolean;
}

export const Box: FC<BoxProps> = memo(
  observer(function Box({ id, content, type, preview }) {
    const { Text, Title } = Typography;
    const { activeElement, setActiveElement } = useStore();

    const renderContent = (): any => {
      switch (type) {
        case "title":
          return <Title>{content}</Title>;
        case "text":
          return <Text>{content}</Text>;
        case "image":
          return <img src={content} style={{ width: 400 }}></img>;
        case "list":
          return content;
      }
    };

    return (
      <div
        style={{
          ...styles,
          border: preview || activeElement === id ? "1px dashed gray" : "none"
        }}
        role={preview ? "BoxPreview" : "Box"}
        onClick={() => id && setActiveElement(id)}
        onMouseDown={() => id !== activeElement && setActiveElement()}>
        {renderContent()}
      </div>
    );
  })
);
