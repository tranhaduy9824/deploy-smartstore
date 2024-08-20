import classNames from 'classnames/bind';
import styles from './Quantity.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { memo, useState } from 'react';

const cx = classNames.bind(styles);

function Quantity({ quantityValue, setQuantityValue, className }) {
    const [localQuantity, setLocalQuantity] = useState(quantityValue);

    const minusQuantity = () => {
        setLocalQuantity((prev) => {
            const newQuantity = Math.max(prev - 1, 1);
            setQuantityValue(newQuantity);
            return newQuantity;
        });
    };

    const plusQuantity = () => {
        setLocalQuantity((prev) => {
            const newQuantity = prev + 1;
            setQuantityValue(newQuantity);
            return newQuantity;
        });
    };

    return (
        <div className={cx('wrapper', { [className]: className })}>
            <span onClick={minusQuantity}>
                <FontAwesomeIcon icon={faMinus} />
            </span>
            <input
                type="number"
                value={localQuantity}
                onChange={(e) => {
                    const value = Math.max(parseInt(e.target.value, 10), 1);
                    setLocalQuantity(value);
                    setQuantityValue(value);
                }}
            />
            <span onClick={plusQuantity}>
                <FontAwesomeIcon icon={faPlus} />
            </span>
        </div>
    );
}

export default memo(Quantity);
