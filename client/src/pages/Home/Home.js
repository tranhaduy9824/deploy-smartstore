/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import images from '~/assets/images';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import WrapperSlide from '~/components/WrapperSlide';
import { useLocation, useNavigate } from 'react-router-dom';
import { CarIcon, ElectronicIcon, FashionIcon, FoodIcon, HousewareIcon } from '~/components/Icons';
import SlideHome from './SlideHome';
import ProductItem from '~/components/ProductItem';
import snippet from '~/handle/snippet';
import { ProductContext } from '~/context/ProductContext';
import { formatPrice } from '~/handle/formatPrice';
import { CategoryContext } from '~/context/CategoryContext';

const cx = classNames.bind(styles);

function Home() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentIndexCategory, setCurrentIndexCategory] = useState(0);
    const [currentIndexRecommend, setCurrentIndexRecommend] = useState(0);
    const [currentIndexNews, setCurrentIndexNews] = useState(0);
    const location = useLocation();

    const { categories } = useContext(CategoryContext);
    const { saleProducts, newProducts, recommendProducts, addProductToRecent } = useContext(ProductContext);

    const IconComponents = {
        'Thời trang': FashionIcon,
        'Thiết bị điện tử': ElectronicIcon,
        Xe: CarIcon,
        'Đồ ăn và thức uống': FoodIcon,
        'Đồ gia dụng': HousewareIcon,
    };

    const handlePrevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + saleProducts.length) % saleProducts.length);
    };

    const handleNextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % saleProducts.length);
    };

    const getCategoryTransform = (index, currentIndexCategory) => {
        if (window.matchMedia('(max-width: 46.1875em)').matches) {
            if (categories.length > 2) {
                return `translateX(calc(-${currentIndexCategory * 100}% - ${currentIndexCategory * 30}px))`;
            }
        } else {
            if (categories.length > 8) {
                return `translateX(calc(-${currentIndexCategory * 100}% - ${currentIndexCategory * 30}px))`;
            }
        }
        return 'none';
    };

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    let showNumber;

    if (window.matchMedia('(max-width: 46.1875em)').matches) {
        showNumber = 1;
    } else if (window.matchMedia('(min-width: 46.25em) and (max-width: 63.9375em)').matches) {
        showNumber = 4;
    } else {
        showNumber = 5;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('box-slide')} id="sale">
                <WrapperSlide
                    data={saleProducts}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    timeDelay={4000}
                    className={cx('list-slide')}
                    handlePrev={handlePrevSlide}
                    handleNext={handleNextSlide}
                >
                    {saleProducts &&
                        saleProducts.map((item, index) => (
                            <div
                                key={index}
                                className={cx('slide-item')}
                                style={{
                                    transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 20}px))`,
                                }}
                            >
                                <div className={cx('content')}>
                                    <h2 className={cx('heading')}>Giảm giá {item.sale}%</h2>
                                    <h3 className={cx('name')}>{item.name}</h3>
                                    <p className={cx('price')}>
                                        <span>{formatPrice((item.price * (100 - item.sale)) / 100)}</span>
                                        <i>
                                            <del>{formatPrice(item.price)}</del>
                                        </i>
                                    </p>
                                    <Button
                                        className={cx('btn-buy')}
                                        to="/payment"
                                        state={{ items: [{ productId: item, quantity: 1, price: item?.price }] }}
                                    >
                                        Mua ngay
                                    </Button>
                                </div>
                                <div
                                    className={cx('image')}
                                    onClick={() => {
                                        navigate(`/product/${item._id}`);
                                        addProductToRecent(item);
                                    }}
                                >
                                    <img src={item.files.photos[0]} alt="Image" />
                                </div>
                            </div>
                        ))}
                </WrapperSlide>
                <div className={cx('controls')}>
                    <button className={cx('prev')} onClick={handlePrevSlide}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button className={cx('next')} onClick={handleNextSlide}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                <img src={images.background_slide} alt="Background slide" className={cx('background-slide')} />
            </div>
            <div className={cx('box-categories')}>
                <SlideHome
                    data={categories}
                    setCurrentIndex={setCurrentIndexCategory}
                    showNumber={window.matchMedia('(max-width: 46.1875em)').matches ? 2 : 8}
                    title="Tìm kiếm bằng danh mục"
                    subTitle="Xem tất cả"
                    link="/product"
                >
                    {categories &&
                        categories.map((item, index) => (
                            <div
                                className={cx('item-category')}
                                key={index}
                                style={{
                                    transform: getCategoryTransform(index, currentIndexCategory),
                                }}
                                onClick={() => navigate('/product', { state: { category: item.name } })}
                            >
                                {React.createElement(IconComponents[item.name] || 'div')}
                                <p>{snippet(item.name, 6)}</p>
                            </div>
                        ))}
                </SlideHome>
            </div>
            <div className={cx('box-recommend')} id="recommend">
                <div className={cx('recommend')}>
                    <SlideHome
                        data={recommendProducts}
                        setCurrentIndex={setCurrentIndexRecommend}
                        showNumber={showNumber}
                        title="Gợi ý"
                        subTitle="Xem tất cả"
                        link="/product"
                        classNameSlide={cx('list-recommend')}
                    >
                        {recommendProducts &&
                            recommendProducts.map((item, index) => (
                                <ProductItem
                                    data={recommendProducts}
                                    item={item}
                                    index={index}
                                    currentIndex={currentIndexRecommend}
                                />
                            ))}
                    </SlideHome>
                </div>
            </div>
            <div className={cx('box-news')} id="news">
                <div className={cx('news')}>
                    <SlideHome
                        data={newProducts}
                        setCurrentIndex={setCurrentIndexNews}
                        showNumber={showNumber}
                        title="Mới nhất"
                        subTitle="Xem tất cả"
                        link="/product"
                        classNameSlide={cx('list-news')}
                    >
                        {newProducts &&
                            newProducts.map((item, index) => (
                                <ProductItem
                                    data={newProducts}
                                    item={item}
                                    index={index}
                                    currentIndex={currentIndexNews}
                                />
                            ))}
                    </SlideHome>
                </div>
            </div>
        </div>
    );
}

export default Home;
