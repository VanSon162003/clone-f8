import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SlideBar from "./components/SlideBar";
import useLoading from "@/hook/useLoading";
import Loading from "@/components/Loading";

function DefaultLayout() {
    const { isLoading } = useLoading();
    console.log(isLoading);

    return (
        <>
            {isLoading && <Loading />}
            <Header />
            <main>
                <div
                    style={{
                        display: "flex",
                        minHeight: "100vh",
                    }}
                >
                    <SlideBar />

                    <div
                        style={{
                            width: "100%",
                            margin: " 0 auto",
                            padding: "0 32px 0 10px",
                        }}
                    >
                        <div className="container-fluid">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default DefaultLayout;
