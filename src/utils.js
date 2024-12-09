import {toast} from 'react-toastify'

export const handleSucess=(msg)=>{
    toast.success(msg,{
        position:'top-right'
    })
}
export const handleError=(msg)=>{
    toast.error(msg,{
        position:'top-right'
    })
}
// utils/auth.js
export const isUserLoggedIn = () => {
    return !!localStorage.getItem("userToken"); // Returns true if token exists
  };
  