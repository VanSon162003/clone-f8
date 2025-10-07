import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "./components/Footer";
import Header from "./components/Header";
import styles from "./CourseLessonPage.module.scss";
import {
    faChevronUp,
    faCircleCheck,
    faCirclePlay,
    faCircleQuestion,
    faComments,
    faCompactDisc,
    faFileLines,
    faHeart,
    faPen,
    faPlus,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import CommentSidebar from "@/components/CommentSidebar";

const mockData = {
    data: {
        end_of_free: false,
        next_id: "NMDNjYjZhNTgtNzM1Ny00YmFlLTlmOTQtYjAxMTVmYTdkNGEzg",
        previous_id: "QMzQyN2JlYTItMjlhNC00MjYxLThjMzYtODhkOTJmYTg0MDYyI",
        has_paid: true,
        is_completable: true,
        is_logged: true,
        has_end_time_logging: true,
        learning_log: {
            id: 17129527,
            user_id: 404595,
            course_id: 1,
            track_id: 110,
            track_step_id: 2305,
            start_time: "2024-12-25 22:39:17",
            end_time: "2024-12-26 00:05:10",
            duration: 5153,
            created_at: "2024-12-25T15:39:17.000000Z",
            updated_at: "2024-12-25T17:05:10.000000Z",
        },
        last_step_id: "EY2E3ZTU5OTAtNWIxMy00ZGM2LWI2MzYtYjczMjhjZmVmNzAwA",
        end_of_course: false,
        is_completed: true,
        user_solutions: [],
        track_step: {
            id: 2305,
            uuid: "726f84ab-8a17-4c44-bca5-3e07f04c56c7",
            course_id: 1,
            track_id: 110,
            step_type: "App\\Common\\Models\\Video",
            step_id: 219,
            track_step_level_id: null,
            comments_count: 98,
            priority: 119,
            position: 202,
            is_present: true,
            is_notified: true,
            published_at: "2022-04-15 04:38:57",
            created_at: "2021-05-26T09:57:25.000000Z",
            updated_at: "2022-03-14T13:38:02.000000Z",
            is_bookmarked: false,
            is_published: true,
            track: {
                id: 110,
                course_id: 1,
                module_id: 1,
                title: "Form validation II",
                priority: 18,
                position: 18,
                duration: 4252,
                is_free: true,
                is_optional: false,
                is_display: 1,
                deleted_at: null,
                created_at: "2022-01-11T13:04:00.000000Z",
                updated_at: "2024-06-25T15:09:41.000000Z",
            },
            step: {
                id: 219,
                title: "Ph\u00e2n t\u00edch c\u00e1ch tri\u1ec3n khai logic",
                content:
                    '<p>Tham gia nh\u00f3m <a href="https://www.facebook.com/groups/f8official/" target="_blank" rel="noopener noreferrer">H\u1ecdc l\u1eadp tr\u00ecnh t\u1ea1i F8</a> tr\u00ean Facebook \u0111\u1ec3 c\u00f9ng nhau trao \u0111\u1ed5i trong qu\u00e1 tr\u00ecnh h\u1ecdc t\u1eadp \u2764\ufe0f</p> <p>C\u00e1c b\u1ea1n subscribe k\u00eanh Youtube <a href="https://url.mycv.vn/f8_youtube?ref=lesson_desc" target="_blank" rel="noopener noreferrer">F8 Official</a> \u0111\u1ec3 nh\u1eadn th\u00f4ng b\u00e1o khi c\u00f3 c\u00e1c b\u00e0i h\u1ecdc m\u1edbi nh\u00e9 \u2764\ufe0f</p>',
                description:
                    '<p>Tham gia nh\u00f3m <a href="https://www.facebook.com/groups/f8official/" target="_blank" rel="noopener noreferrer">H\u1ecdc l\u1eadp tr\u00ecnh t\u1ea1i F8</a> tr\u00ean Facebook \u0111\u1ec3 c\u00f9ng nhau trao \u0111\u1ed5i trong qu\u00e1 tr\u00ecnh h\u1ecdc t\u1eadp \u2764\ufe0f</p> <p>C\u00e1c b\u1ea1n subscribe k\u00eanh Youtube <a href="https://url.mycv.vn/f8_youtube?ref=lesson_desc" target="_blank" rel="noopener noreferrer">F8 Official</a> \u0111\u1ec3 nh\u1eadn th\u00f4ng b\u00e1o khi c\u00f3 c\u00e1c b\u00e0i h\u1ecdc m\u1edbi nh\u00e9 \u2764\ufe0f</p>',
                duration: 3687,
                video_type: "youtube",
                original_name: "Form validation (C\u00e1ch 2)",
                image: "https://i.ytimg.com/vi/jhvEPY8cEu0/maxresdefault.jpg",
                video: "jhvEPY8cEu0",
                playlist: null,
                version: 0,
                updated_at: "2022-02-26T02:00:42.000000Z",
                image_url:
                    "https://i.ytimg.com/vi/jhvEPY8cEu0/maxresdefault.jpg",
                video_url: "https://www.youtube.com/watch?v=jhvEPY8cEu0",
                files: [],
                skip_segments: [],
                questions: [],
            },
        },
        course: {
            id: 1,
            level_id: 1,
            parent_id: null,
            title: "L\u1eadp Tr\u00ecnh JavaScript C\u01a1 B\u1ea3n",
            certificate_name: "JavaScript Basic",
            slug: "javascript-co-ban",
            description:
                "H\u1ecdc Javascript c\u01a1 b\u1ea3n ph\u00f9 h\u1ee3p cho ng\u01b0\u1eddi ch\u01b0a t\u1eebng h\u1ecdc l\u1eadp tr\u00ecnh. V\u1edbi h\u01a1n 100 b\u00e0i h\u1ecdc v\u00e0 c\u00f3 b\u00e0i t\u1eadp th\u1ef1c h\u00e0nh sau m\u1ed7i b\u00e0i h\u1ecdc.",
            completed_content:
                "Ch\u00fac m\u1eebng b\u1ea1n \u0111\u00e3 ho\u00e0n th\u00e0nh kh\u00f3a h\u1ecdc! B\u1ea1n \u0111\u00e3 l\u00e0m \u0111\u01b0\u1ee3c m\u1ed9t \u0111i\u1ec1u th\u1eadt tuy\u1ec7t v\u1eddi! \ud83c\udf89\n\nTi\u1ebfp theo, b\u1ea1n c\u00f3 2 l\u1ef1a ch\u1ecdn:\n1. [Xem t\u1ed5ng k\u1ebft kh\u00f3a h\u1ecdc](/javascript-co-ban/summary)\n2. [Nh\u1eadn ch\u1ee9ng ch\u1ec9 kh\u00f3a h\u1ecdc](/javascript-co-ban/new-cert)\n\n---\n\nN\u1ebfu b\u1ea1n c\u00f3 b\u1ea5t k\u1ef3 c\u00e2u h\u1ecfi ho\u1eb7c th\u1eafc m\u1eafc n\u00e0o, h\u00e3y li\u00ean h\u1ec7 v\u1edbi ch\u00fang m\u00ecnh qua:\\\n\u23af Email: contact@fullstack.edu.vn\\\n\u23af Phone: 02463291102\n \nTr\u00e2n tr\u1ecdng,\n\n\u0110\u1ed9i ng\u0169 ph\u00e1t tri\u1ec3n F8",
            image: "courses/1.png",
            icon: "courses/1/6200ad9d8a2d8.png",
            content: null,
            video_type: "youtube",
            video: "0SJE9dYdpps",
            pass_percent: 48,
            priority: 5,
            students_count: 151496,
            comments_count: 102,
            videos_count: 112,
            duration: 87324,
            number_of_free: 1000,
            old_price: 0,
            price: 0,
            webhook_url: null,
            is_relatable: null,
            is_pro: false,
            is_completable: true,
            published_at: "2020-02-10T14:23:13.000000Z",
            deleted_at: null,
            created_at: "2020-06-10T14:23:13.000000Z",
            updated_at: "2025-10-05T04:48:25.000000Z",
            image_url: "https://files.fullstack.edu.vn/f8-prod/courses/1.png",
            icon_url:
                "https://files.fullstack.edu.vn/f8-prod/courses/1/6200ad9d8a2d8.png",
            video_url: "https://www.youtube.com/watch?v=0SJE9dYdpps",
            is_published: true,
        },
        course_progress: 100,
        pass_percent: 48,
        resources: [],
        is_course_active: true,
    },
};

const mockDataTrack = {
    data: {
        completed: [],
        remaining: [],
        has_paid: false,
        tracks: [
            {
                id: 1,
                course_id: 1,
                title: "Gi\u1edbi thi\u1ec7u",
                is_free: true,
                position: 1,
                track_steps_count: 3,
                track_steps: [
                    {
                        id: 2091,
                        track_id: 1,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 1,
                        position: 1,
                        is_bookmarked: 0,
                        hash: "lYjllZTExYmQtMGJlMS00NTdiLTlkMjktMTBiMzViNjE4Mzg5Q",
                        is_published: false,
                        step: {
                            id: 1,
                            title: "L\u1eddi khuy\u00ean tr\u01b0\u1edbc kh\u00f3a h\u1ecdc",
                            duration: 260,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 2092,
                        track_id: 1,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 2,
                        position: 2,
                        is_bookmarked: 0,
                        hash: "ROTRkNzkyNTYtNzI1MC00MGU5LWI4NjMtZjI4ZWEyYzU5NzM3Y",
                        is_published: false,
                        step: {
                            id: 2,
                            title: "C\u00e0i \u0111\u1eb7t m\u00f4i tr\u01b0\u1eddng",
                            duration: 128,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 6451,
                        track_id: 1,
                        step_type: "App\\Common\\Models\\Lesson",
                        step_id: 1383,
                        position: 3,
                        is_bookmarked: 0,
                        hash: "EODE3NzQxYTgtNTExYS00MWVjLTk3MDItN2Q1MzdkNzE0ZTBlg",
                        is_published: false,
                        step: {
                            id: 1383,
                            title: "Tham gia c\u1ed9ng \u0111\u1ed3ng F8 tr\u00ean Discord",
                            duration: 60,
                        },
                        resources: [],
                    },
                ],
                duration: 448,
            },
            {
                id: 2,
                course_id: 1,
                title: "Bi\u1ebfn, comments, built-in",
                is_free: true,
                position: 2,
                track_steps_count: 10,
                track_steps: [
                    {
                        id: 2093,
                        track_id: 2,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 3,
                        position: 4,
                        is_bookmarked: 0,
                        hash: "JZGJhMzM3MjYtMjE2MC00MTlmLWE0NDEtY2UzZjhjMzdlNzJjY",
                        is_published: false,
                        step: {
                            id: 3,
                            title: "S\u1eed d\u1ee5ng JavaScript v\u1edbi HTML",
                            duration: 273,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 2845,
                        track_id: 2,
                        step_type: "App\\Common\\Models\\Lesson",
                        step_id: 689,
                        position: 5,
                        is_bookmarked: 0,
                        hash: "QMmQ3ZWMwMDYtMWIzZC00ZTM1LThkMDktOTE5NDI4OTYwMTM0Y",
                        is_published: false,
                        step: {
                            id: 689,
                            title: "L\u00e0m quen v\u1edbi m\u00e0n th\u1eed th\u00e1ch",
                            duration: 60,
                        },
                        resources: [],
                    },
                    {
                        id: 2817,
                        track_id: 2,
                        step_type: "App\\Common\\Models\\Challenge",
                        step_id: 33,
                        position: 6,
                        is_bookmarked: 0,
                        hash: "YNWY3NjJmODktNDVhNC00NDFjLWFkOWQtYTdjYzMyYjg2ODgyk",
                        is_published: false,
                        step: {
                            id: 33,
                            title: "B\u1eaft \u0111\u1ea7u v\u1edbi m\u1ed9t th\u1eed th\u00e1ch nh\u1ecf",
                            duration: 94,
                        },
                        resources: [],
                    },
                    {
                        id: 2589,
                        track_id: 2,
                        step_type: "App\\Common\\Models\\Lesson",
                        step_id: 536,
                        position: 7,
                        is_bookmarked: 0,
                        hash: "cOTc3MjliOWMtNWE5OS00ZWQ2LWFmOTktNWJlYTM5OWVlMDVlM",
                        is_published: false,
                        step: {
                            id: 536,
                            title: "L\u01b0u \u00fd khi h\u1ecdc l\u1eadp tr\u00ecnh t\u1ea1i F8",
                            duration: 180,
                        },
                        resources: [],
                    },
                    {
                        id: 2094,
                        track_id: 2,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 4,
                        position: 8,
                        is_bookmarked: 0,
                        hash: "YYjY0ODZiZjUtODFiZS00OGJjLWJjOTUtMDI1YjhjMWZkYTc1U",
                        is_published: false,
                        step: {
                            id: 4,
                            title: "Kh\u00e1i ni\u1ec7m bi\u1ebfn v\u00e0 c\u00e1ch s\u1eed d\u1ee5ng",
                            duration: 246,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 2818,
                        track_id: 2,
                        step_type: "App\\Common\\Models\\Challenge",
                        step_id: 34,
                        position: 9,
                        is_bookmarked: 0,
                        hash: "ANjA1NzUyYjktMjhkMC00ZDgwLTkzNjktNDBiYjY5ZTJiNTk4k",
                        is_published: false,
                        step: {
                            id: 34,
                            title: "Th\u1ef1c h\u00e0nh s\u1eed d\u1ee5ng bi\u1ebfn",
                            duration: 82,
                        },
                        resources: [],
                    },
                    {
                        id: 2095,
                        track_id: 2,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 5,
                        position: 10,
                        is_bookmarked: 0,
                        hash: "IZDI1MTJhZjgtMDc5Ny00NzY3LTk4ZjMtZmZjNjkzNzc2MTUyg",
                        is_published: false,
                        step: {
                            id: 5,
                            title: "C\u00fa ph\u00e1p comments l\u00e0 g\u00ec?",
                            duration: 336,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 2819,
                        track_id: 2,
                        step_type: "App\\Common\\Models\\Challenge",
                        step_id: 35,
                        position: 11,
                        is_bookmarked: 0,
                        hash: "YYjYzM2JlZTctYmQ5OC00YzdlLWI4MzUtNTdiYTkzOGMxNjQ0c",
                        is_published: false,
                        step: {
                            id: 35,
                            title: "V\u00ed d\u1ee5 s\u1eed d\u1ee5ng comments",
                            duration: 42,
                        },
                        resources: [],
                    },
                    {
                        id: 2096,
                        track_id: 2,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 6,
                        position: 12,
                        is_bookmarked: 0,
                        hash: "gNjg3MjhkNjYtY2YzNy00OTk4LWExY2EtOTdlNmRiOGI2NDkyY",
                        is_published: false,
                        step: {
                            id: 6,
                            title: "Thu\u1eadt ng\u1eef Built-in l\u00e0 g\u00ec?",
                            duration: 467,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 2821,
                        track_id: 2,
                        step_type: "App\\Common\\Models\\Challenge",
                        step_id: 37,
                        position: 13,
                        is_bookmarked: 0,
                        hash: "INDIxMjI2MzYtMjRjYS00ZTIyLTlhMmQtNDgxNzdjMTE2ODM2Y",
                        is_published: false,
                        step: {
                            id: 37,
                            title: "Th\u1ef1c h\u00e0nh s\u1eed d\u1ee5ng console.log",
                            duration: 92,
                        },
                        resources: [],
                    },
                ],
                duration: 1872,
            },
            {
                id: 101,
                course_id: 1,
                title: "To\u00e1n t\u1eed, ki\u1ec3u d\u1eef li\u1ec7u",
                is_free: true,
                position: 3,
                track_steps_count: 26,
                track_steps: [
                    {
                        id: 2097,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 7,
                        position: 14,
                        is_bookmarked: 0,
                        hash: "lMjljODBkODQtM2Y1OC00NzljLTkzOTItZmVjN2Q2OGU0MDFjQ",
                        is_published: false,
                        step: {
                            id: 7,
                            title: "L\u00e0m quen v\u1edbi to\u00e1n t\u1eed",
                            duration: 324,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 2098,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 8,
                        position: 15,
                        is_bookmarked: 0,
                        hash: "AODA1Zjg5ZmQtOWFiMi00OGFiLTk4NTItOGY2NGEzNzdhYjM2Q",
                        is_published: false,
                        step: {
                            id: 8,
                            title: "To\u00e1n t\u1eed s\u1ed1 h\u1ecdc",
                            duration: 334,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 2822,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Challenge",
                        step_id: 38,
                        position: 16,
                        is_bookmarked: 0,
                        hash: "lNTljY2EyM2UtY2Q5Yi00MmFjLWE2NzMtYTY0MGMxZTMyZWNjU",
                        is_published: false,
                        step: {
                            id: 38,
                            title: "Th\u1ef1c h\u00e0nh to\u00e1n t\u1eed s\u1ed1 h\u1ecdc",
                            duration: 149,
                        },
                        resources: [],
                    },
                    {
                        id: 2099,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 9,
                        position: 17,
                        is_bookmarked: 0,
                        hash: "JM2JjOGYyZTctZGI2OC00MTQwLTk3MjUtMzY1NGEzZmUyNWE4c",
                        is_published: false,
                        step: {
                            id: 9,
                            title: "To\u00e1n t\u1eed g\u00e1n",
                            duration: 325,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 3309,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Challenge",
                        step_id: 105,
                        position: 18,
                        is_bookmarked: 0,
                        hash: "MNDM5MDhmNzMtNDA2MC00YWExLWJlZDgtM2M4NzNkZGQyZjk4M",
                        is_published: false,
                        step: {
                            id: 105,
                            title: "Th\u1ef1c h\u00e0nh v\u1edbi to\u00e1n t\u1eed g\u00e1n",
                            duration: 117,
                        },
                        resources: [],
                    },
                    {
                        id: 2823,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Lesson",
                        step_id: 686,
                        position: 19,
                        is_bookmarked: 0,
                        hash: "QYTQ5M2IyYmQtNGY4ZS00MDczLWJkNGQtNmQ5MTZhNjVjMTAzQ",
                        is_published: false,
                        step: {
                            id: 686,
                            title: "To\u00e1n t\u1eed ++ v\u00e0 --",
                            duration: 120,
                        },
                        resources: [],
                    },
                    {
                        id: 2824,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Challenge",
                        step_id: 39,
                        position: 20,
                        is_bookmarked: 0,
                        hash: "gYzgwNWQzM2ItYmIyNS00M2U4LWFkZTctYTM1NjhiZDIyYjU5I",
                        is_published: false,
                        step: {
                            id: 39,
                            title: "V\u00ed d\u1ee5 to\u00e1n t\u1eed ++",
                            duration: 70,
                        },
                        resources: [],
                    },
                    {
                        id: 2257,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 169,
                        position: 21,
                        is_bookmarked: 0,
                        hash: "YN2YzZjU0NGQtZGFkNi00MTAyLWJiNjgtYTQ0NzE2MmI0YWUzQ",
                        is_published: false,
                        step: {
                            id: 169,
                            title: "Nguy\u00ean l\u00fd ho\u1ea1t \u0111\u1ed9ng c\u1ee7a ++ / --",
                            duration: 705,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 3307,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Quiz",
                        step_id: 25,
                        position: 22,
                        is_bookmarked: 0,
                        hash: "QNzQ3YWFjMzgtZjMzNy00MjVjLTkwNDEtOTM2OWVkYjFlM2Fig",
                        is_published: false,
                        step: {
                            id: 25,
                            title: "\u00d4n t\u1eadp to\u00e1n t\u1eed ++ v\u00e0 --",
                            duration: 37,
                        },
                        resources: [],
                    },
                    {
                        id: 2100,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 10,
                        position: 23,
                        is_bookmarked: 0,
                        hash: "UM2UyOWE4YWItZWJhZi00NjMwLTljOGItNWVkYzRjYzZjMzhhI",
                        is_published: false,
                        step: {
                            id: 10,
                            title: "To\u00e1n t\u1eed n\u1ed1i chu\u1ed7i",
                            duration: 249,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 3306,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Quiz",
                        step_id: 24,
                        position: 24,
                        is_bookmarked: 0,
                        hash: "QYTQ0MzE2NWItYjQxNS00ODVjLThmYzQtMTg2YTNiNjMyMGRhI",
                        is_published: false,
                        step: {
                            id: 24,
                            title: "\u00d4n t\u1eadp to\u00e1n t\u1eed n\u1ed1i chu\u1ed7i",
                            duration: 21,
                        },
                        resources: [],
                    },
                    {
                        id: 2831,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Challenge",
                        step_id: 40,
                        position: 25,
                        is_bookmarked: 0,
                        hash: "IYjI3MzljODEtNTQ0OS00NzQxLWI1OWQtOWQ1NTk5MmQyOTRkE",
                        is_published: false,
                        step: {
                            id: 40,
                            title: "Th\u1ef1c h\u00e0nh n\u1ed1i chu\u1ed7i",
                            duration: 113,
                        },
                        resources: [],
                    },
                    {
                        id: 2101,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 11,
                        position: 26,
                        is_bookmarked: 0,
                        hash: "cZDcwNzlmMzQtMTVkZi00ZjEyLTlmZmYtMTBhOWY3YWVjMDA5Q",
                        is_published: false,
                        step: {
                            id: 11,
                            title: "To\u00e1n t\u1eed so s\u00e1nh",
                            duration: 266,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 3305,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Quiz",
                        step_id: 23,
                        position: 27,
                        is_bookmarked: 0,
                        hash: "ZMGZmMTRlNzYtNTQ1NS00M2IyLWIxYmUtMTMyZmY5ZGVkMmU4Y",
                        is_published: false,
                        step: {
                            id: 23,
                            title: "\u00d4n t\u1eadp to\u00e1n t\u1eed so s\u00e1nh",
                            duration: 48,
                        },
                        resources: [],
                    },
                    {
                        id: 2102,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 12,
                        position: 28,
                        is_bookmarked: 0,
                        hash: "AZTA0ZmYxOGYtODlhNy00YWVmLThiNGYtNzkyY2E4OTNjMjYxY",
                        is_published: false,
                        step: {
                            id: 12,
                            title: "Ki\u1ec3u d\u1eef li\u1ec7u Boolean",
                            duration: 219,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 2832,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Challenge",
                        step_id: 41,
                        position: 29,
                        is_bookmarked: 0,
                        hash: "YYmYzMGI5MzEtMGQ3Ni00NGVlLWFlMTUtNDJhOWE2MWE2MDRjE",
                        is_published: false,
                        step: {
                            id: 41,
                            title: "Th\u1ef1c h\u00e0nh d\u00f9ng boolean",
                            duration: 199,
                        },
                        resources: [],
                    },
                    {
                        id: 2103,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 13,
                        position: 30,
                        is_bookmarked: 0,
                        hash: "MNzM4ZDgyMTgtYzQ5Ny00M2YwLTgzNzEtNzQ1YmQ4NjUyMTVig",
                        is_published: false,
                        step: {
                            id: 13,
                            title: "C\u00e2u l\u1ec7nh \u0111i\u1ec1u ki\u1ec7n If",
                            duration: 389,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 3304,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Quiz",
                        step_id: 22,
                        position: 31,
                        is_bookmarked: 0,
                        hash: "ZMWZmZGQyNTktOTY0Yi00YTk0LTk1NWItMDE4MDNjZDcwZjM2k",
                        is_published: false,
                        step: {
                            id: 22,
                            title: "S\u1ed1 ch\u1eb5n hay s\u1ed1 l\u1ebb",
                            duration: 44,
                        },
                        resources: [],
                    },
                    {
                        id: 2104,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 14,
                        position: 32,
                        is_bookmarked: 0,
                        hash: "kMTk5MzhmNTUtZGZlZi00ZGU1LWI3MzUtZjE4ZmM4M2QxNzEwU",
                        is_published: false,
                        step: {
                            id: 14,
                            title: "To\u00e1n t\u1eed logical",
                            duration: 336,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 3303,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Quiz",
                        step_id: 21,
                        position: 33,
                        is_bookmarked: 0,
                        hash: "dZjdkNTdmM2UtYzhiNy00MmQwLWJlOTYtYjMwZWQzZDkwODBkU",
                        is_published: false,
                        step: {
                            id: 21,
                            title: "\u00d4n t\u1eadp to\u00e1n t\u1eed logical",
                            duration: 42,
                        },
                        resources: [],
                    },
                    {
                        id: 2105,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 15,
                        position: 34,
                        is_bookmarked: 0,
                        hash: "IZjIxYWE0M2ItNmMwMS00ZDUwLTg0ZmMtMjIxMjMyNDJjYTQyI",
                        is_published: false,
                        step: {
                            id: 15,
                            title: "Ki\u1ec3u d\u1eef li\u1ec7u",
                            duration: 1260,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 3301,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Quiz",
                        step_id: 20,
                        position: 35,
                        is_bookmarked: 0,
                        hash: "NNGNjODQ2ZGItMzc2ZC00YjU3LTkyZDUtM2JkZGJlODRlNmI5I",
                        is_published: false,
                        step: {
                            id: 20,
                            title: "B\u1ea1n c\u00f2n nh\u1edb typeof kh\u00f4ng?",
                            duration: 48,
                        },
                        resources: [],
                    },
                    {
                        id: 2106,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 16,
                        position: 36,
                        is_bookmarked: 0,
                        hash: "YZTYwMjcyMDgtNTJkMC00NWEyLTg3MzYtODAwNjExYmYxYjJkg",
                        is_published: false,
                        step: {
                            id: 16,
                            title: "To\u00e1n t\u1eed so s\u00e1nh II",
                            duration: 247,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                    {
                        id: 2635,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Lesson",
                        step_id: 608,
                        position: 37,
                        is_bookmarked: 0,
                        hash: "IMzI1OTUyOTgtYWEyZS00ZjhhLWE0YWUtYTgwZGMzNWEwOTI4g",
                        is_published: false,
                        step: {
                            id: 608,
                            title: "Truthy v\u00e0 Falsy l\u00e0 g\u00ec?",
                            duration: 180,
                        },
                        resources: [],
                    },
                    {
                        id: 3300,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Quiz",
                        step_id: 19,
                        position: 38,
                        is_bookmarked: 0,
                        hash: "ZYzZhNTQxNTEtY2I4OS00NGQzLTg5ZWMtZjJkMDhmNDE0NDNjE",
                        is_published: false,
                        step: {
                            id: 19,
                            title: "\u00d4n l\u1ea1i ki\u1ebfn th\u1ee9c v\u1ec1 Truthy v\u00e0 Falsy",
                            duration: 43,
                        },
                        resources: [],
                    },
                    {
                        id: 2107,
                        track_id: 101,
                        step_type: "App\\Common\\Models\\Video",
                        step_id: 17,
                        position: 39,
                        is_bookmarked: 0,
                        hash: "NMzNiMjZjNTktMTNiZC00NDc0LTkyZWQtZjFmNjcyZWIyMDBjk",
                        is_published: false,
                        step: {
                            id: 17,
                            title: "To\u00e1n t\u1eed logical v\u00e0 c\u00e2u l\u1ec7nh \u0111i\u1ec1u ki\u1ec7n If",
                            duration: 793,
                            image_url: "",
                            video_url: null,
                        },
                        resources: [],
                    },
                ],
                duration: 6678,
            },
        ],
        user_progress: [
            2091, 2092, 6451, 2093, 2845, 2817, 2589, 2094, 2818, 2095, 2819,
            2096, 2821, 2097, 2098, 2822, 2099, 3309, 2823, 2824, 2257, 3307,
            2100, 3306, 2831, 2101, 3305, 2102, 2832, 2103, 3304, 2104, 3303,
            2105, 3301, 2106, 2635, 3300, 2107, 2113, 3298, 2836, 2837, 2114,
            3297, 3296, 2115, 2834, 2835, 2838, 2839, 2116, 2117, 3295, 2108,
            3292, 2109, 3291, 2841, 2844, 2701, 2110, 2842, 2843, 2846, 2111,
            2847, 2848, 2112, 3047, 3048, 3049, 2118, 3214, 2131, 3215, 2146,
            3216, 2119, 3217, 2261, 3218, 2120, 3219, 2121, 3220, 3221, 2149,
            3222, 2122, 2123, 3223, 2124, 3289, 2125, 3286, 2126, 3224, 2127,
            2128, 2129, 2130, 2132, 2133, 2329, 2147, 3283, 2240, 2241, 3282,
            2242, 3281, 2704, 3280, 2259, 3279, 2262, 3278, 2263, 3277, 2264,
            2265, 2266, 3275, 2267, 3274, 2268, 3273, 2269, 2270, 2271, 2272,
            3272, 2273, 2274, 2275, 2276, 3271, 2277, 3270, 2278, 3269, 3268,
            2279, 3267, 2280, 3266, 2281, 3265, 3264, 3263, 3262, 2282, 3261,
            3260, 2283, 2284, 2345, 2346, 3259, 3258, 3257, 3256, 2347, 3255,
            2348, 2349, 3254, 3253, 2350, 3252, 2351, 2352, 2353, 2354, 2356,
            2357, 2332, 2333, 2334, 2335, 3251, 2336, 3250, 2337, 2338, 2340,
            2339, 3249, 2341, 2342, 2440, 2592, 2599, 2784, 2285, 2286, 2289,
            2290, 2291, 2305, 2310, 2260, 2827, 3147,
        ],
        is_registered: true,
        track_steps_count: 205,
    },
};

function CourseLessonPage() {
    const [openSideBar, setOpenSideBar] = useState(false);
    const [openCommentSideBar, setOpenCommentSideBar] = useState(false);
    const [trackStepActive, setTrackStepActive] = useState(null);

    const toggleSideBar = () => {
        setOpenSideBar(!openSideBar);
    };

    const formatDuration = (seconds) => {
        if (typeof seconds !== "number" || seconds < 0) return "00:00";

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    const handleCancelCommentSideBar = () => {
        setOpenCommentSideBar(false);
    };

    const handleTrackStepActive = (e, id) => {
        e.stopPropagation();
        setTrackStepActive(id);
    };

    return (
        <>
            <section
                className={`${styles.indexModule_grid} ${styles.indexModule_fullWidth}`}
            >
                <Header />
                {openSideBar && (
                    <div className={styles.sidebar}>
                        <div id="learn-playlist" className={styles.container}>
                            <header className={styles.header}>
                                <h1 className={styles.heading}>
                                    Nội dung khóa học
                                </h1>
                                <button className={styles.closeBtn}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </header>
                            <div className={styles.body}>
                                {mockDataTrack.data.tracks.map((track) => {
                                    return (
                                        <>
                                            <div
                                                className={
                                                    styles.sectionWrapper
                                                }
                                            >
                                                <h3
                                                    className={
                                                        styles.sectionTitle
                                                    }
                                                >
                                                    {`${track.position}. ${track.title}`}
                                                </h3>
                                                <span
                                                    className={
                                                        styles.sectionDesc
                                                    }
                                                >
                                                    {`${
                                                        track.track_steps_count
                                                    }/${
                                                        track.track_steps.length
                                                    } | ${formatDuration(
                                                        track.duration
                                                    )}`}
                                                </span>
                                                <span
                                                    className={
                                                        styles.sectionIcon
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faChevronUp}
                                                    />
                                                </span>
                                            </div>

                                            <div
                                                className={`${styles.trackStepsList} ${styles.open}`}
                                            >
                                                {track.track_steps.map(
                                                    (step) => {
                                                        const stepType =
                                                            step.step_type
                                                                .split("\\")
                                                                .at(-1);

                                                        const iconType =
                                                            stepType === "Video"
                                                                ? faCirclePlay
                                                                : stepType ===
                                                                  "Lesson"
                                                                ? faFileLines
                                                                : stepType ===
                                                                  "Challenge"
                                                                ? faPen
                                                                : faCircleQuestion;

                                                        return (
                                                            <>
                                                                <div
                                                                    className={`${
                                                                        styles.learnItem
                                                                    } ${
                                                                        trackStepActive ===
                                                                            step.id &&
                                                                        styles.active
                                                                    } learn-item-1`}
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleTrackStepActive(
                                                                            e,
                                                                            step.id
                                                                        )
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            styles.info
                                                                        }
                                                                    >
                                                                        <h3
                                                                            className={
                                                                                styles.title
                                                                            }
                                                                        >
                                                                            {`${step.position}. ${step.step.title}`}
                                                                        </h3>
                                                                        <p
                                                                            className={
                                                                                styles.desc
                                                                            }
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={
                                                                                    (stepType ===
                                                                                        "Video" &&
                                                                                        trackStepActive ===
                                                                                            step.id &&
                                                                                        faCompactDisc) ||
                                                                                    iconType
                                                                                }
                                                                                className={
                                                                                    stepType ===
                                                                                        "Video" &&
                                                                                    trackStepActive ===
                                                                                        step.id &&
                                                                                    styles.active
                                                                                }
                                                                            />
                                                                            <span>
                                                                                {`${formatDuration(
                                                                                    step
                                                                                        .step
                                                                                        .duration
                                                                                )}`}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            styles.iconBox
                                                                        }
                                                                    >
                                                                        {/* falock */}
                                                                        <FontAwesomeIcon
                                                                            className={`${styles.stateIcon}`}
                                                                            icon={
                                                                                faCircleCheck
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div
                    className={`${styles.wrapper} ${
                        !openSideBar && styles.fulWidth
                    }`}
                >
                    <div
                        className={`${styles.wrapperInner}  noselect ${styles.fulWidth}`}
                    >
                        <div data-tour="learning-center">
                            <div className={styles.videoWrapper}>
                                <div
                                    className={styles.player}
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <div
                                        className={styles.reactPlayer__preview}
                                        tabIndex={0}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center center",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundImage:
                                                'url("https://i.ytimg.com/vi/jhvEPY8cEu0/maxresdefault.jpg")',
                                        }}
                                    >
                                        <div
                                            className={
                                                styles.reactPlayer__shadow
                                            }
                                            style={{
                                                background:
                                                    "radial-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%)",
                                                borderRadius: "64px",
                                                width: "64px",
                                                height: "64px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <div
                                                className={
                                                    styles.reactPlayer__playIcon
                                                }
                                                style={{
                                                    borderStyle: "solid",
                                                    borderWidth:
                                                        "16px 0px 16px 26px",
                                                    borderColor:
                                                        "transparent transparent transparent white",
                                                    marginLeft: "7px",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`${styles.content} ${
                            !openSideBar && styles.fulWidth
                        }`}
                    >
                        <div className={styles.contentTop}>
                            <header className={styles.header}>
                                <h1 className={styles.heading}>
                                    Phân tích cách triển khai logic
                                </h1>
                                <p className={styles.updated}>
                                    Cập nhật tháng 2 năm 2022
                                </p>
                            </header>

                            <button
                                className={styles.addNote}
                                data-tour="notes-tutorial"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                <span className={styles.label}>
                                    Thêm ghi chú tại{" "}
                                    <span className={styles.num}>00:00</span>
                                </span>
                            </button>
                        </div>

                        <div
                            className={styles.lessonBody}
                            style={{
                                "--font-size": "1.6rem",
                                "--line-height": "1.8",
                            }}
                        >
                            <p>
                                Tham gia nhóm{" "}
                                <a
                                    rel="noopener noreferrer nofollow"
                                    target="_blank"
                                    href="https://www.facebook.com/groups/f8official/"
                                >
                                    Học lập trình tại F8
                                </a>{" "}
                                trên Facebook để cùng nhau trao đổi trong quá
                                trình học tập ❤️
                            </p>
                            <p>
                                Các bạn subscribe kênh Youtube{" "}
                                <a
                                    rel="noopener noreferrer nofollow"
                                    target="_blank"
                                    href="https://url.mycv.vn/f8_youtube?ref=lesson_desc"
                                >
                                    F8 Official
                                </a>{" "}
                                để nhận thông báo khi có các bài học mới nhé ❤️
                            </p>
                        </div>
                    </div>

                    <p className={styles.footer}>
                        Made with{" "}
                        <FontAwesomeIcon
                            icon={faHeart}
                            className={styles.heart}
                        />
                        <span className={styles.dot}>·</span> Powered by F8
                    </p>
                </div>

                <div
                    data-tour="comments-tutorial"
                    className={`${styles.commentBtn} ${
                        openSideBar && styles.showTracks
                    }`}
                    onClick={() => setOpenCommentSideBar(!openCommentSideBar)}
                >
                    <button className={styles.commentWrapper}>
                        <FontAwesomeIcon icon={faComments} />
                        <span className={styles.title}>Hỏi đáp</span>
                    </button>
                </div>
                <Footer
                    openSideBar={openSideBar}
                    toggleSideBar={toggleSideBar}
                />
            </section>

            {
                <CommentSidebar
                    open={openCommentSideBar}
                    onCancel={handleCancelCommentSideBar}
                />
            }
        </>
    );
}

export default CourseLessonPage;
