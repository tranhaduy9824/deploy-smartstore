/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import { BarsIcon, DownIcon, FilterIcon, GridIcon } from '~/components/Icons';
import WrapperHover from '~/components/WrapperHover';
import { NavLink, useLocation } from 'react-router-dom';
import { formatPrice } from '~/handle/formatPrice';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ProductItem from '~/components/ProductItem';
import Pagination from '~/components/Pagination';
import { ProductContext } from '~/context/ProductContext';
import { CategoryContext } from '~/context/CategoryContext';
import WrapperModel from '~/components/WrapperModel';

const cx = classNames.bind(styles);

function Product() {
    const { state } = useLocation();
    const [showCategorySub, setShowCategorySub] = useState([]);
    const [typeViewList, setTypeViewList] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(state?.category || '');
    const [selectedCategorySub, setSelectedCategorySub] = useState(state?.categorySub || '');
    const [selectedPriceRange, setSelectedPriceRange] = useState({});
    const [selectedSort, setSelectedSort] = useState(state?.selectedSort || 0);
    const [sale, setSale] = useState(state?.sale || false);
    const [showFilter, setShowFilter] = useState(false);

    const { products, setProducts, getProducts } = useContext(ProductContext);
    const { categories } = useContext(CategoryContext);

    useEffect(() => {
        window.scrollTo(0, 0);

        return () => {
            window.scrollTo(0, 0);
        };
    }, []);

    useEffect(() => {
        if (state?.category) {
            setSelectedCategory(state?.category);
        }

        if (state?.categorySub) {
            setSelectedCategorySub(state?.categorySub);
        }

        if (state?.selectedSort) {
            setSelectedSort(state?.selectedSort);
        }

        if (state?.sale) {
            setSale(state?.sale);
        }
    }, [state]);

    useEffect(() => {
        if (selectedCategory || selectedCategorySub || selectedPriceRange) {
            getProducts({
                category: selectedCategory,
                categorySub: selectedCategorySub,
                priceRange: selectedPriceRange,
                sort: selectedSort,
                sale: sale ? true : undefined,
            });
        } else {
            getProducts();
        }

        return () => {
            setProducts([]);
        };
    }, [selectedCategory, selectedCategorySub, selectedPriceRange, selectedSort, sale, getProducts]);

    const listSort = [
        'Sắp xếp mặc định',
        'Sắp xếp theo độ phổ biến',
        'Sắp xếp theo đánh giá',
        'Sắp xếp theo mới nhất',
        'Sắp xếp theo giá: thấp -> cao',
        'Sắp xếp theo giá: cao -> thấp',
    ];

    const priceRange = [
        {
            from: 0,
            to: 100000,
        },
        {
            from: 100000,
            to: 200000,
        },
        {
            from: 200000,
            to: 500000,
        },
        {
            from: 500000,
            to: 1000000,
        },
        {
            from: 1000000,
        },
    ];

    const handleSpanClick = (index) => {
        setShowCategorySub((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const handleClickPriceRange = (item) => {
        if (selectedPriceRange.from === item.from) {
            setSelectedPriceRange('');
        } else {
            setSelectedPriceRange(item);
        }
    };

    const sideBarContent = (
        <div className={cx('sidebar')}>
            <div className={cx('box-categories')}>
                <h2>Tất cả danh mục</h2>
                <ul className={cx('list-category')}>
                    {categories &&
                        categories.map((category, index) => (
                            <>
                                <li key={index} className={cx('category-main')}>
                                    <NavLink
                                        onClick={() => {
                                            if (selectedCategory === category.name && selectedCategorySub === '') {
                                                setSelectedCategory('');
                                            } else {
                                                setSelectedCategory(category.name);
                                            }
                                            setSelectedCategorySub('');
                                        }}
                                        className={cx({ selected: category.name === selectedCategory })}
                                    >
                                        {category.name}{' '}
                                        <span className={cx('number-category-sub')}>{category.categorySub.length}</span>
                                    </NavLink>
                                    <span onClick={() => handleSpanClick(index)}>
                                        {!showCategorySub[index] ? (
                                            <FontAwesomeIcon icon={faChevronDown} />
                                        ) : (
                                            <FontAwesomeIcon icon={faChevronUp} />
                                        )}
                                    </span>
                                </li>
                                <ul key={index} className={cx('category-sub', { show: showCategorySub[index] })}>
                                    {category.categorySub.map((item, index) => (
                                        <li key={index}>
                                            <NavLink
                                                onClick={() => {
                                                    if (selectedCategorySub === item) {
                                                        setSelectedCategorySub('');
                                                    } else {
                                                        setSelectedCategorySub(item);
                                                        setSelectedCategory(category.name);
                                                    }
                                                }}
                                                className={cx({ selected: item === selectedCategorySub })}
                                            >
                                                {item}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ))}
                </ul>
            </div>
            <div className={cx('box-price')}>
                <h2>Phạm vi giá</h2>
                <ul className={cx('list-price')}>
                    <li className={cx('selected-sale')}>
                        <input checked={sale} type="checkbox" id="sale-price" onChange={() => setSale(!sale)} />
                        <label for="sale-price">Giá đặc biệt</label>
                    </li>
                    {priceRange.map((item, index) => (
                        <li key={index}>
                            {item.to ? (
                                <NavLink
                                    onClick={() => handleClickPriceRange(item)}
                                    className={cx({ selected: selectedPriceRange.from === item.from })}
                                >
                                    {formatPrice(item.from)} - {formatPrice(item.to)}
                                </NavLink>
                            ) : (
                                <NavLink
                                    onClick={() => handleClickPriceRange(item)}
                                    className={cx({ selected: selectedPriceRange.from === item.from })}
                                >
                                    {formatPrice(item.from)} +
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top-product')}>
                <div className={cx('title')}>
                    <h1>Sản phẩm</h1>
                </div>
                <div className={cx('control-content')}>
                    {window.matchMedia('(max-width: 46.1875em)').matches && (
                        <span onClick={() => setShowFilter(true)}>
                            <FilterIcon /> Lọc
                        </span>
                    )}
                    <div className={cx('box-sort')}>
                        <span className={cx('label-control')}>Sắp xếp theo:</span>
                        <WrapperHover
                            noIcon
                            content={listSort}
                            onClick={(index) => setSelectedSort(index)}
                            classNameContent={cx('wrapper-list-sort')}
                            className={cx('list-sort')}
                        >
                            <div className={cx('sort')}>
                                <span className={cx('sort-current')}>{listSort[selectedSort]}</span>
                                <DownIcon />
                            </div>
                        </WrapperHover>
                    </div>
                    <div className={cx('box-view')}>
                        <span className={cx('label-control')}>Xem</span>
                        <div className={cx('view')}>
                            <span
                                className={cx('grid-icon', { selected: !typeViewList })}
                                onClick={() => setTypeViewList(false)}
                            >
                                <GridIcon />
                            </span>
                            <span
                                className={cx('bars-icon', { selected: typeViewList })}
                                onClick={() => setTypeViewList(true)}
                            >
                                <BarsIcon />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('bottom-product')}>
                {window.matchMedia('(max-width: 46.1875em)').matches ? (
                    <WrapperModel
                        className={cx('box-filter')}
                        showToRight
                        show={showFilter}
                        onClose={() => setShowFilter(false)}
                    >
                        {sideBarContent}
                    </WrapperModel>
                ) : (
                    sideBarContent
                )}
                <div className={cx('content')}>
                    <div className={cx({ 'list-product': typeViewList, 'grid-product': !typeViewList })}>
                        <Pagination data={products} limit={10}>
                            {({ item, index }) => (
                                <ProductItem
                                    numberSnippet={50}
                                    item={item}
                                    index={index}
                                    className={cx('product-item')}
                                />
                            )}
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;
