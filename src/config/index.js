const config = {
    routes: {
        home: "/",
        products: "/products",
        productDetail: "/products/:id",
        blog: "/blog",
        learning: "/learning-paths",
        learningItem: "/learning-paths/:nameCourse",
        notFound: "*",
        authenticationApp: "/authenticationApp",
        register: "/register",
        login: "/login",
        forgotPassWord: "/forgotPassWord",
        settingApp: "/setting/p/:username",
        setting: "/setting",
        aboutUs: "/about-us",
        contactUs: "/contact-us",
        terms: "/terms",
        privacy: "/privacy",
    },
};

export default config;
