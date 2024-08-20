export const showAlert = (message, onConfirm = null) => ({
    type: 'SHOW_ALERT',
    payload: {
        message,
        onConfirm,
    },
});

export const hideAlert = () => ({
    type: 'HIDE_ALERT',
});
