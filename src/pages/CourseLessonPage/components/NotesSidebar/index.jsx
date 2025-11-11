import { useState } from "react";
import styles from "./NotesSidebar.module.scss";
import {
    useGetAllNotesQuery,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
} from "@/services/notesService";
import DOMPurify from "dompurify";

function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${m}:${s}`;
}

export default function NotesSidebar({
    open,
    onClose,
    courseId,
    tracks = [],
    onJumpToLesson,
}) {
    // fetch notes when sidebar is open (for current course)
    const queryArg = courseId ? { courseId } : undefined;
    const { data: notes = [], isLoading } = useGetAllNotesQuery(queryArg, {
        // skip: !open || !courseId,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    // console.log(notes);

    const [selectedTrackId, setSelectedTrackId] = useState("");
    const [selectedLessonId, setSelectedLessonId] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [filterPinned, setFilterPinned] = useState("all"); // all, pinned, unpinned

    // Edit/Delete modal state
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editPinned, setEditPinned] = useState(false);
    const [deleteNoteId, setDeleteNoteId] = useState(null);

    // Toast state
    const [toast, setToast] = useState(null);

    // Mutations
    const [updateNote] = useUpdateNoteMutation();
    const [deleteNote] = useDeleteNoteMutation();

    // Show toast helper
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    if (!open) return null;

    // normalize notes payload: backend may return an array or a paginated object { data: [...] }
    const allNotes = Array.isArray(notes) ? notes : notes?.data || [];

    // derive list of lessons for selected track
    const lessonsForTrack = (() => {
        const t = tracks.find((tr) => tr.id === Number(selectedTrackId));
        return t?.lessons || [];
    })();

    // filter notes according to selected track/lesson/pinned status
    let visibleNotes = allNotes || [];
    if (selectedLessonId) {
        visibleNotes = visibleNotes.filter(
            (n) => n.lesson?.id === Number(selectedLessonId)
        );
    } else if (selectedTrackId) {
        visibleNotes = visibleNotes.filter(
            (n) => n.lesson?.track?.id === Number(selectedTrackId)
        );
    }

    if (filterPinned === "pinned") {
        visibleNotes = visibleNotes.filter((n) => n.is_pinned === true);
    } else if (filterPinned === "unpinned") {
        visibleNotes = visibleNotes.filter((n) => n.is_pinned === false);
    }

    // Copy and sort
    visibleNotes = [...visibleNotes].sort((a, b) => {
        // Pinned notes always come first
        if (a.is_pinned !== b.is_pinned) {
            return a.is_pinned ? -1 : 1;
        }

        // Then sort by date within pinned and unpinned groups
        if (sortOrder === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortOrder === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
        }
        return 0;
    });

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <aside
                className={styles.sidebar}
                onClick={(e) => e.stopPropagation()}
            >
                <header className={styles.header}>
                    <h3>Ghi chú của tôi</h3>
                    <button className={styles.close} onClick={onClose}>
                        ×
                    </button>
                </header>

                <div className={styles.controls}>
                    <div className={styles.selectGroup}>
                        <label>Chọn chương</label>
                        <select
                            value={selectedTrackId}
                            onChange={(e) => {
                                setSelectedTrackId(e.target.value);
                                setSelectedLessonId("");
                            }}
                        >
                            <option value="">Tất cả chương</option>
                            {tracks.map((tr) => (
                                <option
                                    key={tr.id}
                                    value={tr.id}
                                >{`${tr.position}. ${tr.title}`}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.selectGroup}>
                        <label>Chọn bài (tùy chọn)</label>
                        <select
                            value={selectedLessonId}
                            onChange={(e) =>
                                setSelectedLessonId(e.target.value)
                            }
                        >
                            <option value="">Tất cả bài</option>
                            {lessonsForTrack.map((l) => (
                                <option
                                    key={l.id}
                                    value={l.id}
                                >{`${l.position}. ${l.title}`}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.selectGroup}>
                        <label>Trạng thái</label>
                        <select
                            value={filterPinned}
                            onChange={(e) => setFilterPinned(e.target.value)}
                        >
                            <option value="all">Tất cả</option>
                            <option value="pinned">📌 Ghim</option>
                            <option value="unpinned">Bình thường</option>
                        </select>
                    </div>

                    <div className={styles.selectGroup}>
                        <label>Sắp xếp</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                        </select>
                    </div>
                </div>

                <div className={styles.list}>
                    {isLoading && <p>Đang tải...</p>}
                    {!isLoading &&
                        (!visibleNotes || visibleNotes.length === 0) && (
                            <p>Chưa có ghi chú nào</p>
                        )}

                    {visibleNotes &&
                        visibleNotes.map((note) => (
                            <div key={note.id} className={styles.noteItem}>
                                <div className={styles.meta}>
                                    <div>
                                        <div className={styles.lessonTitle}>
                                            {note.lesson?.title}
                                        </div>
                                        <div className={styles.trackCourse}>
                                            {note.lesson?.track?.title} —{" "}
                                            {note.lesson?.track?.course?.title}
                                        </div>
                                    </div>
                                    {note.is_pinned && (
                                        <span className={styles.pinnedBadge}>
                                            📌
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={styles.content}
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            note.content
                                        ),
                                    }}
                                />
                                <div className={styles.footer}>
                                    <span className={styles.time}>
                                        {formatTime(note.video_timestamp || 0)}
                                    </span>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.goto}
                                            onClick={() => {
                                                onJumpToLesson &&
                                                    onJumpToLesson(
                                                        note.lesson?.id,
                                                        note.video_timestamp
                                                    );
                                            }}
                                        >
                                            ⯈ Xem lại
                                        </button>
                                        <button
                                            className={styles.pinBtn}
                                            onClick={async () => {
                                                try {
                                                    await updateNote({
                                                        id: note.id,
                                                        is_pinned:
                                                            !note.is_pinned,
                                                    }).unwrap();
                                                    showToast(
                                                        note.is_pinned
                                                            ? "Bỏ ghim thành công"
                                                            : "Ghim ghi chú thành công",
                                                        "success"
                                                    );
                                                } catch (err) {
                                                    showToast(
                                                        "Cập nhật ghim thất bại",
                                                        "error"
                                                    );
                                                }
                                            }}
                                            title={
                                                note.is_pinned
                                                    ? "Bỏ ghim"
                                                    : "Ghim"
                                            }
                                        >
                                            {note.is_pinned ? "📍" : "📌"}
                                        </button>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => {
                                                setEditingNoteId(note.id);
                                                setEditContent(note.content);
                                                setEditPinned(
                                                    note.is_pinned || false
                                                );
                                            }}
                                            title="Sửa"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => {
                                                setDeleteNoteId(note.id);
                                            }}
                                            title="Xóa"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Edit Modal */}
                {editingNoteId && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h4>Sửa ghi chú</h4>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={4}
                            />
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={editPinned}
                                    onChange={(e) =>
                                        setEditPinned(e.target.checked)
                                    }
                                />
                                📌 Ghim ghi chú này
                            </label>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => {
                                        setEditingNoteId(null);
                                        setEditContent("");
                                        setEditPinned(false);
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    className={styles.saveBtn}
                                    onClick={async () => {
                                        try {
                                            await updateNote({
                                                id: editingNoteId,
                                                content: editContent,
                                                is_pinned: editPinned,
                                            }).unwrap();
                                            showToast(
                                                "Cập nhật ghi chú thành công",
                                                "success"
                                            );
                                            setEditingNoteId(null);
                                            setEditContent("");
                                            setEditPinned(false);
                                        } catch (err) {
                                            showToast(
                                                "Cập nhật ghi chú thất bại",
                                                "error"
                                            );
                                            console.error(
                                                "Update failed:",
                                                err
                                            );
                                        }
                                    }}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteNoteId && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h4>Xác nhận xóa ghi chú?</h4>
                            <p>Hành động này không thể hoàn tác.</p>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setDeleteNoteId(null)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className={styles.deleteConfirmBtn}
                                    onClick={async () => {
                                        try {
                                            await deleteNote({
                                                id: deleteNoteId,
                                            }).unwrap();
                                            showToast(
                                                "Xóa ghi chú thành công",
                                                "success"
                                            );
                                            setDeleteNoteId(null);
                                        } catch (err) {
                                            showToast(
                                                "Xóa ghi chú thất bại",
                                                "error"
                                            );
                                            console.error(
                                                "Delete failed:",
                                                err
                                            );
                                        }
                                    }}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast Notification */}
                {toast && (
                    <div
                        className={`${styles.toast} ${
                            styles[`toast-${toast.type}`]
                        }`}
                    >
                        {toast.message}
                    </div>
                )}
            </aside>
        </div>
    );
}
