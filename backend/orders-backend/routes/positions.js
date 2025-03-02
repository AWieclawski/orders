const core = require("./routerCore");
const router = core.router;
const service = require("../services/positionService");
const mapper = require("../mappers/positionMapper");
const {Position} = require("../models/EntityModels");
const {PositionDto} = require("../models/DtoModels");
const errorTxt = "Error while ";
const warnTxt = `Position post failed!`;

router.get("/by-order", async (req, res) => {
    const {order } = req.query;
    if (order) {
        console.log(`received: `, order);
        const found = await service.getPositionByOrder(order);
        res.json(found);
    } else {
        console.warn(warnTxt, order);
        res.json({error: `${warnTxt}`});
    }
});

/**
 * https://masteringjs.io/tutorials/express/post
 */
router.post("/update", async (req, res) => {
    const position = req.body;
    if (position) {
        console.log(`received: `, position);
        const updated = await updatePosition(position);
        res.json(updated);
    } else {
        console.warn(warnTxt, position);
        res.json({error: `${warnTxt}`});
    }
});

router.post("/save", async (req, res) => {
    const position = req.body;
    if (position) {
        console.log(`received: `, position);
        const saved = await savePosition(position);
        res.json(saved);
        console.log(`saved: `, saved);
    } else {
        console.warn(warnTxt, position);
        res.json({error: `${warnTxt}`});
    }
});

router.delete("/delete", async (req, res) => {
    const {position} = req.query;
    if (position) {
        console.log(`received: `, position);
        const deleted = await deletePosition(position);
        res.json(deleted);
        console.log(`deleted: `, deleted);
    } else {
        console.warn(warnTxt, position);
        res.json({error: `${warnTxt}`});
    }
});

async function updatePosition(dto) {
    const posDto = new PositionDto(dto);
    posDto.validateNumbers();
    let entity = await service.getPositionById(posDto.key);
    if (!(entity)) {
        entity = await savePosition(dto);
        return entity;
    }
    let position = new Position(entity);
    try {
        await service.updatePosition(posDto, position);
        const updated = await service.getPositionById(posDto.key);
        return mapper.positionToDto(updated);
    } catch (err) {
        console.error(errorTxt, " updating: ", position, " | ", err.message);
    }
}

async function savePosition(dto) {
    const posDto = new PositionDto(dto);
    posDto.validateNumbers();
    try {
        const saved = await service.savePosition(posDto);
        if (saved) {
            return mapper.positionsToDtos(saved)[0];
        } else {
            return posDto;
        }
    } catch (err) {
        console.error(errorTxt, " saving: ", posDto, " | ", err.message);
    }
}


async function deletePosition(id) {
    let entity = await service.getPositionById(id);
    try {
        const deleted = await service.deletePosition(entity); // return Array
        if (deleted) {
            return mapper.positionsToDtos(deleted)[0];
        } else {
            return id;
        }
    } catch (err) {
        console.error(errorTxt, " deleting: ", entity, " | ", err.message);
    }
}


module.exports = {router: router};