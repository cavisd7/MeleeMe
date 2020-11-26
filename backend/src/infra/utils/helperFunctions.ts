const deepCopy = (obj) => {
    if (typeof obj !== "object" || obj === null) return obj;
  
    let outObject = Array.isArray(obj) ? [] : {}
  
    for (let key in obj) {
        let value = obj[key];
        outObject[key] = deepCopy(value);
    };
    return outObject;
};

export { deepCopy };
 