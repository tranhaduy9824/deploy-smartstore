import { useEffect, useId, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './BoxInput.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function BoxInput({ value, onChange, onKeyPress, label, email = false, onFocus, isPassword = false, className }) {
    const [focus, setFocus] = useState(false);
    const [eye, setEye] = useState(false);
    const uniqueId = useId();

    const handleEyePassword = () => {
        setEye(!eye);
    };

    useEffect(() => {
        if (onFocus) {
            setFocus(true);
        }
    }, [onFocus]);

    return (
        <div className={cx('wrapper', className)}>
            <label htmlFor={`input-${uniqueId}`} className={cx({ focus: focus })}>
                {label}
            </label>
            <input
                id={`input-${uniqueId}`}
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                type={email ? 'email' : isPassword ? (!eye ? 'password' : 'text') : 'text'}
                onFocus={() => setFocus(true)}
                onBlur={() => !value && setFocus(false)}
                required
                className={cx({ password: isPassword })}
            />
            {isPassword && (
                <FontAwesomeIcon
                    icon={eye ? faEyeSlash : faEye}
                    onClick={handleEyePassword}
                    className={cx('eye-icon')}
                />
            )}
        </div>
    );
}

export default BoxInput;
