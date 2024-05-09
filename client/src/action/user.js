import axios from 'axios'
import { setUser } from '../reducers/userReducer'
import {API_URL} from '../config'

export const register = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:8998/api/register', {
            email,
            password
        })
        console.log(response.data)
    } catch (e) {
        alert(e.response.data.message)
    }
}

export const login = (email, password) => {
    return async dispatch => {
        try {
            const response = await axios.post('http://localhost:8998/api/login', {
                email,
                password
            })
            dispatch(setUser(response.data.user))
            localStorage.setItem('token', response.data.token)
            console.log(response.data)
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

export const auth = () => {
    return async dispatch => {
        try {
            const response = await axios.get('http://localhost:8998/api/auth', 
               {headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}}
            )
 
            dispatch(setUser(response.data.user))
            localStorage.setItem('token', response.data.token)
            console.log(response.data)
        } catch (e) {
            console.log(e.response.data.msg)
            localStorage.removeItem('token')
        }
    }
}

export const uploadAvatar =  (file) => {
    return async dispatch => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await axios.post(`${API_URL}api/files/avatar`, formData,
                {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}

export const deleteAvatar = () => {
    return async dispatch => {
        try {
            const response = await axios.delete(`${API_URL}api/files/avatar`,
               {headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}}
            )
 
            dispatch(setUser(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}