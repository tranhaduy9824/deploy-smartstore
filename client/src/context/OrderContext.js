import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideAlert, showAlert } from '~/redux/actions/alert';
import { getRequest, patchRequest, postRequest } from '~/utils/services';
import { AuthContext } from './AuthContext';
import { hideLoading, showLoading } from '~/redux/actions/loading';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const OrderContext = createContext();

export const OrderContextProvider = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [ordersShop, setOrdersShop] = useState([]);
    const [changeItemId, setChangeItemId] = useState(null);

    const { user } = useContext(AuthContext);

    const [searchParams] = useSearchParams();

    const createPayment = useCallback(
        async (amount, orderId, token = user?.token) => {
            try {
                const payment = await postRequest(
                    '/payment',
                    {
                        amount: amount,
                        orderId: orderId,
                    },
                    token,
                );
                window.location.href = payment.redirectUrl;
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch, user],
    );

    const createOrder = useCallback(
        async (data, token = user?.token) => {
            try {
                dispatch(showLoading());
                const response = await postRequest('/orders', data, token);
                dispatch(hideLoading());

                if (response.order.paymentMethod === 'cash_on_delivery') {
                    navigate('/profile');
                    dispatch(showAlert('Đặt hàng thành công!'));
                } else {
                    createPayment(response.order.totalPrice, response.order._id, token);
                }
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch, user, navigate, createPayment],
    );

    const getOrders = useCallback(
        async (token = user?.token) => {
            try {
                const response = await getRequest('/orders', {}, token);
                setOrders(response.orders);
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch, user],
    );

    const getOrdersShop = useCallback(
        async (token = user?.token) => {
            try {
                const response = await getRequest('/orders/shop', {}, token);
                setOrdersShop(response.orders);
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch, user],
    );

    const updateOrder = useCallback(
        async (data, token = user?.token, orderId) => {
            try {
                const isConfirm = await new Promise((resolve) => {
                    dispatch(showAlert('Bạn có chắc muốn cập nhật đơn hàng này?', resolve));
                });

                dispatch(hideAlert());
                if (isConfirm) {
                    setChangeItemId(orderId);
                    await patchRequest(`/orders/${orderId}`, data, token);
                    if (!data?.status) {
                        await getOrdersShop(token);
                        await getOrders(token);
                    } else {
                        await getOrdersShop(token);
                    }
                    setChangeItemId(null);
                }
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch, user, getOrders, getOrdersShop],
    );

    useEffect(() => {
        const handleVNPayReturn = async () => {
            try {
                const params = Object.fromEntries([...searchParams]);
                const response = await getRequest('/payment/vnpay_return', params);

                if (response.messageSuccess) {
                    navigate('/profile');
                    dispatch(showAlert('Thanh toán thành công!'));
                } else {
                    navigate('/profile');
                    dispatch(showAlert('Thanh toán không thành công!'));
                }
            } catch (error) {
                navigate('/profile');
                console.error('Lỗi xử lý phản hồi từ VNPay:', error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        };

        if (searchParams.size === 12) {
            handleVNPayReturn();
        }
    }, [searchParams, dispatch, user, navigate]);

    return (
        <OrderContext.Provider
            value={{
                changeItemId,
                createPayment,
                createOrder,
                orders,
                getOrders,
                updateOrder,
                ordersShop,
                getOrdersShop,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};
