import classNames from 'classnames/bind';
import styles from './Payment.module.scss';
import { useContext, useEffect, useState } from 'react';
import { HomeIcon, LocalIcon } from '~/components/Icons';
import { AuthContext } from '~/context/AuthContext';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import WrapperModel from '~/components/WrapperModel';
import AddAddress from '~/components/AddAddress';
import AddressItem from '../Profile/AddressItem';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatPrice } from '~/handle/formatPrice';
import { highestShippingCost } from '~/handle/highestShippingCost';
import snippet from '~/handle/snippet';
import { OrderContext } from '~/context/OrderContext';

const cx = classNames.bind(styles);

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const [typePay, setTypePay] = useState('cash_on_delivery');
    const [showChangeAddress, setShowChangeAddress] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [updateAddress, setUpdateAddress] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [items, setItems] = useState(location.state?.items || []);

    const { user } = useContext(AuthContext);
    const { createOrder } = useContext(OrderContext);

    useEffect(() => {
        window.scrollTo(0, 0);

        return () => {
            window.scrollTo(0, 0);
        };
    }, []);

    useEffect(() => {
        if (user) {
            user.user.address.map((item) => {
                item.isDefault && setSelectedAddress(item);
            });
        }
    }, [user]);

    const totalPrice = items?.reduce((acc, item) => acc + (item?.price || 0), 0) + highestShippingCost(items);

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('content')}>
                    <div className={cx('info-payment')}>
                        <p className={cx('title')}>
                            <LocalIcon />
                            <span>Địa chỉ nhận hàng</span>
                        </p>
                        <div className={cx('address-user')}>
                            {user && user.user.address.length !== 0 && (
                                <>
                                    <span>
                                        {selectedAddress?.fullname} {selectedAddress?.phone}
                                    </span>
                                    <p>
                                        {selectedAddress?.specificAddress}, {selectedAddress?.address}
                                    </p>
                                    {selectedAddress?.isDefault && <div>Mặc dịnh</div>}
                                    <p className={cx('change')} onClick={() => setShowChangeAddress(true)}>
                                        Thay đổi
                                    </p>
                                </>
                            )}
                            {user && user.user.address.length === 0 && (
                                <div onClick={() => setShowAddAddress(true)}>Thêm địa chỉ</div>
                            )}
                        </div>
                        <p className={cx('title')}>Phương thức thanh toán</p>
                        <div className={cx('payment')}>
                            <div className={cx('list-type')}>
                                <div
                                    className={cx({ active: typePay === 'cash_on_delivery' })}
                                    onClick={() => setTypePay('cash_on_delivery')}
                                >
                                    Thanh toán khi nhận hàng
                                </div>
                                <div
                                    className={cx({ active: typePay === 'digital_wallet' })}
                                    onClick={() => setTypePay('digital_wallet')}
                                >
                                    Ví điện tử
                                </div>
                            </div>
                            {typePay === 'cash_on_delivery' && (
                                <p>Phí thu hộ: ₫0 VNĐ. Ưu đãi về phí vận chuyển (nếu có) áp dụng cả với phí thu hộ.</p>
                            )}
                        </div>
                    </div>
                    <div className={cx('bill')}>
                        <p className={cx('title')}>Đơn hàng của bạn</p>
                        <div>
                            <span>Sản phẩm</span>
                            <span>Tổng</span>
                        </div>
                        <div className={cx('list-product')}>
                            {items?.map((item, index) => (
                                <div>
                                    <span onClick={() => navigate(`/product/${item?.productId?._id}`)}>
                                        {snippet(item?.productId?.name, 50)} (x{item?.quantity})
                                    </span>
                                    <span className={cx('money')}>{formatPrice(item?.price)}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <span>Chi phí vận chuyển</span>
                            <span className={cx('money')}>{formatPrice(highestShippingCost(items))}</span>
                        </div>
                        <div>
                            <span>Tổng</span>
                            <span className={cx('money')}>{formatPrice(totalPrice)}</span>
                        </div>
                    </div>
                </div>
                <div className={cx('controls')}>
                    <div className={cx('navigate')}>
                        <Button
                            className={cx('btn-navigate')}
                            to="/cart"
                            iconLeft={<FontAwesomeIcon icon={faArrowLeft} />}
                        >
                            Xem lại giỏ hàng
                        </Button>
                        <Button className={cx('btn-navigate')} to="/" iconLeft={<HomeIcon />}>
                            Trở về nhà
                        </Button>
                    </div>
                    <Button
                        className={cx('btn-buy')}
                        onClick={() =>
                            createOrder(
                                {
                                    items: items,
                                    paymentMethod: typePay,
                                    shippingAddress: {
                                        recipientName: selectedAddress.fullname,
                                        recipientPhone: selectedAddress.phone,
                                        address: selectedAddress.address,
                                        specificAddress: selectedAddress.specificAddress,
                                    },
                                },
                                user?.token,
                            )
                        }
                    >
                        Đặt hàng
                    </Button>
                </div>
            </div>
            <WrapperModel
                classNameContent={cx('model-change-address')}
                show={showChangeAddress}
                onClose={() => {
                    setShowChangeAddress(false);
                    setUpdateAddress(null);
                }}
            >
                <p className={cx('title')}>Địa Chỉ Của Tôi</p>
                <div className={cx('list-address')}>
                    {user?.user?.address
                        .sort((a, b) => {
                            if (a.isDefault && !b.isDefault) return -1;
                            if (!a.isDefault && b.isDefault) return 1;

                            return 0;
                        })
                        .map((item, index) => (
                            <div className={cx('adddress-item')} key={index} onClick={() => setSelectedAddress(item)}>
                                <div className={cx('radio-input')}>
                                    <input
                                        type="radio"
                                        checked={selectedAddress?._id === item._id}
                                        onChange={() => setSelectedAddress(item)}
                                    />
                                </div>
                                <AddressItem
                                    data={item}
                                    key={index}
                                    onUpdate={(addressData) => {
                                        setUpdateAddress(addressData);
                                        setShowChangeAddress(false);
                                        setShowAddAddress(true);
                                    }}
                                    payPage
                                />
                            </div>
                        ))}
                </div>
                <div className={cx('controls')}>
                    <div
                        className={cx('add-address')}
                        onClick={() => {
                            setUpdateAddress(null);
                            setShowChangeAddress(false);
                            setShowAddAddress(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Thêm địa chỉ mới
                    </div>
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
                        setUpdateAddress(null);
                        setShowAddAddress(false);
                        setShowChangeAddress(true);
                    }}
                    comeback={() => {
                        setUpdateAddress(null);
                        setShowAddAddress(false);
                        setShowChangeAddress(true);
                    }}
                />
            </WrapperModel>
        </>
    );
}

export default Payment;
