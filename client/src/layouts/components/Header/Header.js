/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import style from './Header.module.scss';
import images from '~/assets/images';
import Search from '~/components/Search';
import {
    AccountIcon,
    CartIcon,
    DownIcon,
    FavouriteIcon,
    RecentlyIcon,
    SaleIcon,
    ThunderIcon,
} from '~/components/Icons';
import ButtonIcon from '~/components/ButtonIcon';
import WrapperHover from '~/components/WrapperHover';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import ItemHover from './ItemHover/ItemHover';
import { useContext, useEffect } from 'react';
import { AuthContext } from '~/context/AuthContext';
import Avatar from '~/components/Avatar';
import { CategoryContext } from '~/context/CategoryContext';
import { ProductContext } from '~/context/ProductContext';
import { CartContext } from '~/context/CartContext';
import ViewQuickCart from './ViewQuickCart';
import { WishlistContext } from '~/context/WishlistContext';
import HeaderMobile from './HeaderMobile';
import { ShopContext } from '~/context/ShopContext';

const cx = classNames.bind(style);

function Header() {
    const navigate = useNavigate();
    const { user, handleLogout } = useContext(AuthContext);
    const { categories } = useContext(CategoryContext);
    const { recentProducts, getRecentProducts, addProductToRecent } = useContext(ProductContext);
    const { cart } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);
    const { myShop, getMyShop } = useContext(ShopContext);

    useEffect(() => {
        getRecentProducts();
    }, []);

    useEffect(() => {
        if (user) {
            getMyShop(user?.token);
        }
    }, [user, getMyShop]);

    return (
        <header className={cx('wrapper')}>
            <div className={cx('header-main')}>
                <div className={cx('box-logo')}>
                    <NavLink to="/">
                        <img src={images.logo_and_text} alt="Logo" />
                    </NavLink>
                </div>
                <Search />
                <div className={cx('box-btn-user')}>
                    <div className={cx('support')}>
                        <span>0867 125 575</span>
                        <p>Hỗ trợ 24/7</p>
                    </div>
                    <WrapperHover
                        content={
                            user
                                ? myShop
                                    ? [
                                          { title: 'Thông tin', to: '/profile' },
                                          { title: 'Cửa hàng', to: '/myshop' },
                                          { title: 'Đăng xuất', onClick: handleLogout },
                                      ]
                                    : [
                                          { title: 'Thông tin', to: '/profile' },
                                          { title: 'Đăng xuất', onClick: handleLogout },
                                      ]
                                : 'Đăng nhập'
                        }
                        end
                        className={cx('box-hover', { 'is-user': user })}
                    >
                        {user ? (
                            <div className={cx('avatar')}>
                                <Avatar url={user.user.avatar} />
                            </div>
                        ) : (
                            <ButtonIcon to="/login" className={cx('icon-header-user', 'account-icon')}>
                                <AccountIcon />
                            </ButtonIcon>
                        )}
                    </WrapperHover>
                    <WrapperHover content="Yêu thích" end className={cx('box-hover')}>
                        <ButtonIcon
                            count={wishlist?.products?.length || '0'}
                            to="/wishlist"
                            className={cx('icon-header-user', 'favourite-icon')}
                        >
                            <FavouriteIcon />
                        </ButtonIcon>
                    </WrapperHover>
                    <WrapperHover
                        content={user && cart?.items?.length > 0 ? <ViewQuickCart cart={cart} /> : 'Giỏ hàng của tôi'}
                        end
                        className={cx('box-hover', { cart: user && cart?.items?.length > 0 })}
                    >
                        <div className={cx('box-cart')}>
                            <ButtonIcon
                                count={cart?.items?.length || '0'}
                                to="/cart"
                                className={cx('icon-header-user', 'cart-icon')}
                            >
                                <CartIcon />
                            </ButtonIcon>
                            <NavLink to="/cart">
                                <div className={cx('cart-text')}>
                                    <span className={cx('title')}>Giỏ hàng của tôi</span>
                                    <span className={cx('cart-price-total')}>0 VND</span>
                                </div>
                            </NavLink>
                        </div>
                    </WrapperHover>
                </div>
            </div>
            <div className={cx('header-bottom')}>
                <div className={cx('box-categories')}>
                    <WrapperHover
                        start
                        noIcon
                        content={
                            <ul>
                                <ItemHover to="/#sale">Ưu đãi hôm nay</ItemHover>
                                <ItemHover to="/#recommend">Gợi ý</ItemHover>
                                <ItemHover to="/#news">Mới nhất</ItemHover>
                                {categories &&
                                    categories.map((category, index) => (
                                        <ItemHover
                                            index={index}
                                            contentHover={category.categorySub.map((item, index2) => ({
                                                category: category.name,
                                                categorySub: item,
                                                to: '/product',
                                            }))}
                                            to="/product"
                                            category
                                        >
                                            {category.name}
                                        </ItemHover>
                                    ))}
                            </ul>
                        }
                        className={cx('hover-box-categories')}
                    >
                        <Button
                            iconLeft={<FontAwesomeIcon icon={faBars} />}
                            className={cx('wrapper-categories')}
                            classNameSub={cx('item-categories')}
                            classNameIcon={cx('icon-item-categories')}
                        >
                            Sản phẩm theo thể loại
                        </Button>
                    </WrapperHover>
                </div>
                <div className={cx('list-item-navigate')}>
                    <Button
                        iconLeft={<ThunderIcon />}
                        className={cx('wrapper-item-navigate')}
                        classNameSub={cx('item-navigate')}
                        classNameIcon={cx('icon-left-item')}
                        onClick={() => navigate('/product', { state: { selectedSort: 1 } })}
                    >
                        Phổ biến
                    </Button>
                    <Button
                        iconLeft={<SaleIcon />}
                        className={cx('wrapper-item-navigate')}
                        classNameSub={cx('item-navigate')}
                        classNameIcon={cx('icon-left-item')}
                        onClick={() => navigate('/product', { state: { sale: true } })}
                    >
                        Giá đặc biệt
                    </Button>
                    <Button to="/" className={cx('wrapper-item-navigate')} classNameSub={cx('item-navigate')}>
                        Trang chủ
                    </Button>
                    <WrapperHover
                        content={[
                            { title: 'Sản phẩm', to: '/product' },
                            { title: 'Giỏ hàng', to: '/cart' },
                            { title: 'Thanh toán', to: '/payment', state: { items: cart?.items } },
                        ]}
                        classNameWrapper={cx('wrapper-hover-navigate')}
                    >
                        <Button
                            iconRight={<DownIcon />}
                            className={cx('wrapper-item-navigate')}
                            classNameSub={cx('item-navigate')}
                            classNameIcon={cx('icon-right-item')}
                            to="/product"
                        >
                            Sản phẩm
                        </Button>
                    </WrapperHover>
                    <WrapperHover
                        content={['Blog mặc định', 'Bài đăng đơn']}
                        classNameWrapper={cx('wrapper-hover-navigate')}
                    >
                        <Button
                            iconRight={<DownIcon />}
                            className={cx('wrapper-item-navigate')}
                            classNameSub={cx('item-navigate')}
                            classNameIcon={cx('icon-right-item')}
                        >
                            Blog
                        </Button>
                    </WrapperHover>
                    <WrapperHover
                        content={['Về chúng tôi', 'Liên hệ chúng tôi', 'Câu hỏi thường gặp', 'Trang 404', 'Sắp ra mắt']}
                        classNameWrapper={cx('wrapper-hover-navigate')}
                    >
                        <Button
                            iconRight={<DownIcon />}
                            className={cx('wrapper-item-navigate')}
                            classNameSub={cx('item-navigate')}
                            classNameIcon={cx('icon-right-item')}
                        >
                            Trang
                        </Button>
                    </WrapperHover>
                    <Button className={cx('wrapper-item-navigate')} classNameSub={cx('item-navigate')}>
                        Thương hiệu
                    </Button>
                </div>
                <div className={cx('recently-view')}>
                    <WrapperHover
                        content={
                            <ul>
                                {recentProducts?.map((product, index) => (
                                    <li key={index}>
                                        <Link
                                            to={`/product/${product.id}`}
                                            onClick={() =>
                                                addProductToRecent({ _id: product?.id, imageUrl: product?.imageUrl })
                                            }
                                        >
                                            <img src={product.imageUrl} alt="Ảnh được xem gần đây" />
                                        </Link>
                                    </li>
                                ))}
                                {recentProducts.length === 0 && <span>Chưa có sản phẩm nào được xem gần đây</span>}
                            </ul>
                        }
                        end
                        classNameWrapper={cx('wrapper-hover-recently')}
                    >
                        <Button
                            iconLeft={<RecentlyIcon />}
                            className={cx('wrapper-item-recently')}
                            classNameSub={cx('item-recently')}
                            classNameIcon={cx('icon-item-recently')}
                        >
                            Đã xem gần đây
                        </Button>
                    </WrapperHover>
                </div>
            </div>
            <HeaderMobile categories={categories} myShop={myShop} />
        </header>
    );
}

export default Header;
