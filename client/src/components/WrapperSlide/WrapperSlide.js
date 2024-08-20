import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useGesture } from 'react-use-gesture';

function WrapperSlide({ data = [], currentIndex, setCurrentIndex, handleNext, handlePrev, timeDelay, children, className }) {
    useEffect(() => {
        if (timeDelay) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % data.length);
            }, timeDelay);

            return () => clearInterval(interval);
        }
    }, [data.length, timeDelay, currentIndex, setCurrentIndex]);

    const bind = useGesture({
        onDragEnd: ({ direction: [xDir] }) => {
            if (xDir < 0) {
                handleNext();
            } else if (xDir > 0) {
                handlePrev();
            }
        },
    });

    return (
        <div className={classNames({ [className]: className })} {...bind()}>
            {children}
        </div>
    );
}

export default WrapperSlide;
