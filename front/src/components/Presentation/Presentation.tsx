import type { FC } from "react";

import { Container } from "./Container";
import { CustomDragLayer } from "./CustomDragLayer";

export const Presentation: FC = () => (
  <div>
    <Container />
    <CustomDragLayer />
  </div>
);
