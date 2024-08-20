import classNames from 'classnames/bind';
import styles from './ManageProduct.module.scss';
import { useContext, useState } from 'react';
import HeaderSelect from '~/components/HeaderSelect/HeaderSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TrashIcon } from '~/components/Icons';
import { Link } from 'react-router-dom';
import ModelManageProduct from './ModelManageProduct';
import { ProductContext } from '~/context/ProductContext';
import { AuthContext } from '~/context/AuthContext';
import { formatPrice } from '~/handle/formatPrice';

const cx = classNames.bind(styles);

function ManageProduct({ productsShop }) {
    const [contentSelected, setContentSelected] = useState('all');
    const [searchValue, setSearchValue] = useState('');
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [productEdit, setProductEdit] = useState(null);

    const { user } = useContext(AuthContext);
    const { deleteProduct } = useContext(ProductContext);

    const listHeader = [
        { content: 'all', title: 'Tất cả' },
        { content: 'is-active', title: 'Đang hoạt động' },
        { content: 'out-stock', title: 'Hết hàng' },
        { content: 'not approved', title: 'Chờ duyệt' },
    ];

    const filteredProducts = productsShop?.filter((product) => {
        const matchesStatus =
            contentSelected === 'all' ||
            (contentSelected === 'is-active' && product.status === 'approved' && product.inStock === true) ||
            (contentSelected === 'out-stock' && product.inStock === false) ||
            product.status === contentSelected;

        const matchesSearch = product.name.toLowerCase().includes(searchValue.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('box-title')}>
                <p className={cx('title')}>Quản lý sản phẩm</p>
                <div className={cx('add-product')} onClick={() => setShowAddProduct(true)}>
                    <FontAwesomeIcon icon={faPlus} /> Thêm sản phẩm
                </div>
            </div>
            <HeaderSelect
                listHeader={listHeader}
                contentSelected={contentSelected}
                setContentSelected={setContentSelected}
            />
            <div className={cx('search')}>
                <input
                    placeholder="Nhập tên sản phẩm"
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <span>{filteredProducts?.length} Sản Phẩm</span>
            </div>
            <div className={cx('list-product')}>
                {filteredProducts?.map((product, index) => (
                    <div key={index} className={cx('product-item')}>
                        <Link
                            to={
                                (contentSelected === 'is-active' || contentSelected === 'all') &&
                                product.status === 'approved' &&
                                product.inStock === true
                                    ? `/product/${product?._id}`
                                    : ''
                            }
                        >
                            <img src={product?.files?.photos[0]} alt={'Ảnh'} />
                        </Link>
                        <Link
                            to={
                                (contentSelected === 'is-active' || contentSelected === 'all') &&
                                product.status === 'approved' &&
                                product.inStock === true
                                    ? `/product/${product?._id}`
                                    : ''
                            }
                            className={cx('name')}
                        >
                            <p>{product?.name}</p>
                        </Link>
                        <p className={cx('price')}>Giá: {formatPrice(product?.price)}</p>
                        <div className={cx('controls')}>
                            <span
                                onClick={() => {
                                    setProductEdit(product);
                                    setShowEditProduct(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </span>
                            <span onClick={() => deleteProduct(product?._id, user?.token)}>
                                <TrashIcon />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <ModelManageProduct
                productEdit={productEdit}
                showEditProduct={showEditProduct}
                setShowEditProduct={setShowEditProduct}
            />
            <ModelManageProduct showEditProduct={showAddProduct} setShowEditProduct={setShowAddProduct} />
        </div>
    );
}

export default ManageProduct;
