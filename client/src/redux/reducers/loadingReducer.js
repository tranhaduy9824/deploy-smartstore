const initialState = {
    show: false
}

const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_LOADING': 
            return { ...state, show: true }
        case 'HIDE_LOADING': 
            return { ...state, show: false }
        default:
            return state
    }
}

export default loadingReducer