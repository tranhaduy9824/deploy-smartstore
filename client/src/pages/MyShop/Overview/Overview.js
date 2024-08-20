import classNames from 'classnames/bind';
import styles from './Overview.module.scss';
import RevenueAnalysisChart from '../RevenueAnalysisChart';
import moment from 'moment';

const cx = classNames.bind(styles);

function Overview({ productsShop = [], ordersShop = [], myShop, setOrderStatus, setContent }) {
    const waitConfirmOrders = ordersShop.filter((order) =>
        order.items.some(
            (item) =>
                item.productId.shop.toString() === myShop?._id.toString() &&
                item.status === 'wait_confirm' &&
                order.allStatus !== 'cancelled' &&
                order.allStatus !== 'done',
        ),
    ).length;

    const deliveringOrders = ordersShop.filter((order) =>
        order.items.some(
            (item) =>
                item.productId.shop.toString() === myShop?._id.toString() &&
                item.status === 'delivering' &&
                order.allStatus !== 'done' &&
                order.allStatus !== 'cancelled',
        ),
    ).length;
    const doneOrders = ordersShop.filter((order) => order.allStatus === 'done').length;
    const cancelledOrders = ordersShop.filter((order) => order.allStatus === 'cancelled').length;

    const notApprovedProducts = productsShop.filter((product) => product.status === 'not approved').length;
    const outOfStockProducts = productsShop.filter((product) => !product.inStock).length;

    const revenueData = Array.from({ length: 14 }, (_, i) => {
        const day = moment().subtract(i, 'days').format('DD/MM');
        return { day, revenue: 0 };
    }).reverse();

    ordersShop
        .filter((order) => order.allStatus === 'done')
        .forEach((order) => {
            const orderDate = moment(order.updatedAt).format('DD/MM');
            const revenueDay = revenueData.find((item) => item.day === orderDate);
            if (revenueDay) {
                revenueDay.revenue += order.totalPrice;
            }
        });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('need-do')}>
                <p className={cx('title')}>Danh sách cần làm</p>
                <p>Những việc bạn sẽ phải làm</p>
                <div className={cx('list')}>
                    <div
                        className={cx('item')}
                        onClick={() => {
                            setContent('manage-order');
                            setOrderStatus('wait_confirm');
                        }}
                    >
                        <p>{waitConfirmOrders}</p>
                        <p>Chờ xác nhận</p>
                    </div>
                    <div
                        className={cx('item')}
                        onClick={() => {
                            setContent('manage-order');
                            setOrderStatus('delivering');
                        }}
                    >
                        <p>{deliveringOrders}</p>
                        <p>Đang vận chuyển</p>
                    </div>
                    <div
                        className={cx('item')}
                        onClick={() => {
                            setContent('manage-order');
                            setOrderStatus('done');
                        }}
                    >
                        <p>{doneOrders}</p>
                        <p>Hoàn thành</p>
                    </div>
                    <div
                        className={cx('item')}
                        onClick={() => {
                            setContent('manage-order');
                            setOrderStatus('cancelled');
                        }}
                    >
                        <p>{cancelledOrders}</p>
                        <p>Đã hủy</p>
                    </div>
                    <div className={cx('item')}>
                        <p>0</p>
                        <p>Hoàn tiền</p>
                    </div>
                    <div className={cx('item')}>
                        <p>{notApprovedProducts}</p>
                        <p>Sản phẩm chờ xác nhận</p>
                    </div>
                    <div className={cx('item')}>
                        <p>{outOfStockProducts}</p>
                        <p>Sản phẩm hết hàng</p>
                    </div>
                </div>
            </div>
            <div className={cx('revenue-analysis')}>
                <p className={cx('title')}>Phân tích doanh thu</p>
                <p>Tổng quan doanh thu của shop đối với đơn hàng đã hoàn thành</p>
                <RevenueAnalysisChart revenueData={revenueData} />
            </div>
        </div>
    );
}

export default Overview;
