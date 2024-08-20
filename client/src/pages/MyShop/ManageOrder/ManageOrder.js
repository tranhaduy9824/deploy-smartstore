import classNames from 'classnames/bind';
import styles from './ManageOrder.module.scss';
import { useState } from 'react';
import WrapperHover from '~/components/WrapperHover';
import { BillIcon, DownIcon } from '~/components/Icons';
import OrderItem from '~/components/OrderItem';
import HeaderSelect from '~/components/HeaderSelect/HeaderSelect';

const cx = classNames.bind(styles);

function ManageOrder({ myShop, ordersShop, orderStatus }) {
    const [contentSelected, setContentSelected] = useState(orderStatus || 'all');
    const [selectedSearch, setSelectedSearch] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const listHeader = [
        { content: 'all', title: 'Tất cả' },
        { content: 'wait_confirm', title: 'Chờ xác nhận' },
        { content: 'delivering', title: 'Đang vận chuyển' },
        { content: 'done', title: 'Hoàn thành' },
        { content: 'cancelled', title: 'Đã hủy' },
    ];

    const listSearch = ['Mã đơn hàng', 'Tên người mua', 'Sản phẩm'];

    const filteredOrders =
        ordersShop?.filter((order) => {
            const isStatusMatch = contentSelected === 'all' || order?.allStatus === contentSelected;

            const isSearchMatch = (() => {
                const query = searchQuery.toLowerCase();
                switch (selectedSearch) {
                    case 0:
                        return order?._id?.toString().toLowerCase().includes(query);
                    case 1:
                        return order?.shippingAddress?.recipientName?.toLowerCase().includes(query);
                    case 2:
                        return order?.items?.some((item) => item?.productId?.name?.toLowerCase().includes(query));
                    default:
                        return false;
                }
            })();

            return isStatusMatch && isSearchMatch;
        }) || [];

    return (
        <div className={cx('wrapper')}>
            <p className={cx('title')}>Quản lý đơn hàng</p>
            <div className={cx('content')}>
                <HeaderSelect
                    listHeader={listHeader}
                    contentSelected={contentSelected}
                    setContentSelected={setContentSelected}
                />
                <div className={cx('search-order')}>
                    <WrapperHover
                        noIcon
                        content={listSearch}
                        onClick={(index) => setSelectedSearch(index)}
                        classNameContent={cx('wrapper-list-search')}
                        className={cx('list-search')}
                    >
                        <div className={cx('search')}>
                            <span className={cx('search-current')}>{listSearch[selectedSearch]}</span>
                            <DownIcon />
                        </div>
                    </WrapperHover>
                    <input
                        placeholder={`Nhập ${listSearch[selectedSearch]}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={cx('order')}>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => (
                            <OrderItem
                                data={order}
                                key={index}
                                myShop
                                status={contentSelected}
                                hasConfirm={order?.items?.some(
                                    (item) =>
                                        item.productId.shop?.toString() === myShop?._id.toString() &&
                                        item.status === 'delivering' &&
                                        order?.allStatus === 'wait_confirm',
                                )}
                            />
                        ))
                    ) : (
                        <div className={cx('not-found')}>
                            <BillIcon />
                            <span>Không tìm thấy đơn hàng</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageOrder;
