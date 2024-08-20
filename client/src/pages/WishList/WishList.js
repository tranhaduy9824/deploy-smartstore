import classNames from 'classnames/bind';
import styles from './WishList.module.scss';
import { NavLink } from 'react-router-dom';
import Pagination from '~/components/Pagination';
import ProductItem from '~/components/ProductItem';
import { useContext, useEffect } from 'react';
import { AuthContext } from '~/context/AuthContext';
import { WishlistContext } from '~/context/WishlistContext';

const cx = classNames.bind(styles);

function WishList() {
    const { user } = useContext(AuthContext);
    const { wishlist, getWishlist } = useContext(WishlistContext);

    useEffect(() => {
        if (user) {
            getWishlist(user.token);
        }
    }, [user, getWishlist]);

    const wishlistReverse = [...(wishlist?.products || [])].reverse();

    return (
        <div className={cx('wrapper')}>
            <h1>Yêu thích</h1>
            <div className={cx('site')}>
                <NavLink to="/" className={cx('navigate')}>
                    Trang chủ
                </NavLink>
                <span> / </span>
                <NavLink>Yêu thích</NavLink>
            </div>
            <div className={cx('content')}>
                <div className={cx('grid-product')}>
                    <Pagination data={wishlistReverse} limit={10}>
                        {({ item, index }) => (
                            <ProductItem numberSnippet={50} item={item} index={index} className={cx('product-item')} />
                        )}
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

export default WishList;
