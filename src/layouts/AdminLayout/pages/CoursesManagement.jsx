import { useEffect, useState, useCallback } from "react";
import {
    Table,
    Space,
    Button,
    Tag,
    Input,
    Modal,
    Form,
    Upload,
    Select,
    message,
    Switch,
} from "antd";
import {
    SearchOutlined,
    CheckCircleOutlined,
    StopOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    useGetAllCoursesManagementQuery,
    useUpdateCourseStatusMutation,
    useDeleteCourseMutation,
    useCreateCourseMutation,
    useUpdateCourseMutation,
} from "@/services/admin/courseApi";
import isHttps from "@/utils/isHttps";

const { Search } = Input;
const { TextArea } = Input;

function CoursesManagement() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [editFileList, setEditFileList] = useState([]);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [courses, setCourses] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const {
        data: coursesData,
        isLoading,
        refetch,
    } = useGetAllCoursesManagementQuery(
        {
            page: currentPage,
            limit: pageSize,
            search: searchQuery,
        },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );

    const [updateCourseStatus] = useUpdateCourseStatusMutation();
    const [deleteCourse] = useDeleteCourseMutation();
    const [createCourse] = useCreateCourseMutation();
    const [updateCourse] = useUpdateCourseMutation();

    useEffect(() => {
        if (coursesData) {
            setCourses(coursesData.data.courses);
            setTotalItems(coursesData.data.pagination.totalItems);
        }
    }, [coursesData]);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên khóa học",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Giảng viên",
            dataIndex: "creator",
            render: (_, record) => record.creator.full_name,
            key: "creator",
        },

        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "published" ? "green" : "orange"}>
                    {status === "published" ? "Đã duyệt" : "Chờ duyệt"}
                </Tag>
            ),
        },
        {
            title: "Học viên",
            dataIndex: "total_view",
            key: "total_view",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    {record.status === "draft" ? (
                        <Button
                            icon={<CheckCircleOutlined />}
                            type="primary"
                            onClick={async () => {
                                try {
                                    await updateCourseStatus({
                                        id: record.id,
                                        status: "published",
                                    }).unwrap();

                                    refetch();
                                } catch (error) {
                                    message.error(
                                        "Có lỗi xảy ra khi duyệt khóa học"
                                    );
                                }
                            }}
                        >
                            Duyệt
                        </Button>
                    ) : (
                        <Button
                            icon={<StopOutlined />}
                            danger
                            onClick={async () => {
                                try {
                                    await updateCourseStatus({
                                        id: record.id,
                                        status: "draft",
                                    }).unwrap();
                                    refetch();
                                } catch (error) {
                                    message.error(
                                        "Có lỗi xảy ra khi hủy duyệt khóa học"
                                    );
                                }
                            }}
                        >
                            Hủy duyệt
                        </Button>
                    )}
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedCourse(record);

                            form.setFieldsValue({
                                ...record,
                                what_you_learn: Array.isArray(
                                    record.what_you_learn
                                )
                                    ? record.what_you_learn.join(",") // JSON → string
                                    : JSON.parse(record.what_you_learn).join(
                                          "\n"
                                      ),
                                requirement:
                                    Array.isArray(record.requirement) || ""
                                        ? record.requirement.join("\n") // JSON → string
                                        : JSON.parse(record.requirement).join(
                                              "\n"
                                          ) || "",
                            });

                            // Set thumbnail preview như cũ
                            if (record.thumbnail) {
                                setEditFileList([
                                    {
                                        uid: "-1",
                                        name: record.thumbnail,
                                        status: "done",
                                        url: isHttps(record.thumbnail)
                                            ? record.thumbnail
                                            : `${
                                                  import.meta.env.VITE_BASE_URL
                                              }${record.thumbnail}`,
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
                            setSelectedCourse(record);
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
            <h2>Quản lý khóa học</h2>
            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Search
                    placeholder="Tìm kiếm khóa học"
                    allowClear
                    enterButton={<SearchOutlined />}
                    style={{ width: 300 }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Tạo khóa học mới
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={courses}
                loading={isLoading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalItems,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} khóa học`,
                }}
            />

            {/* Create Modal */}
            <Modal
                title="Tạo khóa học mới"
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
                                    key === "thumbnail" &&
                                    values[key]?.fileList?.[0]?.originFileObj
                                ) {
                                    formData.append(
                                        key,
                                        values[key].fileList[0].originFileObj
                                    );
                                } else if (
                                    key === "what_you_learn" ||
                                    key === "requirement"
                                ) {
                                    const arr = values[key]
                                        .split("\n")
                                        .map((item) => item.trim())
                                        .filter(Boolean);
                                    formData.append(key, JSON.stringify(arr));
                                } else if (key === "is_pro") {
                                    formData.append(
                                        key,
                                        values[key] ? true : false
                                    );
                                } else {
                                    formData.append(key, values[key]);
                                }
                            });

                            await createCourse(formData).unwrap();
                            message.success("Tạo khóa học thành công");
                            refetch();
                            setIsCreateModalOpen(false);
                            createForm.resetFields();
                        } catch (error) {
                            message.error("Có lỗi xảy ra khi tạo khóa học");
                        }
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiêu đề!",
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
                        name="what_you_learn"
                        label="Bạn sẽ học được gì"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập nội dung học!",
                            },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="requirement"
                        label="Yêu cầu"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập yêu cầu!",
                            },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="level"
                        label="Cấp độ"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn cấp độ!",
                            },
                        ]}
                    >
                        <Select>
                            <Select.Option value="beginner">
                                Beginner
                            </Select.Option>
                            <Select.Option value="intermediate">
                                Intermediate
                            </Select.Option>
                            <Select.Option value="advanced">
                                Advanced
                            </Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Giá khóa học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá khóa học!",
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            min={0}
                            placeholder="Nhập giá (VNĐ)"
                        />
                    </Form.Item>

                    <Form.Item name="old_price" label="Giá gốc (tùy chọn)">
                        <Input
                            type="number"
                            min={0}
                            placeholder="Nhập giá gốc (VNĐ)"
                        />
                    </Form.Item>

                    <Form.Item
                        name="is_pro"
                        valuePropName="checked"
                        label="Khóa học Pro"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="thumbnail"
                        label="Thumbnail"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ảnh thumbnail!",
                            },
                        ]}
                    >
                        <Upload
                            maxCount={1}
                            beforeUpload={() => false}
                            accept="image/*"
                            listType="picture-card"
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tạo khóa học
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Sửa khóa học"
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
                                    key === "thumbnail" &&
                                    values[key]?.fileList?.[0]?.originFileObj
                                ) {
                                    formData.append(
                                        key,
                                        values[key].fileList[0].originFileObj
                                    );
                                } else if (
                                    key === "what_you_learn" ||
                                    key === "requirement"
                                ) {
                                    const arr = values[key]
                                        .split("\n")
                                        .map((item) => item.trim())
                                        .filter(Boolean);
                                    formData.append(key, JSON.stringify(arr));
                                } else if (key === "is_pro") {
                                    formData.append(
                                        key,
                                        values[key] ? true : false
                                    );
                                } else {
                                    formData.append(key, values[key]);
                                }
                            });

                            await updateCourse({
                                id: selectedCourse.id,
                                formData,
                            }).unwrap();
                            message.success("Cập nhật khóa học thành công");
                            refetch();
                            setIsEditModalOpen(false);
                        } catch (error) {
                            message.error(
                                "Có lỗi xảy ra khi cập nhật khóa học"
                            );
                        }
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiêu đề!",
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
                        name="what_you_learn"
                        label="Bạn sẽ học được gì"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập nội dung học!",
                            },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="requirement"
                        label="Yêu cầu"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập yêu cầu!",
                            },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="level"
                        label="Cấp độ"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn cấp độ!",
                            },
                        ]}
                    >
                        <Select>
                            <Select.Option value="beginner">
                                Beginner
                            </Select.Option>
                            <Select.Option value="intermediate">
                                Intermediate
                            </Select.Option>
                            <Select.Option value="advanced">
                                Advanced
                            </Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Giá khóa học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá khóa học!",
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            min={0}
                            placeholder="Nhập giá (VNĐ)"
                        />
                    </Form.Item>

                    <Form.Item name="old_price" label="Giá gốc (tùy chọn)">
                        <Input
                            type="number"
                            min={0}
                            placeholder="Nhập giá gốc (VNĐ)"
                        />
                    </Form.Item>

                    <Form.Item
                        name="is_pro"
                        valuePropName="checked"
                        label="Khóa học Pro"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item name="thumbnail" label="Thumbnail">
                        <Upload
                            maxCount={1}
                            fileList={editFileList}
                            onChange={({ fileList }) =>
                                setEditFileList(fileList)
                            }
                            beforeUpload={() => false}
                            accept="image/*"
                            listType="picture-card"
                        >
                            {editFileList.length === 0 && (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>
                                        Tải ảnh lên
                                    </div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    {/* <Form.Item
                        name="thumbnail"
                        label="Thumbnail"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ảnh thumbnail!",
                            },
                        ]}
                    >
                        <Upload
                            maxCount={1}
                            beforeUpload={() => false}
                            accept="image/*"
                            listType="picture-card"
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                            </div>
                        </Upload>
                    </Form.Item> */}

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
                        await deleteCourse(selectedCourse.id).unwrap();
                        message.success("Xóa khóa học thành công");
                        refetch();
                    } catch (err) {
                        message.error("Có lỗi xảy ra khi xóa khóa học");
                    }
                    setIsDeleteModalOpen(false);
                }}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Bạn có chắc chắn muốn xóa khóa học{" "}
                    <strong>{selectedCourse?.title}</strong> không?
                </p>
            </Modal>
        </div>
    );
}

export default CoursesManagement;
