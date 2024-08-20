// Balance.js
import classNames from 'classnames/bind';
import styles from './Balance.module.scss';
import { useEffect, useState } from 'react';
import { formatPrice } from '~/handle/formatPrice';

const cx = classNames.bind(styles);

function Balance({ ordersShop }) {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (ordersShop) {
            const initialBalance = ordersShop.reduce((acc, order) => {
                if (order.allStatus === 'done') {
                    return acc + order.totalPrice;
                }
                return acc;
            }, 0);

            setBalance(initialBalance);
        }
    }, [ordersShop]);

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Số dư</h2>
            <div className={cx('balance-content')}>
                <div className={cx('balance-amount')}>
                    <span className={cx('amount')}>{formatPrice(balance)}</span>
                </div>
                <button className={cx('withdraw-btn')}>Rút tiền</button>
            </div>
            <div className={cx('transaction-history')}>
                <h3 className={cx('history-title')}>Lịch sử giao dịch</h3>
                <table className={cx('transaction-table')}>
                    <thead>
                        <tr>
                            <th>Thời gian</th>
                            <th>Nội dung</th>
                            <th>Số tiền</th>
                            <th>Số dư</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2023-04-15 10:30</td>
                            <td>Bán hàng</td>
                            <td className={cx('positive')}>+1,000,000 đ</td>
                            <td>1,234,567 đ</td>
                        </tr>
                        <tr>
                            <td>2023-04-10 15:45</td>
                            <td>Rút tiền</td>
                            <td className={cx('negative')}>-500,000 đ</td>
                            <td>234,567 đ</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Balance;
