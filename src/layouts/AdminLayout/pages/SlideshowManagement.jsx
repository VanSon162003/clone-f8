import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
    Button,
    Table,
    Modal,
    Form,
    Input,
    Upload,
    Switch,
    message,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    MenuOutlined,
} from "@ant-design/icons";
import { ChromePicker } from "react-color";
import {
    useGetSlidesQuery,
    useCreateSlideMutation,
    useUpdateSlideMutation,
    useDeleteSlideMutation,
    useUpdateSlideOrderMutation,
} from "@/services/admin/slideshowApi";
import isHttps from "@/utils/isHttps";

const { TextArea } = Input;

const SlideshowManagement = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState("");
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [currentColor, setCurrentColor] = useState("#8EC5FC");

    const { data: slides = [], isLoading } = useGetSlidesQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const [createSlide] = useCreateSlideMutation();
    const [updateSlide] = useUpdateSlideMutation();
    const [deleteSlide] = useDeleteSlideMutation();
    const [updateSlideOrder] = useUpdateSlideOrderMutation();

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            // Handle basic fields
            formData.append("title", values.title || "");
            formData.append("description", values.description || "");
            formData.append("buttonText", values.buttonText || "");
            formData.append("className", values.className || "");
            formData.append("url", values.url || "");
            formData.append("isActive", values.isActive || false);

            // Handle image file
            if (values.image?.fileList?.[0]?.originFileObj) {
                formData.append(
                    "image",
                    values.image.fileList[0].originFileObj
                );
            }

            // Handle custom styles
            if (values.customStyles) {
                formData.append(
                    "customStyles",
                    JSON.stringify({
                        backgroundColor:
                            values.customStyles.backgroundColor || "",
                        backgroundImage:
                            values.customStyles.backgroundImage || "",
                        color: values.customStyles.color || "",
                    })
                );
            }

            if (editingSlide) {
                await updateSlide({ id: editingSlide.id, formData }).unwrap();
                message.success("Slide updated successfully");
            } else {
                await createSlide(formData).unwrap();
                message.success("Slide created successfully");
            }

            setIsModalVisible(false);
            form.resetFields();
            setImageUrl("");
            setCurrentColor("#8EC5FC"); // Reset color picker
        } catch (error) {
            message.error(error.data?.message || "Operation failed");
            console.error("Form submission error:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteSlide(id).unwrap();
            message.success("Slide deleted successfully");
        } catch (error) {
            message.error(error.data?.message || "Failed to delete slide");
            console.error(error);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(slides);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedSlides = items.map((slide, index) => ({
            ...slide,
            order: index,
        }));

        try {
            await updateSlideOrder(
                updatedSlides.map((slide, index) => ({
                    id: slide.id,
                    order: index,
                }))
            ).unwrap();
            message.success("Order updated successfully");
        } catch (error) {
            message.error(error.data?.message || "Failed to update order");
            console.error(error);
        }
    };

    const columns = [
        {
            title: "Order",
            dataIndex: "order",
            width: 60,
            className: "drag-visible",
            render: () => <MenuOutlined style={{ cursor: "grab" }} />,
        },
        {
            title: "Image",
            dataIndex: "image",
            render: (image) =>
                image ? (
                    <img
                        src={
                            isHttps(image)
                                ? image
                                : `${import.meta.env.VITE_BASE_URL}${image}`
                        }
                        alt="Slide"
                        style={{ height: 50 }}
                    />
                ) : (
                    "No image"
                ),
        },
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "URL",
            dataIndex: "url",
            ellipsis: true,
            render: (url) =>
                url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                    </a>
                ) : (
                    "No URL"
                ),
        },
        {
            title: "Description",
            dataIndex: "description",
            ellipsis: true,
        },
        {
            title: "Active",
            dataIndex: "isActive",
            render: (isActive) => <Switch checked={isActive} disabled />,
        },
        {
            title: "Actions",
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingSlide(record);
                            let customStyles = {};

                            try {
                                let parsed = record.customStyles;

                                // Nếu là string thì parse
                                if (typeof parsed === "string") {
                                    parsed = JSON.parse(parsed);

                                    // Nếu sau khi parse xong vẫn là string => parse thêm lần nữa
                                    if (typeof parsed === "string") {
                                        parsed = JSON.parse(parsed);
                                    }
                                }

                                // Nếu có cấp styles thì lấy ra
                                customStyles = parsed.styles || parsed || {};
                            } catch (err) {
                                console.error("Lỗi parse customStyles:", err);
                                customStyles = {};
                            }

                            const defaultStyles = {
                                backgroundColor: "#8EC5FC",
                                backgroundImage:
                                    "linear-gradient(to right, rgb(0, 126, 254), rgb(6, 195, 254))",
                                color: "black",
                            };

                            // Merge default styles with parsed styles
                            const finalStyles = {
                                ...defaultStyles,
                                ...customStyles,
                            };

                            // Set form values
                            form.setFieldsValue({
                                title: record.title,
                                description: record.description,
                                buttonText: record.buttonText,
                                className: record.className,
                                url: record.url,
                                isActive: record.isActive,
                                image: undefined,
                                customStyles: finalStyles,
                            });

                            // Set image preview URL
                            setImageUrl(
                                record.image
                                    ? isHttps(record.image)
                                        ? record.image
                                        : `${import.meta.env.VITE_BASE_URL}${
                                              record.image
                                          }`
                                    : ""
                            );

                            // Set color picker value
                            setCurrentColor(finalStyles.backgroundColor);
                            setIsModalVisible(true);
                        }}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </>
            ),
        },
    ];

    const uploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                message.error("You can only upload image files!");
                return false;
            }
            return false;
        },
        onChange: (info) => {
            if (info.file.status !== "uploading") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImageUrl(e.target.result);
                };
                reader.readAsDataURL(info.file.originFileObj);
            }
        },
    };

    const DraggableBodyRow = ({ ...restProps }) => {
        if (!restProps["data-row-key"]) {
            return <tr {...restProps} />;
        }

        return (
            <Draggable
                key={restProps["data-row-key"]}
                draggableId={restProps["data-row-key"].toString()}
                index={restProps["data-row-key"]}
            >
                {(provided, snapshot) => {
                    const draggableProps = provided.draggableProps;
                    delete draggableProps.onTransitionEnd;

                    return (
                        <tr
                            ref={provided.innerRef}
                            {...draggableProps}
                            {...provided.dragHandleProps}
                            {...restProps}
                            style={{
                                ...draggableProps.style,
                                cursor: snapshot.isDragging
                                    ? "grabbing"
                                    : "grab",
                            }}
                        />
                    );
                }}
            </Draggable>
        );
    };

    return (
        <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Slideshow Management</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingSlide(null);
                        form.resetFields();
                        setImageUrl("");
                        setIsModalVisible(true);
                    }}
                >
                    Add Slide
                </Button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="table">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <Table
                                loading={isLoading}
                                dataSource={slides}
                                columns={columns}
                                rowKey={(record) => record.id}
                                components={{
                                    body: {
                                        row: DraggableBodyRow,
                                    },
                                }}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Modal
                title={editingSlide ? "Edit Slide" : "Add New Slide"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        customStyles: form.getFieldValue("customStyles"),
                        isActive: true,
                    }}
                >
                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[
                            {
                                required: !editingSlide,
                                message: "Please upload an image",
                            },
                        ]}
                    >
                        <Upload
                            {...uploadProps}
                            listType="picture-card"
                            maxCount={1}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="slide"
                                    style={{ width: "100%" }}
                                />
                            ) : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Please input the title",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item label="Button Text" name="buttonText">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Class Name" name="className">
                        <Input placeholder="slide-default" />
                    </Form.Item>

                    <Form.Item label="URL" name="url">
                        <Input />
                    </Form.Item>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h3 className="text-lg font-medium mb-4">
                            Custom Styles
                        </h3>

                        <Form.Item
                            label="Background Color"
                            name={["customStyles", "backgroundColor"]}
                        >
                            <div className="flex items-center gap-2">
                                <Input
                                    value={
                                        form.getFieldValue([
                                            "customStyles",
                                            "backgroundColor",
                                        ]) || currentColor
                                    }
                                    onClick={() =>
                                        setColorPickerVisible(
                                            !colorPickerVisible
                                        )
                                    }
                                    readOnly
                                    style={{
                                        backgroundColor:
                                            form.getFieldValue([
                                                "customStyles",
                                                "backgroundColor",
                                            ]) || currentColor,
                                        color: "#000000",
                                    }}
                                />
                                {colorPickerVisible && (
                                    <div className="absolute z-10">
                                        <div
                                            className="fixed inset-0"
                                            onClick={() =>
                                                setColorPickerVisible(false)
                                            }
                                        />
                                        <ChromePicker
                                            color={currentColor}
                                            onChange={(color) => {
                                                setCurrentColor(color.hex);
                                                const currentStyles =
                                                    form.getFieldValue(
                                                        "customStyles"
                                                    ) || {};
                                                form.setFieldsValue({
                                                    customStyles: {
                                                        ...currentStyles,
                                                        backgroundColor:
                                                            color.hex,
                                                    },
                                                });
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Background Gradient"
                            name={["customStyles", "backgroundImage"]}
                        >
                            <Input placeholder="linear-gradient(to right, rgb(0, 126, 254), rgb(6, 195, 254))" />
                        </Form.Item>

                        <Form.Item
                            label="Text Color"
                            name={["customStyles", "color"]}
                        >
                            <Input placeholder="black" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Active"
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Button
                            type="default"
                            onClick={() => setIsModalVisible(false)}
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {editingSlide ? "Update" : "Create"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SlideshowManagement;
