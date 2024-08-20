import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import WrapperHover from '~/components/WrapperHover';
import WrapperModel from '~/components/WrapperModel';
import BoxInput from '~/components/BoxInput';
import OrderItem from '~/components/OrderItem';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddressItem from './AddressItem';
import { AuthContext } from '~/context/AuthContext';
import Avatar from '~/components/Avatar';
import { handleValidation } from '~/handle/handleValidation';
import { useDispatch } from 'react-redux';
import AddAddress from '~/components/AddAddress';
import { OrderContext } from '~/context/OrderContext';
import { BillIcon } from '~/components/Icons';
import HeaderSelect from '~/components/HeaderSelect/HeaderSelect';

const cx = classNames.bind(styles);

function Profile() {
    const dispatch = useDispatch();
    const [isEditFullname, setIsEditFullname] = useState(false);
    const [isEditEmail, setIsEditEmail] = useState(false);
    const [isEditPhone, setIsEditPhone] = useState(false);
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const refFullname = useRef(null);
    const refEmail = useRef(null);
    const refPhone = useRef(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPasswrod, setConfirmNewPassword] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [contentSelected, setContentSelected] = useState('all');
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [updateAddress, setUpdateAddress] = useState(null);

    const { user, handleUpdate } = useContext(AuthContext);
    const { orders, getOrders } = useContext(OrderContext);

    useEffect(() => {
        if (user) {
            getOrders(user.token);
        }
    }, [user, getOrders]);

    useEffect(() => {
        if (user) {
            setFullname(user.user.fullname);
            setEmail(user.user.email);
            setPhone(user.user.phone || '');
        }
    }, [user]);

    useEffect(() => {
        if (isEditFullname) {
            refFullname.current.focus();
        }
    }, [isEditFullname]);

    useEffect(() => {
        if (isEditEmail) {
            refEmail.current.focus();
        }
    }, [isEditEmail]);

    useEffect(() => {
        if (isEditPhone) {
            refPhone.current.focus();
        }
    }, [isEditPhone]);

    const handleChangePassword = () => {
        if (handleValidation('Default Name', 'default@example.com', newPassword, confirmNewPasswrod, dispatch)) {
            handleUpdate({ password: newPassword });
            setShowChangePassword(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleChangePassword();
        }
    };

    const listHeader = [
        {
            content: 'all',
            title: 'Tất cả',
        },
        {
            content: 'wait_confirm',
            title: 'Chờ xác nhận',
        },
        {
            content: 'delivering',
            title: 'Đang vận chuyển',
        },
        {
            content: 'done',
            title: 'Hoàn thành',
        },
        {
            content: 'cancelled',
            title: 'Đã hủy',
        },
        {
            content: 'address',
            title: 'Địa chỉ nhận hàng',
        },
    ];

    return (
        <>
            <div className={cx('wrapper')}>
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
                    <div className={cx('box-fullname')}>
                        <div className={cx('fullname')}>
                            <input
                                ref={refFullname}
                                disabled={!isEditFullname}
                                value={fullname}
                                onChange={(e) => {
                                    setFullname(e.target.value);
                                }}
                                onBlur={() => {
                                    handleUpdate({ fullname: fullname });
                                    setIsEditFullname(false);
                                }}
                                style={{
                                    width: `${
                                        fullname.split('').filter((char) => /[A-Z]/.test(char)).length * 0.2 +
                                        fullname.length
                                    }ch`,
                                }}
                            />
                            <span
                                onClick={() => {
                                    setIsEditFullname(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </span>
                        </div>
                    </div>
                    <span>Thành viên</span>
                    <div className={cx('change-info')}>
                        <div className={cx('change-item')}>
                            <div className={cx('item')}>
                                <label>Email:</label>
                                <input
                                    type="text"
                                    value={email}
                                    ref={refEmail}
                                    disabled={!isEditEmail}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    onBlur={() => {
                                        handleUpdate({ email: email });
                                        setIsEditEmail(false);
                                    }}
                                    style={{
                                        width: `${email.length}ch`,
                                    }}
                                />
                            </div>
                            <span
                                onClick={() => {
                                    setIsEditEmail(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </span>
                        </div>
                        <div className={cx('change-item')}>
                            <div className={cx('item')}>
                                <label>Số điện thoại:</label>
                                <input
                                    className={cx('phone-input')}
                                    type="text"
                                    value={phone}
                                    ref={refPhone}
                                    disabled={!isEditPhone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                    }}
                                    onBlur={() => {
                                        handleUpdate({ phone: phone });
                                        setIsEditPhone(false);
                                    }}
                                    style={{
                                        width: `${phone.length}ch`,
                                    }}
                                />
                            </div>
                            <span
                                onClick={() => {
                                    setIsEditPhone(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </span>
                        </div>
                        <div className={cx('change-password')} onClick={() => setShowChangePassword(true)}>
                            <FontAwesomeIcon icon={faEdit} />
                            Đổi mật khẩu
                        </div>
                    </div>
                </div>
                <div className={cx('box-content')}>
                    <HeaderSelect
                        listHeader={listHeader}
                        contentSelected={contentSelected}
                        setContentSelected={setContentSelected}
                    />
                    <div className={cx('content')}>
                        {contentSelected !== 'address' ? (
                            <div className={cx('order')}>
                                {contentSelected === 'all' ||
                                orders.filter((order) => order.allStatus === contentSelected).length > 0 ? (
                                    orders?.map((order, index) => (
                                        <OrderItem data={order} key={index} status={contentSelected} />
                                    ))
                                ) : (
                                    <div className={cx('not-found')}>
                                        <BillIcon />
                                        <span>Không tìm thấy đơn hàng</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={cx('address')}>
                                <div className={cx('title')}>
                                    <p>Địa chỉ của tôi</p>
                                    <div className={cx('add-address')} onClick={() => setShowAddAddress(true)}>
                                        <FontAwesomeIcon icon={faPlus} /> Thêm địa chỉ mới
                                    </div>
                                </div>
                                <div className={cx('list-address')}>
                                    <p>Địa chỉ</p>
                                    {user?.user?.address
                                        .sort((a, b) => {
                                            if (a.isDefault && !b.isDefault) return -1;
                                            if (!a.isDefault && b.isDefault) return 1;

                                            return 0;
                                        })
                                        .map((item, index) => (
                                            <AddressItem
                                                data={item}
                                                key={index}
                                                onUpdate={(addressData) => {
                                                    setUpdateAddress(addressData);
                                                    setShowAddAddress(true);
                                                }}
                                            />
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <WrapperModel
                classNameContent={cx('model-change-pw')}
                show={showChangePassword}
                onClose={() => setShowChangePassword(false)}
            >
                <p className={cx('title')}>Đổi mật khẩu</p>
                <BoxInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e)}
                    label="Mật khẩu mới"
                    className={cx('input')}
                    isPassword
                />
                <BoxInput
                    value={confirmNewPasswrod}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e)}
                    label="Xác nhận mật khẩu mới"
                    className={cx('input')}
                    isPassword
                />
                <div className={cx('btn-change-pw')} onClick={handleChangePassword}>
                    Đổi mật khẩu
                </div>
            </WrapperModel>
            <WrapperModel
                classNameContent={cx('model-add-address')}
                show={showAddAddress}
                onClose={() => {
                    setShowAddAddress(false);
                    setUpdateAddress(null);
                }}
            >
                <AddAddress
                    updateAddress={updateAddress}
                    onSuccess={() => {
                        setShowAddAddress(false);
                        setUpdateAddress(null);
                    }}
                />
            </WrapperModel>
        </>
    );
}

export default Profile;
