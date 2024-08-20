import { useCallback, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '~/redux/actions/loading';
import { getRequest, patchRequest } from '~/utils/services';
import { showAlert } from '~/redux/actions/alert';
import { AuthContext } from './AuthContext';

const { createContext } = require('react');

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [shop, setShop] = useState(null);
    const [myShop, setMyShop] = useState(null);

    const { user } = useContext(AuthContext);

    const getShop = useCallback(
        async (id) => {
            try {
                dispatch(showLoading());
                const response = await getRequest(`/shop/${id}`);
                dispatch(hideLoading());
                setShop(response.shop);
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch],
    );

    const getMyShop = useCallback(
        async (token = user?.token) => {
            try {
                dispatch(showLoading());
                const response = await getRequest('/shop/my-shop', {}, token);
                dispatch(hideLoading());
                setMyShop(response.shop);
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch, user],
    );

    const updateMyShop = useCallback(
        async (id, data, token = user?.token) => {
            try {
                dispatch(showLoading());
                const response = await patchRequest(`/shop/${id}`, data, token);
                dispatch(hideLoading());
                dispatch(showAlert("Lưu thành công"))
                setMyShop(response.shop);
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch, user],
    );

    return (
        <ShopContext.Provider value={{ shop, setShop, getShop, myShop, getMyShop, updateMyShop }}>
            {children}
        </ShopContext.Provider>
    );
};
