/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import styles from './Shop.module.scss';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ProductItem from '~/components/ProductItem';
import Pagination from '~/components/Pagination';
import InfoShop from '~/components/InfoShop';

const cx = classNames.bind(styles);

function Shop() {
    const { state } = useLocation();
    const { avatar, productShop, shop } = state;

    useEffect(() => {
        window.scrollTo(0, 0);

        return () => {
            window.scrollTo(0, 0);
        };
    }, []);

    return (
        <div className={cx('wrapper')}>
            <InfoShop avatar={avatar} productShop={productShop} shop={shop} />
            <div className={cx('des')}>
                <h2 className={cx('title')}>Mô tả</h2>
                <p dangerouslySetInnerHTML={{ __html: shop?.description.replace(/\n/g, '<br>') }}></p>
            </div>
            <div className={cx('product-shop')}>
                <h2 className={cx('title')}>Sản phẩm của shop</h2>
                <div className={cx('list-product')}>
                    <Pagination data={productShop} limit={10}>
                        {({ item, index }) => (
                            <ProductItem numberSnippet={50} item={item} index={index} className={cx('product-item')} />
                        )}
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

export default Shop;
