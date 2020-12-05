import axios, { AxiosRequestConfig, Method, AxiosPromise } from 'axios';
import { APIError } from './types';
import { ObjectSchema, ValidationError } from 'yup';

const API_ROOT = process.env.NODE_ENV === 'production' ? process.env.API_ROOT_PROD : process.env.IS_DOCKER ? process.env.API_ROOT_DEV_DOCK : process.env.API_ROOT_DEV_LOCAL;

console.log('API_ROOT', API_ROOT)

export const v1Request = axios.create({ baseURL: `${API_ROOT}`, withCredentials: true });

v1Request.interceptors.response.use(response => {
    return response;
}, err => {
    return Promise.reject({ reason: err.response.data.message });
})

const config = {
    baseURL: `${API_ROOT}`,
    headers: {
        'Content-Type': 'application/json',
        //authorization: token
    },
    withCredentials: true
};

const apiv1 = axios.create(config);

const generateRequest = <T extends object>(request: any): AxiosPromise<T> => {
    if (request.validationErrors) {
        return Promise.reject(request.validationErrors);
    };

    return v1Request(request.config);
};

export const Request = {
    config: {} as AxiosRequestConfig,
    validationErrors: null,
    setUrl (url: string) {
        this.config.url = url;
        return this;
    },
    setMethod (method: Method) {
        this.config.method = method;
        return this;
    },
    setData <T extends object>(data: T, schema?: ObjectSchema<T>) {
        if (schema) {
            try {
                schema.validateSync(data, { abortEarly: false });
    
                if (this.validationErrors) {
                    this.validationErrors = null;
                };
    
            } catch (e) {
                this.validationErrors = mapErrors(e);
            };
        };

        this.config.data = data;
        return this;
    },
    setOnUploadProgress (listener: (progressEvent) => void) {
        this.config.onUploadProgress = listener;
        return this;
    }
};

const mapErrors = <T extends string>(validationError: ValidationError): APIError<T> => {
    let validationErrors: APIError<T> = {};

    validationError.inner.forEach(error => {
        for (let key in error) {
            let errorKey = error.path as T;
            if (key === 'errors' && Array.isArray(error[key])) {
                validationErrors[errorKey] = [...error[key]]
            };
        };
    });

    return validationErrors;
};

/*const validateTransport = <T extends object>(data: T, schema: ObjectSchema<T>) => {
    try {
        schema.validateSync(data, { abortEarly: false });
        return;
    } catch (e) {
        return mapErrors(e);
    };
};*/

export { apiv1, generateRequest, mapErrors };