import axios from 'axios'
import { setFiles, setCurrentDir, addFiles, deleteFileAction } from '../reducers/fileReducer'
import { addUploadFile, changeLoadFile, showUploader } from '../reducers/uploadReducer'
import { hideLoader } from '../reducers/appReducer'

export const getFiles = (dirId, sort) => {
    return async dispatch => {
        try {
            dispatch(showUploader())
            let url = 'http://localhost:8998/api/files'
            if(dirId) {
                url = `http://localhost:8998/api/files?parent=${dirId}`
            }
            if(sort) {
                url = `http://localhost:8998/api/files?sort=${sort}`
            }
            if (dirId && sort) {
                url = `http://localhost:8998/api/files?parent=${dirId}&sort=${sort}`
            }
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            dispatch(setFiles(response.data))
        } catch (e) {
            alert(e.response.data.msg)
        } finally {
            dispatch(hideLoader())
        }
    }
}

export const createDir = (dirId, name) => {
    return async dispatch => {
        try {
            const response = await axios.post(`http://localhost:8998/api/files`, {
                name,
                type: 'dir',
                parent: dirId
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            dispatch(addFiles(response.data))
        } catch (e) {
            alert(e.response.data.msg)
        }
    }
}

export function upload(file, dirId) {
    return async dispatch => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            if (dirId) {
                formData.append('parent', dirId)
            }
            const uploadFile = {name: file.name, progress: 0, id: Date.now()}
            dispatch(showUploader())
            dispatch(addUploadFile(uploadFile))
            const response = await axios.post(`http://localhost:8998/api/files/upload`, formData, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            });
            dispatch(addFiles(response.data))
        } catch (e) {
            alert(e?.response?.data?.message)
        }
    }
}

export const download = async (file) => {
    const response = await fetch(`http://localhost:8998/api/files/download?id=${file._id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    if (response.status === 200) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        link.remove()
    }
}

export const deleteFile = (file, dirId) => {
    return async dispatch => {
        try {
            const response = await axios.delete(`http://localhost:8998/api/files?id=${file._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(deleteFileAction(file._id))
        } catch (e) {
            alert(e.response.data.msg)
            console.log(e.response)
        }
    }
}

export const searchFiles = (search) => {
    return async dispatch => {
        try {
            const response = await axios.get(`http://localhost:8998/api/files/search?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(setFiles(response.data))
        } catch (e) {
            alert(e?.response?.data?.msg)
        } finally {
            dispatch(hideLoader())
        }
    }
}
