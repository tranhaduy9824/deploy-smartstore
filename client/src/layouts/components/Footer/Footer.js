import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import {
    HomeIcon,
    MailIcon,
    PhoneIcon,
    ProtectIcon,
    ReloadIcon,
    RocketIcon,
    SupportIcon,
    TagIcon,
} from '~/components/Icons';
import { NavLink } from 'react-router-dom';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('footer-top')}>
                <div className={cx('footer-top-item')}>
                    <div className={cx('image-item')}>
                        <span>
                            <RocketIcon className={cx('sub-image')} />
                        </span>
                    </div>
                    <div className={cx('content-item')}>
                        <div className={cx('content-title')}>Miễn phí vận chuyển</div>
                        <div className={cx('content-des')}>Đối với tất cả các đơn hàng trên 2.000.000 VND</div>
                    </div>
                </div>
                <div className={cx('footer-top-item')}>
                    <div className={cx('image-item')}>
                        <span>
                            <ReloadIcon className={cx('sub-image')} />
                        </span>
                    </div>
                    <div className={cx('content-item')}>
                        <div className={cx('content-title')}>Trả về 1 & 1</div>
                        <div className={cx('content-des')}>Hủy sau 1 ngày</div>
                    </div>
                </div>
                <div className={cx('footer-top-item')}>
                    <div className={cx('image-item')}>
                        <span>
                            <ProtectIcon className={cx('sub-image')} />
                        </span>
                    </div>
                    <div className={cx('content-item')}>
                        <div className={cx('content-title')}>Thanh toán an toàn 100%</div>
                        <div className={cx('content-des')}>Thanh toán an toàn được đảm bảo</div>
                    </div>
                </div>
                <div className={cx('footer-top-item')}>
                    <div className={cx('image-item')}>
                        <span>
                            <SupportIcon className={cx('sub-image')} />
                        </span>
                    </div>
                    <div className={cx('content-item')}>
                        <div className={cx('content-title')}>Hỗ trợ tận tâm 24/7</div>
                        <div className={cx('content-des')}>Mọi lúc & mọi nơi</div>
                    </div>
                </div>
                <div className={cx('footer-top-item')}>
                    <div className={cx('image-item')}>
                        <span>
                            <TagIcon className={cx('sub-image')} />
                        </span>
                    </div>
                    <div className={cx('content-item')}>
                        <div className={cx('content-title')}>Ưu đãi hàng ngày</div>
                        <div className={cx('content-des')}>GIẢM GIÁ lên tới 70%</div>
                    </div>
                </div>
            </div>
            <div className={cx('footer-center')}>
                <div className={cx('footer-center-item')}>
                    <div className={cx('info-title')}>
                        <h2 className={cx('title')}>SmartStore – Cửa Hàng Trực Tuyến Dành Cho Bạn</h2>
                        <p className={cx('des')}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus viverra iaculis. Etiam
                            vulputate et justo eget scelerisque.
                        </p>
                    </div>
                    <div className={cx('info-contact')}>
                        <ul>
                            <li>
                                <span className={cx('icon')}>
                                    <PhoneIcon />
                                </span>
                                <span className={cx('text')}>
                                    Đường dây nóng 24/7:
                                    <h3>(+84) 867 125 575</h3>
                                </span>
                            </li>
                            <li>
                                <span className={cx('icon')}>
                                    <HomeIcon />
                                </span>
                                <span className={cx('text')}>Đại Minh, Đại Lộc, Quảng Nam</span>
                            </li>
                            <li>
                                <span className={cx('icon')}>
                                    <MailIcon />
                                </span>
                                <span className={cx('text')}>duyth.22it@vku.udn.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={cx('footer-center-item')}>
                    <div className={cx('footer-menu')}>
                        <h2>Liên Kết Hữu Ích</h2>
                        <ul>
                            <li>
                                <NavLink>Về chúng tôi</NavLink>
                            </li>
                            <li>
                                <NavLink>Liên hệ</NavLink>
                            </li>
                            <li>
                                <NavLink>Trung tâm trợ giúp</NavLink>
                            </li>
                            <li>
                                <NavLink>Sự nghiệp</NavLink>
                            </li>
                            <li>
                                <NavLink>Chính sách</NavLink>
                            </li>
                            <li>
                                <NavLink>Giảm giá thần tốc</NavLink>
                            </li>
                            <li>
                                <NavLink>Chính thức</NavLink>
                            </li>
                            <li>
                                <NavLink>Sơ đồ trang web</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('footer-menu')}>
                        <h2>Trung tâm trợ giúp</h2>
                        <ul>
                            <li>
                                <NavLink>Thanh toán</NavLink>
                            </li>
                            <li>
                                <NavLink>Vận chuyển</NavLink>
                            </li>
                            <li>
                                <NavLink>Trả lại sản phẩm</NavLink>
                            </li>
                            <li>
                                <NavLink>Câu hỏi thường gặp</NavLink>
                            </li>
                            <li>
                                <NavLink>Thanh toán</NavLink>
                            </li>
                            <li>
                                <NavLink>Các vấn đề khác</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('footer-menu')}>
                        <h2>Doanh nghiệp SmartStore</h2>
                        <ul>
                            <li>
                                <NavLink>Bán trên SmartStore</NavLink>
                            </li>
                            <li>
                                <NavLink>Chương trình liên kết</NavLink>
                            </li>
                            <li>
                                <NavLink>Nhà cung cấp của chúng tôi</NavLink>
                            </li>
                            <li>
                                <NavLink>Khả năng tiếp cận</NavLink>
                            </li>
                            <li>
                                <NavLink>Quảng cáo với chúng tôi</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={cx('footer-center-item')}>
                    <h2>Bản Tin SmartStore</h2>
                    <p>Đăng ký ngay để nhận thông tin cập nhật về khuyến mãi và phiếu giảm giá. Đừng lo lắng! Chúng tôi không thư rác</p>
                </div>
            </div>
            <div className={cx('footer-bottom')}>
                <div className={cx('copyright')}>
                    ©2024 <b>SmartStore</b> Mọi quyền được bảo lưu
                </div>
            </div>
        </footer>
    );
}

export default Footer;
