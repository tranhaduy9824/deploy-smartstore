import classNames from 'classnames/bind';
import styles from './HeaderMobile.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars, faChevronRight, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink } from 'react-router-dom';
import images from '~/assets/images';
import { AccountIcon, CartIcon, FavouriteIcon, ProductIcon, SearchIcon } from '~/components/Icons';
import { useContext, useState } from 'react';
import WrapperModel from '~/components/WrapperModel';
import { CartContext } from '~/context/CartContext';
import { WishlistContext } from '~/context/WishlistContext';
import { AuthContext } from '~/context/AuthContext';
import Avatar from '~/components/Avatar';
import Search from '~/components/Search';

const cx = classNames.bind(styles);

function HeaderMobile({ categories, myShop }) {
    const [showHeaderLeft, setShowHeaderLeft] = useState(false);
    const [showHeaderRight, setShowHeaderRight] = useState(false);
    const [isShowLevel2, setIsShowLevel2] = useState(null);

    const { user, handleLogout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);

    const handleClickLinkLeft = () => setShowHeaderLeft(false);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('main')}>
                <span onClick={() => setShowHeaderLeft(true)}>
                    <FontAwesomeIcon icon={faBars} />
                </span>
                <NavLink to="/">
                    <img src={images.logo_and_text} alt="Logo" />
                </NavLink>
                <span onClick={() => setShowHeaderRight(true)}>
                    <SearchIcon />
                </span>
            </div>
            <WrapperModel
                className={cx('mobile-left')}
                showToRight
                show={showHeaderLeft}
                onClose={() => setShowHeaderLeft(false)}
                closeBtn={<FontAwesomeIcon icon={faArrowLeft} className={cx('arrow-left')} />}
            >
                <div className={cx('header')}>
                    {user ? (
                        <Link to="/profile" onClick={handleClickLinkLeft}>
                            <Avatar url={user?.user?.avatar} className={cx('avatar')} />
                        </Link>
                    ) : (
                        <>
                            <AccountIcon />
                            <Link to="/login">Đăng nhập</Link>/<Link to="/signup">Đăng ký</Link>
                        </>
                    )}
                </div>
                <div className={cx('list-item')}>
                    <ul>
                        <li>
                            <Link to="/#sale" onClick={handleClickLinkLeft}>
                                Ưu đãi hôm nay
                            </Link>
                        </li>
                        <li>
                            <Link to="/#recommend" onClick={handleClickLinkLeft}>
                                Gợi ý
                            </Link>
                        </li>
                        <li>
                            <Link to="/#news" onClick={handleClickLinkLeft}>
                                Mới nhất
                            </Link>
                        </li>
                        {categories &&
                            categories.map((category, index) => (
                                <>
                                    <li>
                                        <Link
                                            index={index}
                                            to="/product"
                                            onClick={handleClickLinkLeft}
                                            state={{ category: category.name }}
                                        >
                                            {category.name}
                                        </Link>
                                        <FontAwesomeIcon
                                            icon={faChevronRight}
                                            className={cx('right-icon', { isShow: isShowLevel2 === index })}
                                            onClick={() =>
                                                isShowLevel2 === index ? setIsShowLevel2(null) : setIsShowLevel2(index)
                                            }
                                        />
                                    </li>
                                    <ul className={cx({ isShow: index === isShowLevel2 })}>
                                        {category.categorySub.map((item, index2) => (
                                            <li className={cx('level-2')}>
                                                <Link
                                                    key={index2}
                                                    to="/product"
                                                    onClick={handleClickLinkLeft}
                                                    state={{ category: category.name, categorySub: item }}
                                                >
                                                    {item}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ))}
                        <li>
                            <Link to="/wishlist" onClick={handleClickLinkLeft}>
                                <FavouriteIcon /> Yêu thích ({wishlist?.products?.length || 0})
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" onClick={handleClickLinkLeft}>
                                <CartIcon /> Giỏ hàng ({cart?.items?.length || 0})
                            </Link>
                        </li>
                        {user && (
                            <li>
                                <Link to="/profile" onClick={handleClickLinkLeft}>
                                    <AccountIcon />
                                    Thông tin
                                </Link>
                            </li>
                        )}
                        {user && myShop && (
                            <li>
                                <Link to="/myshop" onClick={handleClickLinkLeft}>
                                    <ProductIcon />
                                    Cửa hàng
                                </Link>
                            </li>
                        )}
                        {user && (
                            <li
                                onClick={() => {
                                    handleLogout();
                                    handleClickLinkLeft();
                                }}
                            >
                                <Link>
                                    <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </WrapperModel>
            <WrapperModel
                className={cx('mobile-right')}
                showToLeft
                show={showHeaderRight}
                onClose={() => setShowHeaderRight(false)}
                closeBtn={<span className={cx('btn-cancel')}>Hủy</span>}
            >
                <div className={cx('header')}>
                    <Search className={cx('search-mobile')} onClickProduct={() => setShowHeaderRight(false)} />
                </div>
            </WrapperModel>
        </div>
    );
}

export default HeaderMobile;
