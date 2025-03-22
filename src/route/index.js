import config from "@/config";
import Home from "@/pages/Home";
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
    },

    {
        path: config.routes.productDetail,
        component: ProductDetail,
    },

    {
        path: config.routes.notFound,
        component: NotFound,
    },
];

export default routes;
