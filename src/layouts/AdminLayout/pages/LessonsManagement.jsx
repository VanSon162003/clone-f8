import { useState, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
    Space,
    Button,
    Input,
    Modal,
    Form,
    Select,
    Upload,
    message,
    Card,
    Pagination,
    Collapse,
} from "antd";
import VideoUploader from "@/components/Editor/VideoUploader";
import Editor from "@/components/Editor";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
    useGetAllLessonsManagementQuery,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useUpdateLessonPositionMutation,
} from "@/services/admin/lessonsService";
import { useGetAllTracksManagementQuery } from "@/services/admin/tracksService";
import useDebounce from "@/hook/useDebounce";
import LessonItem from "./LessonItem";
import isHttps from "@/utils/isHttps";

const { TextArea } = Input;

function LessonsManagement() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const debouncedSearchText = useDebounce(searchText, 500);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();

    const handleMoveLesson = async (dragIndex, hoverIndex, track) => {
        try {
            const movingLesson = track.lessons[dragIndex];
            const newPosition = hoverIndex;

            // Update position in the backend
            await updateLessonPosition({
                lessonId: movingLesson.id,
                position: newPosition,
                trackId: track.id,
            }).unwrap();

            message.success("Di chuyển bài học thành công");
            refetch();
        } catch (err) {
            console.error("Error moving lesson:", err);
            message.error(
                err.data?.message || "Có lỗi xảy ra khi di chuyển bài học"
            );
        }
    };

    const handleEdit = (lesson) => {
        setSelectedLesson(lesson);

        // Chuẩn bị fileList cho thumbnail nếu có
        let thumbnailList = [];
        if (lesson.thumbnail) {
            thumbnailList = [
                {
                    uid: "-1",
                    name: "current-thumbnail",
                    status: "done",
                    url: isHttps(lesson.thumbnail)
                        ? lesson.thumbnail
                        : `${import.meta.env.VITE_BASE_URL}${lesson.thumbnail}`,
                },
            ];
        }

        // Chuẩn bị video url
        let videoUrl = lesson.video_url;
        if (videoUrl && !isHttps(videoUrl)) {
            videoUrl = `${import.meta.env.VITE_BASE_URL}${videoUrl}`;
        }

        // Set giá trị cho form
        form.setFieldsValue({
            title: lesson.title,
            track_id: lesson.track.id,
            video_type: lesson.video_type,
            video_url: videoUrl,
            content: lesson.content,
            thumbnail: thumbnailList,
        });

        setIsEditModalOpen(true);
    };

    // API hooks
    const { data: tracksData } = useGetAllTracksManagementQuery(
        {
            page: 1,
            limit: 100,
            search: "",
        },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );

    const {
        data: lessonsData,
        refetch,
        isFetching,
    } = useGetAllLessonsManagementQuery(
        {
            search: debouncedSearchText,
            track_id: selectedTrack,
            course_id: selectedCourse,
            limit: 100000, // Set high limit to get all lessons
        },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );

    // Organize lessons and tracks by course
    const organizedData = useMemo(() => {
        if (!tracksData?.data?.tracks) return [];

        // First, organize all tracks by course
        const tracksByCourse = {};
        tracksData.data.tracks.forEach((track) => {
            const courseId = track.course.id;

            if (!tracksByCourse[courseId]) {
                tracksByCourse[courseId] = {
                    id: courseId,
                    title: track.course.title,
                    tracks: {},
                };
            }

            tracksByCourse[courseId].tracks[track.id] = {
                ...track,
                lessons: [],
            };
        });

        // Then, add lessons to their respective tracks
        if (lessonsData?.data?.lessons) {
            lessonsData.data.lessons.forEach((lesson) => {
                const courseId = lesson.track.course.id;
                const trackId = lesson.track.id;

                if (tracksByCourse[courseId]?.tracks[trackId]) {
                    tracksByCourse[courseId].tracks[trackId].lessons.push(
                        lesson
                    );
                }
            });
        }

        // Convert to array and sort tracks within each course
        const organizedCourses = Object.values(tracksByCourse).map(
            (course) => ({
                ...course,
                tracks: Object.values(course.tracks)
                    .sort((a, b) => a.position - b.position)
                    .map((track) => ({
                        ...track,
                        lessons: track.lessons.sort(
                            (a, b) => a.position - b.position
                        ),
                    })),
            })
        );

        // Filter by selected course if any
        const filteredCourses = selectedCourse
            ? organizedCourses.filter((course) => course.id === selectedCourse)
            : organizedCourses;

        // Apply pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return {
            total: filteredCourses.length,
            items: filteredCourses.slice(startIndex, endIndex),
        };
    }, [
        tracksData?.data?.tracks,
        lessonsData?.data?.lessons,
        selectedCourse,
        currentPage,
        pageSize,
    ]);

    const [createLesson] = useCreateLessonMutation();
    const [updateLesson] = useUpdateLessonMutation();
    const [deleteLesson] = useDeleteLessonMutation();
    const [updateLessonPosition] = useUpdateLessonPositionMutation();

    return (
        <div>
            <h2>Quản lý bài học</h2>
            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                }}
            >
                <Space>
                    <Input.Search
                        placeholder="Tìm kiếm bài học..."
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        loading={isFetching}
                        allowClear
                    />
                    <Select
                        style={{ width: 300 }}
                        placeholder="Lọc theo khóa học"
                        allowClear
                        showSearch
                        loading={isFetching}
                        optionFilterProp="label"
                        value={selectedCourse}
                        onChange={(value) => {
                            setSelectedCourse(value);
                            setSelectedTrack(null); // Reset track when changing course
                            setCurrentPage(1); // Reset page when changing course
                        }}
                        options={
                            tracksData?.data?.tracks?.reduce((acc, track) => {
                                const course = track.course;
                                if (
                                    !acc.some(
                                        (item) => item.value === course.id
                                    )
                                ) {
                                    acc.push({
                                        value: course.id,
                                        label: course.title,
                                    });
                                }
                                return acc;
                            }, []) || []
                        }
                    />
                    <Select
                        style={{ width: 300 }}
                        placeholder="Lọc theo chương"
                        allowClear
                        showSearch
                        loading={isFetching}
                        optionFilterProp="label"
                        value={selectedTrack}
                        onChange={(value) => {
                            setSelectedTrack(value);
                            setCurrentPage(1); // Reset page when changing track
                        }}
                        options={
                            tracksData?.data?.tracks
                                ?.filter(
                                    (track) =>
                                        !selectedCourse ||
                                        track.course.id === selectedCourse
                                )
                                ?.map((track) => ({
                                    value: track.id,
                                    label: `${track.title} - ${track.course.title}`,
                                })) || []
                        }
                    />
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Thêm bài học mới
                </Button>
            </div>

            <DndProvider backend={HTML5Backend}>
                {isFetching ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <div className="ant-spin ant-spin-lg ant-spin-spinning">
                            <span className="ant-spin-dot ant-spin-dot-spin">
                                <i className="ant-spin-dot-item"></i>
                                <i className="ant-spin-dot-item"></i>
                                <i className="ant-spin-dot-item"></i>
                                <i className="ant-spin-dot-item"></i>
                            </span>
                        </div>
                        <div style={{ marginTop: 16, color: "#666" }}>
                            Đang tải dữ liệu...
                        </div>
                    </div>
                ) : organizedData?.items?.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <div
                            style={{
                                fontSize: 18,
                                color: "#666",
                                marginBottom: 16,
                            }}
                        >
                            {searchText ? (
                                <>
                                    Không tìm thấy bài học nào phù hợp với từ
                                    khóa "{searchText}"
                                </>
                            ) : selectedTrack ? (
                                <>Không có bài học nào trong chương đã chọn</>
                            ) : selectedCourse ? (
                                <>Không có bài học nào trong khóa học đã chọn</>
                            ) : (
                                <>Không có bài học nào</>
                            )}
                        </div>
                        <Button
                            type="primary"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Thêm bài học mới
                        </Button>
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <div style={{ marginBottom: 16, color: "#666" }}>
                                Kết quả tìm kiếm cho "{searchText}"
                            </div>
                        )}
                        <Collapse
                            defaultActiveKey={
                                selectedCourse ? [selectedCourse] : undefined
                            }
                        >
                            {organizedData?.items?.map((course) => (
                                <Collapse.Panel
                                    key={course.id}
                                    header={
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                width: "100%",
                                            }}
                                        >
                                            <span>{course.title}</span>
                                            <span
                                                style={{
                                                    fontSize: "0.9em",
                                                    color: "#666",
                                                }}
                                            >
                                                {course.tracks.reduce(
                                                    (total, track) =>
                                                        total +
                                                        track.lessons.length,
                                                    0
                                                )}{" "}
                                                bài học
                                            </span>
                                        </div>
                                    }
                                >
                                    {course.tracks.map((track) => (
                                        <Card
                                            key={track.id}
                                            title={
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <span>{track.title}</span>
                                                    <span
                                                        style={{
                                                            fontSize: "0.9em",
                                                            color: "#666",
                                                        }}
                                                    >
                                                        {track.lessons.length}{" "}
                                                        bài học
                                                    </span>
                                                </div>
                                            }
                                            style={{ marginBottom: 16 }}
                                        >
                                            {track.lessons.length === 0 ? (
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                        padding: "20px 0",
                                                        color: "#666",
                                                    }}
                                                >
                                                    Chưa có bài học nào trong
                                                    chương này
                                                </div>
                                            ) : (
                                                track.lessons.map(
                                                    (lesson, index) => (
                                                        <LessonItem
                                                            key={lesson.id}
                                                            lesson={lesson}
                                                            index={index}
                                                            handleEdit={
                                                                handleEdit
                                                            }
                                                            setSelectedLesson={
                                                                setSelectedLesson
                                                            }
                                                            setIsDeleteModalOpen={
                                                                setIsDeleteModalOpen
                                                            }
                                                            onMoveLesson={(
                                                                dragIndex,
                                                                hoverIndex
                                                            ) =>
                                                                handleMoveLesson(
                                                                    dragIndex,
                                                                    hoverIndex,
                                                                    track
                                                                )
                                                            }
                                                        />
                                                    )
                                                )
                                            )}
                                        </Card>
                                    ))}
                                </Collapse.Panel>
                            ))}
                        </Collapse>
                    </>
                )}
                <div style={{ marginTop: 16, textAlign: "right" }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={organizedData.total}
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                        showSizeChanger
                        showTotal={(total) => `Tổng số ${total} khóa học`}
                    />
                </div>
            </DndProvider>

            {/* Create Modal */}
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
                        console.log(values);

                        try {
                            const formData = new FormData();
                            Object.keys(values).forEach((key) => {
                                if (
                                    key === "thumbnail" &&
                                    values[key]?.[0]?.originFileObj
                                ) {
                                    formData.append(
                                        "thumbnail",
                                        values[key][0].originFileObj
                                    );
                                } else if (
                                    key === "video_url" &&
                                    values.video_type === "upload" &&
                                    values[key]
                                ) {
                                    formData.append("video_url", values[key]);
                                } else {
                                    formData.append(key, values[key] || "");
                                }
                            });

                            await createLesson(formData).unwrap();
                            message.success("Thêm bài học mới thành công");
                            setIsCreateModalOpen(false);
                            createForm.resetFields();
                            refetch();
                        } catch (error) {
                            console.error("Error adding lesson:", error);
                            message.error(
                                error.data?.message ||
                                    "Có lỗi xảy ra khi thêm bài học mới"
                            );
                        }
                    }}
                >
                    <Form.Item
                        name="track_id"
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
                            showSearch
                            optionFilterProp="label"
                            options={
                                tracksData?.data?.tracks?.map((track) => ({
                                    value: track.id,
                                    label: `${track.title} - ${track.course.title}`,
                                })) || []
                            }
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
                        name="thumbnail"
                        label="Thumbnail"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e?.fileList;
                        }}
                    >
                        <Upload
                            name="thumbnail"
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

                    <Form.Item
                        name="video_type"
                        label="Loại video"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn loại video!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn loại video"
                            options={[
                                { value: "youtube", label: "Youtube" },
                                { value: "vimeo", label: "Vimeo" },
                                { value: "upload", label: "Upload" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.video_type !== currentValues.video_type
                        }
                    >
                        {({ getFieldValue }) =>
                            getFieldValue("video_type") === "upload" ? (
                                <Form.Item name="video_url" label="Video">
                                    <VideoUploader
                                        onChange={(file) => {
                                            createForm.setFieldValue(
                                                "video_url",
                                                file
                                            );
                                        }}
                                    />
                                </Form.Item>
                            ) : (
                                <Form.Item
                                    name="video_url"
                                    label="URL Video"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập URL video!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Nhập URL video từ Youtube hoặc Vimeo" />
                                </Form.Item>
                            )
                        }
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung bài học"
                        rules={[
                            {
                                required: true,
                                validator: (_, value) => {
                                    // Kiểm tra nội dung rỗng hoặc chỉ có thẻ p trống
                                    if (
                                        !value ||
                                        value.trim() === "" ||
                                        value === "<p><br></p>" ||
                                        value === "<p></p>"
                                    ) {
                                        return Promise.reject(
                                            "Vui lòng nhập nội dung bài học!"
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                        validateTrigger={["onChange", "onBlur"]}
                    >
                        <Editor
                            type="admin"
                            onContentChange={(content) => {
                                createForm.setFieldsValue({ content });
                                createForm.validateFields(["content"]);
                            }}
                        />
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
                    form.resetFields();
                    setSelectedLesson(null);
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
                                    values[key]?.[0]?.originFileObj
                                ) {
                                    formData.append(
                                        "thumbnail",
                                        values[key][0].originFileObj
                                    );
                                } else if (
                                    key === "video_url" &&
                                    values.video_type === "upload" &&
                                    values[key]
                                ) {
                                    formData.append("video_url", values[key]);
                                } else {
                                    formData.append(key, values[key] || "");
                                }
                            });

                            await updateLesson({
                                id: selectedLesson.id,
                                formData,
                            }).unwrap();
                            message.success("Cập nhật bài học thành công");
                            setIsEditModalOpen(false);
                            form.resetFields();
                            refetch();
                        } catch (error) {
                            console.error("Error updating lesson:", error);
                            message.error(
                                error.data?.message ||
                                    "Có lỗi xảy ra khi cập nhật bài học"
                            );
                        }
                    }}
                >
                    <Form.Item
                        name="track_id"
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
                            showSearch
                            optionFilterProp="label"
                            options={
                                tracksData?.data?.tracks?.map((track) => ({
                                    value: track.id,
                                    label: `${track.title} - ${track.course.title}`,
                                })) || []
                            }
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
                        name="thumbnail"
                        label="Thumbnail"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }

                            return e?.fileList;
                        }}
                    >
                        <Upload
                            name="thumbnail"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            accept="image/*"
                            fileList={form.getFieldValue("thumbnail")}
                            showUploadList={{
                                showPreviewIcon: true,
                                showRemoveIcon: true,
                            }}
                        >
                            <Button icon={<UploadOutlined />}>
                                {form.getFieldValue("thumbnail")?.length > 0
                                    ? "Thay đổi ảnh"
                                    : "Chọn hình ảnh"}
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="video_type"
                        label="Loại video"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn loại video!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn loại video"
                            options={[
                                { value: "youtube", label: "Youtube" },
                                { value: "vimeo", label: "Vimeo" },
                                { value: "upload", label: "Upload" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.video_type !== currentValues.video_type
                        }
                    >
                        {({ getFieldValue }) =>
                            getFieldValue("video_type") === "upload" ||
                            getFieldValue("video_type") === "Upload" ? (
                                <Form.Item name="video_url" label="Video">
                                    <VideoUploader
                                        defaultValue={selectedLesson?.video_url}
                                        onChange={(file) => {
                                            form.setFieldValue(
                                                "video_url",
                                                file
                                            );
                                        }}
                                    />
                                </Form.Item>
                            ) : (
                                <Form.Item
                                    name="video_url"
                                    label="URL Video"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập URL video!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Nhập URL video từ Youtube hoặc Vimeo" />
                                </Form.Item>
                            )
                        }
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung bài học"
                        rules={[
                            {
                                required: true,
                                validator: (_, value) => {
                                    // Kiểm tra nội dung rỗng hoặc chỉ có thẻ p trống
                                    if (
                                        !value ||
                                        value.trim() === "" ||
                                        value === "<p><br></p>" ||
                                        value === "<p></p>"
                                    ) {
                                        return Promise.reject(
                                            "Vui lòng nhập nội dung bài học!"
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                        validateTrigger={["onChange", "onBlur"]}
                    >
                        <Editor
                            type="admin"
                            content={selectedLesson?.content}
                            onContentChange={(content) => {
                                form.setFieldsValue({ content });
                                form.validateFields(["content"]);
                            }}
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
                        await deleteLesson(selectedLesson.id).unwrap();
                        message.success("Xóa bài học thành công");
                        refetch();
                    } catch (error) {
                        console.error("Error deleting lesson:", error);
                        message.error(
                            error.data?.message ||
                                "Có lỗi xảy ra khi xóa bài học"
                        );
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
