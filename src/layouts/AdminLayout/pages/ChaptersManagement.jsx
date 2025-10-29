import { useState, useRef } from "react";
import {
    Table,
    Space,
    Button,
    Input,
    Modal,
    Form,
    Select,
    message,
} from "antd";
import useDebounce from "@/hook/useDebounce";
import PropTypes from "prop-types";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    MenuOutlined,
} from "@ant-design/icons";
import { arrayMoveImmutable } from "array-move";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
    useGetAllTracksManagementQuery,
    useCreateTrackMutation,
    useUpdateTrackMutation,
    useDeleteTrackMutation,
    useUpdateTrackPositionsMutation,
} from "@/services/admin/tracksService";
import { useGetAllCoursesManagementQuery } from "@/services/admin/coursesManagementService";

// Component imports and types defined above

const DraggableRow = ({
    index,
    moveRow,
    className,
    style,
    record,
    ...restProps
}) => {
    const ref = useRef(null);

    DraggableRow.propTypes = {
        index: PropTypes.number.isRequired,
        moveRow: PropTypes.func.isRequired,
        className: PropTypes.string,
        style: PropTypes.object,
        record: PropTypes.object.isRequired,
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
            moveRow(item.index, index, item.record, record);
        },
    });

    const [, drag] = useDrag({
        type: "DraggableRow",
        item: { index, record },
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

function ChaptersManagement() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 500);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();

    // API hooks
    const { data: coursesData } = useGetAllCoursesManagementQuery(
        {
            page: 1,
            limit: 100, // Get all courses for the dropdown
            search: "", // Empty search to get all courses
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );
    const {
        data: tracksData,
        isLoading,
        refetch,
    } = useGetAllTracksManagementQuery(
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

    const [createTrack] = useCreateTrackMutation();
    const [updateTrack] = useUpdateTrackMutation();
    const [deleteTrack] = useDeleteTrackMutation();
    const [updateTrackPositions] = useUpdateTrackPositionsMutation();

    const moveRow = async (dragIndex, hoverIndex, dragRecord, hoverRecord) => {
        // Only allow reordering within the same course
        if (dragRecord.course.id !== hoverRecord.course.id) {
            message.warning(
                "Chỉ có thể sắp xếp chương trong cùng một khóa học"
            );
            return;
        }

        const courseTracks = tracksData?.data?.tracks.filter(
            (track) => track.course.id === dragRecord.course.id
        );

        if (!courseTracks) return;

        // Find the current indices within the course group
        const courseTrackIndices = courseTracks.map((t) => t.id);
        const dragTrackIndex = courseTrackIndices.indexOf(dragRecord.id);
        const hoverTrackIndex = courseTrackIndices.indexOf(hoverRecord.id);

        const newCourseTracks = arrayMoveImmutable(
            courseTracks,
            dragTrackIndex,
            hoverTrackIndex
        );

        try {
            await updateTrackPositions({
                tracks: newCourseTracks.map((track, index) => ({
                    id: track.id,
                    position: index + 1,
                })),
            }).unwrap();
            refetch();
        } catch (error) {
            message.error(
                error.data?.message ||
                    "Có lỗi xảy ra khi cập nhật vị trí chương"
            );
        }
    };

    // Group tracks by course
    const groupedTracks = tracksData?.data?.tracks?.reduce((acc, track) => {
        const courseId = track.course.id;
        if (!acc[courseId]) {
            acc[courseId] = {
                course: track.course,
                tracks: [],
            };
        }
        acc[courseId].tracks.push(track);
        return acc;
    }, {});

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên chương",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Vị trí",
            dataIndex: "position",
            key: "position",
            render: (_, record) => record.position,
            width: 80,
        },
        {
            title: "Khoá học",
            dataIndex: "course",
            render: (_, record) => record.course.title,
            key: "course",
        },
        {
            title: "Số bài học",
            dataIndex: "total_lessons",
            key: "total_lessons",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedChapter(record);
                            // Reset form and set values after a short delay to ensure proper initialization
                            setTimeout(() => {
                                form.setFieldsValue({
                                    title: record.title,
                                    course_id: record.course.id,
                                });
                            }, 100);
                            setIsEditModalOpen(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => {
                            setSelectedChapter(record);
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
            <h2>Quản lý chương học</h2>
            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Input.Search
                    placeholder="Tìm kiếm chương học..."
                    style={{ width: 300 }}
                    allowClear
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                    }}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Thêm chương mới
                </Button>
            </div>
            <DndProvider backend={HTML5Backend}>
                <Table
                    components={{
                        body: {
                            row: DraggableRow,
                        },
                    }}
                    dataSource={Object.values(groupedTracks || {}).flatMap(
                        (group) =>
                            group.tracks.map((track) => ({
                                ...track,
                                courseTitle: group.course.title,
                                groupKey: `course-${group.course.id}`,
                            }))
                    )}
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
                    expandable={{
                        expandedRowKeys: Object.values(groupedTracks || {}).map(
                            (group) => `course-${group.course.id}`
                        ),
                        expandIcon: () => null,
                    }}
                    groupBy="courseTitle"
                    loading={isLoading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: tracksData?.data?.pagination?.total || 0,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} chương`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                    onRow={(record, index) => ({
                        index,
                        moveRow,
                        record,
                    })}
                    rowKey="id"
                />
            </DndProvider>

            {/* Create Modal */}
            <Modal
                title="Thêm chương mới"
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
                            await createTrack({
                                ...values,
                            }).unwrap();
                            message.success("Thêm chương mới thành công");
                            setIsCreateModalOpen(false);
                            createForm.resetFields();
                        } catch (error) {
                            console.error("Error adding chapter:", error);
                            message.error("Có lỗi xảy ra khi thêm chương mới");
                        }
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Tên chương"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên chương!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

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
                            showSearch
                            optionFilterProp="label"
                            loading={!coursesData}
                            options={
                                coursesData?.data?.courses?.map((course) => ({
                                    value: course.id,
                                    label: course.title,
                                })) || []
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm chương
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Sửa chương"
                open={isEditModalOpen}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    form.resetFields();
                    setSelectedChapter(null);
                }}
                afterClose={() => {
                    form.resetFields();
                    setSelectedChapter(null);
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={async (values) => {
                        try {
                            await updateTrack({
                                id: selectedChapter.id,
                                ...values,
                            }).unwrap();
                            message.success("Cập nhật chương thành công");
                            setIsEditModalOpen(false);
                        } catch (error) {
                            console.error("Error updating chapter:", error);
                            message.error("Có lỗi xảy ra khi cập nhật chương");
                        }
                    }}
                    // We don't need initialValues here as we're setting values when opening the modal
                >
                    <Form.Item
                        name="title"
                        label="Tên chương"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên chương!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

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
                            showSearch
                            optionFilterProp="label"
                            loading={!coursesData}
                            options={
                                coursesData?.data?.courses?.map((course) => ({
                                    value: course.id,
                                    label: course.title,
                                })) || []
                            }
                        />
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
                        await deleteTrack(selectedChapter.id).unwrap();
                        message.success("Xóa chương thành công");
                        refetch();
                    } catch (error) {
                        console.error("Error deleting chapter:", error);
                        message.error("Có lỗi xảy ra khi xóa chương");
                    }
                    setIsDeleteModalOpen(false);
                }}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Bạn có chắc chắn muốn xóa chương{" "}
                    <strong>{selectedChapter?.title}</strong> không?
                </p>
            </Modal>
        </div>
    );
}

export default ChaptersManagement;
