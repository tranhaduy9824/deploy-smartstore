import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Signup.module.scss';

import images from '~/assets/images';
import BoxInput from '~/components/BoxInput';
import Button from '~/components/Button';
import WrapperAnimation from '~/components/WrapperAnimation';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

function Signup() {
    const [show, setShow] = useState(true);
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(null);

    const { handleSignUp } = useContext(AuthContext);

    const handleNavLinkClick = (e) => {
        setShow(false);
        e.preventDefault();
        setTimeout(() => {
            navigate('/login', { state: { animation: 'inFromRight' } });
        }, 500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignUp(fullname, email, password, confirmPassword, setShow);
        }
    };

    return (
        <WrapperAnimation inFromLeft outToLeft show={show} className={cx('wrapper-animation')}>
            <div className={cx('wrapper')}>
                <div className={cx('box-content')}>
                    <div className={cx('content')}>
                        <div className={cx('box-signup')}>
                            <p className={cx('title')}>Đăng ký</p>
                            <BoxInput
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e)}
                                label="Họ và tên"
                                className={cx('input')}
                            />
                            <BoxInput
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e)}
                                label="Email"
                                className={cx('input')}
                                email
                            />
                            <BoxInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e)}
                                label="Mật khẩu"
                                className={cx('input')}
                                isPassword
                            />
                            <BoxInput
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e)}
                                label="Xác nhận mật khẩu"
                                className={cx('input')}
                                isPassword
                            />
                            <Button onClick={() => handleSignUp(fullname, email, password, confirmPassword, setShow)}>
                                Đăng ký
                            </Button>
                            <div className={cx('to-login')}>
                                <p>
                                    Bạn đã có tài khoản?{' '}
                                    <NavLink onClick={handleNavLinkClick} to="/login" className={cx('login')}>
                                        Đăng nhập
                                    </NavLink>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('background-signup')}>
                        <img src={images.signup_image} alt="Background signup" />
                    </div>
                </div>
            </div>
        </WrapperAnimation>
    );
}

export default Signup;
