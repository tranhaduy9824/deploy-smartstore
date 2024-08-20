const initialState = {
    show: false,
    message: '',
    onConfirm: null,
};

const alertReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_ALERT':
            return { ...state, show: true, message: action.payload.message, onConfirm: action.payload.onConfirm };
        case 'HIDE_ALERT':
            return { ...state, show: false, message: '', onConfirm: null };
        default:
            return state;
    }
};

export default alertReducer;