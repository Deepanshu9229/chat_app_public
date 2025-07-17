import { createSlice } from "@reduxjs/toolkit";
const socketSlice = createSlice({
    name:"socket",
    initialState:{
        socket:null,
    },
    reducers:{
        setSocket:(state, action)=>{
            state.socket = action.payload ;//? true : null;
        }
    }
});
export const {setSocket} = socketSlice.actions;
export default socketSlice.reducer;
