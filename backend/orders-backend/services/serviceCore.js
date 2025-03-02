const util = require("../utils/utility");
const {fetchFirst, fetchSelected, fetchAll, executeReturning} = require("../database/queries");
const rmDuplicates = util.rmDuplicates;
const cleanEntities = util.cleanEntities;
const retrievingErrorTxt = "Error while retrieving ";

async function getAllQuery(sql) {
    try {
        return await fetchAll(sql);
    } catch (err) {
        console.log(retrievingErrorTxt + "for query: " + sql + " | " + err);
        return [];
    }
}

async function getFirstQuery(sql) {
    return await fetchFirst(sql);
}

async function updateQuery(sql) {
    return await executeReturning(sql);
}

module.exports = {
    getFirstQuery: getFirstQuery,
    getAllQuery: getAllQuery,
    updateQuery: updateQuery,
    fetchSelected: fetchSelected,
    rmDuplicates: rmDuplicates,
    cleanEntities: cleanEntities
};