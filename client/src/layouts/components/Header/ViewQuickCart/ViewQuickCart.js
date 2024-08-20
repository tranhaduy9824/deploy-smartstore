/* eslint-disable jsx-a11y/img-redundant-alt */
import classNames from 'classnames/bind';
import styles from './ViewQuickCart.module.scss';
import { Link } from 'react-router-dom';
import snippet from '~/handle/snippet';
import { formatPrice } from '~/handle/formatPrice';
import { TrashIcon } from '~/components/Icons';
import Button from '~/components/Button';
import { useContext } from 'react';
import { CartContext } from '~/context/CartContext';
import { ProductContext } from '~/context/ProductContext';

const cx = classNames.bind(styles);

function ViewQuickCart({ cart }) {
    const { deleteItemToCart, deletingItemId } = useContext(CartContext);
    const { addProductToRecent } = useContext(ProductContext);

    return (
        <div className={cx('wrapper')}>
            <ul>
                {cart?.items.map((item, index) => (
                    <li key={index} className={cx({ deleting: deletingItemId === item.productId._id })}>
                        <Link to={`/product/${item.productId._id}`} onClick={() => addProductToRecent(item.productId)}>
                            <img src={item.productId.files.photos[0]} alt="Image" />
                        </Link>
                        <div className={cx('content')}>
                            <Link
                                to={`/product/${item.productId._id}`}
                                onClick={() => addProductToRecent(item.productId)}
                            >
                                {snippet(item.productId.name, 40)}
                            </Link>
                            <span>
                                <b>{formatPrice(item.price)}</b> (x{item.quantity})
                            </span>
                        </div>
                        <span onClick={() => deleteItemToCart(item.productId._id)}>
                            <TrashIcon />
                        </span>
                    </li>
                ))}
            </ul>
            <div className={cx('control')}>
                <p>
                    <strong>Tổng:</strong>
                    <span>{formatPrice(cart?.totalPrice)}</span>
                </p>
                <p>
                    <Button className={cx('btn-control')} to="/cart">
                        Xem giỏ hàng
                    </Button>
                    <Button className={cx('btn-control')} to="/payment" state={{ items: cart?.items }}>
                        Thanh toán
                    </Button>
                </p>
            </div>
        </div>
    );
}

export default ViewQuickCart;
