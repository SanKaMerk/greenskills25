import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ConfigProvider } from "antd";
import ru_RU from "antd/lib/locale/ru_RU";
import { createStore, StoreContext } from "./stores";
import { App } from "./App";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(isSameOrBefore);

const stores = createStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ConfigProvider locale={ru_RU}>
      <StoreContext.Provider value={stores}>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </StoreContext.Provider>
    </ConfigProvider>
  </BrowserRouter>
);
