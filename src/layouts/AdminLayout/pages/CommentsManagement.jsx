import { useState } from "react";
import {
    Table,
    Tag,
    Button,
    Input,
    Modal,
    message,
    Tooltip,
    Space,
} from "antd";
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import {
    useGetAllCommentsManagementQuery,
    useUpdateCommentVisibilityMutation,
} from "@/services/admin/commentsService";
import useDebounce from "@/hook/useDebounce";
import isHttps from "@/utils/isHttps";

function CommentsManagement() {
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hideModalVisible, setHideModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    const debouncedSearchText = useDebounce(searchText, 500);

    const { data: commentsData, isFetching } = useGetAllCommentsManagementQuery(
        {
            page: currentPage,
            limit: pageSize,
            search: debouncedSearchText,
        },
        {
            refetchOnMountOrArgChange: true,
            refreshing: true,
            refetchOnFocus: true,
        }
    );

    const [updateVisibility] = useUpdateCommentVisibilityMutation();

    const handleVisibilityChange = async (comment, visible) => {
        try {
            await updateVisibility({
                id: comment.id,
                visible: visible,
            }).unwrap();
            message.success(
                visible
                    ? "Đã hiển thị bình luận thành công"
                    : "Đã ẩn bình luận thành công"
            );
            setHideModalVisible(false);
            setSelectedComment(null);
        } catch (error) {
            message.error(
                error.data?.message ||
                    `Có lỗi xảy ra khi ${visible ? "hiển thị" : "ẩn"} bình luận`
            );
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
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
            render: (text) => (
                <Tooltip title={text}>
                    <div
                        style={{
                            maxWidth: "300px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {text}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Người đăng",
            dataIndex: ["user", "name"],
            key: "author",
            render: (_, record) => <Tag>{record.user.full_name}</Tag>,
        },
        {
            title: "Thuộc về",
            key: "commentable",
            render: (_, record) => {
                const type = record.commentable_type;
                const info = record.commentable;
                return info ? (
                    <Tag color={type === "Post" ? "blue" : "green"}>
                        {type === "Post" ? "Bài viết: " : "Khóa học: "}
                        {info.title}
                    </Tag>
                ) : (
                    "-"
                );
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "deleted_at",
            key: "status",
            width: 120,
            render: (deletedAt) => (
                <Tag color={deletedAt ? "error" : "success"}>
                    {deletedAt ? "Đã ẩn" : "Hiển thị"}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 180,
            render: (_, record) => (
                <Space>
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedComment(record);
                            setViewModalVisible(true);
                        }}
                        title="Xem chi tiết"
                    >
                        Xem
                    </Button>
                    {record.deleted_at ? (
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => handleVisibilityChange(record, true)}
                            title="Hiển thị bình luận"
                        >
                            Hiển thị
                        </Button>
                    ) : (
                        <Button
                            danger
                            icon={<EyeInvisibleOutlined />}
                            onClick={() => {
                                setSelectedComment(record);
                                setHideModalVisible(true);
                            }}
                            title="Ẩn bình luận"
                        >
                            Ẩn
                        </Button>
                    )}
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
                    placeholder="Tìm kiếm bình luận..."
                    allowClear
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    loading={isFetching}
                />
            </div>

            <Table
                columns={columns}
                dataSource={commentsData?.data?.comments || []}
                rowKey="id"
                loading={isFetching}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: commentsData?.data?.pagination?.total || 0,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} bình luận`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                }}
                locale={{
                    emptyText: (
                        <div style={{ padding: "20px 0" }}>
                            <QuestionCircleOutlined
                                style={{ fontSize: 24, marginBottom: 8 }}
                            />
                            <div>
                                {searchText
                                    ? `Không tìm thấy bình luận nào cho từ khóa "${searchText}"`
                                    : "Không có bình luận nào"}
                            </div>
                        </div>
                    ),
                }}
            />

            <Modal
                title="Xác nhận ẩn bình luận"
                open={hideModalVisible}
                onOk={() => handleVisibilityChange(selectedComment, false)}
                onCancel={() => {
                    setHideModalVisible(false);
                    setSelectedComment(null);
                }}
                okText="Ẩn"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn ẩn bình luận này không?</p>
                <div
                    style={{
                        background: "#f5f5f5",
                        padding: 16,
                        borderRadius: 4,
                        marginTop: 8,
                    }}
                >
                    <strong>Nội dung:</strong> {selectedComment?.content}
                </div>
            </Modal>

            {/* View Details Modal */}
            <Modal
                title="Chi tiết bình luận"
                open={viewModalVisible}
                onCancel={() => {
                    setViewModalVisible(false);
                    setSelectedComment(null);
                }}
                width={700}
                footer={[
                    <Button
                        key="close"
                        onClick={() => {
                            setViewModalVisible(false);
                            setSelectedComment(null);
                        }}
                    >
                        Đóng
                    </Button>,
                ]}
            >
                {selectedComment && (
                    <div className="comment-details">
                        <Space
                            direction="vertical"
                            size="large"
                            style={{ width: "100%" }}
                        >
                            <div style={{ marginBottom: 16 }}>
                                <h3
                                    style={{
                                        borderBottom: "1px solid #f0f0f0",
                                        paddingBottom: 8,
                                    }}
                                >
                                    Thông tin bình luận
                                </h3>
                            </div>

                            {/* Thông tin người dùng */}
                            <div>
                                <strong>Người bình luận:</strong>
                                <div
                                    style={{
                                        marginTop: 8,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    {selectedComment.user.avatar && (
                                        <img
                                            src={
                                                isHttps(
                                                    selectedComment.user.avatar
                                                )
                                                    ? selectedComment.user
                                                          .avatar
                                                    : `${
                                                          import.meta.env
                                                              .VITE_BASE_URL
                                                      }${
                                                          selectedComment.user
                                                              .avatar
                                                      }`
                                            }
                                            alt={selectedComment.user.full_name}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
                                    <div>
                                        <div>
                                            <strong>
                                                {selectedComment.user.full_name}
                                            </strong>
                                        </div>
                                        <div style={{ color: "#666" }}>
                                            {selectedComment.user.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nội dung bình luận */}
                            <div>
                                <strong>Nội dung:</strong>
                                <div
                                    style={{
                                        marginTop: 8,
                                        padding: 16,
                                        background: "#f5f5f5",
                                        borderRadius: 4,
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {selectedComment.content}
                                </div>
                            </div>

                            {/* Thông tin liên quan */}
                            <div>
                                <strong>Thuộc về:</strong>
                                <div style={{ marginTop: 8 }}>
                                    <Tag
                                        color={
                                            selectedComment.commentable_type ===
                                            "Post"
                                                ? "blue"
                                                : "green"
                                        }
                                    >
                                        {selectedComment.commentable_type ===
                                        "Post"
                                            ? "Bài viết"
                                            : "Khóa học"}
                                    </Tag>
                                    {selectedComment.commentable?.title}
                                </div>
                            </div>

                            {/* Trạng thái */}
                            <div>
                                <strong>Trạng thái:</strong>{" "}
                                <Tag
                                    color={
                                        selectedComment.deleted_at
                                            ? "error"
                                            : "success"
                                    }
                                >
                                    {selectedComment.deleted_at
                                        ? "Đã ẩn"
                                        : "Đang hiển thị"}
                                </Tag>
                            </div>

                            {/* Thời gian */}
                            <div>
                                <Space direction="vertical">
                                    <div>
                                        <strong>Thời gian tạo:</strong>{" "}
                                        {new Date(
                                            selectedComment.created_at
                                        ).toLocaleString("vi-VN")}
                                    </div>
                                    <div>
                                        <strong>Cập nhật lần cuối:</strong>{" "}
                                        {new Date(
                                            selectedComment.updated_at
                                        ).toLocaleString("vi-VN")}
                                    </div>
                                    {selectedComment.deleted_at && (
                                        <div>
                                            <strong>Thời gian ẩn:</strong>{" "}
                                            {new Date(
                                                selectedComment.deleted_at
                                            ).toLocaleString("vi-VN")}
                                        </div>
                                    )}
                                </Space>
                            </div>
                        </Space>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default CommentsManagement;
