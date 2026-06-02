import { Button, Card, Space, Tag } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    MenuOutlined,
    EyeOutlined,
    CodeOutlined,
} from "@ant-design/icons";
import { useDrag, useDrop } from "react-dnd";
import isHttps from "@/utils/isHttps";
import PropTypes from "prop-types";
import { useRef } from "react";
import { ItemTypes } from "./constants";

const lessonPropType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    lesson_type: PropTypes.string,
    track: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        course: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
});

LessonItem.propTypes = {
    lesson: lessonPropType.isRequired,
    index: PropTypes.number.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleViewDetails: PropTypes.func.isRequired,
    handleManageExercise: PropTypes.func.isRequired,
    setSelectedLesson: PropTypes.func.isRequired,
    setIsDeleteModalOpen: PropTypes.func.isRequired,
    onMoveLesson: PropTypes.func.isRequired,
};

export default function LessonItem({
    lesson,
    index,
    handleEdit,
    handleViewDetails,
    handleManageExercise,
    setSelectedLesson,
    setIsDeleteModalOpen,
    onMoveLesson,
}) {
    const ref = useRef(null);

    const [{ isDragging }, drag, dragPreview] = useDrag({
        type: ItemTypes.LESSON,
        item: { id: lesson.id, index, trackId: lesson.track.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.LESSON,
        canDrop: (item) => {
            return item.trackId === lesson.track.id;
        },
        drop: (item) => {
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            onMoveLesson(dragIndex, hoverIndex);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver() && monitor.canDrop(),
        }),
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));

    const isChallenge = lesson.lesson_type === "Challenge";

    return (
        <div ref={dragPreview}>
            <Card.Grid
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 16,
                    marginBottom: 8,
                    opacity,
                    background: isChallenge ? "#f6ffed" : undefined,
                    border: isOver ? "2px dashed #1890ff" : undefined,
                    transition: "border 0.2s ease",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div ref={ref}>
                        <MenuOutlined style={{ cursor: "grab" }} />
                    </div>
                    <img
                        src={
                            isHttps(lesson.thumbnail)
                                ? lesson.thumbnail
                                : `${import.meta.env.VITE_BASE_URL}${
                                      lesson.thumbnail
                                  }`
                        }
                        alt={lesson.title}
                        style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 8 }}>
                            {lesson.title}
                            {isChallenge && (
                                <Tag color="green" style={{ fontSize: 11 }}>
                                    Bài tập
                                </Tag>
                            )}
                        </div>
                        <div>{lesson.description || "Không có mô tả"}</div>
                    </div>
                </div>
                <Space>
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(lesson)}
                    >
                        Xem
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(lesson)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type={isChallenge ? "primary" : "default"}
                        icon={<CodeOutlined />}
                        onClick={() => handleManageExercise(lesson)}
                        style={isChallenge ? {} : { borderColor: "#1890ff", color: "#1890ff" }}
                    >
                        Bài tập
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setSelectedLesson(lesson);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        Xóa
                    </Button>
                </Space>
            </Card.Grid>
        </div>
    );
}
