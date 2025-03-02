const core = require("./routerCore");
const router = core.router;
const service = require("../services/customersService");
const customerMapper = require("../mappers/customerMapper");

router.get("/", async (req, res) => {
    let dataSet = await service.getActiveCustomers();
    if (!(dataSet)) {
        dataSet = [];
    }
    const dtoSet = customerMapper.customersToDtos(dataSet);
    res.send(dtoSet);
});

router.get("/all", async (req, res) => {
    let dataSet = await service.getCustomers();
    if (!(dataSet)) {
        dataSet = [];
    }
    const dtoSet = customerMapper.customersToDtos(dataSet);
    res.send(dtoSet);
});

module.exports = router;
