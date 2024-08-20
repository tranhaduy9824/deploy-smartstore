/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import images from '~/assets/images';
import { useContext, useEffect, useState } from 'react';
import Button from '~/components/Button';
import { faChevronRight, faHeart as faHeartFull, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { formatPrice } from '~/handle/formatPrice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RatingStar from '~/components/RatingStar';
import { CartIcon } from '~/components/Icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';
import Reviews from './Reviews';
import ProductItem from '~/components/ProductItem';
import { Link, useParams } from 'react-router-dom';
import { ProductContext } from '~/context/ProductContext';
import { AuthContext } from '~/context/AuthContext';
import { CartContext } from '~/context/CartContext';
import { WishlistContext } from '~/context/WishlistContext';
import { isWishlist } from '~/handle/isWishlist';
import { ReviewContext } from '~/context/ReviewContext';

const cx = classNames.bind(styles);

function ProductDetail() {
    const [quantityValue, setQuantityValue] = useState(1);
    const [isFavourite, setIsFavourite] = useState(false);
    const [owner, setOwner] = useState(null);
    const [productShop, setProductShop] = useState([]);
    const { id } = useParams(null);
    const [reviews, setReviews] = useState([]);

    const { product, setProduct, getProduct, getProductsByShop } = useContext(ProductContext);
    const { user, getUserById } = useContext(AuthContext);
    const { addCart } = useContext(CartContext);
    const { wishlist, addWishlist, removeWishlist } = useContext(WishlistContext);
    const { getReviewsByProductId } = useContext(ReviewContext);

    const [imageCurrent, setImageCurrent] = useState(product?.files && product.files.video ? 0 : 1);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviews = await getReviewsByProductId(product?._id);
            setReviews(reviews);
        };

        if (product?._id) {
            fetchReviews();
        }
    }, [product, getReviewsByProductId]);

    useEffect(() => {
        if (wishlist) {
            if (isWishlist(wishlist, product?._id)) {
                setIsFavourite(true);
            } else {
                setIsFavourite(false);
            }
        }
    }, [wishlist, product]);

    useEffect(() => {
        window.scrollTo(0, 0);

        return () => {
            window.scrollTo(0, 0);
        };
    }, [id]);

    useEffect(() => {
        setImageCurrent(product?.files && product.files.video ? 0 : 1);
    }, [product]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                await getProduct(id);
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };

        fetchProduct();

        return () => {
            setOwner(null);
            setProduct(null);
        };
    }, [id, getProduct]);

    useEffect(() => {
        if (product?.shop?.owner) {
            const fetchOwner = async () => {
                try {
                    const ownerData = await getUserById(product.shop.owner);
                    const productShop = await getProductsByShop(product.shop._id);
                    setOwner(ownerData);
                    setProductShop(productShop);
                } catch (error) {
                    console.error('Lỗi:', error);
                }
            };

            fetchOwner();
        }
    }, [product, getUserById]);

    const minusQuantity = () => {
        if (!quantityValue.trim && quantityValue > 1) {
            setQuantityValue(quantityValue - 1);
        } else {
            setQuantityValue(1);
        }
    };

    const plusQuantity = () => {
        if (!quantityValue.trim) {
            setQuantityValue(quantityValue + 1);
        } else {
            setQuantityValue(1);
        }
    };

    const price = formatPrice(product?.price);
    const priceSale = formatPrice(Math.round((product?.price * (100 - product?.sale)) / 100));
    const priceQuantity = formatPrice(Math.round(product?.price * quantityValue));
    const priceSaleQuantity = formatPrice(Math.round(((product?.price * (100 - product?.sale)) / 100) * quantityValue));

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('box-image')}>
                    {product?.files && product.files.video && imageCurrent === 0 ? (
                        <video
                            width="400"
                            height="400"
                            muted
                            controls
                            preload="metadata"
                            className={cx('video-selected')}
                        >
                            <source src={product.files.video} type="video/mp4" />
                            Trình duyệt của bạn không hỗ trợ thẻ video.
                        </video>
                    ) : (
                        <img
                            src={product?.files && product.files.photos[imageCurrent - 1]}
                            alt="Image"
                            className={cx('image-selected')}
                        />
                    )}
                    {product?.inStock === false && <div className={cx('out-stock')}>Hết hàng</div>}
                    <div className={cx('list-image')}>
                        {product?.files &&
                            [
                                product.files.video && { type: 'video', src: product.files.video },
                                ...product.files.photos,
                            ].map((file, index) => (
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
                                                <video width="80" height="80" onClick={() => setImageCurrent(index)}>
                                                    <source src={file.src} type="video/mp4" />
                                                    Trình duyệt của bạn không hỗ trợ thẻ video.
                                                </video>
                                                <img src={images.play_btn} alt="Video" className={cx('btn-video')} />
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
                            ))}
                    </div>
                    <div className={cx('btn-action')}>
                        <span
                            onClick={() => {
                                if (user) {
                                    if (!isFavourite) {
                                        addWishlist(product?._id, user?.token);
                                    } else {
                                        removeWishlist(product?._id, user?.token);
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
                <div className={cx('info-product')}>
                    <h2>{product && product.name}</h2>
                    <div className={cx('rating')}>
                        <RatingStar rating={product?.rating} />
                        <span className={cx('number-rating')}>({product?.numberRating})</span>
                    </div>
                    <div className={cx('price')}>
                        {product?.sale ? (
                            <>
                                <span className={cx('sale')}>Sale {product?.sale}%: </span>
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
                    <div className={cx('shipping-cost')}>
                        <img src={images.delivery_truck} alt="Icon delivery truck" />
                        Chi phí vận chuyển:{' '}
                        <span>{product?.shippingCost === 0 ? 'Miễn phí' : formatPrice(product?.shippingCost)}</span>
                    </div>
                    <h3>Số lượng</h3>
                    <div className={cx('box-quantity')}>
                        <span onClick={minusQuantity}>
                            <FontAwesomeIcon icon={faMinus} />
                        </span>
                        <input type="number" value={quantityValue} onChange={(e) => setQuantityValue(e.target.value)} />
                        <span onClick={plusQuantity}>
                            <FontAwesomeIcon icon={faPlus} />
                        </span>
                    </div>
                    <div className={cx('total')}>
                        Total: <span>{!product?.sale ? priceQuantity : priceSaleQuantity}</span>
                    </div>
                    <div className={cx('box-btn')}>
                        <Button
                            className={cx('btn-add-cart')}
                            iconLeft={<CartIcon />}
                            onClick={() => addCart({ productId: product?._id, quantity: quantityValue })}
                        >
                            Thêm giỏ hàng
                        </Button>
                        <Button
                            className={cx('btn-buy')}
                            to="/payment"
                            state={{ items: [{ productId: product, quantity: quantityValue, price: product?.price }] }}
                        >
                            Mua ngay
                        </Button>
                    </div>
                    <h3>Cửa hàng</h3>
                    <div className={cx('info-shop')}>
                        <Link to="/shop" state={{ productShop, shop: product?.shop, avatar: owner?.avatar }}>
                            <img src={owner?.avatar} alt="Image shop" />
                        </Link>
                        <div className={cx('content-shop')}>
                            <Link to="/shop" state={{ productShop, shop: product?.shop, avatar: owner?.avatar }}>
                                <h3>{product?.shop.name}</h3>
                            </Link>
                            <p>Số sản phẩm: {productShop.length}</p>
                        </div>
                        <div className={cx('btn-shop')}>
                            <Button
                                className={cx('chat')}
                                onClick={() => {}}
                                iconLeft={<FontAwesomeIcon icon={faRocketchat} />}
                            >
                                Chat Ngay
                            </Button>
                            <Button
                                className={cx('view-shop')}
                                to="/shop"
                                state={{ productShop, shop: product?.shop, avatar: owner?.avatar }}
                            >
                                Xem shop
                            </Button>
                        </div>
                    </div>
                    <h3>Mô tả</h3>
                    <div
                        className={cx('des')}
                        dangerouslySetInnerHTML={{ __html: product?.des.replace(/\n/g, '<br>') }}
                    ></div>
                </div>
            </div>
            <Reviews reviews={reviews} />
            <div className={cx('box-product-shop')}>
                <div className={cx('title')}>
                    <h2>Các sản phẩm khác của shop</h2>
                    <Link to="/shop" state={{ productShop, shop: product?.shop, avatar: owner?.avatar }}>
                        Xem tất cả <FontAwesomeIcon icon={faChevronRight} />
                    </Link>
                </div>
                <div className={cx('list-product')}>
                    {productShop.slice(0, 10).map((item, index) => (
                        <ProductItem numberSnippet={50} item={item} index={index} className={cx('product-item')} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
