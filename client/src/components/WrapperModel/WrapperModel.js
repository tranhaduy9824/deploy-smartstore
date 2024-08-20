import { cloneElement, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './WrapperModel.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import WrapperAnimation from '../WrapperAnimation';

const cx = classNames.bind(styles);

function WrapperModel({
    show,
    showToRight,
    showToLeft,
    onClose,
    noClose,
    className,
    classNameContent,
    classIcon,
    children,
    closeBtn
}) {
    const [hidden, setHidden] = useState(!show);
    const [classHidden, setClassHidden] = useState(hidden);

    useEffect(() => {
        setHidden(!show);
    }, [show]);

    const handleClose = () => {
        setHidden(true);
        setTimeout(() => {
            onClose();
        }, 500);
    };

    useEffect(() => {
        if (!hidden) {
            setClassHidden(hidden);
        } else {
            setTimeout(() => {
                setClassHidden(hidden);
            }, 500);
        }
    }, [hidden]);

    return (
        <div
            className={cx('wrapper', { [className]: className, hidden: classHidden })}
            onClick={!noClose ? handleClose : undefined}
        >
            <WrapperAnimation
                showItem={!showToRight && !showToLeft}
                hiddenItem={!showToRight && !showToLeft}
                inFromLeft={showToRight}
                outToLeft={showToRight}
                inFromRight={showToLeft}
                outToRight={showToLeft}
                show={!hidden}
            >
                <div
                    className={cx('content', { [classNameContent]: classNameContent })}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                    {!noClose && !closeBtn && (
                        <FontAwesomeIcon
                            onClick={handleClose}
                            icon={faTimes}
                            className={cx('icon-clear', { [classIcon]: classIcon })}
                        />
                    )}
                    {closeBtn && cloneElement(closeBtn, { onClick: handleClose })}
                </div>
            </WrapperAnimation>
        </div>
    );
}

export default WrapperModel;
