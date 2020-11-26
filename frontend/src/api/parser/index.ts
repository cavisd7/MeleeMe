import { Request, generateRequest, v1Request } from '../index';

import { SLPMatchData } from 'src/store/parser/types';

interface SlpRequestParams {
    data: FormData
}

const slpMatchUploadRequest = (data: File[]) => {
    const formData = new FormData();
    data.forEach((file, i) => {
        formData.append(`slp_replay${i}`, data[i], data[i].name);
    });

    return generateRequest<SLPMatchData[]>(
        Request
            .setData(formData)
            .setUrl('/parser/parse')
            .setMethod('post')
            //.setOnUploadProgress()
    ).then(res => res.data);
};

export { slpMatchUploadRequest };