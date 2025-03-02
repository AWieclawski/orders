const core = require("./serviceCore");
const {Position} = require("../models/EntityModels");

async function getPositionById(id) {
    return await core.getFirstQuery(`select *
                                     from main.positions
                                     where id = ${id}`);
}

async function getPositionByOrder(order) {
    return await core.getFirstQuery(`select *
                                     from main.positions
                                     where order_id = ${order}`);
}

async function updatePosition(dto, position) {
    const updSet = Position.getUpdatableSet(dto);
    const sql = `update main.positions
                 set ${updSet}
                 where id = ${position.id}
                 RETURNING * `;
    return await core.updateQuery(sql);
}

async function savePosition(dto) {
    const insSet = Position.getInsertableSet(dto);
    const sql = `insert into main.positions ${insSet} RETURNING * `;
    return await core.updateQuery(sql);
}


async function deletePosition(position) {
    const sql = `DELETE
                 FROM main.positions
                 WHERE id = ${position.id}
                 RETURNING * `;
    return await core.updateQuery(sql);
}


module.exports = {
    getPositionById: getPositionById,
    getPositionByOrder: getPositionByOrder,
    updatePosition: updatePosition,
    savePosition: savePosition,
    deletePosition: deletePosition
};