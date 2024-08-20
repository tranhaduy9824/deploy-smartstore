import classNames from 'classnames/bind';
import styles from './ModelManageProduct.module.scss';
import { useContext, useEffect, useState } from 'react';
import WrapperModel from '~/components/WrapperModel';
import { CategoryContext } from '~/context/CategoryContext';
import { ProductContext } from '~/context/ProductContext';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

function ModelManageProduct({ productEdit, showEditProduct, setShowEditProduct }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [sale, setSale] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [video, setVideo] = useState(null);
    const [category, setCategory] = useState('');
    const [categorySub, setCategorySub] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [inStock, setInStock] = useState(true);

    const { user } = useContext(AuthContext);
    const { categories } = useContext(CategoryContext);
    const { updateProduct, addProduct } = useContext(ProductContext);

    useEffect(() => {
        setName(productEdit?.name || '');
        setDescription(productEdit?.des || '');
        setPrice(productEdit?.price || 0);
        setSale(productEdit?.sale || 0);
        setPhotos(productEdit?.files?.photos || []);
        setVideo(productEdit?.files?.video || null);
        setCategory(productEdit?.category || '');
        setCategorySub(productEdit?.categorySub || '');
        setShippingCost(productEdit?.shippingCost || 0);
        setInStock(productEdit?.inStock);
    }, [productEdit]);

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        const validPhotos = files.filter((file) => file instanceof Blob && file.type.startsWith('image/'));
        setPhotos(validPhotos);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file instanceof Blob && file.type === 'video/mp4') {
            setVideo(file);
        } else {
            setVideo(null);
        }
    };

    const handleUpdateProduct = async () => {
        if (productEdit) {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('des', description);
            formData.append('price', price);
            formData.append('sale', sale);
            formData.append('category', category);
            formData.append('categorySub', categorySub);
            formData.append('shippingCost', shippingCost);
            formData.append('inStock', inStock);

            photos.forEach((photo) => formData.append('photos', photo));
            if (video) {
                formData.append('video', video);
            }

            await updateProduct(productEdit._id, formData, user?.token);
            setShowEditProduct(false);
            setPhotos([]);
        }
    };

    const handleAddProduct = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('des', description);
        formData.append('price', price);
        formData.append('sale', sale);
        formData.append('category', category);
        formData.append('categorySub', categorySub);
        formData.append('shippingCost', shippingCost);
        formData.append('inStock', inStock);

        photos.forEach((photo) => formData.append('photos', photo));
        if (video) {
            formData.append('video', video);
        }

        await addProduct(formData, user?.token);
        setShowEditProduct(false);
        setPhotos([]);
    };

    useEffect(() => {
        return () => {
            photos.forEach((photo) => {
                if (photo instanceof Blob) {
                    URL.revokeObjectURL(photo);
                }
            });
            if (video && video instanceof Blob) {
                URL.revokeObjectURL(video);
            }
        };
    }, [photos, video]);

    const listPhoto = photos.length > 0 ? photos : productEdit?.files?.photos || [];

    return (
        <WrapperModel
            show={showEditProduct}
            onClose={() => setShowEditProduct(false)}
            classNameContent={cx('model-edit-product')}
        >
            <h2>{productEdit ? 'Edit Product' : 'Add Product'}</h2>
            <div className={cx('info')}>
                <div className={cx('item-info')}>
                    <label htmlFor="name">Tên</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={cx('item-info')}>
                    <label htmlFor="description">Mô tả</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className={cx('item-info')}>
                    <label htmlFor="price">Giá (đ)</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className={cx('item-info')}>
                    <label htmlFor="sale">Giảm giá (%)</label>
                    <input type="number" id="sale" value={sale} onChange={(e) => setSale(e.target.value)} />
                </div>
                <div className={cx('item-info')}>
                    <label htmlFor="photos">Ảnh</label>
                    <div className={cx('photo-preview')}>
                        {listPhoto.map((photo, index) => {
                            const photoURL = photo instanceof Blob ? URL.createObjectURL(photo) : photo;
                            return (
                                <div key={index} className={cx('photo-item')}>
                                    <img src={photoURL} alt={`Ảnh ${index}`} />
                                </div>
                            );
                        })}
                    </div>
                    <input type="file" id="photos" multiple accept="image/*" onChange={handlePhotoChange} />
                </div>
                <div className={cx('item-info')}>
                    <label htmlFor="video">Video</label>
                    <div className={cx('video-preview')}>
                        {video && (
                            <div className={cx('video-item')}>
                                <video src={video instanceof Blob ? URL.createObjectURL(video) : video} controls />
                            </div>
                        )}
                        <input type="file" id="video" accept="video/mp4" onChange={handleVideoChange} />
                    </div>
                </div>
                <div className={cx('item-info')}>
                    <label htmlFor="category">Danh mục</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Chọn danh mục</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={cx('item-info')}>
                    <label htmlFor="categorySub">Danh mục phụ</label>
                    <select id="categorySub" value={categorySub} onChange={(e) => setCategorySub(e.target.value)}>
                        <option value="">Chọn danh mục phụ</option>
                        {categories
                            .find((cat) => cat.name === category)
                            ?.categorySub.map((subCat) => (
                                <option key={subCat} value={subCat}>
                                    {subCat}
                                </option>
                            ))}
                    </select>
                </div>
                <div className={cx('item-info')}>
                    <label htmlFor="shippingCost">Phí vận chuyển</label>
                    <input
                        type="number"
                        id="shippingCost"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(e.target.value)}
                    />
                </div>
                <div className={cx('item-info')}>
                    <label htmlFor="inStock">Còn hàng</label>
                    <input
                        type="checkbox"
                        id="inStock"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                    />
                </div>
            </div>
            <div className={cx('save-btn')} onClick={productEdit ? handleUpdateProduct : handleAddProduct}>
                {productEdit ? 'Lưu' : 'Thêm sản phẩm'}
            </div>
        </WrapperModel>
    );
}

export default ModelManageProduct;
