const config = {
    routes: {
        home: "/",
        products: "/products",
        productDetail: "/products/:id",
        blog: "/blog",
        blogDetail: "/blog/:slug",
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
        profile: "/profile/:username",
        writePost: "/new-post",
        postEdit: "/post/edit",
        myPost: "/me/posts",
        myPostPublished: "/me/posts/published",
    },
};

export default config;
