const login = (state = {
    isLogin: false
}, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isLogin: true
            }
        default:
            return state
    }
}

export default login