import { Request, generateRequest, v1Request } from '../index';

import { SlpMatchData } from 'src/store/parser/types';

const slpMatchUploadRequest = (data: File[]) => {
    const formData = new FormData();
    data.forEach((file, i) => {
        formData.append(`slp_replay${i}`, data[i], data[i].name);
    });

    return generateRequest<SlpMatchData[]>(
        Request
            .setData(formData)
            .setUrl('/parser/parse')
            .setMethod('post')
    ).then(res => res.data);
};

export { slpMatchUploadRequest };