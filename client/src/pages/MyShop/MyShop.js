/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import styles from './MyShop.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '~/context/AuthContext';
import { ShopContext } from '~/context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '~/context/ProductContext';
import InfoShop from '~/components/InfoShop';
import Overview from './Overview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import EditShop from './EditShop';
import ManageOrder from './ManageOrder';
import ManageProduct from './ManageProduct';
import ManageReview from './ManageReview';
import Balance from './Balance';
import { OrderContext } from '~/context/OrderContext';

const cx = classNames.bind(styles);

function MyShop() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [showManageOrder, setShowManageOrder] = useState(true);
    const [showCustomerCare, setShowCustomerCare] = useState(true);
    const [content, setContent] = useState('overview');
    const [orderStatus, setOrderStatus] = useState('all');

    const { user } = useContext(AuthContext);
    const { myShop, getMyShop } = useContext(ShopContext);
    const { productsShop, getProductsMyShop } = useContext(ProductContext);
    const { ordersShop, getOrdersShop } = useContext(OrderContext);

    useEffect(() => {
        const fetchMyShop = async () => {
            try {
                if (user && myShop?._id !== prevMyShopId.current) {
                    prevMyShopId.current = myShop?._id;
                    await getMyShop(user.token);
                    await getOrdersShop(user.token);
                    await getProductsMyShop(user?.token);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching my shop:', error);
                setIsLoading(false);
            }
        };

        fetchMyShop();

        return () => {
            window.scrollTo(0, 0);
        };
    }, [user, getMyShop, getProductsMyShop, myShop]);

    const prevMyShopId = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!myShop && !isLoading) {
        navigate('/');
        return null;
    }

    return (
        <div className={cx('wrapper')}>
            <InfoShop avatar={user?.user?.avatar} productShop={productsShop} shop={myShop} myShop />
            <div className={cx('box-content')}>
                <div className={cx('controls')}>
                    <ul>
                        <li className={cx({ selected: content === 'overview' })} onClick={() => setContent('overview')}>
                            Tổng quan
                        </li>
                        <li
                            className={cx({ selected: content === 'edit-shop' })}
                            onClick={() => setContent('edit-shop')}
                        >
                            Sửa thông tin
                        </li>
                        <li
                            className={cx({ selected: content === 'manage-order' })}
                            onClick={() => setShowManageOrder(!showManageOrder)}
                        >
                            Quản lý đơn hàng
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                className={cx('right-icon', { isShow: showManageOrder })}
                            />
                        </li>
                        <ul className={cx({ isShow: showManageOrder })}>
                            <li className={cx('level-2')} onClick={() => setContent('manage-order')}>
                                Tất cả
                            </li>
                            <li
                                className={cx('level-2')}
                                onClick={() => {
                                    setOrderStatus('cancelled');
                                    setContent('manage-order');
                                }}
                            >
                                Đã hủy
                            </li>
                            <li className={cx('level-2')}>Cài đặt vận chuyển</li>
                        </ul>
                        <li
                            className={cx({ selected: content === 'manage-product' })}
                            onClick={() => setContent('manage-product')}
                        >
                            Quản lý sản phẩm
                        </li>
                        <li
                            className={cx({ selected: content === 'manage-review' })}
                            onClick={() => setShowCustomerCare(!showCustomerCare)}
                        >
                            Chăm sóc khánh hàng
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                className={cx('right-icon', { isShow: showCustomerCare })}
                            />
                        </li>
                        <ul className={cx({ isShow: showCustomerCare })}>
                            <li className={cx('level-2')}>Quản lý Chat</li>
                            <li className={cx('level-2')} onClick={() => setContent('manage-review')}>
                                Quản lý đánh giá
                            </li>
                        </ul>
                        <li className={cx({ selected: content === 'balance' })} onClick={() => setContent('balance')}>
                            Số dư
                        </li>
                    </ul>
                </div>
                <div className={cx('content')}>
                    {content === 'overview' && (
                        <Overview
                            productsShop={productsShop}
                            ordersShop={ordersShop}
                            myShop={myShop}
                            setOrderStatus={setOrderStatus}
                            setContent={setContent}
                        />
                    )}
                    {content === 'edit-shop' && <EditShop myShop={myShop} />}
                    {content === 'manage-order' && (
                        <ManageOrder myShop={myShop} ordersShop={ordersShop} orderStatus={orderStatus} />
                    )}
                    {content === 'manage-product' && <ManageProduct productsShop={productsShop} />}
                    {content === 'manage-review' && <ManageReview myShop={myShop} ordersShop={ordersShop} />}
                    {content === 'balance' && <Balance ordersShop={ordersShop} />}
                </div>
            </div>
        </div>
    );
}

export default MyShop;
