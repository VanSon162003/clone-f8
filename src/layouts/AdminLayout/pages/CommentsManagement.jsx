import { useState } from "react";
import { Table, Tag, Button, Input, Modal, message, Tooltip } from "antd";
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

function CommentsManagement() {
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [hideModalVisible, setHideModalVisible] = useState(false);
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
            width: 120,
            render: (_, record) =>
                record.deleted_at ? (
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
        </div>
    );
}

export default CommentsManagement;
