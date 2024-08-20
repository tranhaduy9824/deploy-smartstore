import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ResetPassword.module.scss';
import BoxInput from '~/components/BoxInput';
import Button from '~/components/Button';
import WrapperAnimation from '~/components/WrapperAnimation';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

function ResetPassword() {
    const [show, setShow] = useState(true);
    const { id, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { handleReset } = useContext(AuthContext);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleReset(id, token, password, confirmPassword, setShow);
        }
    };

    return (
        <WrapperAnimation show={show} showItem hiddenItem>
            <div className={cx('wrapper')}>
                <p className={cx('title')}>Đặt lại mật khẩu</p>
                <p className={cx('des')}>Nhập mật khẩu mới bên dưới để thay đổi mật khẩu của bạn</p>
                <BoxInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isPassword
                    label="Mật khẩu mới"
                    onKeyPress={(e) => handleKeyPress(e)}
                />
                <BoxInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isPassword
                    label="Xác nhận mật khẩu mới"
                    onKeyPress={(e) => handleKeyPress(e)}
                />
                <Button onClick={() => handleReset(id, token, password, confirmPassword, setShow)}>
                    Đặt lại mật khẩu
                </Button>
            </div>
        </WrapperAnimation>
    );
}

export default ResetPassword;
