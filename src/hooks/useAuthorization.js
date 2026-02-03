import { useDispatch } from 'react-redux';
import { checkAuthorizationFun } from '../store/slices/autorizationSlice';
import toast from 'react-hot-toast';

const useAuthorization = () => {
    const dispatch = useDispatch();

    const checkAuthorization = async (err) => {
        console.log('inside auth hook')
        if (err && err.response && err.response.status === 403) {
            await dispatch(checkAuthorizationFun(true));
        } else {
            toast.error(err?.response?.data?.message);
            await dispatch(checkAuthorizationFun(false));
        }
    };


    return {
        checkAuthorization
    };
};

export default useAuthorization;
