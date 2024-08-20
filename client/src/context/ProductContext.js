/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideAlert, showAlert } from '~/redux/actions/alert';
import { hideLoading, showLoading } from '~/redux/actions/loading';
import { deleteRequest, getRequest, patchRequest, postRequest } from '~/utils/services';
import { AuthContext } from './AuthContext';

export const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [productsShop, setProductsShop] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [recommendProducts, setRecommendProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [notFound, setNotFound] = useState(false);

    const { user } = useContext(AuthContext);

    const getProduct = useCallback(
        async (id) => {
            try {
                dispatch(showLoading());
                const response = await getRequest(`/products/${id}`);
                dispatch(hideLoading());
                setProduct(response.data);
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch],
    );

    const getProducts = useCallback(
        async (data) => {
            try {
                dispatch(showLoading());
                const response = await getRequest('/products/', data);
                dispatch(hideLoading());
                setProducts(response.data.products);
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch],
    );

    const searchProduct = useCallback(
        async (data, setShowLoading) => {
            try {
                setShowLoading(true);
                const response = await getRequest('/products/search', data);
                setShowLoading(false);
                if (response.products.length === 0) {
                    setSearchResult([]);
                    setNotFound(true);
                } else {
                    setSearchResult(response.products);
                    setNotFound(false);
                }
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch],
    );

    const getNewProducts = useCallback(async () => {
        try {
            dispatch(showLoading());
            const response = await getRequest('/products/new');
            dispatch(hideLoading());
            setNewProducts(response.products);
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
            dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
        }
    }, [dispatch]);

    const getSaleProducts = useCallback(async () => {
        try {
            dispatch(showLoading());
            const response = await getRequest('/products/sale');
            dispatch(hideLoading());
            setSaleProducts(response.products);
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
            dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
        }
    }, [dispatch]);

    const getRecommendProducts = useCallback(async () => {
        try {
            dispatch(showLoading());
            const response = await getRequest('/products/recommend', {}, user ? user.token : null);
            dispatch(hideLoading());
            setRecommendProducts(response.products);
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
            dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
        }
    }, [dispatch, user]);

    const getProductsByShop = useCallback(async (id) => {
        try {
            const response = await getRequest(`/products/shop/${id}`);
            return response.products;
        } catch (error) {
            console.log(error);
            dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
        }
    }, []);

    const getProductsMyShop = useCallback(async (token = user?.token) => {
        try {
            const response = await getRequest('/products/my-shop', {}, token);
            setProductsShop(response.products);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const addProductToRecent = useCallback(
        (product) => {
            const recentProducts = JSON.parse(localStorage.getItem('recentProducts')) || [];

            const updatedRecentProducts = recentProducts.filter((p) => p.id !== product?._id);

            updatedRecentProducts.unshift({
                id: product?._id,
                imageUrl: product?.files?.photos[0] || product?.imageUrl,
            });

            if (updatedRecentProducts.length > 10) {
                updatedRecentProducts.pop();
            }

            localStorage.setItem('recentProducts', JSON.stringify(updatedRecentProducts));
            setRecentProducts(updatedRecentProducts);
        },
        [setRecentProducts],
    );

    const getRecentProducts = useCallback(() => {
        const storedRecentProducts = JSON.parse(localStorage.getItem('recentProducts')) || [];
        if (JSON.stringify(storedRecentProducts) !== JSON.stringify(recentProducts)) {
            setRecentProducts(storedRecentProducts);
        }
    }, [recentProducts]);

    const updateProduct = useCallback(
        async (productId, body, token = user?.token) => {
            try {
                const isConfirm = await new Promise((resolve) => {
                    dispatch(showAlert('Bạn có chắc muốn cập nhật sản phẩm này?', resolve));
                });

                dispatch(hideAlert());
                if (isConfirm) {
                    dispatch(showLoading());
                    await patchRequest(`/products/${productId}`, body, token, true);
                    await getProductsMyShop(token);
                    dispatch(hideLoading());
                    dispatch(showAlert('Cập nhập sản phẩm thành công'));
                }
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch],
    );

    const addProduct = useCallback(
        async (body, token = user?.token) => {
            try {
                const isConfirm = await new Promise((resolve) => {
                    dispatch(showAlert('Bạn có chắc muốn tạo sản phẩm này?', resolve));
                });

                dispatch(hideAlert());
                if (isConfirm) {
                    dispatch(showLoading());
                    await postRequest('/products/', body, token, true);
                    await getProductsMyShop(token);
                    dispatch(hideLoading);
                    dispatch(showAlert('Thêm sản phẩm thành công'));
                }
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
            }
        },
        [dispatch],
    );

    const deleteProduct = useCallback(
        async (id, token = user?.token) => {
            try {
                const isConfirm = await new Promise((resolve) => {
                    dispatch(showAlert('Bạn có chắc muốn xóa sản phẩm này?', resolve));
                });

                dispatch(hideAlert());
                if (isConfirm) {
                    dispatch(showLoading());
                    await deleteRequest(`/products/${id}`, {}, token);
                    await getProductsMyShop(token);
                    dispatch(hideLoading);
                    dispatch(showAlert('Xóa sản phẩm thành công'));
                }
            } catch (error) {
                console.log(error);
                dispatch(hideLoading());
            }
        },
        [dispatch],
    );

    useEffect(() => {
        getNewProducts();
        getSaleProducts();
    }, []);

    useEffect(() => {
        getRecommendProducts();
    }, [user]);

    return (
        <ProductContext.Provider
            value={{
                searchResult,
                setSearchResult,
                searchProduct,
                notFound,
                setNotFound,
                product,
                setProduct,
                getProduct,
                products,
                setProducts,
                getProducts,
                newProducts,
                getNewProducts,
                saleProducts,
                getSaleProducts,
                recommendProducts,
                getRecommendProducts,
                getProductsByShop,
                recentProducts,
                addProductToRecent,
                getRecentProducts,
                updateProduct,
                getProductsMyShop,
                productsShop,
                addProduct,
                deleteProduct
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
