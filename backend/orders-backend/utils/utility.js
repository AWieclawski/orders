const {throws} = require("node:assert");
const isUndef = (value) => {
    return typeof value == 'undefined';
}

const rmDuplicates = (list) => {
    if (list) {
        if (Array.isArray(list)) {
            let tmp = new Set(list);
            return [...tmp];
        } else {
            return list;
        }
    }
    return [];
}


function cleanEntity(entity) {
    try {
        delete entity.id;
    } catch (err) {
        console.log("Entity cleaning error | " + err);
    }
}

const cleanEntities = (entities) => {
    if (entities) {
        if (Array.isArray(entities)) {
            entities.forEach((entity) => {
                cleanEntity(entity);
            })
        } else {
            cleanEntity(entities);
        }
    }
}

function validateNumber(value) {
    let result = value?.toString();
    const commas = (result?.match(/,/g) || [])?.length;
    const dots = (result?.match(/\./g) || [])?.length;
    if (dots === 0 && commas === 1) {
        result = result.replace(',', '.');
    }
    if (Number.isNaN(result)) {
        console.error("Input value is not correct Number!", value);
        return null;
    }
    return result;
}


module.exports = {
    isUndef: isUndef,
    rmDuplicates: rmDuplicates,
    cleanEntities: cleanEntities,
    validateNumber: validateNumber
};
