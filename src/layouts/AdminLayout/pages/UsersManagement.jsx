import { Table, Space, Button, Select, Input } from "antd";
import {
    SearchOutlined,
    LockOutlined,
    UnlockOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
    useGetAllUsersManagementQuery,
    useUpdateUserRoleMutation,
    useUpdateUserStatusMutation,
} from "@/services/admin/usersService";
import { message } from "antd";
import useDebounce from "@/hook/useDebounce";

const { Search } = Input;

function UsersManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 500);

    const [updateRole] = useUpdateUserRoleMutation();
    const [updateStatus] = useUpdateUserStatusMutation();

    const handleRoleChange = useCallback(
        async (value, userId) => {
            try {
                await updateRole({ userId, role: value }).unwrap();
                message.success("Cập nhật vai trò thành công");
                refetch();
            } catch (error) {
                console.error("Error changing role:", error);
                message.error("Có lỗi xảy ra khi cập nhật vai trò");
            }
        },
        [updateRole]
    );

    const handleStatusChange = useCallback(
        async (userId, newStatus) => {
            try {
                await updateStatus({ userId, status: newStatus }).unwrap();
                message.success("Cập nhật trạng thái thành công");
                refetch();
            } catch (error) {
                console.error("Error changing status:", error);
                message.error("Có lỗi xảy ra khi cập nhật trạng thái");
            }
        },
        [updateStatus]
    );

    const columns = useMemo(
        () => [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "Tên",
                dataIndex: "full_name",
                key: "full_name",
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
            },
            {
                title: "Vai trò",
                dataIndex: "role",
                key: "role",
                render: (role, record) => {
                    return (
                        <Select
                            value={record.role}
                            style={{ width: 120 }}
                            onChange={(value) =>
                                handleRoleChange(value, record.id)
                            }
                            options={[
                                { value: "user", label: "User" },
                                { value: "instructor", label: "Instructor" },
                                { value: "admin", label: "Admin" },
                            ]}
                        />
                    );
                },
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                render: (status) => (
                    <span
                        style={{ color: status === "active" ? "green" : "red" }}
                    >
                        {status === "active" ? "Hoạt động" : "Đã khóa"}
                    </span>
                ),
            },
            {
                title: "Hành động",
                key: "action",
                render: (_, record) => (
                    <Space size="middle">
                        {record.status === "active" ? (
                            <Button
                                icon={<LockOutlined />}
                                danger
                                onClick={() =>
                                    handleStatusChange(record.id, "inactive")
                                }
                            >
                                Khóa
                            </Button>
                        ) : (
                            <Button
                                icon={<UnlockOutlined />}
                                type="primary"
                                onClick={() =>
                                    handleStatusChange(record.id, "active")
                                }
                            >
                                Mở khóa
                            </Button>
                        )}
                    </Space>
                ),
            },
        ],
        [handleRoleChange, handleStatusChange]
    );

    const [data, setData] = useState([]);

    const {
        data: usersData,
        isFetching,
        refetch,
    } = useGetAllUsersManagementQuery(
        {
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            search: debouncedSearchText,
        },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );

    useEffect(() => {
        if (!isFetching && usersData?.data?.data) {
            setData(usersData.data.data);
        } else if (!isFetching) {
            setData([]);
            console.warn("Invalid data format received:", usersData);
        }
    }, [usersData, isFetching]);

    return (
        <div>
            <h2>Quản lý người dùng</h2>
            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm người dùng"
                    allowClear
                    enterButton={<SearchOutlined />}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    }}
                    loading={isFetching}
                />
            </div>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={isFetching}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: usersData?.data?.meta?.total || 0,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} người dùng`,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    onChange: (page, newPageSize) => {
                        if (newPageSize !== pageSize) {
                            setPageSize(newPageSize);
                            setCurrentPage(1);
                        } else {
                            setCurrentPage(page);
                        }
                    },
                }}
            />
        </div>
    );
}

export default UsersManagement;
