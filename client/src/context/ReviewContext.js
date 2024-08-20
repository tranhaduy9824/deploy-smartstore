/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useCallback, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showAlert } from '~/redux/actions/alert';
import { getRequest, postRequest } from '~/utils/services';
import { AuthContext } from './AuthContext';

export const ReviewContext = createContext();

export const ReviewContextProvider = ({ children }) => {
    const [review, setReview] = useState([]);
    const dispatch = useDispatch();

    const { user } = useContext(AuthContext);

    const createReview = useCallback(
        async (data, token = user?.token) => {
            try {
                await postRequest('/review', data, token);
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch, user],
    );

    const getReviewsByProductId = useCallback(
        async (productId) => {
            try {
                const response = await getRequest(`/review/${productId}`);
                return response.reviews;
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch],
    );

    const getReviewByOrder = useCallback(
        async (orderId, token = user?.token) => {
            try {
                const response = await getRequest(`/review/me/${orderId}`, {}, token);
                setReview((prevReviews) => {
                    const newReviews = response.review.filter((newReview) => {
                        return !prevReviews.some(
                            (existingReview) =>
                                existingReview.orderId === newReview.orderId &&
                                existingReview.productId === newReview.productId,
                        );
                    });
                    return [...prevReviews, ...newReviews];
                });
            } catch (error) {
                console.log(error);
            }
        },
        [user],
    );

    const getReviewsByShopId = useCallback(
        async (token = user?.token) => {
            try {
                const response = await getRequest('/review/my-shop', {}, token);
                return response.reviews;
            } catch (error) {
                console.log(error);
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch],
    );

    return (
        <ReviewContext.Provider
            value={{ review, setReview, getReviewsByProductId, createReview, getReviewByOrder, getReviewsByShopId }}
        >
            {children}
        </ReviewContext.Provider>
    );
};
