/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Button,
  Input,
  List,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Upload,
  UploadProps
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
  SaveOutlined
} from "@ant-design/icons";
import { Presentation } from "../components/Presentation";
import { useStore } from "src/stores";
import { puskaStrashnayaApi } from "src/api/puskaStrashnaya";

export const Page = observer((): JSX.Element => {
  const {
    isAuth,
    activeElement,
    data,
    presentations,
    slideNumber,
    setPresentations,
    setData,
    setSlideNumber,
    setDataEasy
  } = useStore();

  const { TextArea } = Input;

  const { Dragger } = Upload;

  const props: UploadProps = {
    name: "file",
    multiple: false,
    action: "http://91.236.196.165:8800/process_file/",
    beforeUpload: (file) => {
      console.log(file.type);
      const isPDFPPTX =
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      if (!isPDFPPTX) {
        message.error(`${file.name} не в формате PDF или PPTX`);
      }
      return isPDFPPTX || Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} загружен успешно.`);
      } else if (status === "error") {
        message.error(`Ошибка при загрузке ${info.file.name}.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    }
  };

  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenLoad, setIsModalOpenLoad] = useState(false);
  const [isModalOpenTemplate, setIsModalOpenTemplate] = useState(false);
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (): void => {
    if (theme && description) {
      puskaStrashnayaApi
        .postGenerate({ theme, description })
        .then(() => {
          setTheme("");
          setDescription("");
        })
        .catch(() => message.error("Ошибка при генерации презентации"));
    } else {
      message.error("Заполните все поля");
    }
  };

  const getPresentations = (): void => {
    puskaStrashnayaApi
      .getPresentations()
      .then((res) => setPresentations(res.data))
      .catch(() => null);
  };

  useEffect(() => {
    getPresentations();
  }, [isAuth]);

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center"
        }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between"
          }}>
          {data ? (
            <Button onClick={() => setData()}>К списку презентаций</Button>
          ) : (
            <div></div>
          )}
          <div style={{ display: "flex", gap: "16px" }}>
            {data ? (
              <Button onClick={() => setIsModalOpenTemplate(true)}>
                Выбрать шаблон
              </Button>
            ) : (
              <div></div>
            )}
            {data ? (
              <a
                href="src/assets/test.pdf"
                download="file"
                target="_blank"
                rel="noreferrer">
                <Button>Скачать</Button>
              </a>
            ) : (
              <div></div>
            )}
            <Button onClick={() => setIsModalOpenCreate(true)}>
              Создать презентацию
            </Button>
            <Button onClick={() => setIsModalOpenLoad(true)}>
              Приложить документы
            </Button>
          </div>
        </div>
        {data ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              gap: "16px"
            }}>
            <div
              style={{
                display: "flex",
                width: "1280px",
                justifyContent: "end"
              }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <Button type="default" shape="circle" icon={<PlusOutlined />} />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SaveOutlined />}
                  onClick={() => {
                    puskaStrashnayaApi
                      .putPresentation(data)
                      .then(() => message.success("Изменения сохранены"))
                      .catch(() => "Ошибка при сохранении изменений");
                  }}
                />
                <Button type="default" shape="circle" icon={<EditOutlined />} />
                <Button
                  danger
                  type="primary"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    if (activeElement) {
                      let components = [];
                      const tempData = { ...data };
                      if (tempData.slides) {
                        components = tempData.slides[
                          slideNumber - 1
                        ].components.filter(
                          (comp) => comp.id !== activeElement
                        );
                        tempData.slides[slideNumber - 1].components =
                          components;
                      }
                      setDataEasy(tempData);
                    }
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <Presentation />
            </div>
            <Pagination
              current={slideNumber}
              total={data.slides.length * 10}
              onChange={(page) => setSlideNumber(page)}
            />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={presentations}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="list-edit"
                    onClick={() =>
                      puskaStrashnayaApi
                        .getPresentation(item.id)
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-expect-error
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        .then((res) => setData(res.data[0]))
                        .catch(() => {
                          setData();
                          message.error("Ошибка при загрузке презентации");
                        })
                    }>
                    Открыть
                  </Button>,
                  <Popconfirm
                    key="list-delete"
                    placement="left"
                    title="Удалить презентацию"
                    description="Вы точно хотите удалить презентацию?"
                    onConfirm={() =>
                      puskaStrashnayaApi
                        .deletePresentation(item.id)
                        .then(() => {
                          getPresentations();
                          message.success("Презентация удалена");
                        })
                        .catch(() =>
                          message.error("Ошибка при удалени презентации")
                        )
                    }
                    okText="Да"
                    cancelText="Нет">
                    <Button
                      key="list-delete"
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                ]}>
                <List.Item.Meta title={item.name} />
              </List.Item>
            )}
            style={{
              minHeight: 200,
              overflowY: "auto",
              width: "100%",
              marginTop: 40
            }}
          />
        )}
      </div>
      <Modal
        title="Выбрать шаблон"
        open={isModalOpenTemplate}
        onOk={() => setIsModalOpenTemplate(false)}
        onCancel={() => setIsModalOpenTemplate(false)}>
        <Select
          style={{ width: "100%" }}
          options={[
            { value: 1, label: "Шаблон 1" },
            { value: 2, label: "Шаблон 2" },
            { value: 3, label: "Шаблон 3" }
          ]}
          onChange={(value) => {
            console.log(value);
            const tempData = { ...data };
            tempData.background = value;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            setDataEasy(tempData);
          }}
        />
      </Modal>
      <Modal
        title="Создать презентацию"
        open={isModalOpenCreate}
        onOk={handleCreate}
        onCancel={() => {
          setIsModalOpenCreate(false);
          setTheme("");
          setDescription("");
        }}
        okText="Создать"
        cancelText="Отмена">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input
            placeholder="Тема"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
          <TextArea
            placeholder="Описание"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </Modal>
      <Modal
        title="Приложить документы"
        open={isModalOpenLoad}
        onOk={() => setIsModalOpenLoad(false)}
        onCancel={() => setIsModalOpenLoad(false)}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Нажмите или перетащите файл для загрузки
          </p>
          <p className="ant-upload-hint">Поддерживаются форматы PDF и PPTX</p>
        </Dragger>
      </Modal>
    </div>
  );
});
