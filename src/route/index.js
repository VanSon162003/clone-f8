import config from "@/config";
import AdminLayout from "@/layouts/AminLayout";
import NoFooterLayout from "@/layouts/NoFooterLayout";
import NoHeaderLayout from "@/layouts/NoHeaderLayout";
import Blog from "@/pages/Blog";
import Home from "@/pages/Home";
import Learning from "@/pages/Learning";
import NotFound from "@/pages/NotFound";
import ProductDetail from "@/pages/ProductDetail";
import Products from "@/pages/Products";

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
        layout: NoHeaderLayout,
    },

    {
        path: config.routes.learning,
        component: Learning,
        layout: NoFooterLayout,
    },
];

export default routes;
