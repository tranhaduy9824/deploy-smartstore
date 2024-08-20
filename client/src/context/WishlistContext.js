import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showAlert } from '~/redux/actions/alert';
import { deleteRequest, getRequest, postRequest } from '~/utils/services';
import { AuthContext } from './AuthContext';
import { hideLoading, showLoading } from '~/redux/actions/loading';

export const WishlistContext = createContext();

export const WishlistContextProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [wishlist, setWishlist] = useState({});

    const { user } = useContext(AuthContext);

    const getWishlist = useCallback(
        async (token = user.token) => {
            try {
                const response = await getRequest('/wishlist', {}, token);
                setWishlist(response.wishlist);
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch, user],
    );

    const addWishlist = useCallback(
        async (productId, token = user.token) => {
            try {
                await postRequest('/wishlist', { productId: productId }, token);
                await getWishlist(token);
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Vui lòng đăng nhập'));
            }
        },
        [dispatch, user, getWishlist],
    );

    const removeWishlist = useCallback(
        async (productId, token = user.token) => {
            try {
                await deleteRequest('/wishlist', { productId: productId }, token);
                await getWishlist(token);
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Vui lòng đăng nhập'));
            }
        },
        [dispatch, user, getWishlist],
    );

    useEffect(() => {
        if (user) {
            getWishlist(user.token);
        } else {
            setWishlist({});
        }
    }, [user, getWishlist]);

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                getWishlist,
                addWishlist,
                removeWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
