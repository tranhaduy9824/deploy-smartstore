import { showAlert } from '~/redux/actions/alert';

const isValidEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const handleValidation = (fullname, email, password, confirmPassword, dispatch) => {
    let isValid = true;

    if (!fullname.trim()) {
        dispatch(showAlert('Vui lòng nhập họ và tên.'));
        isValid = false;
    } else if (!email.trim() || !isValidEmail(email)) {
        dispatch(showAlert('Vui lòng nhập email hợp lệ.'));
        isValid = false;
    } else if (password.length < 8) {
        dispatch(showAlert('Vui lòng nhập mật khẩu có ít nhất 8 ký tự.'));
        isValid = false;
    } else if (password !== confirmPassword) {
        dispatch(showAlert('Mật khẩu không khớp!'));
        isValid = false;
    }

    return isValid;
};
