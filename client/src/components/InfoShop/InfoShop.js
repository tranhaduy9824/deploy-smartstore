import classNames from 'classnames/bind';
import styles from './InfoShop.module.scss';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faRocketchat, faTiktok, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { LocalIcon, MailIcon, PhoneIcon, ProductIcon } from '../Icons';

const cx = classNames.bind(styles);

function InfoShop({ avatar, productShop, shop, myShop }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('item-info')}>
                <div className={cx('avatar-name')}>
                    <img src={avatar} alt="Ảnh" />
                    <div className={cx('name')}>
                        <h1>{shop?.name}</h1>
                        <div>Cửa hàng</div>
                    </div>
                </div>
                {!myShop && (
                    <div className={cx('control')}>
                        <Button
                            className={cx('chat')}
                            onClick={() => {}}
                            iconLeft={<FontAwesomeIcon icon={faRocketchat} />}
                        >
                            Chat
                        </Button>
                    </div>
                )}
            </div>
            <div className={cx('item-info')}>
                <div>
                    <ProductIcon /> Số sản phẩm:
                    <span>{productShop?.length}</span>
                </div>
                <div>
                    <PhoneIcon /> Số điện thoại:
                    <span>{shop?.phone}</span>
                </div>
                <div>
                    <MailIcon /> Email:
                    <span>{shop?.email}</span>
                </div>
            </div>
            <div className={cx('item-info')}>
                <div>
                    <LocalIcon /> Địa chỉ: <span>{shop?.address}</span>
                </div>
                <div className={cx('social')}>
                    <span>Nền tảng khác: </span>
                    {shop?.socialMediaUrls?.facebook && (
                        <a href={shop?.socialMediaUrls?.facebook} className={cx('fb')}>
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                    )}
                    {shop?.socialMediaUrls?.instagram && (
                        <a href={shop?.socialMediaUrls?.instagram} className={cx('ins')}>
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                    )}
                    {shop?.socialMediaUrls?.twitter && (
                        <a href={shop?.socialMediaUrls?.twitter} className={cx('twitter')}>
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                    )}
                    {shop?.socialMediaUrls?.tiktok && (
                        <a href={shop?.socialMediaUrls?.tiktok} className={cx('tik')}>
                            <FontAwesomeIcon icon={faTiktok} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InfoShop;
