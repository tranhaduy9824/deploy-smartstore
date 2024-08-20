import classNames from 'classnames/bind';
import styles from './AddressItem.module.scss';
import { useContext } from 'react';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

function AddressItem({ data, onUpdate, className, payPage }) {
    const { handleUpdate } = useContext(AuthContext);

    return (
        <div className={cx('wrapper', { [className]: className })}>
            <div className={cx('box-left')}>
                <div className={cx('info-user')}>
                    <span className={cx('name')}>{data.fullname}</span>
                    <span className={cx('phone-number')}>| {data.phone}</span>
                </div>
                <div className={cx('info-address')}>
                    <p>{data.address}</p>
                    <p>{data.specificAddress}</p>
                </div>
                {data.isDefault && <div className={cx('default-address')}>Mặc định</div>}
            </div>
            <div className={cx('box-right')}>
                <div className={cx('action-text')}>
                    <div
                        onClick={(e) => {
                            onUpdate(data);
                            e.stopPropagation();
                        }}
                    >
                        Cập nhập
                    </div>
                    {!payPage && <div onClick={() => handleUpdate({ addressId: data._id })}>Xóa</div>}
                </div>
                {!payPage && !data.isDefault && (
                    <div
                        className={cx('change-default')}
                        onClick={() => {
                            handleUpdate({ setDefault: true, addressId: data._id });
                        }}
                    >
                        Thiết lập mặc định
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddressItem;
