import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SlideBar from "./components/SlideBar";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

function DefaultLayout() {
    const loading = useSelector((state) => state.auth.loading);

    return (
        <>
            <ToastContainer />
            {loading && <Loading />}
            <Header />
            <main>
                <div
                    style={{
                        display: "flex",
                        minHeight: "100vh",
                    }}
                >
                    <SlideBar />
                    <Outlet />
                </div>
            </main>

            <Footer />
        </>
    );
}

export default DefaultLayout;
