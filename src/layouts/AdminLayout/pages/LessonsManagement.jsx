import { useState, useMemo, useRef, useEffect } from "react";
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
    Tag,
    Divider,
    Tooltip,
    Radio,
} from "antd";
import VideoUploader from "@/components/Editor/VideoUploader";
import Editor from "@/components/Editor";
import {
    PlusOutlined,
    UploadOutlined,
    MinusCircleOutlined,
    CodeOutlined,
    BookOutlined,
    EditOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    BulbOutlined,
} from "@ant-design/icons";
import {
    useGetAllLessonsManagementQuery,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useUpdateLessonPositionMutation,
} from "@/services/admin/lessonsService";
import {
    useGetExerciseByLessonIdQuery,
    useUpsertExerciseMutation,
    useDeleteExerciseMutation,
    useAiGenerateExerciseMutation,
} from "@/services/admin/exercisesService";
import { useGetAllTracksManagementQuery } from "@/services/admin/tracksService";
import useDebounce from "@/hook/useDebounce";
import LessonItem from "./LessonItem";
import isHttps from "@/utils/isHttps";

const { TextArea } = Input;

function LessonsManagement() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
    const [exerciseLesson, setExerciseLesson] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const debouncedSearchText = useDebounce(searchText, 500);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();
    const [exerciseForm] = Form.useForm();

    // Inline Exercise creation/editing states
    const [createExerciseMethod, setCreateExerciseMethod] = useState("manual");
    const [createAiTopic, setCreateAiTopic] = useState("");
    const [createAiPreview, setCreateAiPreview] = useState(null);

    const [editExerciseMethod, setEditExerciseMethod] = useState("manual");
    const [editAiTopic, setEditAiTopic] = useState("");
    const [editAiPreview, setEditAiPreview] = useState(null);

    const [aiGenerateExercise, { isLoading: isAiGenerating }] = useAiGenerateExerciseMutation();

    const createLessonMode = Form.useWatch("lesson_mode", createForm);
    const createLessonType = Form.useWatch("lesson_type", createForm);
    const editLessonMode = Form.useWatch("lesson_mode", form);
    const editLessonType = Form.useWatch("lesson_type", form);

    const handleCreateAiGenerate = async () => {
        if (!createAiTopic.trim() || createAiTopic.trim().length < 5) {
            message.warning("Vui lòng nhập chủ đề bài tập (tối thiểu 5 ký tự)");
            return;
        }
        const language = createForm.getFieldValue("language") || "javascript";
        try {
            const result = await aiGenerateExercise({ topic: createAiTopic.trim(), language }).unwrap();
            const data = result.data;

            createForm.setFieldsValue({
                problem_statement: data.problem_statement,
                initial_code: data.initial_code,
                solution_code: data.solution_code,
                test_cases: data.test_cases.map((tc) => ({
                    name: tc.name,
                    input: String(tc.input ?? ""),
                    expected_output: String(tc.expected_output ?? ""),
                    is_hidden: Boolean(tc.is_hidden),
                })),
            });

            setCreateAiPreview({
                problem_statement: data.problem_statement,
                test_count: data.test_cases.length,
                hidden_count: data.test_cases.filter((tc) => tc.is_hidden).length,
            });

            message.success("AI đã sinh xong bài tập! Đã điền vào form, bạn có thể chỉnh sửa thêm.");
        } catch (err) {
            message.error(err.data?.message || err.message || "Có lỗi khi gọi AI");
        }
    };

    const handleEditAiGenerate = async () => {
        if (!editAiTopic.trim() || editAiTopic.trim().length < 5) {
            message.warning("Vui lòng nhập chủ đề bài tập (tối thiểu 5 ký tự)");
            return;
        }
        const language = form.getFieldValue("language") || "javascript";
        try {
            const result = await aiGenerateExercise({ topic: editAiTopic.trim(), language }).unwrap();
            const data = result.data;

            form.setFieldsValue({
                problem_statement: data.problem_statement,
                initial_code: data.initial_code,
                solution_code: data.solution_code,
                test_cases: data.test_cases.map((tc) => ({
                    name: tc.name,
                    input: String(tc.input ?? ""),
                    expected_output: String(tc.expected_output ?? ""),
                    is_hidden: Boolean(tc.is_hidden),
                })),
            });

            setEditAiPreview({
                problem_statement: data.problem_statement,
                test_count: data.test_cases.length,
                hidden_count: data.test_cases.filter((tc) => tc.is_hidden).length,
            });

            message.success("AI đã sinh xong bài tập! Đã điền vào form, bạn có thể chỉnh sửa thêm.");
        } catch (err) {
            message.error(err.data?.message || err.message || "Có lỗi khi gọi AI");
        }
    };

    const renderExerciseFields = (formInstance, methodState, setMethodState, aiTopicState, setAiTopicState, handleAiGenerateFunc, aiPreviewState, setAiPreviewState) => {
        const LANGUAGE_STARTER = {
            javascript: `// Viết hàm của bạn ở đây\\nfunction solution() {\\n\\n}`,
            html: `<!DOCTYPE html>\\n<html lang="vi">\\n<head>\\n  <meta charset="UTF-8">\\n  <title>Bài tập HTML</title>\\n</head>\\n<body>\\n  <!-- Viết code ở đây -->\\n</body>\\n</html>`,
            css: `/* Viết CSS ở đây */\\nbody {\\n\\n}`,
        };

        return (
            <div style={{ marginTop: 20 }}>
                <Divider orientation="left">Cấu hình bài tập</Divider>
                
                <Form.Item label="Cách tạo bài tập">
                    <Radio.Group
                        value={methodState}
                        onChange={(e) => setMethodState(e.target.value)}
                        optionType="button"
                        buttonStyle="solid"
                    >
                        <Radio.Button value="manual">
                            <EditOutlined style={{ marginRight: 6 }} />
                            Tự viết tay (Nhập thủ công)
                        </Radio.Button>
                        <Radio.Button value="ai">
                            <ThunderboltOutlined style={{ marginRight: 6 }} />
                            Tạo tự động bằng AI
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>

                {methodState === "ai" && (
                    <div
                        style={{
                            background: "linear-gradient(135deg, #f0f5ff 0%, #f6ffed 100%)",
                            border: "1px dashed #91caff",
                            borderRadius: 8,
                            padding: "16px 20px",
                            marginBottom: 20,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <ThunderboltOutlined style={{ color: "#1677ff", fontSize: 16 }} />
                            <span style={{ fontWeight: 600, color: "#1677ff", fontSize: 14 }}>
                                Sinh bài tập tự động bằng AI
                            </span>
                            <Tag color="blue" style={{ fontSize: 11, marginLeft: 4 }}>GPT-4o-mini</Tag>
                        </div>

                        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                                    Nhập chủ đề / yêu cầu ngắn gọn:
                                </div>
                                <Input
                                    value={aiTopicState}
                                    onChange={(e) => setAiTopicState(e.target.value)}
                                    placeholder="Ví dụ: Viết hàm tính tổng mảng số nguyên, Kiểm tra palindrome..."
                                    onPressEnter={handleAiGenerateFunc}
                                    maxLength={200}
                                    showCount
                                    disabled={isAiGenerating}
                                />
                            </div>
                            <Button
                                type="primary"
                                onClick={handleAiGenerateFunc}
                                loading={isAiGenerating}
                                style={{
                                    background: isAiGenerating ? undefined : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                    border: "none",
                                    minWidth: 150,
                                }}
                                icon={!isAiGenerating && <ThunderboltOutlined />}
                            >
                                {isAiGenerating ? "Đang sinh..." : "Tạo bài tập"}
                            </Button>
                        </div>

                        {aiPreviewState && (
                            <div
                                style={{
                                    marginTop: 12,
                                    padding: "10px 14px",
                                    background: "#fff",
                                    border: "1px solid #b7eb8f",
                                    borderRadius: 6,
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 10,
                                }}
                            >
                                <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 18, flexShrink: 0, marginTop: 2 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, color: "#389e0d", fontSize: 13, marginBottom: 4 }}>
                                        AI đã điền vào form ({aiPreviewState.test_count} test cases, {aiPreviewState.hidden_count} ẩn)
                                    </div>
                                    <div style={{ fontSize: 12, color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {aiPreviewState.problem_statement?.slice(0, 120)}...
                                    </div>
                                </div>
                                <Tooltip title="Xóa preview">
                                    <Button
                                        type="text"
                                        size="small"
                                        onClick={() => setAiPreviewState(null)}
                                        style={{ color: "#999", flexShrink: 0 }}
                                    >
                                        <CloseOutlined />
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                )}

                <Form.Item
                    name="language"
                    label="Ngôn ngữ lập trình"
                    rules={[{ required: true, message: "Vui lòng chọn ngôn ngữ!" }]}
                    initialValue="javascript"
                >
                    <Select
                        options={[
                            { value: "javascript", label: "JavaScript" },
                            { value: "html", label: "HTML" },
                            { value: "css", label: "CSS" },
                        ]}
                        onChange={(lang) => {
                            const currentInitial = formInstance.getFieldValue("initial_code");
                            if (!currentInitial || currentInitial.trim() === "") {
                                formInstance.setFieldValue("initial_code", LANGUAGE_STARTER[lang] || "");
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="problem_statement"
                    label="Đề bài"
                    rules={[{ required: true, message: "Vui lòng nhập đề bài!" }]}
                >
                    <TextArea
                        rows={5}
                        placeholder="Mô tả yêu cầu của bài tập, ví dụ: Viết hàm tính tổng hai số..."
                    />
                </Form.Item>

                <Form.Item
                    name="initial_code"
                    label="Code khởi đầu (học viên sẽ thấy phần này)"
                >
                    <TextArea
                        rows={5}
                        placeholder="Code template cho học viên"
                        style={{ fontFamily: "monospace", fontSize: 13 }}
                    />
                </Form.Item>

                <Form.Item
                    name="solution_code"
                    label="Code giải mẫu (chỉ admin xem)"
                >
                    <TextArea
                        rows={5}
                        placeholder="Code giải mẫu để tham khảo"
                        style={{ fontFamily: "monospace", fontSize: 13 }}
                    />
                </Form.Item>

                <Divider orientation="left">Test Cases</Divider>
                <Form.List
                    name="test_cases"
                    initialValue={[{ name: "Test 1", input: "", expected_output: "", is_hidden: false }]}
                    rules={[
                        {
                            validator: async (_, testCases) => {
                                if (!testCases || testCases.length < 1) {
                                    return Promise.reject(new Error("Cần ít nhất 1 test case!"));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Card
                                    key={key}
                                    size="small"
                                    style={{ marginBottom: 12, background: "#fafafa", border: "1px solid #e8e8e8" }}
                                    extra={
                                        fields.length > 1 ? (
                                            <Tooltip title="Xóa test case">
                                                <MinusCircleOutlined
                                                    onClick={() => remove(name)}
                                                    style={{ color: "#ff4d4f", cursor: "pointer" }}
                                                />
                                            </Tooltip>
                                        ) : null
                                    }
                                    title={`Test Case ${name + 1}`}
                                >
                                    <div style={{ display: "flex", gap: 16 }}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "name"]}
                                            label="Tên test"
                                            style={{ flex: 1, marginBottom: 0 }}
                                        >
                                            <Input placeholder="Tên mô tả test case" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "is_hidden"]}
                                            label="Ẩn với học viên"
                                            valuePropName="checked"
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Select
                                                style={{ width: 130 }}
                                                options={[
                                                    { value: false, label: "Hiện" },
                                                    { value: true, label: "Ẩn" },
                                                ]}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "input"]}
                                            label="Input (để trống nếu không cần)"
                                            style={{ flex: 1, marginBottom: 0 }}
                                        >
                                            <Input
                                                placeholder="Ví dụ: 5 hoặc [1,2,3]"
                                                style={{ fontFamily: "monospace" }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "expected_output"]}
                                            label="Kết quả mong đợi"
                                            rules={[{ required: true, message: "Cần nhập kết quả!" }]}
                                            style={{ flex: 1, marginBottom: 0 }}
                                        >
                                            <Input
                                                placeholder="Ví dụ: 15 hoặc true"
                                                style={{ fontFamily: "monospace" }}
                                            />
                                        </Form.Item>
                                    </div>
                                </Card>
                            ))}
                            <Form.ErrorList errors={errors} />
                            <Button
                                type="dashed"
                                onClick={() => add({ name: `Test ${fields.length + 1}`, input: "", expected_output: "", is_hidden: false })}
                                block
                                icon={<PlusOutlined />}
                            >
                                Thêm test case
                            </Button>
                        </>
                    )}
                </Form.List>
            </div>
        );
    };

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

    const handleManageExercise = (lesson) => {
        setExerciseLesson(lesson);
        setIsExerciseModalOpen(true);
    };

    const handleViewDetails = (lesson) => {
        setSelectedLesson(lesson);
        setIsViewModalOpen(true);
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

        // Set giá trị cho form
        form.setFieldsValue({
            lesson_mode: lesson.lesson_type === "Challenge" ? "exercise" : "lesson",
            lesson_type: lesson.lesson_type,
            title: lesson.title,
            track_id: lesson.track.id,
            video_type: lesson.video_type,
            video_url: lesson.video_url,
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
    const [upsertExercise, { isLoading: isUpsertingExercise }] = useUpsertExerciseMutation();
    const [deleteExercise, { isLoading: isDeletingExercise }] = useDeleteExerciseMutation();

    // Fetch exercise data when exercise modal is open
    const {
        data: exerciseData,
        isFetching: isFetchingExercise,
    } = useGetExerciseByLessonIdQuery(
        exerciseLesson?.id,
        { skip: !exerciseLesson || !isExerciseModalOpen }
    );

    // Fetch exercise data for selected lesson (if it is of type Challenge)
    const isEditChallenge = selectedLesson?.lesson_type === "Challenge";
    const {
        data: editExerciseData,
        isFetching: isFetchingEditExercise,
    } = useGetExerciseByLessonIdQuery(
        selectedLesson?.id,
        { skip: !selectedLesson || !isEditModalOpen || !isEditChallenge }
    );

    // Sync form values when exercise data loads for edit modal
    useEffect(() => {
        if (isEditModalOpen && selectedLesson && selectedLesson.lesson_type === "Challenge" && editExerciseData?.data) {
            const existingExercise = editExerciseData.data;
            const testCases = (existingExercise.test_cases || []).map((tc) => ({
                name: tc.name || "",
                input: tc.input !== undefined ? String(tc.input) : "",
                expected_output: tc.expected_output !== undefined ? String(tc.expected_output) : "",
                is_hidden: tc.is_hidden || false,
            }));
            form.setFieldsValue({
                language: existingExercise.language || "javascript",
                problem_statement: existingExercise.problem_statement || "",
                initial_code: existingExercise.initial_code || "",
                solution_code: existingExercise.solution_code || "",
                test_cases: testCases.length > 0 ? testCases : [{ name: "Test 1", input: "", expected_output: "", is_hidden: false }],
            });
        }
    }, [editExerciseData, isEditModalOpen, selectedLesson, form]);

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
                                                            handleViewDetails={
                                                                handleViewDetails
                                                            }
                                                            handleManageExercise={
                                                                handleManageExercise
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
            <Modal
                title="Thêm bài học mới"
                open={isCreateModalOpen}
                onCancel={() => {
                    setIsCreateModalOpen(false);
                    createForm.resetFields();
                    setCreateAiTopic("");
                    setCreateAiPreview(null);
                    setCreateExerciseMethod("manual");
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    initialValues={{
                        lesson_mode: "lesson",
                        lesson_type: "Lesson",
                    }}
                    onFinish={async (values) => {
                        try {
                            const formData = new FormData();
                            const lessonKeys = ["track_id", "title", "lesson_type", "video_type", "video_url", "content"];
                            lessonKeys.forEach((key) => {
                                if (values[key] !== undefined) {
                                    formData.append(key, values[key]);
                                }
                            });

                            if (values.thumbnail?.[0]?.originFileObj) {
                                formData.append("thumbnail", values.thumbnail[0].originFileObj);
                            }

                            const result = await createLesson(formData).unwrap();

                            if (values.lesson_type === "Challenge") {
                                const newLessonId = result.data.id;
                                await upsertExercise({
                                    lesson_id: newLessonId,
                                    problem_statement: values.problem_statement,
                                    language: values.language || "javascript",
                                    initial_code: values.initial_code || "",
                                    solution_code: values.solution_code || "",
                                    test_cases: (values.test_cases || []).map((tc, i) => ({
                                        name: tc.name || `Test ${i + 1}`,
                                        input: tc.input,
                                        expected_output: tc.expected_output,
                                        is_hidden: tc.is_hidden || false,
                                    })),
                                }).unwrap();
                            }

                            message.success("Thêm bài học mới thành công");
                            setIsCreateModalOpen(false);
                            createForm.resetFields();
                            setCreateAiTopic("");
                            setCreateAiPreview(null);
                            setCreateExerciseMethod("manual");
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
                        name="lesson_mode"
                        label="Hình thức bài học"
                        rules={[{ required: true, message: "Vui lòng chọn hình thức!" }]}
                    >
                        <Radio.Group
                            optionType="button"
                            buttonStyle="solid"
                            size="large"
                            onChange={(e) => {
                                const mode = e.target.value;
                                if (mode === "lesson") {
                                    createForm.setFieldValue("lesson_type", "Lesson");
                                } else {
                                    createForm.setFieldValue("lesson_type", "Challenge");
                                }
                            }}
                            style={{ width: "100%", display: "flex" }}
                        >
                            <Radio.Button value="lesson" style={{ flex: 1, textAlign: "center" }}>
                                <BookOutlined style={{ marginRight: 8 }} />
                                Bài học (Lý thuyết / Video)
                            </Radio.Button>
                            <Radio.Button value="exercise" style={{ flex: 1, textAlign: "center" }}>
                                <CodeOutlined style={{ marginRight: 8 }} />
                                Bài tập thực hành (Coding Challenge)
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="lesson_type" noStyle>
                        <input type="hidden" />
                    </Form.Item>

                    {createLessonMode === "lesson" && (
                        <Form.Item
                            name="lesson_type"
                            label="Loại bài học"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn loại bài học!",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn loại bài học"
                                options={[
                                    { value: "Lesson", label: "Bài học dạng lý thuyết / văn bản" },
                                    { value: "Video", label: "Bài học dạng video" },
                                ]}
                            />
                        </Form.Item>
                    )}

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

                    {createLessonType === "Video" && (
                        <>
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
                        </>
                    )}

                    {createLessonType !== "Challenge" && (
                        <Form.Item
                            name="content"
                            label="Nội dung bài học"
                            rules={[
                                {
                                    required: true,
                                    validator: (_, value) => {
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
                    )}

                    {createLessonType === "Challenge" &&
                        renderExerciseFields(
                            createForm,
                            createExerciseMethod,
                            setCreateExerciseMethod,
                            createAiTopic,
                            setCreateAiTopic,
                            handleCreateAiGenerate,
                            createAiPreview,
                            setCreateAiPreview
                        )
                    }

                    <Form.Item style={{ marginTop: 24 }}>
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
                    setEditAiTopic("");
                    setEditAiPreview(null);
                    setEditExerciseMethod("manual");
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={async (values) => {
                        try {
                            const formData = new FormData();
                            const lessonKeys = ["track_id", "title", "lesson_type", "video_type", "video_url", "content"];
                            lessonKeys.forEach((key) => {
                                if (values[key] !== undefined) {
                                    formData.append(key, values[key]);
                                }
                            });

                            if (values.thumbnail?.[0]?.originFileObj) {
                                formData.append("thumbnail", values.thumbnail[0].originFileObj);
                            }

                            await updateLesson({
                                id: selectedLesson.id,
                                formData,
                            }).unwrap();

                            if (values.lesson_type === "Challenge") {
                                await upsertExercise({
                                    lesson_id: selectedLesson.id,
                                    problem_statement: values.problem_statement,
                                    language: values.language || "javascript",
                                    initial_code: values.initial_code || "",
                                    solution_code: values.solution_code || "",
                                    test_cases: (values.test_cases || []).map((tc, i) => ({
                                        name: tc.name || `Test ${i + 1}`,
                                        input: tc.input,
                                        expected_output: tc.expected_output,
                                        is_hidden: tc.is_hidden || false,
                                    })),
                                }).unwrap();
                            } else if (selectedLesson.lesson_type === "Challenge") {
                                // If changed from Challenge to another type, delete the exercise
                                await deleteExercise(selectedLesson.id).unwrap();
                            }

                            message.success("Cập nhật bài học thành công");
                            setIsEditModalOpen(false);
                            form.resetFields();
                            setEditAiTopic("");
                            setEditAiPreview(null);
                            setEditExerciseMethod("manual");
                            setSelectedLesson(null);
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
                        name="lesson_mode"
                        label="Hình thức bài học"
                        rules={[{ required: true, message: "Vui lòng chọn hình thức!" }]}
                    >
                        <Radio.Group
                            optionType="button"
                            buttonStyle="solid"
                            size="large"
                            onChange={(e) => {
                                const mode = e.target.value;
                                if (mode === "lesson") {
                                    form.setFieldValue("lesson_type", "Lesson");
                                } else {
                                    form.setFieldValue("lesson_type", "Challenge");
                                }
                            }}
                            style={{ width: "100%", display: "flex" }}
                        >
                            <Radio.Button value="lesson" style={{ flex: 1, textAlign: "center" }}>
                                <BookOutlined style={{ marginRight: 8 }} />
                                Bài học (Lý thuyết / Video)
                            </Radio.Button>
                            <Radio.Button value="exercise" style={{ flex: 1, textAlign: "center" }}>
                                <CodeOutlined style={{ marginRight: 8 }} />
                                Bài tập thực hành (Coding Challenge)
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="lesson_type" noStyle>
                        <input type="hidden" />
                    </Form.Item>

                    {editLessonMode === "lesson" && (
                        <Form.Item
                            name="lesson_type"
                            label="Loại bài học"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn loại bài học!",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn loại bài học"
                                options={[
                                    { value: "Lesson", label: "Bài học dạng lý thuyết / văn bản" },
                                    { value: "Video", label: "Bài học dạng video" },
                                ]}
                            />
                        </Form.Item>
                    )}

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

                    {editLessonType === "Video" && (
                        <>
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
                        </>
                    )}

                    {editLessonType !== "Challenge" && (
                        <Form.Item
                            name="content"
                            label="Nội dung bài học"
                            rules={[
                                {
                                    required: true,
                                    validator: (_, value) => {
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
                    )}

                    {editLessonType === "Challenge" &&
                        renderExerciseFields(
                            form,
                            editExerciseMethod,
                            setEditExerciseMethod,
                            editAiTopic,
                            setEditAiTopic,
                            handleEditAiGenerate,
                            editAiPreview,
                            setEditAiPreview
                        )
                    }

                    <Form.Item style={{ marginTop: 24 }}>
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

            {/* View Details Modal */}
            <Modal
                title="Chi tiết bài học"
                open={isViewModalOpen}
                onCancel={() => {
                    setIsViewModalOpen(false);
                    setSelectedLesson(null);
                }}
                width={800}
                footer={[
                    <Button
                        key="close"
                        onClick={() => {
                            setIsViewModalOpen(false);
                            setSelectedLesson(null);
                        }}
                    >
                        Đóng
                    </Button>,
                ]}
            >
                {selectedLesson && (
                    <div className="lesson-details">
                        <div style={{ marginBottom: 24 }}>
                            <h3
                                style={{
                                    borderBottom: "1px solid #f0f0f0",
                                    paddingBottom: 8,
                                }}
                            >
                                {selectedLesson.title}
                            </h3>
                            <Space
                                direction="vertical"
                                size="large"
                                style={{ width: "100%" }}
                            >
                                <div>
                                    <strong>Thuộc chương:</strong>{" "}
                                    {selectedLesson.track.title}
                                </div>
                                <div>
                                    <strong>Khóa học:</strong>{" "}
                                    {selectedLesson.track.course.title}
                                </div>
                                {selectedLesson.thumbnail && (
                                    <div>
                                        <strong>Hình thu nhỏ:</strong>
                                        <div style={{ marginTop: 8 }}>
                                            <img
                                                src={
                                                    isHttps(
                                                        selectedLesson.thumbnail
                                                    )
                                                        ? selectedLesson.thumbnail
                                                        : `${
                                                              import.meta.env
                                                                  .VITE_BASE_URL
                                                          }${
                                                              selectedLesson.thumbnail
                                                          }`
                                                }
                                                alt={selectedLesson.title}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "200px",
                                                    objectFit: "cover",
                                                    borderRadius: 4,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <strong>Loại video:</strong>{" "}
                                    {selectedLesson.video_type
                                        .charAt(0)
                                        .toUpperCase() +
                                        selectedLesson.video_type.slice(1)}
                                </div>
                                {selectedLesson.video_url && (
                                    <div>
                                        <strong>URL Video:</strong>{" "}
                                        <a
                                            href={
                                                isHttps(
                                                    selectedLesson.video_url
                                                )
                                                    ? selectedLesson.video_url
                                                    : `${
                                                          import.meta.env
                                                              .VITE_BASE_URL
                                                      }${
                                                          selectedLesson.video_url
                                                      }`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Xem video
                                        </a>
                                    </div>
                                )}
                                <div>
                                    <strong>Nội dung bài học:</strong>
                                    <div
                                        style={{
                                            marginTop: 8,
                                            padding: 16,
                                            background: "#f5f5f5",
                                            borderRadius: 4,
                                            maxHeight: "300px",
                                            overflowY: "auto",
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: selectedLesson.content,
                                        }}
                                    />
                                </div>
                                <div>
                                    <strong>Ngày tạo:</strong>{" "}
                                    {new Date(
                                        selectedLesson.created_at
                                    ).toLocaleString("vi-VN")}
                                </div>
                                <div>
                                    <strong>Cập nhật lần cuối:</strong>{" "}
                                    {new Date(
                                        selectedLesson.updated_at
                                    ).toLocaleString("vi-VN")}
                                </div>
                            </Space>
                        </div>
                    </div>
                )}
            </Modal>
            {/* Exercise Management Modal */}
            <ExerciseModal
                open={isExerciseModalOpen}
                lesson={exerciseLesson}
                exerciseData={exerciseData}
                isFetching={isFetchingExercise}
                form={exerciseForm}
                upsertExercise={upsertExercise}
                isUpsertingExercise={isUpsertingExercise}
                deleteExercise={deleteExercise}
                isDeletingExercise={isDeletingExercise}
                refetch={refetch}
                onClose={() => {
                    setIsExerciseModalOpen(false);
                    setExerciseLesson(null);
                    exerciseForm.resetFields();
                }}
            />
        </div>
    );
}

export default LessonsManagement;

// ─── Exercise Modal Component ────────────────────────────────────────────────

function ExerciseModal({
    open,
    lesson,
    exerciseData,
    isFetching,
    form,
    upsertExercise,
    isUpsertingExercise,
    deleteExercise,
    isDeletingExercise,
    refetch,
    onClose,
}) {
    const existingExercise = exerciseData?.data;

    // AI Generate state
    const [aiTopic, setAiTopic] = useState("");
    const [aiPreview, setAiPreview] = useState(null); // preview of last AI generation
    const [aiGenerateExercise, { isLoading: isAiGenerating }] = useAiGenerateExerciseMutation();
    const topicInputRef = useRef(null);

    // Reset AI state when modal closes
    useMemo(() => {
        if (!open) {
            setAiTopic("");
            setAiPreview(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleAiGenerate = async () => {
        if (!aiTopic.trim() || aiTopic.trim().length < 5) {
            message.warning("Vui lòng nhập chủ đề bài tập (tối thiểu 5 ký tự)");
            topicInputRef.current?.focus();
            return;
        }
        const language = form.getFieldValue("language") || "javascript";
        try {
            const result = await aiGenerateExercise({ topic: aiTopic.trim(), language }).unwrap();
            const data = result.data;

            // Auto-fill the form with AI result
            form.setFieldsValue({
                problem_statement: data.problem_statement,
                initial_code: data.initial_code,
                solution_code: data.solution_code,
                test_cases: data.test_cases.map((tc) => ({
                    name: tc.name,
                    input: String(tc.input ?? ""),
                    expected_output: String(tc.expected_output ?? ""),
                    is_hidden: Boolean(tc.is_hidden),
                })),
            });

            // Store preview for display
            setAiPreview({
                problem_statement: data.problem_statement,
                test_count: data.test_cases.length,
                hidden_count: data.test_cases.filter((tc) => tc.is_hidden).length,
            });

            message.success("AI đã sinh xong bài tập! Đã điền vào form, bạn có thể chỉnh sửa thêm.");
        } catch (err) {
            const msg = err.data?.message || err.message || "Có lỗi khi gọi AI";
            message.error(msg);
        }
    };

    // Sync form values when exercise data loads
    useMemo(() => {
        if (!open) return;
        if (existingExercise) {
            const testCases = (existingExercise.test_cases || []).map((tc) => ({
                name: tc.name || "",
                input: tc.input !== undefined ? String(tc.input) : "",
                expected_output: tc.expected_output !== undefined
                    ? String(tc.expected_output)
                    : (tc.output !== undefined ? String(tc.output) : ""),
                is_hidden: tc.is_hidden || false,
            }));
            form.setFieldsValue({
                language: existingExercise.language || "javascript",
                problem_statement: existingExercise.problem_statement || "",
                initial_code: existingExercise.initial_code || "",
                solution_code: existingExercise.solution_code || "",
                test_cases: testCases.length > 0 ? testCases : [{ name: "", input: "", expected_output: "", is_hidden: false }],
            });
        } else if (!isFetching) {
            // New exercise - set defaults
            form.setFieldsValue({
                language: "javascript",
                problem_statement: "",
                initial_code: "",
                solution_code: "",
                test_cases: [{ name: "Test 1", input: "", expected_output: "", is_hidden: false }],
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingExercise, isFetching, open]);

    const handleSubmit = async (values) => {
        try {
            await upsertExercise({
                lesson_id: lesson.id,
                problem_statement: values.problem_statement,
                language: values.language,
                initial_code: values.initial_code || "",
                solution_code: values.solution_code || "",
                test_cases: (values.test_cases || []).map((tc, i) => ({
                    name: tc.name || `Test ${i + 1}`,
                    input: tc.input,
                    expected_output: tc.expected_output,
                    is_hidden: tc.is_hidden || false,
                })),
            }).unwrap();
            message.success(existingExercise ? "Cập nhật bài tập thành công!" : "Tạo bài tập thành công!");
            refetch();
            onClose();
        } catch (err) {
            message.error(err.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteExercise(lesson?.id).unwrap();
            message.success("Đã xóa bài tập và chuyển về bài học thông thường");
            refetch();
            onClose();
        } catch (err) {
            message.error(err.data?.message || "Có lỗi xảy ra khi xóa bài tập");
        }
    };

    const LANGUAGE_STARTER = {
        javascript: `// Viết hàm của bạn ở đây\nfunction solution() {\n\n}`,
        html: `<!DOCTYPE html>\n<html lang="vi">\n<head>\n  <meta charset="UTF-8">\n  <title>Bài tập HTML</title>\n</head>\n<body>\n  <!-- Viết code ở đây -->\n</body>\n</html>`,
        css: `/* Viết CSS ở đây */\nbody {\n\n}`,
    };

    return (
        <Modal
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CodeOutlined style={{ color: "#52c41a" }} />
                    <span>Quản lý bài tập: <strong>{lesson?.title}</strong></span>
                    {existingExercise && (
                        <Tag color="green">Đã có bài tập</Tag>
                    )}
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={900}
            destroyOnClose
        >
            {isFetching ? (
                <div style={{ textAlign: "center", padding: 40 }}>Đang tải...</div>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        language: "javascript",
                        test_cases: [{ name: "Test 1", input: "", expected_output: "", is_hidden: false }],
                    }}
                >
                    {/* ── Language Selector ── */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                        <Form.Item
                            name="language"
                            label="Ngôn ngữ lập trình"
                            rules={[{ required: true, message: "Vui lòng chọn ngôn ngữ!" }]}
                            style={{ minWidth: 200, marginBottom: 0 }}
                        >
                            <Select
                                options={[
                                    { value: "javascript", label: "JavaScript" },
                                    { value: "html", label: "HTML" },
                                    { value: "css", label: "CSS" },
                                ]}
                                onChange={(lang) => {
                                    const currentInitial = form.getFieldValue("initial_code");
                                    if (!currentInitial || currentInitial.trim() === "") {
                                        form.setFieldValue("initial_code", LANGUAGE_STARTER[lang] || "");
                                    }
                                }}
                            />
                        </Form.Item>
                    </div>

                    {/* ── AI Generate Section ── */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #f0f5ff 0%, #f6ffed 100%)",
                            border: "1px dashed #91caff",
                            borderRadius: 8,
                            padding: "16px 20px",
                            marginBottom: 20,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <ThunderboltOutlined style={{ color: "#1677ff", fontSize: 16 }} />
                            <span style={{ fontWeight: 600, color: "#1677ff", fontSize: 14 }}>
                                Sinh bài tập tự động bằng AI
                            </span>
                            <Tag color="blue" style={{ fontSize: 11, marginLeft: 4 }}>GPT-4o-mini</Tag>
                        </div>

                        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                                    Nhập chủ đề / yêu cầu ngắn gọn:
                                </div>
                                <Input
                                    ref={topicInputRef}
                                    value={aiTopic}
                                    onChange={(e) => setAiTopic(e.target.value)}
                                    placeholder="Ví dụ: Viết hàm tính tổng mảng số nguyên, Kiểm tra palindrome, Đếm số từ trong chuỗi..."
                                    onPressEnter={handleAiGenerate}
                                    maxLength={200}
                                    showCount
                                    disabled={isAiGenerating}
                                />
                            </div>
                            <Button
                                type="primary"
                                onClick={handleAiGenerate}
                                loading={isAiGenerating}
                                style={{
                                    background: isAiGenerating ? undefined : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                    border: "none",
                                    minWidth: 150,
                                }}
                                icon={!isAiGenerating && <ThunderboltOutlined />}
                            >
                                {isAiGenerating ? "Đang sinh bài tập..." : "Tạo bài tập"}
                            </Button>
                        </div>

                        {/* AI Preview Card — shown after successful generation */}
                        {aiPreview && (
                            <div
                                style={{
                                    marginTop: 12,
                                    padding: "10px 14px",
                                    background: "#fff",
                                    border: "1px solid #b7eb8f",
                                    borderRadius: 6,
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 10,
                                }}
                            >
                                <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 18, flexShrink: 0, marginTop: 2 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, color: "#389e0d", fontSize: 13, marginBottom: 4 }}>
                                        AI đã điền vào form ({aiPreview.test_count} test cases,{" "}
                                        {aiPreview.hidden_count} ẩn)
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "#555",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {aiPreview.problem_statement?.slice(0, 120)}...
                                    </div>
                                </div>
                                <Tooltip title="Xóa preview">
                                    <Button
                                        type="text"
                                        size="small"
                                        onClick={() => setAiPreview(null)}
                                        style={{ color: "#999", flexShrink: 0 }}
                                    >
                                        <CloseOutlined />
                                    </Button>
                                </Tooltip>
                            </div>
                        )}

                        <div style={{ fontSize: 11, color: "#999", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            <BulbOutlined style={{ color: "#faad14" }} />
                            <span>AI sẽ tự động điền đề bài, code mẫu và test cases vào form. Bạn có thể chỉnh sửa trước khi lưu.</span>
                        </div>
                    </div>

                    <Divider style={{ margin: "0 0 16px" }}>
                        <span style={{ fontSize: 12, color: "#999" }}>Hoặc nhập thủ công</span>
                    </Divider>

                    <Form.Item
                        name="problem_statement"
                        label="Đề bài"
                        rules={[{ required: true, message: "Vui lòng nhập đề bài!" }]}
                    >
                        <TextArea
                            rows={5}
                            placeholder="Mô tả yêu cầu của bài tập, ví dụ: Viết hàm tính tổng hai số..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="initial_code"
                        label="Code khởi đầu (học viên sẽ thấy phần này)"
                    >
                        <TextArea
                            rows={5}
                            placeholder="Code template cho học viên"
                            style={{ fontFamily: "monospace", fontSize: 13 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="solution_code"
                        label="Code giải mẫu (chỉ admin xem)"
                    >
                        <TextArea
                            rows={5}
                            placeholder="Code giải mẫu để tham khảo"
                            style={{ fontFamily: "monospace", fontSize: 13 }}
                        />
                    </Form.Item>

                    <Divider orientation="left">Test Cases</Divider>
                    <Form.List
                        name="test_cases"
                        rules={[
                            {
                                validator: async (_, testCases) => {
                                    if (!testCases || testCases.length < 1) {
                                        return Promise.reject(new Error("Cần ít nhất 1 test case!"));
                                    }
                                },
                            },
                        ]}
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card
                                        key={key}
                                        size="small"
                                        style={{ marginBottom: 12, background: "#fafafa", border: "1px solid #e8e8e8" }}
                                        extra={
                                            fields.length > 1 ? (
                                                <Tooltip title="Xóa test case">
                                                    <MinusCircleOutlined
                                                        onClick={() => remove(name)}
                                                        style={{ color: "#ff4d4f", cursor: "pointer" }}
                                                    />
                                                </Tooltip>
                                            ) : null
                                        }
                                        title={`Test Case ${name + 1}`}
                                    >
                                        <div style={{ display: "flex", gap: 16 }}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "name"]}
                                                label="Tên test"
                                                style={{ flex: 1, marginBottom: 0 }}
                                            >
                                                <Input placeholder="Tên mô tả test case" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "is_hidden"]}
                                                label="Ẩn với học viên"
                                                valuePropName="checked"
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Select
                                                    style={{ width: 130 }}
                                                    options={[
                                                        { value: false, label: "Hiện" },
                                                        { value: true, label: "Ẩn" },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "input"]}
                                                label="Input (để trống nếu không cần)"
                                                style={{ flex: 1, marginBottom: 0 }}
                                            >
                                                <Input
                                                    placeholder="Ví dụ: 5 hoặc [1,2,3]"
                                                    style={{ fontFamily: "monospace" }}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "expected_output"]}
                                                label="Kết quả mong đợi"
                                                rules={[{ required: true, message: "Cần nhập kết quả!" }]}
                                                style={{ flex: 1, marginBottom: 0 }}
                                            >
                                                <Input
                                                    placeholder="Ví dụ: 15 hoặc true"
                                                    style={{ fontFamily: "monospace" }}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Card>
                                ))}
                                <Form.ErrorList errors={errors} />
                                <Button
                                    type="dashed"
                                    onClick={() => add({ name: `Test ${fields.length + 1}`, input: "", expected_output: "", is_hidden: false })}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Thêm test case
                                </Button>
                            </>
                        )}
                    </Form.List>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                        <div>
                            {existingExercise && (
                                <Button
                                    danger
                                    loading={isDeletingExercise}
                                    onClick={() => {
                                        Modal.confirm({
                                            title: "Xóa bài tập",
                                            content: "Bạn có chắc muốn xóa bài tập này? Bài học sẽ được chuyển về dạng bài học thường.",
                                            okText: "Xóa",
                                            cancelText: "Hủy",
                                            okButtonProps: { danger: true },
                                            onOk: handleDelete,
                                        });
                                    }}
                                >
                                    Xóa bài tập
                                </Button>
                            )}
                        </div>
                        <Space>
                            <Button onClick={onClose}>Hủy</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isUpsertingExercise}
                                icon={<CodeOutlined />}
                            >
                                {existingExercise ? "Cập nhật bài tập" : "Tạo bài tập"}
                            </Button>
                        </Space>
                    </div>
                </Form>
            )}
        </Modal>
    );
}
