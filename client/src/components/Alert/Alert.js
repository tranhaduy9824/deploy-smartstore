import classNames from 'classnames/bind';
import styles from './Alert.module.scss';
import WrapperModel from '../WrapperModel';
import { useSelector, useDispatch } from 'react-redux';
import { hideAlert } from '~/redux/actions/alert';

const cx = classNames.bind(styles);

function Alert() {
    const { show, message, onConfirm } = useSelector((state) => state.alert);
    const dispatch = useDispatch();

    const onClose = () => {
        dispatch(hideAlert());
    };

    return (
        <WrapperModel show={show} onClose={onClose}>
            <div className={cx('wrapper')}>
                <div className={cx('title')}>
                    <span>Thông báo</span>
                </div>
                <p className={cx('message')}>{message}</p>
                {onConfirm && (
                    <div className={cx('actions')}>
                        <button className={cx('btn', 'confirm')} onClick={onConfirm}>
                            Xác nhận
                        </button>
                        <button className={cx('btn', 'cancel')} onClick={onClose}>
                            Hủy
                        </button>
                    </div>
                )}
            </div>
        </WrapperModel>
    );
}

export default Alert;
