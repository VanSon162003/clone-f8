import useApi from "@/hook/useApi";
import styles from "./Home.module.scss";
import Section from "@/components/Section";
import { Tab, Tabs } from "@/components/Tabs";
import { Accordion, AccordionItem } from "@/components/Accordion";
import Form, { TextInput } from "@/components/Form";
import schemaLogin from "@/schema/schemaLogin";
function Home() {
    const coursePro = useApi("/pro");
    const courseFree = useApi("/free");
    const courseArticle = useApi("/article");
    const courseVideo = useApi("/video");

    return (
        <div className={styles.wrapper}>
            <Tabs onChange={(index) => console.log(index)}>
                <Tab title={"button 1"}>content 1</Tab>
                <Tab title={"button 2"}>content 2</Tab>
                <Tab title={"button 3"}>content 3</Tab>
                <Tab title={"button 4"}>content 4</Tab>
            </Tabs>

            <Accordion
                defaultIndex={0}
                onChange={(index) => console.log(index)}
                collapseOthers={false}
            >
                <AccordionItem header="Accordion 1">
                    Nội dung của Accordion 1
                </AccordionItem>
                <AccordionItem header="Accordion 2">
                    Nội dung của Accordion 2
                </AccordionItem>
                <AccordionItem header="Accordion 3">
                    Nội dung của Accordion 3
                </AccordionItem>
            </Accordion>

            <Form onSubmit={(data) => console.log(data)} schema={schemaLogin}>
                <TextInput name="email" />
                <TextInput name="password" />
                <button>Submit hihi</button>
            </Form>
            <Section
                courseType="pro"
                courseList={coursePro}
                heading={"Khoá học Pro"}
            />

            <Section
                courseType="free"
                courseList={courseFree}
                heading={"Khoá học Free"}
                path={"/learning-paths"}
                titleViewAll="Xem lộ trình"
            />

            <Section
                courseType="article"
                courseList={courseArticle}
                heading={"Bài viết nổi bật"}
                path={"/blog"}
                titleViewAll="Xem tất cả"
            />

            <Section
                courseType="video"
                courseList={courseVideo}
                heading={"Videos nổi bật"}
                path={"https://www.youtube.com/c/F8VNOfficial/videos"}
                titleViewAll="Xem tất cả"
            />
        </div>
    );
}

export default Home;
