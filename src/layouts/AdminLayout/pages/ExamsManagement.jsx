import React, { useState, useEffect } from "react";
import {
    Select,
    Card,
    Tabs,
    Form,
    Input,
    InputNumber,
    Button,
    Table,
    Tag,
    Modal,
    Space,
    Typography,
    Divider,
    Spin,
    Tooltip,
    Row,
    Col
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    RobotOutlined,
    SaveOutlined,
    EditOutlined,
    WarningOutlined,
    FileTextOutlined,
    TeamOutlined,
    SettingOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetAllCoursesQuery } from "@/services/coursesService";
import {
    useGetExamByCourseQuery,
    useUpsertExamMutation,
    useSaveQuestionsMutation,
    useAiGenerateQuestionsMutation,
    useGetSubmissionsQuery
} from "@/services/admin/examsService";

const { Title, Text, Paragraph } = Typography;

function ExamsManagement() {
    const navigate = useNavigate();
    
    // Store and retrieve selected course ID in localStorage to survive page reloads
    const [selectedCourseId, setSelectedCourseId] = useState(() => {
        const saved = localStorage.getItem("admin_selected_course_id");
        return saved ? parseInt(saved) : null;
    });
    const [activeTab, setActiveTab] = useState("config");

    // Fetch all courses
    const { data: coursesResponse, isLoading: isCoursesLoading } = useGetAllCoursesQuery();
    const courses = coursesResponse?.data || [];

    // Fetch Exam for selected course
    const { data: examResponse, isLoading: isExamLoading, refetch: refetchExam } = useGetExamByCourseQuery(
        selectedCourseId,
        { skip: !selectedCourseId }
    );
    const exam = examResponse?.data;

    // Mutations
    const [upsertExam, { isLoading: isSavingExam }] = useUpsertExamMutation();
    const [saveQuestions, { isLoading: isSavingQuestions }] = useSaveQuestionsMutation();
    const [aiGenerateQuestions, { isLoading: isGeneratingAI }] = useAiGenerateQuestionsMutation();

    // Local State for Forms / Editors
    const [examForm] = Form.useForm();
    const [questions, setQuestions] = useState([]);
    
    // AI Modal State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiForm] = Form.useForm();

    // Submissions page/filters state
    const [submissionPage, setSubmissionPage] = useState(1);
    const [submissionStatusFilter, setSubmissionStatusFilter] = useState(null);
    const { data: submissionsResponse, isLoading: isSubmissionsLoading, refetch: refetchSubmissions } = useGetSubmissionsQuery(
        { examId: exam?.id, page: submissionPage, status: submissionStatusFilter },
        { skip: !exam?.id }
    );
    const submissionsData = submissionsResponse?.data || { submissions: [], total: 0 };
    const submissionsList = submissionsData.submissions || [];

    // Select first course by default when loaded if no course is cached
    useEffect(() => {
        if (courses.length > 0 && !selectedCourseId) {
            const defaultId = courses[0].id;
            setSelectedCourseId(defaultId);
            localStorage.setItem("admin_selected_course_id", defaultId);
        }
    }, [courses, selectedCourseId]);

    // Load exam info into form when exam loads
    useEffect(() => {
        if (exam) {
            examForm.setFieldsValue({
                title: exam.title,
                description: exam.description,
                duration: exam.duration,
                passing_score: exam.passing_score
            });
            // Map options array correctly
            const mappedQuestions = (exam.questions || []).map((q) => {
                let parsedOptions = q.options;
                if (typeof q.options === "string") {
                    try {
                        parsedOptions = JSON.parse(q.options);
                    } catch (e) {
                        parsedOptions = [];
                    }
                }
                return {
                    ...q,
                    options: parsedOptions || []
                };
            });
            setQuestions(mappedQuestions);
        } else {
            examForm.resetFields();
            setQuestions([]);
        }
    }, [exam, examForm]);

    // Refetch submissions when tab changes or exam changes
    useEffect(() => {
        if (activeTab === "submissions" && exam?.id) {
            refetchSubmissions();
        }
    }, [activeTab, exam?.id, refetchSubmissions]);

    const handleCourseChange = (value) => {
        setSelectedCourseId(value);
        localStorage.setItem("admin_selected_course_id", value);
        setActiveTab("config");
    };

    const handleConfigSubmit = async (values) => {
        if (!selectedCourseId) return;
        try {
            await upsertExam({
                course_id: selectedCourseId,
                title: values.title,
                description: values.description,
                duration: values.duration,
                passing_score: values.passing_score
            }).unwrap();
            toast.success("Lưu cấu hình bài thi thành công!");
            refetchExam();
        } catch (error) {
            toast.error(error.data?.message || "Lỗi lưu cấu hình bài thi");
        }
    };

    const handleInitializeExam = async () => {
        if (!selectedCourseId) return;
        const selectedCourse = courses.find(c => c.id === selectedCourseId);
        try {
            await upsertExam({
                course_id: selectedCourseId,
                title: `Bài kiểm tra cuối khóa: ${selectedCourse?.title || ""}`,
                description: "Nhằm đánh giá năng lực của học viên trước khi hoàn thành khóa học.",
                duration: 45,
                passing_score: 5.0
            }).unwrap();
            toast.success("Khởi tạo cấu hình bài thi thành công!");
            refetchExam();
        } catch (error) {
            toast.error(error.data?.message || "Lỗi khởi tạo bài thi");
        }
    };

    // Question management helpers
    const addQuestion = (type) => {
        const newQuestion = {
            id: `temp-${Date.now()}`,
            question_text: "",
            question_type: type,
            options: type === "multiple_choice" ? ["", "", "", ""] : null,
            correct_answer: "",
            score: 1.0
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestionField = (idx, field, value) => {
        const updated = [...questions];
        updated[idx] = {
            ...updated[idx],
            [field]: value
        };
        setQuestions(updated);
    };

    const updateOptionField = (qIdx, optIdx, val) => {
        const updated = [...questions];
        const newOptions = [...(updated[qIdx].options || [])];
        newOptions[optIdx] = val;
        updated[qIdx] = {
            ...updated[qIdx],
            options: newOptions
        };
        setQuestions(updated);
    };

    const removeQuestion = (idx) => {
        const updated = questions.filter((_, i) => i !== idx);
        setQuestions(updated);
    };

    const handleSaveQuestions = async () => {
        if (!exam) return;

        // Validation checks
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question_text.trim()) {
                toast.error(`Câu hỏi số ${i + 1} chưa điền nội dung câu hỏi.`);
                return;
            }
            if (q.question_type === "multiple_choice") {
                if (!q.options || q.options.some(opt => !opt || !opt.trim())) {
                    toast.error(`Câu hỏi số ${i + 1} cần điền đầy đủ 4 phương án trắc nghiệm.`);
                    return;
                }
                if (!q.correct_answer.trim()) {
                    toast.error(`Câu hỏi số ${i + 1} chưa chọn đáp án đúng.`);
                    return;
                }
                if (!q.options.includes(q.correct_answer)) {
                    toast.error(`Câu hỏi số ${i + 1} đáp án đúng phải trùng với một trong các phương án.`);
                    return;
                }
            } else {
                if (!q.correct_answer.trim()) {
                    toast.error(`Câu hỏi số ${i + 1} chưa điền gợi ý đáp án/tự luận mẫu.`);
                    return;
                }
            }
        }

        try {
            await saveQuestions({
                examId: exam.id,
                questions: questions.map(q => ({
                    question_text: q.question_text,
                    question_type: q.question_type,
                    options: q.options,
                    correct_answer: q.correct_answer,
                    score: q.score
                }))
            }).unwrap();
            toast.success("Lưu toàn bộ danh sách câu hỏi thành công!");
            refetchExam();
        } catch (error) {
            toast.error(error.data?.message || "Lỗi lưu danh sách câu hỏi");
        }
    };

    const handleAiGenerateSubmit = async (values) => {
        const selectedCourse = courses.find(c => c.id === selectedCourseId);
        const topic = values.topic || selectedCourse?.title || "";
        try {
            const res = await aiGenerateQuestions({
                topic,
                mcCount: values.mcCount,
                essayCount: values.essayCount
            }).unwrap();

            if (res.success && Array.isArray(res.data)) {
                const generatedQuestions = res.data.map((q, idx) => ({
                    id: `ai-${idx}-${Date.now()}`,
                    question_text: q.question_text,
                    question_type: q.question_type,
                    options: q.options || [],
                    correct_answer: q.correct_answer,
                    score: q.score
                }));
                setQuestions(generatedQuestions);
                setIsAiModalOpen(false);
                aiForm.resetFields();
                toast.success(`Đã tự động tạo ${generatedQuestions.length} câu hỏi thành công! Hãy kiểm tra và bấm "Lưu toàn bộ đề thi".`);
            }
        } catch (error) {
            toast.error(error.data?.message || "Lỗi khi tạo đề thi bằng AI");
        }
    };

    // Submissions table structure
    const submissionsColumns = [
        {
            title: "Học viên",
            dataIndex: "user",
            key: "user",
            render: (user) => (
                <div>
                    <div style={{ fontWeight: "bold" }}>{user?.full_name}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>@{user?.username} | {user?.email}</Text>
                </div>
            )
        },
        {
            title: "Thời gian bắt đầu",
            dataIndex: "start_time",
            key: "start_time",
            render: (time) => time ? new Date(time).toLocaleString("vi-VN") : ""
        },
        {
            title: "Thời gian nộp",
            dataIndex: "submit_time",
            key: "submit_time",
            render: (time) => time ? new Date(time).toLocaleString("vi-VN") : <Tag color="warning">Chưa nộp</Tag>
        },
        {
            title: "Gian lận (Chuyển tab)",
            dataIndex: "tab_switch_count",
            key: "tab_switch_count",
            render: (count) => (
                <Space>
                    <Text style={{ fontWeight: "bold", color: count >= 3 ? "#ff4d4f" : "#faad14" }}>
                        {count} / 3 lần
                    </Text>
                    {count >= 3 && <Tag color="error">Gian lận!</Tag>}
                </Space>
            )
        },
        {
            title: "Điểm trắc nghiệm/Tự luận",
            key: "scores",
            render: (_, record) => {
                const isEssayGraded = record.essay_graded;
                return (
                    <div>
                        <div style={{ fontSize: 16, fontWeight: "bold" }}>
                            {record.score !== null ? `${record.score.toFixed(1)} / 10.0` : "Chưa có"}
                        </div>
                        <div>
                            {isEssayGraded ? (
                                <Tag color="success">Đã chấm xong</Tag>
                            ) : (
                                <Tag color="warning">Đợi chấm tự luận</Tag>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            title: "Trạng thái bài nộp",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                if (status === "in_progress") return <Tag color="blue">Đang làm bài</Tag>;
                if (status === "submitted") return <Tag color="success">Đã nộp bài</Tag>;
                if (status === "auto_submitted_cheating") return <Tag color="error">Bị ép nộp (Gian lận)</Tag>;
                return <Tag>{status}</Tag>;
            }
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space>
                    {!record.essay_graded ? (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/exams/submissions/${record.id}/grade`)}
                        >
                            Chấm tự luận
                        </Button>
                    ) : (
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/exams/submissions/${record.id}/grade`)}
                        >
                            Xem & Sửa điểm
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    if (isCoursesLoading) {
        return (
            <div style={{ padding: 24, textAlign: "center" }}>
                <Spin size="large" />
                <div style={{ marginTop: 12 }}>Đang tải danh sách khóa học...</div>
            </div>
        );
    }

    // Build Tab items to prevent using deprecated child component Tabs.TabPane
    const tabItems = [
        {
            key: "config",
            label: <span><SettingOutlined /> Cấu hình chung</span>,
            children: (
                <Form
                    form={examForm}
                    layout="vertical"
                    onFinish={handleConfigSubmit}
                    style={{ maxWidth: 650, marginTop: 16 }}
                >
                    <Form.Item
                        label="Tiêu đề bài thi"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề bài thi" }]}
                    >
                        <Input placeholder="Ví dụ: Bài kiểm tra cuối khóa lập trình Javascript cơ bản" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả bài thi (Hướng dẫn, Quy chế)"
                        name="description"
                    >
                        <Input.TextArea rows={4} placeholder="Nhập hướng dẫn làm bài thi cho học viên" />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="Thời gian làm bài (Phút)"
                                name="duration"
                                rules={[{ required: true, message: "Vui lòng nhập thời gian thi" }]}
                            >
                                <InputNumber min={5} max={180} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Điểm số tối thiểu để đạt"
                                name="passing_score"
                                rules={[{ required: true, message: "Vui lòng nhập điểm tối thiểu" }]}
                            >
                                <InputNumber min={1.0} max={10.0} step={0.5} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSavingExam} icon={<SaveOutlined />}>
                            Lưu cấu hình
                        </Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: "questions",
            label: <span><FileTextOutlined /> Quản lý câu hỏi ({questions.length})</span>,
            children: (
                <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <Space>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => addQuestion("multiple_choice")}
                            >
                                Thêm câu trắc nghiệm
                            </Button>
                            <Button
                                type="primary"
                                style={{ background: "#a0d911", borderColor: "#a0d911" }}
                                icon={<PlusOutlined />}
                                onClick={() => addQuestion("essay")}
                            >
                                Thêm câu tự luận
                            </Button>
                        </Space>
                        <Button
                            type="dashed"
                            danger
                            icon={<RobotOutlined />}
                            onClick={() => {
                                const selectedCourse = courses.find(c => c.id === selectedCourseId);
                                aiForm.setFieldsValue({
                                    topic: selectedCourse?.title || "",
                                    mcCount: 5,
                                    essayCount: 1
                                });
                                setIsAiModalOpen(true);
                            }}
                        >
                            Tạo đề bằng AI (GPT)
                        </Button>
                    </div>

                    <Divider />

                    {questions.length === 0 ? (
                        <Card style={{ textAlign: "center", padding: 24, background: "#fafafa" }}>
                            <Text type="secondary">Chưa có câu hỏi nào được thêm vào bài thi. Vui lòng thêm câu hỏi thủ công hoặc sử dụng AI để tự động tạo câu hỏi.</Text>
                        </Card>
                    ) : (
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            {questions.map((q, qIdx) => {
                                const isMC = q.question_type === "multiple_choice";
                                return (
                                    <Card
                                        key={q.id}
                                        title={
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span>Câu hỏi {qIdx + 1}: <Tag color={isMC ? "blue" : "purple"}>{isMC ? "Trắc nghiệm" : "Tự luận"}</Tag></span>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => removeQuestion(qIdx)}
                                                />
                                            </div>
                                        }
                                        style={{ border: "1px solid #d9d9d9", borderRadius: 6 }}
                                    >
                                        <Row gutter={[16, 16]}>
                                            <Col span={20}>
                                                <Form.Item label="Nội dung câu hỏi" required>
                                                    <Input.TextArea
                                                        rows={2}
                                                        value={q.question_text}
                                                        onChange={(e) => updateQuestionField(qIdx, "question_text", e.target.value)}
                                                        placeholder="Nhập nội dung câu hỏi..."
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item label="Điểm số">
                                                    <InputNumber
                                                        min={0.5}
                                                        max={10}
                                                        step={0.5}
                                                        value={q.score}
                                                        onChange={(val) => updateQuestionField(qIdx, "score", val)}
                                                        style={{ width: "100%" }}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            {isMC ? (
                                                <Col span={24}>
                                                    <Text strong>Các phương án lựa chọn:</Text>
                                                    <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
                                                        {[0, 1, 2, 3].map((optIdx) => (
                                                            <Col span={12} key={optIdx}>
                                                                <Input
                                                                    addonBefore={`Phương án ${String.fromCharCode(65 + optIdx)}`}
                                                                    value={q.options?.[optIdx] || ""}
                                                                    onChange={(e) => updateOptionField(qIdx, optIdx, e.target.value)}
                                                                    placeholder={`Nhập phương án ${String.fromCharCode(65 + optIdx)}`}
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>

                                                    <Form.Item label="Phương án chính xác" style={{ marginTop: 16 }} required>
                                                        <Select
                                                            value={q.correct_answer || undefined}
                                                            onChange={(val) => updateQuestionField(qIdx, "correct_answer", val)}
                                                            placeholder="Chọn phương án đúng"
                                                            options={q.options?.map((opt, optIdx) => ({
                                                                value: opt,
                                                                label: `${String.fromCharCode(65 + optIdx)}. ${opt}`,
                                                                disabled: !opt || !opt.trim()
                                                            }))}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            ) : (
                                                <Col span={24}>
                                                    <Form.Item label="Gợi ý đáp án / Bài làm mẫu của Giáo viên (Dùng để đối chiếu chấm điểm)" required>
                                                        <Input.TextArea
                                                            rows={4}
                                                            value={q.correct_answer}
                                                            onChange={(e) => updateQuestionField(qIdx, "correct_answer", e.target.value)}
                                                            placeholder="Nhập nội dung gợi ý/đáp án mẫu tự luận..."
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            )}
                                        </Row>
                                    </Card>
                                );
                            })}

                            <Divider />
                            
                            <div style={{ textAlign: "right", paddingBottom: 30 }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SaveOutlined />}
                                    loading={isSavingQuestions}
                                    onClick={handleSaveQuestions}
                                >
                                    Lưu toàn bộ đề thi
                                </Button>
                            </div>
                        </Space>
                    )}
                </div>
            )
        },
        {
            key: "submissions",
            label: <span><TeamOutlined /> Bài nộp của học viên</span>,
            children: (
                <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <Text strong style={{ fontSize: 16 }}>Lịch sử thi và làm bài của học viên</Text>
                        <Space>
                            <span>Bộ lọc:</span>
                            <Select
                                value={submissionStatusFilter}
                                onChange={(val) => {
                                    setSubmissionStatusFilter(val);
                                    setSubmissionPage(1);
                                }}
                                style={{ width: 180 }}
                                allowClear
                                placeholder="Trạng thái"
                                options={[
                                    { value: "submitted", label: "Đã nộp bài" },
                                    { value: "auto_submitted_cheating", label: "Vi phạm gian lận" },
                                    { value: "in_progress", label: "Đang làm bài" }
                                ]}
                            />
                        </Space>
                    </div>

                    <Table
                        dataSource={submissionsList}
                        columns={submissionsColumns}
                        rowKey="id"
                        loading={isSubmissionsLoading}
                        pagination={{
                            current: submissionPage,
                            total: submissionsData.total,
                            pageSize: 10,
                            onChange: (page) => setSubmissionPage(page)
                        }}
                    />
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: "24px 30px" }}>
            <Card style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            <FileTextOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                            QUẢN LÝ BÀI THI CUỐI KHÓA (FINAL EXAMS)
                        </Title>
                    </Col>
                    <Col style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: "bold" }}>Chọn khóa học:</span>
                        <Select
                            value={selectedCourseId}
                            onChange={handleCourseChange}
                            style={{ width: 250 }}
                            placeholder="Chọn khóa học"
                            options={courses.map(course => ({
                                value: course.id,
                                label: course.title
                            }))}
                        />
                    </Col>
                </Row>
            </Card>

            {isExamLoading ? (
                <div style={{ padding: 48, textAlign: "center" }}>
                    <Spin />
                    <div style={{ marginTop: 12 }}>Đang tải thông tin bài thi...</div>
                </div>
            ) : !exam ? (
                <Card style={{ textAlign: "center", padding: 48, borderRadius: 8 }}>
                    <WarningOutlined style={{ fontSize: 48, color: "#faad14", marginBottom: 16 }} />
                    <Title level={4}>Khóa học này chưa được cấu hình đề thi cuối khóa</Title>
                    <Paragraph type="secondary" style={{ maxWidth: 500, margin: "0 auto 24px auto" }}>
                        Việc tạo bài thi cuối khóa sẽ kích hoạt yêu cầu thi trắc nghiệm và tự luận đối với học viên trước khi họ hoàn thành khóa học để nhận chứng chỉ.
                    </Paragraph>
                    <Button type="primary" size="large" onClick={handleInitializeExam}>
                        Khởi tạo bài thi ngay
                    </Button>
                </Card>
            ) : (
                <Card style={{ borderRadius: 8 }}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        size="large"
                        items={tabItems}
                    />
                </Card>
            )}

            {/* AI Generator Modal */}
            <Modal
                title="Tạo câu hỏi thi bằng Trí tuệ nhân tạo (OpenAI)"
                open={isAiModalOpen}
                onCancel={() => setIsAiModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={aiForm}
                    layout="vertical"
                    onFinish={handleAiGenerateSubmit}
                >
                    <Form.Item
                        label="Chủ đề kiểm tra / Nội dung khóa học (Nhập rõ để AI sinh sát nhất)"
                        name="topic"
                        rules={[{ required: true, message: "Vui lòng nhập chủ đề thi" }]}
                    >
                        <Input.TextArea rows={3} placeholder="Ví dụ: HTML, CSS, thẻ div, flexbox, các câu lệnh Javascript bất đồng bộ, Promise..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Số câu hỏi trắc nghiệm"
                                name="mcCount"
                                initialValue={5}
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={0} max={20} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số câu hỏi tự luận"
                                name="essayCount"
                                initialValue={1}
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={0} max={10} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: "right", margin: 0 }}>
                        <Space>
                            <Button onClick={() => setIsAiModalOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={isGeneratingAI} icon={<RobotOutlined />}>
                                {isGeneratingAI ? "Đang sinh câu hỏi..." : "Bắt đầu sinh đề"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ExamsManagement;
