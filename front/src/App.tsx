import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Avatar,
  Input,
  Layout,
  Menu,
  message,
  Modal,
  Result,
  Spin,
  theme
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getToken, removeToken, setToken, useMediaQueries } from "./helpers";
import { AppStyled, AppWrapper, CentredContent } from "./AppStyle";
import { Page } from "./pages";
import { puskaStrashnayaApi } from "./api/puskaStrashnaya";
import { useStore } from "src/stores";
import logo from "src/assets/logo.png";
import "src/styles/index.css";

export const App = observer((): JSX.Element => {
  const [isModalOpenLogin, setIsModalOpenLogin] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  const { isAuth, clearStore, setIsAuth } = useStore();
  const { desktopM, heightM } = useMediaQueries();

  const { Content, Header } = Layout;

  const HEADER_MENU_ITEMS = [
    {
      key: "user-menu-item",
      label: (
        <Avatar>
          <UserOutlined />
        </Avatar>
      ),
      children: [
        {
          label: isAuth ? "Выйти" : "Войти"
        }
      ]
    }
  ];

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      setIsModalOpenLogin(true);
    }
  }, []);

  const handleLogin = (): void => {
    if (login && password) {
      puskaStrashnayaApi
        .login({ username: login, password })
        .then((res) => {
          const token = res.data.access_token;
          if (token) {
            setToken(token);
            setIsAuth(true);
            setIsModalOpenLogin(false);
          } else {
            throw new Error();
          }
        })
        .catch(() => message.error("Ошибка при аутентификации"));
    } else {
      message.error("Введите логин и пароль");
    }
  };

  const handleLogout = (): void => {
    removeToken();
    clearStore();
  };

  const renderContent = (): JSX.Element => {
    if (isAuth === undefined) {
      return (
        <CentredContent>
          <Spin />
        </CentredContent>
      );
    }

    return desktopM || heightM ? (
      <CentredContent>
        <Result
          status="403"
          title="Мобильная версия в разработке"
          subTitle="Пожалуйста, воспользуйтесь ПК для работы с порталом"
        />
      </CentredContent>
    ) : (
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
          <div>
            <img
              src={logo}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "16px"
              }}></img>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            items={HEADER_MENU_ITEMS}
            onClick={() => (isAuth ? handleLogout() : handleLogin())}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflowY: "auto",
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}>
          <Page />
        </Content>
        <Modal
          title="Войти"
          open={isModalOpenLogin}
          onOk={handleLogin}
          onCancel={() => {
            setIsModalOpenLogin(false);
            setLogin("");
            setPassword("");
          }}
          okText="Вход"
          cancelText="Отмена">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input
              placeholder="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <Input.Password
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Modal>
      </Layout>
    );
  };

  return (
    <AppWrapper>
      <AppStyled>{renderContent()}</AppStyled>
    </AppWrapper>
  );
});
