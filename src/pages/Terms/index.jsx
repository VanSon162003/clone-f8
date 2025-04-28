import Button from "@/components/Button";
import styles from "./Terms.module.scss";

import Banner from "@/components/Banner";
import { faLink } from "@fortawesome/free-solid-svg-icons";

function Terms() {
    return (
        <div className={styles.parent}>
            <div className="container-fluid">
                <div className={styles.container}>
                    <div className={styles.top}>
                        <h1 className={styles.heading}>Điều khoản sử dụng</h1>
                        <div className={`${styles.desc} ${styles.warp}`}>
                            <p>Điều khoản sử dụng</p>
                        </div>
                    </div>

                    <div className={styles.body}>
                        <section className={styles.row}>
                            <section className={`${styles.col} ${styles.col8}`}>
                                <div className={styles.wrapper}>
                                    <h2
                                        data-appended="true"
                                        className={styles.heading}
                                        id="quy-dinh-chung"
                                    >
                                        <Button
                                            data-link
                                            to="#quy-dinh-chung"
                                            target="_self"
                                            icon={faLink}
                                        ></Button>
                                        Quy định chung
                                    </h2>
                                    <p>
                                        Website (viết tắt: F8) do Công ty cổ
                                        phần công nghệ giáo dục F8 sở hữu và vận
                                        hành. Hoạt động trên website bao gồm:
                                        Ban quản trị website và Học viên có đăng
                                        ký sử dụng tài khoản đã được phê duyệt
                                        bởi ban quản trị website F8.
                                    </p>
                                    <p>
                                        Học viên đăng ký tài khoản, thanh toán
                                        và sử dụng dịch vụ trên trang web đồng
                                        nghĩa với việc đồng ý với các điều khoản
                                        hoạt động, chịu trách nhiệm pháp lý với
                                        hành vi của mình và cam kết thực hiện
                                        mọi quy định liên quan.
                                    </p>
                                    <p>
                                        Mọi sản phẩm hàng hóa/dịch vụ giao dịch
                                        trên website đáp ứng đầy đủ các điều
                                        kiện theo quy định của F8 và theo quy
                                        định có liên quan của pháp luật, không
                                        thuộc trường hợp các mặt hàng cấm giao
                                        dịch, hàng lậu, hàng giả.
                                    </p>
                                    <p>
                                        F8 cam kết xây dựng quy chế dựa trên các
                                        quy định về thương mại điện tử và tuân
                                        theo các quy định của pháp luật Việt
                                        Nam.
                                    </p>
                                    <hr />
                                    <h2
                                        data-appended="true"
                                        className={styles.heading}
                                        id="quyen-so-huu-tri-tue"
                                    >
                                        <Button
                                            data-link
                                            to="#quyen-so-huu-tri-tue"
                                            target="_self"
                                            icon={faLink}
                                        ></Button>
                                        Quyền sở hữu trí tuệ
                                    </h2>
                                    <p>
                                        Theo quy định của Pháp luật và nội quy
                                        của đơn vị chủ quản, bản quyền của khoá
                                        học thuộc về đơn vị sản xuất - đơn vị
                                        tạo ra khoá học. Tất cả các bài giảng,
                                        tài liệu, video clip, học liệu sử dụng
                                        trong các khóa học trực tuyến và trực
                                        tiếp của F8 đều thuộc quyền sở hữu hợp
                                        pháp của và Công ty cổ phần công nghệ
                                        giáo dục F8. Do đó, người tham gia khoá
                                        học phải tuân thủ các yêu cầu sau:
                                    </p>
                                    <p>
                                        Không được chia sẻ khóa học cho bất kỳ
                                        bên thứ 3 nào với bất kỳ mục đích gì khi
                                        chưa được sự cho phép bằng văn bản của
                                        F8 hoặc cơ quan có thẩm quyền.
                                    </p>
                                    <p>
                                        Không được ghi hình, download tài liệu
                                        (trừ các tài liệu cho phép download),
                                        lấy tài liệu của khóa học đi bán dưới
                                        bất kỳ hình thức nào (cá nhân hoặc doanh
                                        nghiệp).
                                    </p>
                                    <p>
                                        Không tự ý chỉnh sửa, cắt ghép, chia sẻ
                                        nội dung khóa học và hình ảnh giáo viên
                                        và các nội dung khác cho bất kỳ bên thứ
                                        3 nào (bao gồm cả mạng xã hội). Khi chưa
                                        được sự đồng ý bằng văn bản của F8 hoặc
                                        cơ quan có thẩm quyền.
                                    </p>
                                    <p>
                                        Mọi hình thức vi phạm bản quyền của các
                                        khoá học của F8 đều sẽ được can thiệp
                                        bởi pháp luật theo đúng quy định về
                                        quyền sở hữu trí tuệ.
                                    </p>
                                    <blockquote>
                                        <p>
                                            Người vi phạm sẽ chịu toàn bộ chi
                                            phí kiện tụng và bồi thường thiệt
                                            hại (quy đổi thành tiền mặt) liên
                                            quan đến hành vi phát tán trái phép
                                            tài nguyên khóa học Pro của F8.
                                        </p>
                                    </blockquote>
                                    <hr />
                                    <h2
                                        data-appended="true"
                                        className={styles.heading}
                                        id="quan-ly-va-su-dung-tai-khoan"
                                    >
                                        <Button
                                            data-link
                                            to="#quan-ly-va-su-dung-tai-khoan"
                                            target="_self"
                                            icon={faLink}
                                        ></Button>
                                        Quyền sở hữu trí tuệ
                                    </h2>
                                    <h3>3.1. Về tài khoản học tập</h3>
                                    <p>
                                        Mỗi tài khoản đăng ký chỉ được phép sử
                                        dụng duy nhất cho một người, không được
                                        chia sẻ cho nhiều người cùng học. Trong
                                        trường hợp, F8 phát hiện chủ sở hữu vi
                                        phạm về việc tài khoản học bị chia sẻ,
                                        F8 có quyền ngừng cung cấp khóa học cho
                                        học viên, xóa tài khoản và chặn mọi truy
                                        cập của học viên đã có vi phạm và không
                                        hoàn lại học phí.
                                    </p>
                                    <p>
                                        Chủ sở hữu tài khoản sẽ chịu trách nhiệm
                                        nếu các hình ảnh/video/bài giảng của F8
                                        bị phát tán ra bên ngoài. Khi F8 phát
                                        hiện bất cứ tài nguyên nào trong khóa
                                        học trả phí của F8 bị phát tán ra ngoài,
                                        F8 có quyền xóa tài khoản và chặn mọi
                                        truy cập của tài khoản thực hiện tải
                                        xuống tài nguyên, F8 không hỗ trợ mở lại
                                        tài khoản nếu vi phạm.
                                    </p>
                                    <p>
                                        Nếu bàn luận về chính trị, tôn giáo, nội
                                        dung đồi trụy, thì F8 có quyền khóa tài
                                        khoản đó vĩnh viễn và sẽ không hoàn lại
                                        học phí các khóa học đã đăng ký.
                                    </p>
                                    <p>
                                        Mỗi tài khoản được đăng nhập và học tập
                                        tối đa 02 thiết bị.
                                    </p>

                                    <h3>
                                        3.2 Về thời gian học các khóa online
                                    </h3>
                                    <p>
                                        Khi khoá học đã được mua, học viên có
                                        toàn quyền học tập cho riêng mình, không
                                        giới hạn số lần xem và không giới hạn
                                        thời gian sử dụng.
                                    </p>

                                    <h2
                                        data-appended="true"
                                        className={styles.heading}
                                        id="hinh-thuc-thanh-toan"
                                    >
                                        <Button
                                            data-link
                                            to="#hinh-thuc-thanh-toan"
                                            target="_self"
                                            icon={faLink}
                                        ></Button>
                                        Hình thức thanh toán
                                    </h2>

                                    <h3>4.1. Phương thức thanh toán</h3>
                                    <p>
                                        Sau khi lựa chọn khoá học mong muốn, để
                                        tham gia khoá học chính thức, bạn cần
                                        thanh toán trước 100% học phí qua hình
                                        thức chuyển khoản theo hướng dẫn chi
                                        tiết các bước trên trang thanh toán của
                                        F8. Sau khi hệ thống ghi nhận được học
                                        phí của bạn, F8 sẽ tiến hành các thủ tục
                                        kích hoạt khoá học của bạn trong vòng 05
                                        phút. Nếu quá thời gian trên, bạn liên
                                        hệ tới số hotline của F8 (08 1919 8989)
                                        hoặc email để được hỗ trợ.
                                    </p>
                                    <p>
                                        Trường hợp thanh toán bằng Momo hoặc hệ
                                        thống không ghi nhận thanh toán. Bạn vui
                                        lòng chụp lại bill chuyển khoản và gửi
                                        qua Fanpage hoặc gọi tới hotline 08 1919
                                        8989 để được hỗ trợ nhanh nhất.
                                    </p>
                                    <h3>4.2. Đảm bảo an toàn giao dịch</h3>

                                    <p>
                                        Khách hàng tuyệt đối không sử dụng bất
                                        kỳ chương trình, công cụ hay hình thức
                                        nào khác để can thiệp vào hệ thống hay
                                        làm thay đổi cấu trúc dữ liệu. Nghiêm
                                        cấm việc phát tán, truyền bá hay cổ vũ
                                        cho bất kỳ hoạt động nào nhằm can thiệp,
                                        phá hoại hay xâm nhập của hệ thống
                                        website. Mọi vi phạm sẽ bị xử lý theo
                                        quy chế và quy định của pháp luật.
                                    </p>

                                    <p>
                                        Mọi thông tin giao dịch được bảo mật,
                                        trừ trường hợp buộc phải cung cấp khi Cơ
                                        quan pháp luật yêu cầu.
                                    </p>
                                    <hr />

                                    <h2
                                        data-appended="true"
                                        className={styles.heading}
                                        id="chinh-sach-hoan-va-huy-khoa-hoc"
                                    >
                                        <Button
                                            data-link
                                            to="#chinh-sach-hoan-va-huy-khoa-hoc"
                                            target="_self"
                                            icon={faLink}
                                        ></Button>
                                        Chính sách hoàn và huỷ khoá học
                                    </h2>

                                    <p>
                                        Học viên đã đăng ký mua khoá học có thể
                                        yêu cầu hoàn tiền trong vòng 7 ngày (bao
                                        gồm cả thứ 7, chủ nhật, ngày lễ, ngày
                                        nghỉ…) tính từ thời điểm kích hoạt khoá
                                        học và sử dụng không quá 3 bài giảng
                                        (bao gồm cả bài tập, đề thi, v.v.) của
                                        khóa học đó.
                                    </p>
                                    <p>
                                        Học viên gửi email đến, trong vòng 3
                                        ngày làm việc sau khi nhận được đầy đủ
                                        thông tin từ học viên qua email, F8 sẽ
                                        hoàn tiền bằng hình thức chuyển khoản
                                        qua tài khoản ngân hàng mà người dùng
                                        cung cấp.
                                    </p>
                                    <p>
                                        Chính sách hoàn khoá học chỉ áp dụng 1
                                        lần/tài khoản.
                                    </p>
                                    <hr />
                                    <h2
                                        data-appended="true"
                                        className={styles.heading}
                                        id="quyen-va-trach-nhiem-cua-ban-quan-ly-website"
                                    >
                                        <Button
                                            data-link
                                            to="quyen-va-trach-nhiem-cua-ban-quan-ly-website"
                                            target="_self"
                                            icon={faLink}
                                        ></Button>
                                        Quyền và trách nhiệm của ban quản lý
                                        website
                                    </h2>
                                    <h3>6.1. Quyền hạn</h3>
                                    <p>
                                        Yêu cầu Thành viên (Bao gồm Đối tác và
                                        Người học) phải cung cấp thông tin đầy
                                        đủ, chính xác và trung thực. Trong
                                        trường hợp có cơ sở chứng minh thành
                                        viên cung cấp thông tin không chính xác,
                                        sai lệnh, không đầy đủ hoặc vi phạm pháp
                                        luật hay thuần phong mỹ tục Việt Nam thì
                                        F8 có quyền từ chối, tạm ngừng hoặc chấm
                                        dứt quyền sử dụng dịch vụ của thành
                                        viên.
                                    </p>
                                    <p>
                                        F8 có quyền tạm ngừng bình luận, tạo
                                        blog, chỉnh sửa hoặc xóa nội dung bình
                                        luận/blog nếu F8 phát hiện bình
                                        luận/blog đó có nội dung vi phạm pháp
                                        luật, vi phạm quyền sở hữu trí tuệ, xâm
                                        phạm danh dự và nhân phẩm của người
                                        khác.
                                    </p>
                                    <p>
                                        F8 có quyền giữ bản quyền sử dụng dịch
                                        vụ và các nội dung khóa học trên website
                                        theo các quy định pháp luật về bảo hộ sở
                                        hữu trí tuệ tại Việt Nam. Tất cả các
                                        biểu tượng, nội dung theo các ngôn ngữ
                                        khác nhau đều thuộc quyền sở hữu của F8.
                                        Nghiêm cấm mọi hành vi sao chép, sử dụng
                                        và phổ biến bất hợp pháp các quyền sở
                                        hữu trên.
                                    </p>
                                    <p>
                                        F8 có thể chấm dứt ngay quyền sử dụng
                                        dịch vụ và quyền thành viên của thành
                                        viên nếu phát hiện thành viên đã phá
                                        sản, bị kết án hoặc đang trong thời gian
                                        thụ án, trong trường hợp thành viên tiếp
                                        tục hoạt động có thể gây cho F8 trách
                                        nhiệm pháp lý; có những hoạt động lừa
                                        đảo, giả mạo, gây rối loạn thị trường,
                                        gây mất đoàn kết đối với các thành viên
                                        khác của F8; hoạt động vi phạm pháp luật
                                        hiện hành của Việt Nam. Trong trường hợp
                                        chấm dứt quyền thành viên và quyền sử
                                        dụng dịch vụ thì tất cả các chứng nhận,
                                        các quyền của thành viên được cấp sẽ mặc
                                        nhiên hết giá trị và bị chấm dứt.
                                    </p>
                                    <p>
                                        F8 có quyền thay đổi bảng giá các khóa
                                        học và phương thức thanh toán để phù hợp
                                        với nhu cầu và hướng phát triển của
                                        website cũng như của Công ty Cổ phần
                                        Công Nghệ Giáo Dục F8.
                                    </p>
                                    <h3>6.2. Nghĩa vụ</h3>
                                    <p>
                                        Chịu trách nhiệm xây dựng Website bao
                                        gồm một số công việc chính như: nghiên
                                        cứu, thiết kế, mua sắm các thiết bị phần
                                        cứng và phần mềm, kết nối Internet, xây
                                        dựng chính sách phục vụ cho hoạt động
                                        Website,... trong điều kiện và phạm vi
                                        cho phép.
                                    </p>
                                    <p>
                                        Chịu trách nhiệm xây dựng, bổ sung hệ
                                        thống các kiến thức, thông tin về:
                                        nghiệp vụ thương mại điện tử, hệ thống
                                        văn bản pháp luật thương mại trong nước
                                        và quốc tế, thị trường nước ngoài, cũng
                                        như các tin tức có liên quan đến hoạt
                                        động của Website.
                                    </p>
                                    <p>
                                        Cung cấp đầy đủ và chính xác thông tin
                                        và phương thức liên lạc của Đối tác sản
                                        xuất nội dung.
                                    </p>
                                    <p>
                                        Cung cấp đầy đủ thông tin về sản phẩm
                                        được cung cấp trên website: thông tin về
                                        sản phẩm, giá cả, phương thức thanh toán
                                        và giao nhận,…
                                    </p>
                                    <p>
                                        Đảm bảo tính chính xác, trung thực của
                                        thông tin về các Khóa học trực tuyến
                                        cung cấp trên website.
                                    </p>
                                    <p>
                                        Cung cấp thông tin về tình hình kinh
                                        doanh của mình khi có yêu cầu của cơ
                                        quan nhà nước có thẩm quyền để phục vụ
                                        hoạt động thống kê thương mại điện tử.
                                    </p>
                                    <p>
                                        Tuân thủ quy định của pháp luật về thanh
                                        toán, quảng cáo, khuyến mại, bảo vệ
                                        quyền sở hữu trí tuệ, bảo vệ quyền lợi
                                        người tiêu dùng và các quy định của pháp
                                        luật có liên quan khác khi bán hàng hóa
                                        hoặc cung ứng dịch vụ trên sàn giao dịch
                                        thương mại điện tử.
                                    </p>
                                    <hr />

                                    <h2
                                        data-appended="true"
                                        className={styles.heading}
                                        id="quyen-va-trach-nhiem-cua-ben-tham-gia"
                                    >
                                        <Button
                                            data-link
                                            to="quyen-va-trach-nhiem-cua-ben-tham-gia"
                                            target="_self"
                                            icon={faLink}
                                        ></Button>
                                        Quyền và trách nhiệm của bên tham gia
                                    </h2>
                                    <h3>7.1. Quyền hạn</h3>
                                    <p>
                                        Học viên có quyền tham gia vào các khóa
                                        học miễn phí/trả phí của F8.
                                    </p>
                                    <p>
                                        Học viên sẽ được hưởng các chính sách ưu
                                        đãi do F8 cung cấp. Chính sách ưu đãi sẽ
                                        được đăng tải trực tiếp trên trang chủ
                                        của website{" "}
                                        <Button to="/">
                                            https://fullstack.edu.vn
                                        </Button>{" "}
                                        và các kênh thông tin khác.
                                    </p>

                                    <p>
                                        Học viên có quyền đóng góp ý kiến về F8
                                        trong quá trình sử dụng, mọi kiến nghị
                                        được gửi trực tiếp qua thư, điện thoại,
                                        email, fanpage, group F8 trên Facebook .
                                        Tất cả các ý kiến, thắc mắc sẽ được
                                        phòng chăm sóc khách hàng giải đáp trong
                                        thời gian ngắn nhất có thể.
                                    </p>
                                    <p>7.2. Nghĩa vụ</p>
                                    <p>
                                        Học viên sẽ chịu trách nhiệm về bảo mật
                                        và lưu giữ và mọi hoạt động sử dụng dịch
                                        vụ dưới tên đăng ký, mật khẩu và hòm thư
                                        điện tử của mình. Học viên có trách
                                        nhiệm thông báo kịp thời cho F8 về những
                                        hành vi sử dụng trái phép tài khoản để
                                        hai bên cùng hợp tác xử lý.
                                    </p>
                                    <p>
                                        Học viên cam kết, đồng ý không sử dụng
                                        dịch vụ của F8 vào những mục đích bất
                                        hợp pháp, lừa đảo, thăm dò thông tin bất
                                        hợp pháp, phá hoại, tạo ra và phát tán
                                        virus gây hư hại tới hệ thống, cấu hình,
                                        truyền tải thông tin của F8. Hay sử dụng
                                        dịch vụ, tạo đơn hàng giả vào mục đích
                                        đầu cơ, gây lũng đoạn thị trường.
                                    </p>
                                    <p>
                                        Học viên cam kết không sao chép, sửa
                                        đổi, truyền bá, phân phối các khóa học
                                        hay tạo các công cụ tương tự như của F8
                                        khi không được sự đồng ý của F8.
                                    </p>
                                    <p>
                                        Học viên không được hành động gây mất uy
                                        tín của F8 dưới mọi hình thức như gây
                                        mất đoàn kết giữa các thành viên, tuyên
                                        truyền, phổ biến thông tin sai sự thật
                                        hoặc không có lợi cho uy tín của F8.
                                    </p>
                                    <p>
                                        Người dùng/học viên tại F8 chịu 100%
                                        trách nhiệm về nội dung của mình đăng
                                        tải tại các nền tảng của F8. Ví dụ như:
                                        nội dung bình luận, các bài viết (blog),
                                        hình ảnh, video,...
                                    </p>
                                    <blockquote>
                                        <p>
                                            Người vi phạm sẽ chịu toàn bộ chi
                                            phí kiện tụng và bồi thường thiệt
                                            hại (quy đổi thành tiền mặt) liên
                                            quan đến hành vi phát tán trái phép
                                            tài nguyên khóa học Pro của F8.
                                        </p>
                                    </blockquote>
                                    <hr />

                                    <h2
                                        data-appended="true"
                                        className={styles.heading}
                                        id="dieu-khoan-cam-ket-va-ap-dung"
                                    >
                                        <Button
                                            data-link
                                            to="dieu-khoan-cam-ket-va-ap-dung"
                                            target="_self"
                                            icon={faLink}
                                        ></Button>
                                        Điều khoản cam kết và áp dụng
                                    </h2>
                                    <p>
                                        Quy chế hoạt động sẽ được website F8 cập
                                        nhật bổ sung liên tục mà không cần báo
                                        trước. Thành viên tham gia website có
                                        trách nhiệm tuân theo quy chế hiện hành
                                        khi hoạt động và học tập trên F8.
                                    </p>
                                    <p>
                                        Địa chỉ liên lạc chính thức của
                                        Website/ứng dụng cung cấp khóa học trực
                                        tuyến .
                                    </p>
                                    <p>
                                        <strong>Công ty/Tổ chức:</strong> Công
                                        ty Cổ phần Công Nghệ Giáo Dục F8
                                    </p>

                                    <p>
                                        <strong>Địa chỉ:</strong> Số 1, ngõ 41,
                                        Trần Duy Hưng, phường Trung Hòa, quận
                                        Cầu Giấy, TP. Hà Nội
                                    </p>

                                    <p>
                                        <strong>Email:</strong>{" "}
                                        <a href="mailto:contact@fullstack.edu.vn">
                                            contact@fullstack.edu.vn
                                        </a>
                                    </p>
                                    <p>
                                        <strong>Số điện thoại:</strong> 08 1919
                                        8989
                                    </p>
                                </div>
                            </section>

                            <section className={`${styles.col} ${styles.col4}`}>
                                <Banner />
                            </section>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Terms;
