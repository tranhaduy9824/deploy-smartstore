import classNames from "classnames/bind";
import styles from './WrapperAnimation.module.scss';

const cx = classNames.bind(styles);

function WrapperAnimation({ show, inFromLeft, inFromRight, outToLeft, outToRight, showItem, hiddenItem, className, children }) {

    const classes = cx('wrapper', {
        'in-from-left': inFromLeft && show,
        'in-from-right': inFromRight && show,
        'show-item': showItem && show,
        'out-to-left': outToLeft && !show,
        'out-to-right': outToRight && !show,
        'hidden-item': hiddenItem && !show,
        [className]: className
    })

    return (
        <div className={classes}>
            {children}
        </div>
    );
}

export default WrapperAnimation;