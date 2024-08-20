/* eslint-disable jsx-a11y/img-redundant-alt */
import classNames from 'classnames/bind';
import styles from './OrderItem.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { GuaranteeIcon } from '../Icons';
import { formatPrice } from '~/handle/formatPrice';
import snippet from '~/handle/snippet';
import { useContext, useState } from 'react';
import { OrderContext } from '~/context/OrderContext';
import { AuthContext } from '~/context/AuthContext';
import ModelOrderDetail from './ModelOrderDetail';
import ModelReview from './ModelReview';
import { ProductContext } from '~/context/ProductContext';

const cx = classNames.bind(styles);

function OrderItem({ myShop = false, data, status, hasConfirm, className }) {
    const navigate = useNavigate();
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [productReview, setProductReview] = useState(null);

    const { user } = useContext(AuthContext);
    const { createPayment, updateOrder, changeItemId } = useContext(OrderContext);
    const { addProductToRecent } = useContext(ProductContext);

    const statusText = {
        wait_confirm: 'Chờ xác nhận',
        delivering: 'Đang vận chuyển',
        cancelled: 'Đã hủy',
        done: 'Hoàn thành',
    };

    const handleConfirm = () => {
        updateOrder(
            {
                status: 'delivering',
            },
            user?.token,
            data?._id,
        );
    };

    return (
        (status === 'all' || data?.allStatus === status) && (
            <div className={cx('wrapper', { [className]: className, changeItem: changeItemId === data?._id })}>
                <div className={cx('content')}>
                    <div className={cx('box-image')}>
                        {data?.items?.slice(0, 3).map((item, index) => (
                            <Link
                                key={index}
                                to={`/product/${item?.productId?._id}`}
                                onClick={() => addProductToRecent(item?.productId)}
                                className={cx({
                                    'two-image': data?.items?.length === 2,
                                    'three-image': data?.items?.length >= 3,
                                })}
                            >
                                <img src={item?.productId?.files?.photos[0]} alt="Image" />
                            </Link>
                        ))}
                    </div>
                    <div className={cx('info-item')}>
                        {data?.items?.map((item, index) => (
                            <h4 key={index}>
                                <Link
                                    to={`/product/${item?.productId?._id}`}
                                    onClick={() => addProductToRecent(item?.productId)}
                                >
                                    {data?.items?.length === 1
                                        ? item?.productId?.name
                                        : snippet(item?.productId?.name, 45)}
                                </Link>
                                <span>(x{item?.quantity})</span>
                            </h4>
                        ))}
                    </div>
                    <div className={cx('info-order')}>
                        <p>{data?.paymentMethod === 'cash_on_delivery' ? 'Thanh toán khi nhận hàng' : 'Ví điện tử'}</p>
                        <p>
                            Phí vận chuyển: <span>{formatPrice(data?.shippingCost)}</span>
                        </p>
                    </div>
                </div>
                <div className={cx('total')}>
                    <p>Trạng thái: {statusText[data?.allStatus]}</p>
                    <p>
                        <GuaranteeIcon />
                        Thành tiền: <span>{formatPrice(data?.totalPrice)}</span>
                    </p>
                </div>
                <div className={cx('action')}>
                    {!myShop && (
                        <div
                            className={cx('buy-again')}
                            onClick={() => navigate('/payment', { state: { items: data?.items } })}
                        >
                            Mua lại
                        </div>
                    )}
                    {data?.allStatus === 'wait_confirm' && (
                        <div
                            className={cx('cancel-btn')}
                            onClick={() => updateOrder({ allStatus: 'cancelled' }, user?.token, data?._id)}
                        >
                            Hủy đơn hàng
                        </div>
                    )}
                    {data?.allStatus === 'wait_confirm' && myShop && !hasConfirm && (
                        <div className={cx('confirm-btn')} onClick={handleConfirm}>
                            Xác nhận
                        </div>
                    )}
                    {data?.allStatus === 'wait_confirm' && data?.paymentMethod === 'digital_wallet' && !myShop && (
                        <div
                            className={cx('pay-btn')}
                            onClick={() => createPayment(data?.totalPrice, data?._id, user?.token)}
                        >
                            Thanh toán
                        </div>
                    )}
                    <div className={cx('detail-btn')} onClick={() => setShowOrderDetail(true)}>
                        Xem chi tiết
                    </div>
                </div>
                <ModelOrderDetail
                    data={data}
                    showOrderDetail={showOrderDetail}
                    setShowOrderDetail={setShowOrderDetail}
                    setShowReview={setShowReview}
                    setProductReview={setProductReview}
                    myShop={myShop}
                />
                <ModelReview
                    orderId={data?._id}
                    showReview={showReview}
                    productReview={productReview}
                    setShowReview={setShowReview}
                    setProductReview={setProductReview}
                />
            </div>
        )
    );
}

export default OrderItem;
