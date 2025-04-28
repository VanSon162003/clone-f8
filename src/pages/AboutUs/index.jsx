import React from "react";
import styles from "./AboutUs.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

function AboutUs() {
    return (
        <div className={styles.slideBarContent}>
            <section
                className={`${styles.moduleFullWidth} ${styles.moduleGrid} ${styles.root}`}
            >
                <div className={`${styles.textContent} ${styles.wrapper}`}>
                    <section
                        className={`${styles.moduleGrid} ${styles.moduleWide}`}
                    >
                        <h1 className={styles.heading}>Giới Thiệu Về F8</h1>

                        <section className={styles.moduleRow}>
                            <section
                                className={`${styles.moduleCol} ${styles.moduleCol6}`}
                            >
                                <img
                                    className={styles.firstImg}
                                    src="https://fullstack.edu.vn/assets/f8-og-image-qzPzCV0R.png"
                                    alt="Giới thiệu về F8"
                                />
                            </section>

                            <section
                                className={`${styles.moduleCol} ${styles.moduleCol6}`}
                            >
                                <div className={styles.introText}>
                                    <h2 className={styles.heading}>
                                        BẠN CÓ BIẾT?
                                    </h2>
                                    <p>
                                        Ngoài kia có rất nhiều bạn làm sai nghề,
                                        tư duy an phận và bị chôn chân với một
                                        công việc không đủ vui, không đủ sống,
                                        các bạn ấy gặp hết khủng hoảng tuổi này
                                        tới tuổi kia.
                                    </p>
                                    <p>
                                        Tuổi 22 đang ngỡ ngàng không biết mình
                                        nên làm nghề gì. Tuổi 28 thì bàng hoàng
                                        không biết lương như mình thì lập gia
                                        đình và nuôi dạy con cái làm sao...
                                    </p>
                                </div>
                            </section>

                            <section
                                className={`${styles.moduleCol} ${styles.moduleCol12}`}
                            >
                                <div className={styles.introTextSecond}>
                                    <p>
                                        Mọi chuyện sẽ rất khác nếu họ được định
                                        hướng công việc phù hợp, biết cách đặt
                                        cho mình một mục tiêu rõ ràng và có đầy
                                        đủ kỹ năng cần thiết để phát triển sự
                                        nghiệp.
                                    </p>
                                    <p>
                                        F8 tin rằng con người Việt Nam không hề
                                        thua kém ai. Con rồng cháu tiên hoàn
                                        toàn có thể trở thành công dân toàn cầu.
                                    </p>
                                    <p>
                                        F8 mong muốn trở thành một tổ chức góp
                                        phần tạo nên sự thay đổi đó. Việc tạo ra
                                        cộng đồng học lập trình mới chỉ là điểm
                                        bắt đầu...
                                    </p>
                                </div>
                            </section>
                        </section>
                    </section>
                </div>

                <section
                    className={`${styles.moduleGrid} ${styles.moduleWide}`}
                >
                    <section className={styles.moduleRow}>
                        <section
                            className={`${styles.moduleCol} ${styles.moduleCol12}`}
                        >
                            <div
                                className={`${styles.textContent} ${styles.goal}`}
                            >
                                <h2 className={styles.heading}>Tầm nhìn</h2>
                                <p>
                                    Trở thành công ty công nghệ giáo dục có vị
                                    thế vững vàng trên thị trường, với các sản
                                    phẩm hỗ trợ học lập trình chất lượng, thông
                                    minh và hiệu quả. F8 sẽ nổi tiếng bởi chất
                                    lượng sản phẩm vượt trội và được cộng đồng
                                    tin tưởng chứ không phải vì tiếp thị tốt.
                                </p>
                                <h2 className={styles.heading}>
                                    GIÁ TRỊ CỐT LÕI
                                </h2>
                                <p>
                                    <strong>Sự tử tế: </strong>
                                    Tử tế trong chính người F8 với nhau và tử tế
                                    với học viên là kim chỉ nam phấn đấu. Đã làm
                                    sản phẩm là phải chất lượng và chứng minh
                                    được hiệu quả, bất kể là sản phẩm miễn phí
                                    hay giá rẻ. Làm ra phải thấy muốn để người
                                    thân mình dùng.
                                </p>
                                <p>
                                    <strong>Tư duy số: </strong>
                                    Sản phẩm làm ra không phải là để vừa lòng
                                    đội ngũ trong công ty. Sản phẩm làm ra với
                                    mục tiêu cao nhất là người học thấy dễ học,
                                    được truyền cảm hứng tự học, học tới bài học
                                    cuối cùng và người học có thể tự tay làm ra
                                    những dự án bằng kiến thức đã học.
                                </p>
                                <p>
                                    <strong>
                                        Luôn đổi mới và không ngừng học:{" "}
                                    </strong>
                                    Học từ chính đối thủ, học từ những công ty
                                    công nghệ giáo dục tốt trên thế giới và luôn
                                    luôn lắng nghe mọi góp ý từ phía học viên.
                                </p>
                                <p>
                                    <strong>Tư duy bền vững: </strong>
                                    Có hai thứ đáng để đầu tư giúp mang lại
                                    thành quả tài chính tốt nhất trong dài hạn
                                    của một công ty đó là nhân viên và khách
                                    hàng.
                                </p>
                            </div>
                        </section>
                    </section>
                </section>

                <div className={styles.whatToSale}>
                    <section
                        className={`${styles.moduleGrid} ${styles.moduleWide}`}
                    >
                        <section className={styles.moduleRow}>
                            <section
                                className={`${styles.moduleCol} ${styles.moduleCol12}`}
                            >
                                <div className={styles.content}>
                                    <h3 className={styles.heading}>
                                        Bạn nhận được gì từ F8?
                                    </h3>

                                    <div
                                        className={`${styles.gird} ${styles.textContent}`}
                                    >
                                        <div className={styles.gridItem}>
                                            <h4 className={styles.heading}>
                                                1. Sự thành thạo
                                            </h4>
                                            Các bài học đi đôi với thực hành,
                                            làm bài kiểm tra ngay trên trang web
                                            và bạn luôn có sản phẩm thực tế sau
                                            mỗi khóa học.
                                        </div>

                                        <div className={styles.gridItem}>
                                            <h4 className={styles.heading}>
                                                2. Tính tự học
                                            </h4>
                                            Một con người chỉ thực sự trưởng
                                            thành trong sự nghiệp nếu họ biết
                                            cách tự thu nạp kiến thức mới cho
                                            chính mình.
                                        </div>

                                        <div className={styles.gridItem}>
                                            <h4 className={styles.heading}>
                                                3. Tiết kiệm thời gian
                                            </h4>
                                            Thay vì chật vật vài năm thì chỉ cần
                                            4-6 tháng để có thể bắt đầu công
                                            việc đầu tiên với vị trí Intern tại
                                            công ty IT.
                                        </div>

                                        <div className={styles.gridItem}>
                                            <h4 className={styles.heading}>
                                                4. Làm điều quan trọng
                                            </h4>
                                            Chỉ học và làm những điều quan trọng
                                            để đạt được mục tiêu đi làm được
                                            trong thời gian ngắn nhất.
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </section>
                </div>

                <section
                    className={`${styles.moduleGrid} ${styles.moduleWide}`}
                >
                    <section className={styles.moduleRow}>
                        <section
                            className={`${styles.moduleCol} ${styles.moduleCol12}`}
                        >
                            <div
                                className={`${styles.textContent} ${styles.strategy}`}
                            >
                                <h3 className={styles.heading}>
                                    Chiến lược phát triển
                                </h3>
                                <h4 className={styles.heading}>
                                    1. Coi trọng đào tạo và phát triển nhân tài
                                </h4>
                                <p>
                                    F8 tin rằng sản phẩm tuyệt vời chỉ có thể
                                    tạo ra bởi những con người tài năng. Công ty
                                    muốn tăng trưởng nhanh bền vững phải có
                                    những nhân sự xuất sắc có tâm, có tài. Vì
                                    vậy, F8 không ngừng tìm kiếm và phát triển
                                    những cá nhân tài năng cùng xây dựng bộ máy.
                                    Nếu bạn muốn được làm cùng với những người
                                    giỏi giang khác? Bạn muốn được chủ động
                                    quyết định trong công việc của mình? Và bạn
                                    muốn được tương thưởng xứng đáng? Hãy về với
                                    F8 😍
                                </p>
                                <div className={styles.textHorizontalWithImg}>
                                    <div className={styles.textBlog}>
                                        <h4 className={styles.heading}>
                                            2. Sản phẩm làm ra là phải chất
                                            lượng, là phải bán được
                                        </h4>
                                        <p>
                                            F8 làm ra những sản phẩm phục vụ thị
                                            trường lớn, chất lượng và hiệu quả
                                            thực sự, đáp ứng nhu cầu cấp thiết
                                            của học viên. Mỗi khóa học, mỗi bài
                                            giảng của F8 không phải được làm ra
                                            bởi chỉ một người. Mà đó là tổng hoà
                                            chuyên môn của người dạy, sales,
                                            marketing, lập trình viên, đạo diễn
                                            hình ảnh và âm thanh… Khúc nào cũng
                                            phải cố benchmarking, tự tin đứng
                                            cạnh các sản phẩm của thế giới. Tức
                                            là làm một cách thông minh và xâu
                                            chuỗi nhiều loại hiểu biết khác
                                            nhau.
                                        </p>
                                    </div>

                                    <img
                                        src="https://fullstack.edu.vn/assets/about-1-CkDQZ5S8.png"
                                        alt=""
                                    />
                                </div>

                                <div
                                    className={`${styles.textHorizontalWithImg} ${styles.reverse}`}
                                >
                                    <div className={styles.textBlog}>
                                        <h4 className={styles.heading}>
                                            3. Tập trung vào khách hàng
                                        </h4>
                                        <p>
                                            Khi học lập trình phần đông học viên
                                            dễ bị mất định hướng, dễ nản khi gặp
                                            khó khăn mà không ai giúp đỡ, nhiều
                                            khi thấy làm giống hệt video rồi mà
                                            không chạy... Tại F8, chúng tôi thấu
                                            hiểu những khó khăn của các bạn,
                                            chúng tôi nỗ lực tạo ra giáo trình
                                            và hệ thống bài tập, hệ thống hỗ trợ
                                            các bạn tối đa trong quá trình học
                                            tập.
                                        </p>
                                    </div>

                                    <img
                                        src="https://fullstack.edu.vn/assets/about-2-DaVDGRBe.png"
                                        alt=""
                                    />
                                </div>

                                <p>
                                    F8 tin rằng trong mỗi chúng ta luôn tồn tại
                                    một "đứa trẻ", để đứa trẻ đó học tốt một
                                    kiến thức mới thì sản phẩm không thể chỉ
                                    thành công về mặt học thuật, mà phải tạo
                                    được thật nhiều cảm xúc. F8 thiết kế hành
                                    trình cảm xúc đó bằng hình ảnh, âm thanh,
                                    bằng các nội dung xu hướng, bằng cách ghi
                                    nhận sự nỗ lực của học viên và luôn tạo cảm
                                    hứng học tập.
                                </p>

                                <div
                                    className={`${styles.textHorizontalWithImg} `}
                                >
                                    <div className={styles.textBlog}>
                                        <h4 className={styles.heading}>
                                            4. Bán hàng và chăm sóc khách hàng
                                            bền vững
                                        </h4>
                                        <p>
                                            Việc bán hàng sẽ trở nên rất dễ dàng
                                            khi khách hàng sử dụng hiệu quả và
                                            truyền tai nhau về sản phẩm. Thành
                                            công về mặt doanh số không quan
                                            trọng bằng việc người học đánh giá
                                            cao sản phẩm sau đó tiếp tục sử
                                            dụng, thậm chí còn giới thiệu cho
                                            người thân và bạn bè. F8 là một
                                            trong những công ty giáo dục, có lẽ
                                            là duy nhất đầu tư rất nhiều ngân
                                            sách vào việc chăm sóc khách hàng,
                                            thay vì bỏ tiền đi đánh bóng tên
                                            tuổi. F8 sẽ tìm mọi cách để dần đạt
                                            được con số 99% khách hàng hài lòng.
                                        </p>
                                        <p>
                                            <em>
                                                1% còn lại là những con người
                                                của F8, chúng tôi không cho phép
                                                bản thân mình cảm thấy hài lòng
                                                hoàn toàn về sản phẩm. Đó chính
                                                là động lực để chúng tôi liên
                                                tục cải thiện, liên tục phát
                                                triển và tạo ra các sản phẩm hỗ
                                                trợ học tập chất lượng cho cộng
                                                đồng.
                                            </em>
                                        </p>
                                    </div>

                                    <img
                                        src="https://fullstack.edu.vn/assets/about-3-Dtr0EU9p.png"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </section>
                    </section>
                </section>

                <div className={`${styles.textContent} ${styles.enviroment}`}>
                    <section
                        className={`${styles.moduleGrid} ${styles.moduleWide}`}
                    >
                        <section className={styles.moduleRow}>
                            <section
                                className={`${styles.moduleCol} ${styles.moduleCol12}`}
                            >
                                <h3 className={styles.heading}>
                                    Môi trường làm việc
                                </h3>
                                <p>
                                    Môi trường làm việc lành mạnh. Không toxic,
                                    không gossip, trong công việc thử thách hết
                                    mình nhưng ngoài công việc không bè phái
                                    ganh đua hay tấn công gì nhau.
                                </p>
                                <p>
                                    Quan điểm làm việc của F8 là dân chủ, sếp có
                                    thể sai nhưng tổ chức phải đúng. Sai thì
                                    nhận và sửa. Nhân viên thoải mái nói lên
                                    chính kiến của mình. Trên dưới lắng nghe và
                                    cởi mở với góc nhìn của nhau, quyết tâm vì
                                    mục tiêu chung.
                                </p>
                                <p>
                                    Tỷ lệ nghỉ việc tại các bộ phận chuyên môn
                                    cao dưới 5%, nhưng đối với F8 đúng người
                                    đúng việc sẽ quan trọng hơn. Các bạn được
                                    thử thách với công việc mới khi đã làm tốt
                                    chuyên môn cũ và công ty luôn sẵn sàng đầu
                                    tư cho nhân viên đi học thêm các kỹ năng cần
                                    thiết cho công việc. Quan điểm của F8, nhân
                                    viên là người bạn đồng hành cùng sự phát
                                    triển của công ty, luôn sẵn sàng giúp nhân
                                    viên có cuộc sống cân bằng và phát triển
                                    chuyên môn tối đa.
                                </p>

                                <div className={styles.quote}>
                                    <FontAwesomeIcon
                                        className={styles.quoteLeft}
                                        icon={faQuoteLeft}
                                    />
                                    Quan điểm của F8 chúng mình là không phải
                                    bạn đi xin việc và công ty cũng không đi xin
                                    ứng viên tài năng. F8 tôn trọng thời gian và
                                    sự quan tâm của các bạn tới chúng mình. Nếu
                                    có điều gì không hài lòng về quy trình tuyển
                                    dụng của công ty, hãy góp ý nhẹ vào{" "}
                                    <a href="mailto:hr@fullstack.edu.vn">
                                        hr@fullstack.edu.vn
                                    </a>{" "}
                                    nhé. F8 cảm ơn bạn đã quan tâm và rất mong
                                    chờ gặp bạn tại F8 😍
                                    <FontAwesomeIcon
                                        className={styles.quoteRight}
                                        icon={faQuoteRight}
                                    />
                                </div>
                            </section>
                        </section>
                    </section>
                </div>
            </section>
        </div>
    );
}

export default AboutUs;
