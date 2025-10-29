import { useState, useRef } from "react";
import {
    Table,
    Space,
    Button,
    Input,
    Modal,
    Form,
    Select,
    Upload,
    message,
} from "antd";
import PropTypes from "prop-types";
import { arrayMoveImmutable } from "array-move";
import { MenuOutlined } from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

// Mock data
const mockLessons = [
    {
        id: 1,
        title: "Giới thiệu JavaScript",
        chapter: {
            id: 1,
            title: "Nhập môn JavaScript",
            course: { id: 1, title: "Khóa học JavaScript" },
        },
        video_url: "https://example.com/video1.mp4",
        description: "Bài học giới thiệu về JavaScript",
        position: 1,
    },
    {
        id: 2,
        title: "Biến và kiểu dữ liệu",
        chapter: {
            id: 1,
            title: "Nhập môn JavaScript",
            course: { id: 1, title: "Khóa học JavaScript" },
        },
        video_url: "https://example.com/video2.mp4",
        description: "Tìm hiểu về biến và kiểu dữ liệu trong JavaScript",
        position: 2,
    },
    {
        id: 3,
        title: "Cấu trúc điều kiện",
        chapter: {
            id: 1,
            title: "Nhập môn JavaScript",
            course: { id: 1, title: "Khóa học JavaScript" },
        },
        video_url: "https://example.com/video3.mp4",
        description: "Học về cấu trúc điều kiện if-else",
        position: 3,
    },
];

const DraggableRow = ({ index, moveRow, className, style, ...restProps }) => {
    const ref = useRef(null);

    DraggableRow.propTypes = {
        index: PropTypes.number.isRequired,
        moveRow: PropTypes.func.isRequired,
        className: PropTypes.string,
        style: PropTypes.object,
    };
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: "DraggableRow",
        collect: (monitor) => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: "drop-over",
            };
        },
        drop: (item) => {
            moveRow(item.index, index);
        },
    });

    const [, drag] = useDrag({
        type: "DraggableRow",
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drop(drag(ref));

    return (
        <tr
            ref={ref}
            className={`${className} ${isOver ? dropClassName : ""}`}
            style={{ cursor: "move", ...style }}
            {...restProps}
        />
    );
};

function LessonsManagement() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [editFileList, setEditFileList] = useState([]);
    const [lessons, setLessons] = useState(mockLessons);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();

    const moveRow = (dragIndex, hoverIndex) => {
        const newData = arrayMoveImmutable(
            lessons.slice(),
            dragIndex,
            hoverIndex
        );
        setLessons(
            newData.map((item, index) => ({ ...item, position: index + 1 }))
        );
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên bài học",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Khóa học",
            dataIndex: "course",
            render: (_, record) => record.chapter.course.title,
            key: "course",
        },
        {
            title: "Chương",
            dataIndex: "chapter",
            render: (_, record) => record.chapter.title,
            key: "chapter",
        },
        {
            title: "Video",
            dataIndex: "video_url",
            key: "video_url",
            render: (video_url) =>
                video_url ? (
                    <a
                        href={video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Xem video
                    </a>
                ) : (
                    "Không có"
                ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedLesson(record);
                            form.setFieldsValue(record);
                            // Set video preview
                            if (record.video_url) {
                                setEditFileList([
                                    {
                                        uid: "-1",
                                        name: record.video_url.split("/").pop(),
                                        status: "done",
                                        url: record.video_url,
                                    },
                                ]);
                            } else {
                                setEditFileList([]);
                            }
                            setIsEditModalOpen(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => {
                            setSelectedLesson(record);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>Quản lý bài học</h2>
            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Thêm bài học mới
                </Button>
            </div>
            <DndProvider backend={HTML5Backend}>
                <Table
                    components={{
                        body: {
                            row: DraggableRow,
                        },
                    }}
                    dataSource={lessons}
                    columns={[
                        {
                            title: "Sort",
                            dataIndex: "sort",
                            width: 30,
                            className: "drag-visible",
                            render: () => (
                                <MenuOutlined
                                    style={{ cursor: "grab", color: "#999" }}
                                />
                            ),
                        },
                        ...columns,
                    ]}
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} bài học`,
                    }}
                    onRow={(_, index) => ({
                        index,
                        moveRow,
                    })}
                    rowKey="id"
                />
            </DndProvider>

            {/* Create Modal */}
            <Modal
                title="Thêm bài học mới"
                open={isCreateModalOpen}
                onCancel={() => {
                    setIsCreateModalOpen(false);
                    createForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={async (values) => {
                        try {
                            const formData = new FormData();
                            Object.keys(values).forEach((key) => {
                                if (
                                    key === "video" &&
                                    values[key]?.fileList?.[0]?.originFileObj
                                ) {
                                    formData.append(
                                        key,
                                        values[key].fileList[0].originFileObj
                                    );
                                } else {
                                    formData.append(key, values[key]);
                                }
                            });

                            // await createLesson(formData).unwrap();
                            message.success("Thêm bài học mới thành công");
                            // refetch();
                            setIsCreateModalOpen(false);
                            createForm.resetFields();
                        } catch (error) {
                            console.error("Error adding lesson:", error);
                            message.error("Có lỗi xảy ra khi thêm bài học mới");
                        }
                    }}
                >
                    <Form.Item
                        name="course_id"
                        label="Khóa học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn khóa học!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn khóa học"
                            // options={courses.map(course => ({
                            //     value: course.id,
                            //     label: course.title
                            // }))}
                            // onChange={(value) => {
                            //     // Load chapters for selected course
                            //     loadChapters(value);
                            //     // Reset chapter selection
                            //     createForm.setFieldsValue({ chapter_id: undefined });
                            // }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="chapter_id"
                        label="Chương"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn chương!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn chương"
                            // options={chapters.map(chapter => ({
                            //     value: chapter.id,
                            //     label: chapter.title
                            // }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Tên bài học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên bài học!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mô tả!",
                            },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="video"
                        label="Video bài học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng tải lên video bài học!",
                            },
                        ]}
                    >
                        <Upload
                            maxCount={1}
                            beforeUpload={() => false}
                            accept="video/*"
                        >
                            <Button icon={<UploadOutlined />}>
                                Tải video lên
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm bài học
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Sửa bài học"
                open={isEditModalOpen}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditFileList([]);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={async (values) => {
                        try {
                            const formData = new FormData();
                            Object.keys(values).forEach((key) => {
                                if (
                                    key === "video" &&
                                    values[key]?.fileList?.[0]?.originFileObj
                                ) {
                                    formData.append(
                                        key,
                                        values[key].fileList[0].originFileObj
                                    );
                                } else {
                                    formData.append(key, values[key]);
                                }
                            });

                            // await updateLesson({
                            //     id: selectedLesson.id,
                            //     formData,
                            // }).unwrap();
                            message.success("Cập nhật bài học thành công");
                            // refetch();
                            setIsEditModalOpen(false);
                        } catch (error) {
                            console.error("Error updating lesson:", error);
                            message.error("Có lỗi xảy ra khi cập nhật bài học");
                        }
                    }}
                >
                    <Form.Item
                        name="course_id"
                        label="Khóa học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn khóa học!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn khóa học"
                            // options={courses.map(course => ({
                            //     value: course.id,
                            //     label: course.title
                            // }))}
                            // onChange={(value) => {
                            //     // Load chapters for selected course
                            //     loadChapters(value);
                            //     // Reset chapter selection
                            //     form.setFieldsValue({ chapter_id: undefined });
                            // }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="chapter_id"
                        label="Chương"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn chương!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn chương"
                            // options={chapters.map(chapter => ({
                            //     value: chapter.id,
                            //     label: chapter.title
                            // }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Tên bài học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên bài học!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mô tả!",
                            },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item name="video" label="Video bài học">
                        <Upload
                            maxCount={1}
                            fileList={editFileList}
                            onChange={({ fileList }) =>
                                setEditFileList(fileList)
                            }
                            beforeUpload={() => false}
                            accept="video/*"
                        >
                            {editFileList.length === 0 && (
                                <Button icon={<UploadOutlined />}>
                                    Tải video mới
                                </Button>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalOpen}
                onOk={async () => {
                    try {
                        // await deleteLesson(selectedLesson.id).unwrap();
                        message.success("Xóa bài học thành công");
                        // refetch();
                    } catch (error) {
                        console.error("Error deleting lesson:", error);
                        message.error("Có lỗi xảy ra khi xóa bài học");
                    }
                    setIsDeleteModalOpen(false);
                }}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Bạn có chắc chắn muốn xóa bài học{" "}
                    <strong>{selectedLesson?.title}</strong> không?
                </p>
            </Modal>
        </div>
    );
}

export default LessonsManagement;
