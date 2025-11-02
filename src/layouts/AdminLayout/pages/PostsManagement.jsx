import { useState } from "react";
import {
    Table,
    Tag,
    Button,
    Space,
    Input,
    Modal,
    message,
    Tooltip,
} from "antd";
import {
    CheckCircleOutlined,
    DeleteOutlined,
    EyeOutlined,
    QuestionCircleOutlined,
    ExclamationCircleFilled,
} from "@ant-design/icons";
import {
    useGetAllPostsManagementQuery,
    useApprovePostMutation,
    useDeletePostMutation,
    useApproveAllPostsMutation,
} from "@/services/admin/postsService";
import useDebounce from "@/hook/useDebounce";

function PostsManagement() {
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [approveAllPosts] = useApproveAllPostsMutation();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [approveAllModalVisible, setApproveAllModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const debouncedSearchText = useDebounce(searchText, 500);

    const { data: postsData, isFetching } = useGetAllPostsManagementQuery(
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

    const [approvePost] = useApprovePostMutation();
    const [deletePost] = useDeletePostMutation();

    const handleApprove = async (id) => {
        try {
            await approvePost({ id, is_approved: true }).unwrap();
            message.success("Bài viết đã được phê duyệt");
        } catch (error) {
            message.error(
                error.data?.message || "Có lỗi xảy ra khi phê duyệt bài viết"
            );
        }
    };

    const handleDelete = async () => {
        try {
            await deletePost(selectedPost.id).unwrap();
            message.success("Xóa bài viết thành công");
            setDeleteModalVisible(false);
        } catch (error) {
            message.error(
                error.data?.message || "Có lỗi xảy ra khi xóa bài viết"
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
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (text) => (
                <Tooltip title={text}>
                    <div
                        style={{
                            maxWidth: "300px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                        dangerouslySetInnerHTML={{
                            __html: text,
                        }}
                    />
                </Tooltip>
            ),
        },
        {
            title: "Tác giả",
            dataIndex: ["user", "name"],
            key: "author",
            render: (_, name) => {
                return name?.author?.full_name ? (
                    <Tag color="blue">{name?.author?.full_name}</Tag>
                ) : (
                    "-"
                );
            },
        },
        {
            title: "Chủ đề",
            dataIndex: ["topic", "name"],
            key: "topic",
            render: (_, topic) =>
                topic.topics.length > 0
                    ? topic.topics.map((item) => {
                          return (
                              <Tag key={item.id} color="blue">
                                  {item.name}
                              </Tag>
                          );
                      })
                    : "-",
        },
        {
            title: "Lượt xem",
            dataIndex: "views_count",
            key: "views",
            width: 100,
            render: (count) => (
                <Space>
                    <EyeOutlined /> {count}
                </Space>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "is_approved",
            key: "status",
            width: 120,
            render: (isApproved) => (
                <Tag color={isApproved ? "success" : "warning"}>
                    {isApproved ? "Đã duyệt" : "Chưa duyệt"}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space>
                    {!record.is_approved && (
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleApprove(record.id)}
                            title="Phê duyệt"
                        >
                            Duyệt
                        </Button>
                    )}
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setSelectedPost(record);
                            setDeleteModalVisible(true);
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
                <Space>
                    <Input.Search
                        placeholder="Tìm kiếm bài viết..."
                        allowClear
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        loading={isFetching}
                    />
                    <Button
                        type="primary"
                        danger
                        icon={<ExclamationCircleFilled />}
                        onClick={() => setApproveAllModalVisible(true)}
                    >
                        Duyệt tất cả bài viết
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={postsData?.data?.posts || []}
                rowKey="id"
                loading={isFetching}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: postsData?.data?.pagination?.total || 0,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} bài viết`,
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
                                    ? `Không tìm thấy bài viết nào cho từ khóa "${searchText}"`
                                    : "Không có bài viết nào"}
                            </div>
                        </div>
                    ),
                }}
            />

            <Modal
                title="Xác nhận xóa"
                open={deleteModalVisible}
                onOk={handleDelete}
                onCancel={() => {
                    setDeleteModalVisible(false);
                    setSelectedPost(null);
                }}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Bạn có chắc chắn muốn xóa bài viết &ldquo;
                    <strong>{selectedPost?.title}</strong>&rdquo; không?
                </p>
            </Modal>

            <Modal
                title="Cảnh báo"
                open={approveAllModalVisible}
                onOk={async () => {
                    try {
                        await approveAllPosts().unwrap();
                        message.success("Đã duyệt tất cả bài viết thành công");
                        setApproveAllModalVisible(false);
                    } catch (error) {
                        message.error(
                            error.data?.message ||
                                "Có lỗi xảy ra khi duyệt bài viết"
                        );
                    }
                }}
                onCancel={() => setApproveAllModalVisible(false)}
                okText="Duyệt tất cả"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p style={{ color: "#ff4d4f" }}>
                    <ExclamationCircleFilled style={{ marginRight: 8 }} />
                    Hành động này sẽ duyệt tất cả các bài viết, bao gồm cả những
                    bài viết có thể chưa phù hợp.
                </p>
                <p>Bạn có chắc chắn muốn tiếp tục?</p>
            </Modal>
        </div>
    );
}

export default PostsManagement;
