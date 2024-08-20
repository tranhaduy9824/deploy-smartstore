import classNames from 'classnames/bind';
import styles from './EditShop.module.scss';
import WrapperHover from '~/components/WrapperHover';
import Avatar from '~/components/Avatar';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '~/context/AuthContext';
import { ShopContext } from '~/context/ShopContext';

const cx = classNames.bind(styles);

function EditShop({ myShop }) {
    const { user, handleUpdate } = useContext(AuthContext);
    const { updateMyShop } = useContext(ShopContext);

    // Local state for form inputs
    const [shopInfo, setShopInfo] = useState({
        name: '',
        description: '',
        phone: '',
        email: '',
        address: '',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',
        tiktokUrl: '',
    });

    useEffect(() => {
        if (myShop) {
            setShopInfo({
                name: myShop.name || '',
                description: myShop.description || '',
                phone: myShop.phone || '',
                email: myShop.email || '',
                address: myShop.address || '',
                facebookUrl: myShop.socialMediaUrls?.facebook || '',
                instagramUrl: myShop.socialMediaUrls?.instagram || '',
                twitterUrl: myShop.socialMediaUrls?.twitter || '',
                tiktokUrl: myShop.socialMediaUrls?.tiktok || '',
            });
        }
    }, [myShop]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setShopInfo(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        const { name, description, phone, email, address, facebookUrl, instagramUrl, twitterUrl, tiktokUrl } = shopInfo;
        const data = {
            name,
            description,
            phone,
            email,
            address,
            socials: {
                facebook: facebookUrl,
                instagram: instagramUrl,
                twitter: twitterUrl,
                tiktok: tiktokUrl,
            },
        };
        await updateMyShop(myShop._id, data);
    };

    return (
        <div className={cx('wrapper')}>
            <p className={cx('title')}>Chỉnh sửa thông tin</p>
            <p>Quản lý thông tin hồ sơ</p>
            <div className={cx('info')}>
                <div className={cx('avatar')}>
                    <WrapperHover
                        noIcon
                        content={
                            <div>
                                <label htmlFor="avatar">Chọn ảnh</label>
                                <input
                                    type="file"
                                    id="avatar"
                                    onChange={(e) => handleUpdate({ avatar: e.target.files[0] })}
                                />
                            </div>
                        }
                        classNameContent={cx('update-avatar')}
                        classNameWrapper={cx('update-avatar-wrapper')}
                    >
                        <Avatar url={user && user.user.avatar} />
                    </WrapperHover>
                </div>
                <div className={cx('info-text')}>
                    <div className={cx('item-info')}>
                        <label htmlFor="name">Tên cửa hàng</label>
                        <input id="name" value={shopInfo.name} onChange={handleInputChange} />
                    </div>
                    <div className={cx('item-info')}>
                        <label htmlFor="description">Mô tả</label>
                        <textarea id="description" value={shopInfo.description} onChange={handleInputChange} />
                    </div>
                    <div className={cx('item-info')}>
                        <label htmlFor="phone">Số điện thoại</label>
                        <input id="phone" value={shopInfo.phone} onChange={handleInputChange} />
                    </div>
                    <div className={cx('item-info')}>
                        <label htmlFor="email">Email</label>
                        <input id="email" value={shopInfo.email} onChange={handleInputChange} />
                    </div>
                    <div className={cx('item-info')}>
                        <label htmlFor="address">Địa chỉ</label>
                        <input id="address" value={shopInfo.address} onChange={handleInputChange} />
                    </div>
                    <div className={cx('item-info')}>
                        <label>Liên kết</label>
                        <div className={cx('socials')}>
                            <div>
                                <label htmlFor="facebookUrl">Facebook</label>
                                <input id="facebookUrl" value={shopInfo.facebookUrl} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label htmlFor="instagramUrl">Instagram</label>
                                <input id="instagramUrl" value={shopInfo.instagramUrl} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label htmlFor="twitterUrl">Twitter</label>
                                <input id="twitterUrl" value={shopInfo.twitterUrl} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label htmlFor="tiktokUrl">Tiktok</label>
                                <input id="tiktokUrl" value={shopInfo.tiktokUrl} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('save-btn')} onClick={handleSave}>Lưu</div>
        </div>
    );
}

export default EditShop;
