import { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showAlert } from '~/redux/actions/alert';
import { getRequest } from '~/utils/services';

export const CategoryContext = createContext();

export const CategoryContextProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [categories, setCategories] = useState();

    const getAllCategory = useCallback(async () => {
        try {
            const response = await getRequest('/category');
            setCategories(response.categories);
        } catch (error) {
            console.log(error);
            dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
        }
    }, [dispatch]);

    useEffect(() => {
        getAllCategory();
    }, []);

    return (
        <CategoryContext.Provider
            value={{
                categories,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};
