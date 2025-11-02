import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
    Table,
    Button,
    Space,
    Input,
    Modal,
    Form,
    message,
    Upload,
    Select,
    Card,
    Tag,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    QuestionCircleOutlined,
    DragOutlined,
} from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
    useGetAllLearningPathsManagementQuery,
    useCreateLearningPathMutation,
    useUpdateLearningPathMutation,
    useDeleteLearningPathMutation,
    useAddCourseToPathMutation,
    useRemoveCourseFromPathMutation,
    useUpdateCoursePositionMutation,
} from "@/services/admin/learningPathsService";
import useDebounce from "@/hook/useDebounce";
import { useGetAllCoursesManagementQuery } from "@/services/admin/coursesManagementService";
import isHttps from "@/utils/isHttps";

const { TextArea } = Input;

// DraggableCourse component for handling drag and drop
const DraggableCourse = ({ course, index, moveHandler }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: "course",
        item: { id: course.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: "course",
        hover: (draggedItem) => {
            if (!ref.current) return;
            const dragIndex = draggedItem.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;
            moveHandler(dragIndex, hoverIndex);
            draggedItem.index = hoverIndex;
        },
    });

    drag(drop(ref));

    return (
        <Card
            ref={ref}
            style={{
                marginBottom: 8,
                cursor: "move",
                opacity: isDragging ? 0.5 : 1,
            }}
            size="small"
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DragOutlined style={{ color: "#999" }} />
                <div>
                    <div style={{ fontWeight: "bold" }}>{course.title}</div>
                    <div style={{ fontSize: "0.9em", color: "#666" }}>
                        {course.description}
                    </div>
                </div>
            </div>
        </Card>
    );
};

DraggableCourse.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    moveHandler: PropTypes.func.isRequired,
};

function LearningPathManagement() {
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();
    const [selectedPath, setSelectedPath] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddCourseModalVisible, setIsAddCourseModalVisible] =
        useState(false);

    const debouncedSearchText = useDebounce(searchText, 500);

    // API Hooks
    const { data: learningPathsData, isFetching } =
        useGetAllLearningPathsManagementQuery(
            {
                page: currentPage,
                limit: pageSize,
                search: debouncedSearchText,
            },
            {
                refetchOnMountOrArgChange: true,
                refetchOnFocus: true,
                refetchOnReconnect: true,
            }
        );

    const { data: coursesData } = useGetAllCoursesManagementQuery(
        {
            page: 1,
            limit: 1000,
            search: "",
        },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );

    const [createLearningPath] = useCreateLearningPathMutation();
    const [updateLearningPath] = useUpdateLearningPathMutation();
    const [deleteLearningPath] = useDeleteLearningPathMutation();
    const [addCourseToPath] = useAddCourseToPathMutation();
    const [removeCourseFromPath] = useRemoveCourseFromPathMutation();
    const [updateCoursePosition] = useUpdateCoursePositionMutation();

    // Handlers
    const handleCreatePath = async (values) => {
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            if (values.image?.[0]?.originFileObj) {
                formData.append("image", values.image[0].originFileObj);
            }

            await createLearningPath(formData).unwrap();
            message.success("Tạo lộ trình học thành công");
            setIsCreateModalVisible(false);
            createForm.resetFields();
        } catch (error) {
            message.error(
                error.data?.message || "Có lỗi xảy ra khi tạo lộ trình học"
            );
        }
    };

    const handleUpdatePath = async (values) => {
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            if (values.image?.[0]?.originFileObj) {
                formData.append("image", values.image[0].originFileObj);
            }

            await updateLearningPath({
                id: selectedPath.id,
                data: formData,
            }).unwrap();
            message.success("Cập nhật lộ trình học thành công");
            setIsEditModalVisible(false);
            setSelectedPath(null);
            form.resetFields();
        } catch (error) {
            message.error(
                error.data?.message || "Có lỗi xảy ra khi cập nhật lộ trình học"
            );
        }
    };

    const handleDeletePath = async () => {
        try {
            await deleteLearningPath(selectedPath.id).unwrap();
            message.success("Xóa lộ trình học thành công");
            setIsDeleteModalVisible(false);
            setSelectedPath(null);
        } catch (error) {
            message.error(
                error.data?.message || "Có lỗi xảy ra khi xóa lộ trình học"
            );
        }
    };

    const handleAddCourse = async (values) => {
        try {
            await addCourseToPath({
                pathId: selectedPath.id,
                courseId: values.course_id,
                position: selectedPath.courses?.length || 0,
            }).unwrap();
            message.success("Thêm khóa học vào lộ trình thành công");
            setIsAddCourseModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error(
                error.data?.message || "Có lỗi xảy ra khi thêm khóa học"
            );
        }
    };

    const handleRemoveCourse = async (pathId, courseId) => {
        try {
            await removeCourseFromPath({ pathId, courseId }).unwrap();
            message.success("Xóa khóa học khỏi lộ trình thành công");
        } catch (error) {
            message.error(
                error.data?.message || "Có lỗi xảy ra khi xóa khóa học"
            );
        }
    };

    // Using handleRemoveCourse in expandedRowRender

    const handleMoveCourse = async (pathId, dragIndex, hoverIndex) => {
        try {
            const courses = selectedPath.courses;
            const draggedCourse = courses[dragIndex];

            await updateCoursePosition({
                pathId,
                courseId: draggedCourse.id,
                position: hoverIndex,
            }).unwrap();
        } catch {
            message.error("Có lỗi xảy ra khi di chuyển khóa học");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
        },
        {
            title: "Hình ảnh",
            dataIndex: "thumbnail",
            key: "thumbnail",
            width: 120,
            render: (thumbnail) => (
                <img
                    src={
                        isHttps(thumbnail)
                            ? thumbnail
                            : `${import.meta.env.VITE_BASE_URL}${thumbnail}`
                    }
                    alt="Learning path thumbnail"
                    style={{ width: 100, height: 60, objectFit: "cover" }}
                />
            ),
        },
        {
            title: "Tên lộ trình",
            dataIndex: "title",
            key: "title",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (text) => (
                <div
                    style={{
                        maxWidth: "400px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: "Số khóa học",
            dataIndex: "courses",
            key: "courses",
            width: 120,
            render: (courses) => (
                <Tag color="blue">{courses?.length || 0} khóa học</Tag>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 250,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setSelectedPath(record);
                            setIsAddCourseModalVisible(true);
                        }}
                        title="Thêm khóa học"
                    >
                        Thêm khóa học
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedPath(record);
                            // Prepare form data
                            let imageList = [];
                            if (record.thumbnail) {
                                imageList = [
                                    {
                                        uid: "-1",
                                        name: "current-image",
                                        status: "done",
                                        url: isHttps(record.thumbnail)
                                            ? record.thumbnail
                                            : `${
                                                  import.meta.env.VITE_BASE_URL
                                              }${record.thumbnail}`,
                                    },
                                ];
                            }
                            form.setFieldsValue({
                                title: record.title,
                                description: record.description,
                                image: imageList,
                            });
                            setIsEditModalVisible(true);
                        }}
                        title="Sửa"
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setSelectedPath(record);
                            setIsDeleteModalVisible(true);
                        }}
                        title="Xóa"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Input.Search
                    placeholder="Tìm kiếm lộ trình..."
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    loading={isFetching}
                    allowClear
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalVisible(true)}
                >
                    Thêm lộ trình mới
                </Button>
            </div>

            <DndProvider backend={HTML5Backend}>
                <Table
                    columns={columns}
                    dataSource={learningPathsData?.data?.learning_paths || []}
                    rowKey="id"
                    loading={isFetching}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: learningPathsData?.data?.pagination?.total || 0,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng số ${total} lộ trình`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                    expandable={{
                        expandedRowRender: (record) => (
                            <div style={{ padding: "0 48px" }}>
                                <h4>Danh sách khóa học trong lộ trình:</h4>
                                {record.courses?.length > 0 ? (
                                    <div>
                                        {record.courses.map((course, index) => (
                                            <div
                                                key={course.id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "16px",
                                                }}
                                            >
                                                <DraggableCourse
                                                    key={course.id}
                                                    course={course}
                                                    index={index}
                                                    moveHandler={(
                                                        dragIndex,
                                                        hoverIndex
                                                    ) =>
                                                        handleMoveCourse(
                                                            record.id,
                                                            dragIndex,
                                                            hoverIndex
                                                        )
                                                    }
                                                />
                                                <Button
                                                    type="link"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() =>
                                                        handleRemoveCourse(
                                                            record.id,
                                                            course.id
                                                        )
                                                    }
                                                >
                                                    Xóa khỏi lộ trình
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            color: "#999",
                                            textAlign: "center",
                                            padding: "20px 0",
                                        }}
                                    >
                                        Chưa có khóa học nào trong lộ trình này
                                    </div>
                                )}
                            </div>
                        ),
                    }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: "20px 0" }}>
                                <QuestionCircleOutlined
                                    style={{ fontSize: 24, marginBottom: 8 }}
                                />
                                <div>
                                    {searchText
                                        ? `Không tìm thấy lộ trình nào cho từ khóa "${searchText}"`
                                        : "Không có lộ trình nào"}
                                </div>
                            </div>
                        ),
                    }}
                />
            </DndProvider>

            {/* Create Modal */}
            <Modal
                title="Thêm lộ trình mới"
                open={isCreateModalVisible}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    createForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreatePath}
                >
                    <Form.Item
                        name="title"
                        label="Tên lộ trình"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên lộ trình!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[
                            { required: true, message: "Vui lòng nhập mô tả!" },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Hình ảnh"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) return e;
                            return e?.fileList;
                        }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn hình ảnh!",
                            },
                        ]}
                    >
                        <Upload
                            name="image"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>
                                Chọn hình ảnh
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm lộ trình
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Sửa lộ trình"
                open={isEditModalVisible}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setSelectedPath(null);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdatePath}>
                    <Form.Item
                        name="title"
                        label="Tên lộ trình"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên lộ trình!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[
                            { required: true, message: "Vui lòng nhập mô tả!" },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Hình ảnh"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) return e;
                            return e?.fileList;
                        }}
                    >
                        <Upload
                            name="image"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            accept="image/*"
                            fileList={form.getFieldValue("image")}
                        >
                            <Button icon={<UploadOutlined />}>
                                {form.getFieldValue("image")?.length > 0
                                    ? "Thay đổi ảnh"
                                    : "Chọn hình ảnh"}
                            </Button>
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
                open={isDeleteModalVisible}
                onOk={handleDeletePath}
                onCancel={() => {
                    setIsDeleteModalVisible(false);
                    setSelectedPath(null);
                }}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Bạn có chắc chắn muốn xóa lộ trình{" "}
                    <strong>{selectedPath?.title}</strong> không? Hành động này
                    không thể hoàn tác.
                </p>
            </Modal>

            {/* Add Course Modal */}
            <Modal
                title="Thêm khóa học vào lộ trình"
                open={isAddCourseModalVisible}
                onCancel={() => {
                    setIsAddCourseModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleAddCourse}>
                    <Form.Item
                        name="course_id"
                        label="Chọn khóa học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn khóa học!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn khóa học để thêm vào lộ trình"
                            showSearch
                            optionFilterProp="children"
                            options={
                                coursesData?.data?.courses
                                    ?.filter(
                                        (course) =>
                                            !selectedPath?.courses?.find(
                                                (c) => c.id === course.id
                                            )
                                    )
                                    .map((course) => ({
                                        value: course.id,
                                        label: course.title,
                                    })) || []
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm khóa học
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default LearningPathManagement;
