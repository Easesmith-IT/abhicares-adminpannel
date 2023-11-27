

const initialState = {
    items: [],
    totalAmount:0,
}

const reducer = (state = initialState, action) => {

    if (action.type === 'ADD_ITEM') {
        const newItemsArray=state.items.concat(action.item)
        return {
            ...state,
            items:newItemsArray
        }
    }
    return state;
}

export default reducer;