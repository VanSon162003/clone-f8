import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    Typography,
    Space,
    Tag,
    Button,
    Input,
    InputNumber,
    Row,
    Col,
    List,
    Alert,
    Divider,
    Radio,
    Spin,
    message
} from "antd";
import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    SaveOutlined,
    WarningOutlined
} from "@ant-design/icons";
import {
    useGetSubmissionDetailQuery,
    useGradeEssaySubmissionMutation
} from "@/services/admin/examsService";

const { Title, Text, Paragraph } = Typography;

function ExamGrading() {
    const { submissionId } = useParams();
    const navigate = useNavigate();

    // Fetch submission detail
    const { data: submissionResponse, isLoading, isError, refetch } = useGetSubmissionDetailQuery(submissionId);
    const submission = submissionResponse?.data;

    // Mutation
    const [gradeEssaySubmission, { isLoading: isGrading }] = useGradeEssaySubmissionMutation();

    // Local grading states: { [answerId]: { score, is_correct, admin_comment } }
    const [grades, setGrades] = useState({});

    // Populate local grades state when submission details are loaded
    useEffect(() => {
        if (submission?.answers) {
            const initialGrades = {};
            submission.answers.forEach((ans) => {
                // We only care about grading essay questions since multiple choice is auto-graded
                if (ans.question?.question_type === "essay") {
                    initialGrades[ans.id] = {
                        answer_id: ans.id,
                        score: ans.score || 0.0,
                        is_correct: ans.is_correct === null ? true : ans.is_correct,
                        admin_comment: ans.admin_comment || ""
                    };
                }
            });
            setGrades(initialGrades);
        }
    }, [submission]);

    const handleGradeChange = (answerId, field, value) => {
        setGrades((prev) => ({
            ...prev,
            [answerId]: {
                ...prev[answerId],
                [field]: value
            }
        }));
    };

    const handleSaveGrades = async () => {
        const gradesPayload = Object.values(grades);
        
        // Simple validation checks
        for (const payload of gradesPayload) {
            const relatedAnswer = submission.answers.find(a => a.id === payload.answer_id);
            const maxScore = relatedAnswer?.question?.score || 1.0;
            if (payload.score < 0 || payload.score > maxScore) {
                message.error(`Điểm số nhập vào phải từ 0 đến điểm tối đa của câu hỏi (${maxScore} điểm)`);
                return;
            }
        }

        try {
            await gradeEssaySubmission({
                submissionId,
                grades: gradesPayload
            }).unwrap();
            message.success("Hoàn tất chấm điểm bài thi tự luận thành công!");
            navigate("/admin/exams");
        } catch (error) {
            message.error(error.data?.message || "Lỗi khi chấm điểm bài thi");
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: 48, textAlign: "center" }}>
                <Spin size="large" />
                <div style={{ marginTop: 12 }}>Đang tải bài thi của học viên...</div>
            </div>
        );
    }

    if (isError || !submission) {
        return (
            <div style={{ padding: 48, textAlign: "center" }}>
                <ExclamationCircleOutlined style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 16 }} />
                <Title level={4}>Không tìm thấy bài làm của học viên</Title>
                <Button type="primary" onClick={() => navigate("/admin/exams")}>Quay lại</Button>
            </div>
        );
    }

    const { user, answers, tab_switch_count, cheat_logs, start_time, submit_time, score, status, essay_graded } = submission;
    const isCheated = tab_switch_count >= 3 || status === "auto_submitted_cheating";

    return (
        <div style={{ padding: "24px 30px" }}>
            {/* Header */}
            <Card style={{ marginBottom: 24, borderRadius: 8 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/exams")}>
                            Quay lại quản lý đề thi
                        </Button>
                        <Tag color={essay_graded ? "success" : "warning"} style={{ fontSize: 14, padding: "4px 8px" }}>
                            {essay_graded ? "Đã chấm điểm xong" : "Đang chờ chấm điểm"}
                        </Tag>
                    </div>
                    
                    <Divider style={{ margin: "12px 0" }} />

                    <Row gutter={24}>
                        <Col span={16}>
                            <Title level={3} style={{ margin: 0 }}>CHẤM ĐIỂM BÀI LÀM TỰ LUẬN</Title>
                            <Paragraph style={{ margin: "6px 0 0 0", fontSize: 15 }}>
                                Học viên: <strong>{user?.full_name}</strong> (Email: {user?.email} | Username: @{user?.username})
                            </Paragraph>
                        </Col>
                        <Col span={8} style={{ textAlign: "right" }}>
                            <Text type="secondary">Tổng điểm hiện tại: </Text>
                            <div style={{ fontSize: 24, fontWeight: "bold", color: "#1890ff" }}>
                                {score !== null ? `${score.toFixed(1)} / 10.0` : "Chưa hoàn tất"}
                            </div>
                        </Col>
                    </Row>
                </Space>
            </Card>

            {/* Anti cheat metrics */}
            <Card title="Phân tích Nhật ký làm bài & Chống gian lận" style={{ marginBottom: 24, borderRadius: 8 }}>
                <Row gutter={24}>
                    <Col span={8}>
                        <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 6 }}>
                            <Text type="secondary">Số lần chuyển tab / rời cửa sổ:</Text>
                            <div style={{ fontSize: 20, fontWeight: "bold", color: isCheated ? "#ff4d4f" : "#faad14", marginTop: 4 }}>
                                {tab_switch_count} / 3 lần
                            </div>
                            {isCheated && <Tag color="error" style={{ marginTop: 8 }}>Cảnh báo vi phạm nghiêm trọng!</Tag>}
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 6 }}>
                            <Text type="secondary">Thời gian bắt đầu làm:</Text>
                            <div style={{ fontSize: 16, fontWeight: "bold", marginTop: 4 }}>
                                {new Date(start_time).toLocaleString("vi-VN")}
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 6 }}>
                            <Text type="secondary">Thời gian nộp bài:</Text>
                            <div style={{ fontSize: 16, fontWeight: "bold", marginTop: 4 }}>
                                {submit_time ? new Date(submit_time).toLocaleString("vi-VN") : "Chưa nộp bài"}
                            </div>
                        </div>
                    </Col>
                </Row>

                {cheat_logs && cheat_logs.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                        <Text strong><WarningOutlined style={{ color: "#faad14", marginRight: 6 }} /> Chi tiết nhật ký phát hiện hoạt động rời màn hình:</Text>
                        <List
                            size="small"
                            bordered
                            dataSource={cheat_logs}
                            renderItem={(log, index) => (
                                <List.Item key={index}>
                                    <Text type="danger">[{new Date(log.timestamp).toLocaleTimeString()}]</Text> Hành vi: {log.reason} (Lần thứ {log.count})
                                </List.Item>
                            )}
                            style={{ marginTop: 10, background: "#fffbe6", borderColor: "#ffe58f" }}
                        />
                    </div>
                )}
            </Card>

            {/* Questions to grade */}
            <Title level={4} style={{ marginBottom: 16 }}>DANH SÁCH CÂU HỎI & BÀI LÀM</Title>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {answers.map((ans, idx) => {
                    const isMC = ans.question?.question_type === "multiple_choice";
                    const gradeState = grades[ans.id];

                    let parsedOptions = [];
                    if (isMC) {
                        try {
                            parsedOptions = typeof ans.question?.options === "string" 
                                ? JSON.parse(ans.question?.options) 
                                : ans.question?.options;
                        } catch (e) {
                            parsedOptions = [];
                        }
                    }

                    return (
                        <Card
                            key={ans.id}
                            title={
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span>Câu {idx + 1} <Tag color={isMC ? "blue" : "purple"}>{isMC ? "Trắc nghiệm" : "Tự luận"}</Tag></span>
                                    <span>Điểm tối đa: {ans.question?.score}</span>
                                </div>
                            }
                            style={{ borderRadius: 8, border: "1px solid #d9d9d9" }}
                        >
                            {/* Question statement */}
                            <Paragraph style={{ fontSize: 16, fontWeight: "bold" }}>
                                {ans.question?.question_text}
                            </Paragraph>

                            {/* Answer review */}
                            {isMC ? (
                                <div style={{ background: "#f9f9f9", padding: 16, borderRadius: 6, marginBottom: 16 }}>
                                    <div style={{ marginBottom: 8 }}>
                                        <Text strong>Các phương án:</Text>
                                        <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                                            {parsedOptions.map((opt, oIdx) => (
                                                <li key={oIdx}>{String.fromCharCode(65 + oIdx)}. {opt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <div style={{ background: "#e6f7ff", padding: 10, borderRadius: 4 }}>
                                                <Text>Học viên chọn: </Text>
                                                <Text strong color="blue">{ans.selected_answer || <span style={{ color: "#ff4d4f" }}>(Bỏ trống)</span>}</Text>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div style={{ background: "#f6ffed", padding: 10, borderRadius: 4 }}>
                                                <Text>Đáp án đúng: </Text>
                                                <Text strong color="green">{ans.question?.correct_answer}</Text>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div style={{ marginTop: 12 }}>
                                        <Text>Điểm đạt được: </Text>
                                        <Text strong style={{ fontSize: 16, color: ans.is_correct ? "#52c41a" : "#ff4d4f" }}>
                                            {ans.score} / {ans.question?.score}
                                        </Text>
                                        <span style={{ marginLeft: 8 }}>
                                            {ans.is_correct ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {/* Student Essay answer */}
                                    <div style={{ background: "#fff0f6", borderLeft: "4px solid #eb2f96", padding: 16, borderRadius: "0 6px 6px 0", marginBottom: 16 }}>
                                        <Text strong style={{ color: "#eb2f96" }}>Bài làm của học viên:</Text>
                                        <Paragraph style={{ whiteSpace: "pre-wrap", marginTop: 8, fontSize: 15 }}>
                                            {ans.essay_answer || <span style={{ color: "#ff4d4f", fontStyle: "italic" }}>Học viên không nộp câu trả lời cho câu này.</span>}
                                        </Paragraph>
                                    </div>

                                    {/* Reference guidelines */}
                                    <div style={{ background: "#f6ffed", borderLeft: "4px solid #52c41a", padding: 16, borderRadius: "0 6px 6px 0", marginBottom: 20 }}>
                                        <Text strong style={{ color: "#52c41a" }}>Đáp án tham khảo / Gợi ý mẫu từ Giáo viên:</Text>
                                        <Paragraph style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
                                            {ans.question?.correct_answer}
                                        </Paragraph>
                                    </div>

                                    <Divider />

                                    {/* Grading controls */}
                                    {gradeState && (
                                        <div style={{ background: "#fafafa", padding: 20, borderRadius: 8, border: "1px dashed #d9d9d9" }}>
                                            <Title level={5} style={{ margin: "0 0 16px 0" }}>Nhập điểm & Nhận xét của Giáo viên</Title>
                                            <Row gutter={[24, 16]}>
                                                <Col span={8}>
                                                    <Space direction="vertical" style={{ width: "100%" }}>
                                                        <Text strong>Điểm chấm:</Text>
                                                        <InputNumber
                                                            min={0.0}
                                                            max={ans.question?.score || 1.0}
                                                            step={0.5}
                                                            value={gradeState.score}
                                                            onChange={(val) => handleGradeChange(ans.id, "score", val)}
                                                            style={{ width: "100%" }}
                                                        />
                                                        <Text type="secondary">Tối đa: {ans.question?.score} điểm</Text>
                                                    </Space>
                                                </Col>
                                                <Col span={8}>
                                                    <Space direction="vertical" style={{ width: "100%" }}>
                                                        <Text strong>Đánh giá:</Text>
                                                        <Radio.Group
                                                            value={gradeState.is_correct}
                                                            onChange={(e) => handleGradeChange(ans.id, "is_correct", e.target.value)}
                                                        >
                                                            <Radio value={true}>Đạt (Đúng)</Radio>
                                                            <Radio value={false}>Chưa đạt (Sai)</Radio>
                                                        </Radio.Group>
                                                    </Space>
                                                </Col>
                                                <Col span={24}>
                                                    <Space direction="vertical" style={{ width: "100%" }}>
                                                        <Text strong>Nhận xét chi tiết cho câu này:</Text>
                                                        <Input.TextArea
                                                            rows={3}
                                                            value={gradeState.admin_comment}
                                                            onChange={(e) => handleGradeChange(ans.id, "admin_comment", e.target.value)}
                                                            placeholder="Nhập nhận xét chi tiết ví dụ: Giải thích tốt, cấu trúc code rõ ràng..."
                                                        />
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    );
                })}

                {/* Submit all grades */}
                <Card style={{ marginTop: 24, textAlign: "right" }}>
                    <Space size="large">
                        <Button size="large" onClick={() => navigate("/admin/exams")}>
                            Hủy bỏ thay đổi
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            icon={<SaveOutlined />}
                            loading={isGrading}
                            onClick={handleSaveGrades}
                        >
                            Hoàn tất & Cập nhật điểm thi
                        </Button>
                    </Space>
                </Card>
            </Space>
        </div>
    );
}

export default ExamGrading;
