/* eslint-disable jsx-a11y/img-redundant-alt */
import classNames from 'classnames/bind';
import styles from './ModelOrderDetail.module.scss';
import { GuaranteeIcon, OrderIcon, PaymentIcon, ReceiveIcon, ReviewIcon } from '~/components/Icons';
import WrapperModel from '~/components/WrapperModel';
import { formatPrice } from '~/handle/formatPrice';
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ReviewContext } from '~/context/ReviewContext';
import { AuthContext } from '~/context/AuthContext';
import RatingStar from '~/components/RatingStar';
import { ProductContext } from '~/context/ProductContext';

const cx = classNames.bind(styles);

function ModelOrderDetail({ myShop, data, showOrderDetail, setShowOrderDetail, setShowReview, setProductReview }) {
    const { review, getReviewByOrder } = useContext(ReviewContext);
    const { user } = useContext(AuthContext);
    const { addProductToRecent } = useContext(ProductContext);

    const stepsCompleted =
        data?.allStatus === 'done'
            ? 3
            : (data?.allStatus === 'delivering' && data?.paymentMethod === 'digital_wallet') || data?.status === 'done'
            ? 2
            : data?.allStatus !== 'cancelled'
            ? 1
            : 0;

    const lineWidth = (stepsCompleted / 4) * 100;
    const widthStyle = lineWidth === 0 ? '0%' : `calc(${lineWidth}% + 20px)`;

    useEffect(() => {
        if (user && data?.allStatus === 'done') {
            getReviewByOrder(data._id, user.token);
        }
    }, [user, getReviewByOrder, data]);

    const findReviewForProduct = (productId) => {
        return review?.find((item) => item?.productId === productId && item?.orderId === data?._id);
    };

    const areAllProductsReviewed = () => {
        if (!data?.items) return false;

        const reviewedProductIds = review.filter((r) => r.orderId === data._id).map((r) => r.productId);

        return data.items.length === new Set(reviewedProductIds).size;
    };

    const statusText = {
        wait_confirm: 'Chờ xác nhận',
        delivering: 'Đang vận chuyển',
        cancelled: 'Đã hủy',
        done: 'Hoàn thành',
    };

    const getStatus = (item) => {
        if (item?.status === 'wait_confirm' && data?.allStatus !== 'cancelled' && data?.allStatus !== 'done') {
            return statusText.wait_confirm;
        }
        if (item?.status === 'delivering' && data?.allStatus !== 'done') {
            return statusText.delivering;
        }
        if (item?.status === 'done' || data?.allStatus === 'done') {
            return statusText.done;
        }
        if (item?.status === 'cancelled' || data?.allStatus === 'cancelled') {
            return statusText.cancelled;
        }
        return null;
    };

    return (
        <WrapperModel classNameContent={cx('wrapper')} show={showOrderDetail} onClose={() => setShowOrderDetail(false)}>
            <div className={cx('status')}>
                <div className={cx('line')} style={{ width: widthStyle, transition: 'width 0.4s ease' }}></div>
                <div className={cx('items-status')}>
                    <div className={cx('item', { success: data?.allStatus !== 'cancelled' })}>
                        <div className={cx('icon')}>
                            <OrderIcon />
                        </div>
                        <div className={cx('text')}>Đơn hàng đã đặt</div>
                    </div>
                    <div
                        className={cx('item', {
                            success:
                                (data?.allStatus === 'delivering' && data?.paymentMethod === 'digital_wallet') ||
                                data?.allStatus === 'done',
                        })}
                    >
                        <div className={cx('icon')}>
                            <PaymentIcon />
                        </div>
                        <div className={cx('text')}>Đơn hàng đã thanh toán ({formatPrice(data?.totalPrice)})</div>
                    </div>
                    <div
                        className={cx('item', {
                            success: data?.allStatus === 'done',
                        })}
                    >
                        <div className={cx('icon')}>
                            <ReceiveIcon />
                        </div>
                        <div className={cx('text')}>Đã nhận được hàng</div>
                    </div>
                    <div
                        className={cx('item', {
                            success: data?.allStatus === 'done' && areAllProductsReviewed(),
                        })}
                    >
                        <div className={cx('icon')}>
                            <ReviewIcon />
                        </div>
                        <div className={cx('text')}>Đơn hàng đã được đánh giá</div>
                    </div>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('products')}>
                    {data?.items?.map((item, index) => {
                        const productReview = findReviewForProduct(item?.productId?._id);
                        return (
                            <>
                                <div className={cx('item')} key={index}>
                                    <Link
                                        to={`/product/${item?.productId?._id}`}
                                        onClick={() => addProductToRecent(item?.productId)}
                                    >
                                        <img src={item?.productId?.files?.photos[0]} alt="Image" />
                                    </Link>
                                    <div className={cx('info-item')}>
                                        <h4>
                                            <Link
                                                to={`/product/${item?.productId?._id}`}
                                                onClick={() => addProductToRecent(item?.productId)}
                                            >
                                                {item?.productId?.name}
                                            </Link>
                                            <span>(x{item?.quantity})</span>
                                        </h4>
                                    </div>
                                    <div className={cx('status-text')}>
                                        <div>{formatPrice(data?.totalPrice)}</div>
                                        <p>
                                            Trạng thái: <span>{getStatus(item)}</span>
                                        </p>
                                    </div>
                                </div>
                                {!myShop && (
                                    <div className={cx('control')} key={index}>
                                        {data?.allStatus === 'done' &&
                                            (!productReview ? (
                                                <div
                                                    className={cx('btn-review')}
                                                    onClick={() => {
                                                        setShowReview(true);
                                                        setProductReview(item?.productId);
                                                    }}
                                                >
                                                    Đánh giá
                                                </div>
                                            ) : (
                                                <RatingStar rating={productReview?.rating} />
                                            ))}
                                        <div className={cx('contact')}>Liên hệ người bán</div>
                                    </div>
                                )}
                            </>
                        );
                    })}
                </div>
                <div className={cx('bill-address')}>
                    <p>Mã đơn hàng: {data?._id}</p>
                    <div className={cx('bill')}>
                        <div>
                            <div>Tổng tiền hàng</div>
                            <div className={cx('money')}>{formatPrice(data?.totalPrice - data?.shippingCost)}</div>
                        </div>
                        <div>
                            <div>Phí vận chuyển</div>
                            <div className={cx('money')}>{formatPrice(data?.shippingCost)}</div>
                        </div>
                        <div>
                            <div>Thành tiền</div>
                            <div className={cx('money')}>{formatPrice(data?.totalPrice)}</div>
                        </div>
                        <div>
                            <div>
                                <GuaranteeIcon />
                                Phương thức thanh toán
                            </div>
                            <div className={cx('payment-method')}>
                                {data?.paymentMethod === 'cash_on_delivery' ? 'Thanh toán khi nhận hàng' : 'Ví điện tử'}
                            </div>
                        </div>
                    </div>
                    <p>Địa chỉ nhận hàng</p>
                    <div className={cx('address')}>
                        <div>{data?.shippingAddress?.recipientName}</div>
                        <div>{data?.shippingAddress?.recipientPhone}</div>
                        <div>{`${data?.shippingAddress?.specificAddress}, ${data?.shippingAddress?.address}`}</div>
                    </div>
                </div>
            </div>
        </WrapperModel>
    );
}

export default ModelOrderDetail;
