import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import styles from './Loading.module.scss';
import WrapperModel from "../WrapperModel";

const cx = classNames.bind(styles);

function Loading() {
    const { show } = useSelector((state) => state.loading)

    return (
        <WrapperModel show={show} noClose classIcon={cx('icon-close')} className={cx('bgr-color')}>
            <div className={cx('wrapper')}>
                <div className={cx('box1')}></div>
                <div className={cx('box2')}></div>
                <div className={cx('box3')}></div>
            </div>
        </WrapperModel>
    );
}

export default Loading;