import axios from "axios"
import { toast } from "react-toastify"

const verifyUser = async (setUser) => {
    const isLogin = JSON.parse(localStorage.getItem('user'))
    if (isLogin) {
        try {
            const response = await axios.get('/api/auth/me')
            setUser({ ...response.data, isLoggedIn: true })
            console.log(response);
        } catch (error) {
            setUser({ isLoggedIn: false })
            localStorage.setItem('user', JSON.stringify({ isLoggedIn: false }))
            toast.error(error.response.data.message)
        }
    }
}

export default verifyUser;