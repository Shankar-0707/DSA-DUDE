import API from "@/api/api";

export const uploadDocument = (file) => {
    const formdata = new FormData();
    formdata.append('pdfFile', file);

    // Override content type for file upload
    return API.post('/documents/upload', formdata,{
         headers: {
            'Content-Type': 'multipart/form-data',
        },
    }, {withCredentials : true});
}

export const getDocumentDetails = (docId) => {
    return API.get(`/documents/${docId}`, {withCredentials : true});
}

export const askQuestion = (docId, question) => {
    return API.post(`/documents/${docId}/qa`, {question}, {withCredentials : true});
}

export const getDocumentHistory = () => {
    return API.get(`/documents`, {withCredentials : true});
}


