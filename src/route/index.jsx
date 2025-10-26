import config from "@/config";
import AdminLayout from "@/layouts/AdminLayout";
import AdminLogin from "@/layouts/AdminLayout/pages/Login";
import {
    Dashboard,
    UsersManagement,
    CoursesManagement,
    PostsManagement,
    CommentsManagement,
    TopicsManagement,
    InstructorsManagement,
    SystemSettings,
    AdvancedStatistics,
} from "@/layouts/AdminLayout/pages";
import AuthenticationApp from "@/layouts/DefaultLayout/components/AuthenticationApp";
import ForgotPassWord from "@/layouts/DefaultLayout/components/AuthenticationApp/page/ForgotPassWord";
import Login from "@/layouts/DefaultLayout/components/AuthenticationApp/page/Login";
import Register from "@/layouts/DefaultLayout/components/AuthenticationApp/page/Register";
// import NoFooterLayout from "@/layouts/NoFooterLayout";
// import NoHeaderLayout from "@/layouts/NoHeaderLayout";
import AboutUs from "@/pages/AboutUs";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import BlogTag from "@/pages/BlogTag";
import ContactUs from "@/pages/ContactUs";
import Home from "@/pages/Home";
import Learning from "@/pages/Learning";
import LearningItem from "@/pages/LearningItem";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import ProductDetail from "@/pages/ProductDetail";
import Products from "@/pages/Products";
import SettingApp from "@/pages/SettingApp";
import Setting from "@/pages/SettingApp/components/Setting";
import Terms from "@/pages/Terms";
import Profile from "@/pages/Profile";
import WritePost from "@/pages/WritePost";
import MyPost from "@/pages/MyPost";
import MyBookmark from "@/pages/MyBookmark";
import CourseDetail from "@/pages/CourseDetail";
import CourseLessonPage from "@/pages/CourseLessonPage";
import VerifyEmail from "@/pages/VerifyEmail";
import ResendEmail from "@/pages/ResendEmail";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancel from "@/pages/Payment/Cancel";
import SearchResults from "@/pages/SearchResults";

const routes = [
    {
        path: config.routes.paymentSuccess,
        component: PaymentSuccess,
        layout: null,
    },
    {
        path: config.routes.paymentCancel,
        component: PaymentCancel,
        layout: null,
    },
    {
        path: config.routes.home,
        component: Home,
    },
    {
        path: config.routes.products,
        component: Products,
        layout: AdminLayout,
    },

    {
        path: config.routes.productDetail,
        component: ProductDetail,
        layout: null,
    },

    {
        path: config.routes.notFound,
        component: NotFound,
    },

    {
        path: config.routes.blog,
        component: Blog,
    },

    {
        path: config.routes.blogDetail,
        component: BlogDetail,
    },

    {
        path: config.routes.blogTag,
        component: BlogTag,
    },

    {
        path: config.routes.learning,
        component: Learning,
    },
    {
        path: config.routes.authenticationApp,
        component: AuthenticationApp,
        layout: null,
    },
    {
        path: config.routes.register,
        component: Register,
        layout: null,
    },
    {
        path: config.routes.login,
        component: Login,
        layout: null,
    },
    {
        path: config.routes.forgotPassWord,
        component: ForgotPassWord,
        layout: null,
    },
    {
        path: config.routes.settingApp,
        component: SettingApp,
        layout: null,
    },
    {
        path: config.routes.setting,
        component: Setting,
        layout: null,
    },
    {
        path: config.routes.learningItem,
        component: LearningItem,
    },
    {
        path: config.routes.aboutUs,
        component: AboutUs,
    },
    {
        path: config.routes.contactUs,
        component: ContactUs,
    },

    {
        path: config.routes.terms,
        component: Terms,
    },
    {
        path: config.routes.privacy,
        component: Privacy,
    },

    {
        path: config.routes.profile,
        component: Profile,
    },
    {
        path: config.routes.writePost,
        component: WritePost,
    },
    {
        path: config.routes.postEdit,
        component: WritePost,
    },
    {
        path: config.routes.myPost,
        component: MyPost,
    },
    {
        path: config.routes.myPostPublished,
        component: MyPost,
    },
    {
        path: config.routes.myBookmark,
        component: MyBookmark,
    },

    {
        path: config.routes.courseDetail,
        component: CourseDetail,
    },

    {
        path: config.routes.courseLessonPage,
        component: CourseLessonPage,
        layout: null,
    },

    {
        path: config.routes.verifyEmail,
        component: VerifyEmail,
        layout: null,
    },
    {
        path: config.routes.resendEmail,
        component: ResendEmail,
        layout: null,
    },
    {
        path: config.routes.searchResults,
        component: SearchResults,
    },

    // admin routes
    {
        path: config.routes.adminLogin,
        component: AdminLogin,
        layout: null,
    },
    {
        path: config.routes.admin,
        component: Dashboard,
        layout: AdminLayout,
        auth: true,
    },
    {
        path: config.routes.adminUsers,
        component: UsersManagement,
        layout: AdminLayout,
        auth: true,
    },
    {
        path: config.routes.adminCourses,
        component: CoursesManagement,
        layout: AdminLayout,
        auth: true,
    },
    {
        path: config.routes.adminPosts,
        component: PostsManagement,
        layout: AdminLayout,
        auth: true,
    },
    {
        path: config.routes.adminComments,
        component: CommentsManagement,
        layout: AdminLayout,
        auth: true,
    },
    {
        path: config.routes.adminTopics,
        component: TopicsManagement,
        layout: AdminLayout,
        auth: true,
    },
    {
        path: config.routes.adminInstructors,
        component: InstructorsManagement,
        layout: AdminLayout,
        auth: true,
    },
    {
        path: config.routes.adminSettings,
        component: SystemSettings,
        layout: AdminLayout,
        auth: true,
    },
    {
        path: config.routes.adminStatistics,
        component: AdvancedStatistics,
        layout: AdminLayout,
        auth: true,
    },
];

export default routes;
