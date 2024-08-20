/* eslint-disable jsx-a11y/img-redundant-alt */
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { Link } from 'react-router-dom';
import Quantity from '~/components/Quantity';
import { HomeIcon, TrashIcon } from '~/components/Icons';
import { formatPrice } from '~/handle/formatPrice';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '~/context/CartContext';
import { AuthContext } from '~/context/AuthContext';
import useDebounce from '~/hooks/useDebounce';
import { ProductContext } from '~/context/ProductContext';
import { highestShippingCost } from '~/handle/highestShippingCost';
import snippet from '~/handle/snippet';

const cx = classNames.bind(styles);

function Cart() {
    const [quantity, setQuantity] = useState(null);
    const [productId, setProductId] = useState(null);

    const { user } = useContext(AuthContext);
    const { cart, deleteItemToCart, updateCartItemQuantity, deletingItemId } = useContext(CartContext);
    const { addProductToRecent } = useContext(ProductContext);

    const handleQuantityChange = (index, newQuantity) => {
        const id = cart.items[index].productId._id;
        setProductId(id);
        setQuantity(newQuantity);
    };

    const debouncedQuantity = useDebounce(quantity, 500);

    useEffect(() => {
        if (debouncedQuantity !== null && productId && user) {
            updateCartItemQuantity(productId, debouncedQuantity, user.token);
        }
    }, [debouncedQuantity, productId, user, updateCartItemQuantity]);

    return (
        <div className={cx('wrapper')}>
            <h1>Giỏ hàng</h1>
            <div className={cx('site')}>
                <Link to="/" className={cx('navigate')}>
                    Trang chủ
                </Link>{' '}
                <span> / </span>
                <Link to="/product" className={cx('navigate')}>
                    Sản phẩm
                </Link>{' '}
                <span> / </span>
                <Link>Giỏ hàng</Link>
            </div>
            <div className={cx('content')}>
                <table>
                    <tr>
                        <th></th>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Phí vận chuyển</th>
                        <th>Số lượng</th>
                        <th>Tổng tiền</th>
                        <th></th>
                    </tr>
                    {cart &&
                        cart?.items.map((item, index) => (
                            <tr className={cx({ deleting: deletingItemId === item.productId._id })}>
                                <td>
                                    <Link
                                        to={`/product/${item.productId._id}`}
                                        className={cx('navigate')}
                                        onClick={() => addProductToRecent(item.productId)}
                                    >
                                        <img src={item?.productId.files.photos[0]} alt="Image" />
                                    </Link>
                                </td>
                                {!window.matchMedia('(max-width: 46.1875em)').matches && (
                                    <>
                                        <td>
                                            <Link
                                                to={`/product/${item.productId._id}`}
                                                className={cx('navigate')}
                                                onClick={() => addProductToRecent(item.productId)}
                                            >
                                                {item?.productId.name}
                                            </Link>
                                        </td>
                                        <td>{formatPrice(item?.productId.price)}</td>
                                        <td>{formatPrice(item?.productId.shippingCost)}</td>
                                    </>
                                )}
                                <td>
                                    {window.matchMedia('(max-width: 46.1875em)').matches && (
                                        <>
                                            <Link
                                                to={`/product/${item.productId._id}`}
                                                className={cx('navigate')}
                                                onClick={() => addProductToRecent(item.productId)}
                                            >
                                                {snippet(item?.productId.name, 50)}
                                            </Link>
                                            <p>Giá: {formatPrice(item?.productId.price)}</p>
                                        </>
                                    )}
                                    <Quantity
                                        productId={item?.productId._id}
                                        quantityValue={item?.quantity}
                                        setQuantityValue={(newQuantity) => handleQuantityChange(index, newQuantity)}
                                        className={cx('box-quantity')}
                                    />
                                    {window.matchMedia('(max-width: 46.1875em)').matches && (
                                        <p>Tổng tiền: {formatPrice(item?.productId.price * item?.quantity)}</p>
                                    )}
                                </td>
                                {!window.matchMedia('(max-width: 46.1875em)').matches && (
                                    <td>{formatPrice(item?.productId.price * item?.quantity)}</td>
                                )}
                                <td>
                                    <span onClick={() => deleteItemToCart(item?.productId._id)}>
                                        <TrashIcon />
                                    </span>
                                </td>
                            </tr>
                        ))}
                </table>
            </div>
            <div className={cx('action')}>
                <div className={cx('action-left')}>
                    <Button
                        className={cx('btn-navigate')}
                        to="/product"
                        iconLeft={<FontAwesomeIcon icon={faArrowLeft} />}
                    >
                        Tiếp tục mua sắm
                    </Button>
                    <Button className={cx('btn-navigate')} to="/" iconLeft={<HomeIcon />}>
                        Trở về nhà
                    </Button>
                </div>
                <div className={cx('action-right')}>
                    <div className={cx('text')}>
                        <span>Tổng cộng</span>
                        <span>{formatPrice(cart?.totalPrice)}</span>
                    </div>
                    <div className={cx('text')}>
                        <span>Phí vận chuyển</span>
                        <span>{formatPrice(highestShippingCost(cart?.items))}</span>
                    </div>
                    <hr />
                    <div className={cx('text', 'total-cart')}>
                        <span>Tổng cộng</span>
                        <span className={cx('text-total-cart')}>
                            {formatPrice(highestShippingCost(cart?.items) + cart?.totalPrice)}
                        </span>
                    </div>
                    <Button className={cx('btn-check')} to="/payment" state={{ items: cart?.items }}>
                        Tiến hành thanh toán
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Cart;
