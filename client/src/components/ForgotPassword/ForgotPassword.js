import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ForgotPassword.module.scss';

import WrapperModel from '../WrapperModel';
import images from '~/assets/images';
import BoxInput from '../BoxInput';
import Button from '../Button';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

function ForgotPassword({ show, onClose, email }) {
    const [inputEmail, setInputEmail] = useState(email);
    const [focused, setFocused] = useState(false);
    const [statusEmail, setStatusEmail] = useState(false);

    const { handleSendEmail } = useContext(AuthContext);

    useEffect(() => {
        if (inputEmail) {
            setFocused(true);
        }
    }, [inputEmail]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendEmail(inputEmail, setStatusEmail);
        }
    };

    return (
        <WrapperModel show={show} onClose={onClose} classIcon={cx('icon-close')}>
            <div className={cx('wrapper')}>
                {!statusEmail ? (
                    <div className={cx('send-email')}>
                        <img src={images.forgot_password_image} alt="Forgot password" className={cx('image')} />
                        <p className={cx('title')}>Quên mật khẩu?</p>
                        <p className={cx('des')}>
                            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu của
                            bạn
                        </p>
                        <BoxInput
                            value={inputEmail}
                            onChange={(e) => setInputEmail(e.target.value)}
                            label="Nhập email"
                            email
                            onFocus={focused}
                            onKeyPress={(e) => handleKeyPress(e)}
                        />
                        <Button onClick={() => handleSendEmail(inputEmail, setStatusEmail)}>Gửi email</Button>
                    </div>
                ) : (
                    <div className={cx('send-success')}>
                        <img src={images.check_email_image} alt="Check email" className={cx('image')} />
                        <p className={cx('title')}>Kiểm tra email của bạn!</p>
                        <p className={cx('des')}>Chúng tôi vừa gửi cho bạn email hướng dẫn đặt lại mật khẩu</p>
                        <p className={cx('help-contact')}>
                            Đối với bất kỳ câu hỏi về vấn đề xin vui lòng gửi email cho chúng tôi tại
                        </p>
                        <p className={cx('email-contact')}>duyth.22it@vku.udn.vn</p>
                    </div>
                )}
            </div>
        </WrapperModel>
    );
}

export default ForgotPassword;
