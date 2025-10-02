import config from "@/config";
import AdminLayout from "@/layouts/AminLayout";
import AuthenticationApp from "@/layouts/DefaultLayout/components/AuthenticationApp";
import ForgotPassWord from "@/layouts/DefaultLayout/components/AuthenticationApp/page/ForgotPassWord";
import Login from "@/layouts/DefaultLayout/components/AuthenticationApp/page/Login";
import Register from "@/layouts/DefaultLayout/components/AuthenticationApp/page/Register";
import NoFooterLayout from "@/layouts/NoFooterLayout";
import NoHeaderLayout from "@/layouts/NoHeaderLayout";
import AboutUs from "@/pages/AboutUs";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
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

const routes = [
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
];

export default routes;
