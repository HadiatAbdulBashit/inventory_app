import axios from "axios"
import { toast } from "react-toastify"

const verifyUser = async (setUser) => {
    const isLogin = JSON.parse(localStorage.getItem('user') || {})
    if (isLogin.isLoggedIn) {
        try {
            const response = await axios.get('/api/auth/me')
            setUser({ ...response.data, isLoggedIn: true })
        } catch (error) {
            setUser({ isLoggedIn: false })
            localStorage.setItem('user', JSON.stringify({ isLoggedIn: false }))
            toast.error('Your sesion has out, please login again to your acount')
        }
    }
}

export default verifyUser;