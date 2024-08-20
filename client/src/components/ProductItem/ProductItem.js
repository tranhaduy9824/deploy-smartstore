/* eslint-disable jsx-a11y/img-redundant-alt */
import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import RatingStar from '../RatingStar';
import Button from '../Button';
import { QuickViewIcon } from '../Icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartFull } from '@fortawesome/free-solid-svg-icons';
import WrapperModel from '../WrapperModel';
import { formatPrice } from '~/handle/formatPrice';
import snippet from '~/handle/snippet';
import Quantity from '../Quantity';
import images from '~/assets/images';
import { ProductContext } from '~/context/ProductContext';
import { CartContext } from '~/context/CartContext';
import { WishlistContext } from '~/context/WishlistContext';
import { isWishlist } from '~/handle/isWishlist';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

function ProductItem({ data = [], index, item, currentIndex = 0, numberSnippet = 10, className }) {
    const navigate = useNavigate(null);
    const [quantityValue, setQuantityValue] = useState(1);
    const [isFavourite, setIsFavourite] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);
    const [imageCurrent, setImageCurrent] = useState(item.files && item.files.video ? 0 : 1);
    const videoRef = useRef(null);

    const { addProductToRecent } = useContext(ProductContext);
    const { addCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { wishlist, addWishlist, removeWishlist } = useContext(WishlistContext);

    useEffect(() => {
        if (wishlist) {
            if (isWishlist(wishlist, item?._id)) {
                setIsFavourite(true);
            } else {
                setIsFavourite(false);
            }
        }
    }, [wishlist, item]);

    const getTransform = (index, currentIndex) => {
        if (data.length > 6) {
            return `translateX(-${currentIndex * 100}%`;
        }
        return 'none';
    };

    const price = formatPrice(item.price);
    const priceSale = formatPrice(Math.round((item.price * (100 - item.sale)) / 100));
    const priceQuantity = formatPrice(Math.round(item.price * quantityValue));
    const priceSaleQuantity = formatPrice(Math.round(((item.price * (100 - item.sale)) / 100) * quantityValue));

    useEffect(() => {
        if (!showQuickView && videoRef.current) {
            videoRef.current.pause();
        }
    }, [showQuickView]);

    return (
        <>
            <div
                className={cx('box-item', { [className]: className })}
                key={index}
                style={{
                    transform: getTransform(index, currentIndex),
                }}
            >
                <div
                    className={cx('image')}
                    onClick={() => {
                        navigate(`/product/${item._id}`);
                        addProductToRecent(item);
                    }}
                >
                    <img src={item.files && item.files.photos[0]} alt="Image" />
                    {item?.sale > 0 && <div className={cx('sale')}>- {item?.sale}%</div>}
                    {item?.inStock === false && <div className={cx('out-stock')}>Hết hàng</div>}
                </div>
                <div className={cx('content')}>
                    <h2 className={cx('name')}>
                        <Link to={`/product/${item._id}`} onClick={() => addProductToRecent(item)}>
                            {snippet(item.name, 29)}
                        </Link>
                    </h2>
                    <div className={cx('rating')}>
                        <RatingStar rating={item.rating} />
                        <span>({item.numberRating})</span>
                    </div>
                    <div className={cx('price')}>
                        {item.sale ? (
                            <>
                                <span className={cx('sale-price')}>{priceSale}</span>
                                <del>
                                    <i>
                                        <span className={cx('price-old')}>
                                            {snippet(price.concat(priceSale), numberSnippet - priceSale.length, price)}
                                        </span>
                                    </i>
                                </del>
                            </>
                        ) : (
                            <span className={cx('price')}>{price}</span>
                        )}
                    </div>
                </div>
                <div className={cx('box-add-cart')}>
                    <Quantity quantityValue={quantityValue} setQuantityValue={setQuantityValue} />
                    <div className={cx('total')}>
                        Total: <span>{!item.sale ? priceQuantity : priceSaleQuantity}</span>
                    </div>
                    <Button
                        div
                        className={cx('btn-add-cart')}
                        onClick={() => addCart({ productId: item?._id, quantity: quantityValue })}
                    >
                        Thêm giỏ hàng
                    </Button>
                </div>
                <div className={cx('btn-action')}>
                    <span onClick={() => setShowQuickView(true)}>
                        <QuickViewIcon />
                    </span>
                    <span
                        onClick={() => {
                            if (user) {
                                if (!isFavourite) {
                                    addWishlist(item?._id, user?.token);
                                } else {
                                    removeWishlist(item?._id, user?.token);
                                }
                            }
                            setIsFavourite(!isFavourite);
                        }}
                    >
                        {!isFavourite ? (
                            <FontAwesomeIcon icon={faHeart} />
                        ) : (
                            <FontAwesomeIcon icon={faHeartFull} className={cx('is-favourite')} />
                        )}
                    </span>
                </div>
            </div>
            <WrapperModel
                classNameContent={cx('box-content')}
                show={showQuickView}
                onClose={() => setShowQuickView(false)}
                className={cx('box-quick-view')}
                classIcon={cx('icon-close')}
            >
                <div className={cx('box-image')}>
                    {item.files && item.files.video && imageCurrent === 0 ? (
                        <video
                            ref={videoRef}
                            width="400"
                            height="400"
                            muted
                            controls
                            preload="metadata"
                            className={cx('video-selected')}
                        >
                            <source src={item.files.video} type="video/mp4" />
                            Trình duyệt của bạn không hỗ trợ thẻ video.
                        </video>
                    ) : (
                        <img
                            src={item.files && item.files.photos[imageCurrent - 1]}
                            alt="Image"
                            className={cx('image-selected')}
                        />
                    )}
                    {item?.inStock === false && <div className={cx('out-stock')}>Hết hàng</div>}
                    <div className={cx('list-image')}>
                        {item.files &&
                            [item.files.video && { type: 'video', src: item.files.video }, ...item.files.photos].map(
                                (file, index) => (
                                    <>
                                        {file ? (
                                            file.type === 'video' ? (
                                                <div
                                                    key={index}
                                                    className={cx('image-container', {
                                                        'current-image': imageCurrent === index,
                                                    })}
                                                    onClick={() => setImageCurrent(index)}
                                                >
                                                    <video
                                                        width="80"
                                                        height="80"
                                                        onClick={() => setImageCurrent(index)}
                                                    >
                                                        <source src={file.src} type="video/mp4" />
                                                        Trình duyệt của bạn không hỗ trợ thẻ video.
                                                    </video>
                                                    <img
                                                        src={images.play_btn}
                                                        alt="Video"
                                                        className={cx('btn-video')}
                                                    />
                                                </div>
                                            ) : (
                                                <img
                                                    src={file}
                                                    alt="Image"
                                                    key={index}
                                                    className={cx('image-container', {
                                                        'current-image': imageCurrent === index,
                                                    })}
                                                    onClick={() => setImageCurrent(index)}
                                                />
                                            )
                                        ) : null}
                                    </>
                                ),
                            )}
                    </div>
                </div>
                <div className={cx('box-info')}>
                    <Link to={`/product/${item._id}`} onClick={() => addProductToRecent(item)}>
                        <h2>{item.name}</h2>
                    </Link>
                    <div className={cx('rating')}>
                        <RatingStar rating={item.rating} />
                        <span className={cx('number-rating')}>({item.numberRating})</span>
                    </div>
                    <div className={cx('price')}>
                        {item.sale ? (
                            <>
                                <span className={cx('sale')}>Sale {item.sale}%: </span>
                                <span className={cx('sale-price')}>{priceSale}</span>
                                <del>
                                    <i>
                                        <span className={cx('price-old')}>{price}</span>
                                    </i>
                                </del>
                            </>
                        ) : (
                            <span className={cx('price')}>{price}</span>
                        )}
                    </div>
                    <h3>Mô tả</h3>
                    <div
                        className={cx('des')}
                        dangerouslySetInnerHTML={{ __html: item.des && item.des.replace(/\n/g, '<br>') }}
                    ></div>
                    <h3>Số lượng</h3>
                    <Quantity
                        className={cx('box-quantity')}
                        quantityValue={quantityValue}
                        setQuantityValue={setQuantityValue}
                    />
                    <div className={cx('total')}>
                        Total: <span>{!item.sale ? priceQuantity : priceSaleQuantity}</span>
                    </div>
                    <Button
                        div
                        className={cx('btn-add-cart')}
                        onClick={() => addCart({ productId: item?._id, quantity: quantityValue })}
                    >
                        Thêm giỏ hàng
                    </Button>
                </div>
            </WrapperModel>
        </>
    );
}

export default ProductItem;
