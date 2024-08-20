/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useCallback, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { useDispatch } from 'react-redux';

import { hideAlert, showAlert } from '~/redux/actions/alert';
import { hideLoading, showLoading } from '~/redux/actions/loading';
import { getRequest, postRequest } from '~/utils/services';
import { useNavigate } from 'react-router-dom';
import { handleValidation } from '~/handle/handleValidation';

export const AuthContext = createContext();

const vietnamesePhoneRegex = /^(0|[\+84|84])(3[2-9]|5[689]|7[06-9]|8[1-6]|9[0-4,6-9])[0-9]{7}$/;
const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate(null);
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    useEffect(() => {
        const user = sessionStorage.getItem('User');

        setUser(JSON.parse(user));
    }, []);

    // Login
    const handleLogin = useCallback(
        async (email, password, rememberMe, navigateHome) => {
            if (!email || !password) {
                dispatch(showAlert('Email và mật khẩu là bắt buộc!'));
                return;
            }

            const authData = {
                email: email,
                password: password,
            };

            try {
                dispatch(showLoading());
                const data = await postRequest('/users/login', authData);
                sessionStorage.setItem('User', JSON.stringify(data));

                if (rememberMe) {
                    const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
                    localStorage.setItem('rememberedEmail', email);
                    localStorage.setItem('rememberedPassword', encryptedPassword);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                }

                setUser(data);
                dispatch(hideLoading());
                dispatch(showAlert('Đăng nhập thành công!'));
                navigateHome();
            } catch (error) {
                dispatch(hideLoading());
                dispatch(showAlert('Email hoặc mật khẩu không đúng!'));
            }
        },
        [dispatch, secretKey],
    );

    const handleLoginFacebook = useCallback(
        async (data, navigateHome) => {
            const { name, email } = data;
            const avatar = data.picture.data.url;

            const fbUserData = {
                email,
                name,
                avatar,
            };

            try {
                dispatch(showLoading());
                const data = await postRequest('/users/facebook-login', fbUserData);
                sessionStorage.setItem('User', JSON.stringify(data));

                setUser(data);
                dispatch(hideLoading());
                dispatch(showAlert('Đăng nhập thành công!'));
                navigateHome();
            } catch (error) {
                dispatch(hideLoading());
                dispatch(showAlert(error.toString()));
            }
        },
        [dispatch],
    );

    const handleLoginGoogle = useCallback(
        async (data, navigateHome) => {
            const { name, email } = data;

            const ggUserData = {
                email,
                name,
            };

            try {
                dispatch(showLoading());
                const data = await postRequest('/users/google-login', ggUserData);
                sessionStorage.setItem('User', JSON.stringify(data));

                setUser(data);
                dispatch(hideLoading());
                dispatch(showAlert('Đăng nhập thành công!'));
                navigateHome();
            } catch (error) {
                dispatch(hideLoading());
                dispatch(showAlert(error.toString()));
            }
        },
        [dispatch],
    );

    // Signup
    const handleSignUp = useCallback(
        async (fullname, email, password, confirmPassword, setShow) => {
            const userData = {
                fullname,
                email,
                password,
            };

            try {
                if (handleValidation(fullname, email, password, confirmPassword, dispatch)) {
                    dispatch(showLoading());
                    await postRequest('/users/signup', userData);
                    dispatch(hideLoading());
                    dispatch(showAlert('Đăng ký thành công!'));
                    setTimeout(() => {
                        dispatch(hideAlert());
                        setShow(false);
                        setTimeout(() => {
                            navigate('/login', { state: { animation: 'inFromRight' } });
                        }, 500);
                    }, 1000);
                }
            } catch (error) {
                dispatch(hideLoading());
                if (error.response && error.response.status === 409) {
                    dispatch(showAlert('Email đã tồn tại!'));
                } else {
                    dispatch(showAlert('Điền đầy đủ thông tin!'));
                }
            }
        },
        [dispatch, navigate],
    );

    // Forgot password
    const handleSendEmail = useCallback(
        async (email, setStatusEmail) => {
            try {
                dispatch(showLoading());
                await postRequest('/users/forgot-password', { email });
                dispatch(hideLoading());
                setStatusEmail(true);
            } catch (error) {
                dispatch(hideLoading());
                dispatch(showAlert('Người dùng không tồn tại!'));
            }
        },
        [dispatch],
    );

    // Reset password
    const handleReset = useCallback(
        async (id, token, password, confirmPassword, setShow) => {
            try {
                if (handleValidation('Default Name', 'default@example.com', password, confirmPassword, dispatch)) {
                    dispatch(showLoading());
                    await postRequest(`/users/reset-password/${id}/${token}`, { password });
                    dispatch(hideLoading());
                    dispatch(showAlert('Đặt lại mật khẩu thành công!'));
                    setTimeout(() => {
                        dispatch(hideAlert());
                        setShow(false);
                        setTimeout(() => {
                            navigate('/login', { state: { animation: 'showItem' } });
                        }, 500);
                    }, 1000);
                }
            } catch (error) {
                dispatch(hideLoading());
                dispatch(showAlert('Mã thông báo đã hết hạn!'));
            }
        },
        [dispatch, navigate],
    );

    // Log out
    const handleLogout = useCallback(() => {
        sessionStorage.removeItem('User');
        setUser(null);
        navigate('/');
    }, []);

    // Update info
    const handleUpdate = useCallback(
        async (data) => {
            try {
                if (data.avatar || data.password || data.address) dispatch(showLoading());
                const response = await postRequest('/users/update-user', data, user.token, data.avatar !== undefined);
                if (data.avatar || data.password || data.address) dispatch(hideLoading());
                if (data.password) dispatch(showAlert('Đổi mật khẩu thành công'));

                const updatedUser = {
                    ...user,
                    message: response.message,
                    user: response.user,
                };

                setUser(updatedUser);
                sessionStorage.setItem('User', JSON.stringify(updatedUser));
            } catch (error) {
                console.log(error);
                if (data.email && !emailRegex.test(data.email)) {
                    dispatch(showAlert('Email không đúng định dạng!'));
                } else if (data.phone && !vietnamesePhoneRegex.test(data.phone)) {
                    dispatch(showAlert('Số điện thoại không đúng định dạng!'));
                } else if (data.avatar) {
                    dispatch(hideLoading());
                    dispatch(showAlert('Không đúng định dạng hình ảnh!'));
                } else if (data.address) {
                    dispatch(hideLoading());
                    dispatch(showAlert('Vui lòng điền đủ thông tin!'));
                } else {
                    dispatch(showAlert('Hết thời gian, vui lòng đăng nhập lại!'));
                }
            }
        },
        [dispatch, user],
    );

    const getUserById = useCallback(
        async (id) => {
            try {
                const response = await getRequest(`/users/${id}`);
                return response.user;
            } catch (error) {
                dispatch(showAlert('Đã xảy ra lỗi, vui lòng thử lại sau'));
            }
        },
        [dispatch],
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                handleLogin,
                handleLoginFacebook,
                handleLoginGoogle,
                handleSignUp,
                handleSendEmail,
                handleReset,
                handleLogout,
                handleUpdate,
                getUserById,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
