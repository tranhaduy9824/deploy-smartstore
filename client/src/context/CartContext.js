/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showAlert } from '~/redux/actions/alert';
import { deleteRequest, getRequest, patchRequest, postRequest } from '~/utils/services';
import { AuthContext } from './AuthContext';
import { hideLoading, showLoading } from '~/redux/actions/loading';

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [cart, setCart] = useState();
    const [deletingItemId, setDeletingItemId] = useState(null);

    const { user } = useContext(AuthContext);

    const getCart = useCallback(
        async (token = user.token) => {
            try {
                const response = await getRequest('/carts', {}, token);
                setCart(response.cart);
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [user, dispatch],
    );

    const addCart = useCallback(
        async (data) => {
            try {
                dispatch(showLoading());
                await postRequest('/carts', data, user.token);
                dispatch(hideLoading());
                dispatch(showAlert('Thêm giỏ hàng thành công'));
                getCart();
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [user, dispatch],
    );

    const deleteItemToCart = useCallback(
        async (productId) => {
            try {
                setDeletingItemId(productId);
                await deleteRequest('/carts', { productId: productId }, user.token);
                await getCart();
                setDeletingItemId(null);
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [user, dispatch],
    );

    const updateCartItemQuantity = useCallback(async (productId, quantity, token) => {
        try {
            await patchRequest('/carts', { productId: productId, quantity: quantity }, token);
            await getCart(token);
        } catch (error) {
            console.log(error);
            dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
        }
    }, []);

    useEffect(() => {
        if (user && user.token) {
            getCart();
        }
    }, [user, getCart]);

    return (
        <CartContext.Provider
            value={{ cart, setCart, getCart, addCart, deleteItemToCart, deletingItemId, updateCartItemQuantity }}
        >
            {children}
        </CartContext.Provider>
    );
};
