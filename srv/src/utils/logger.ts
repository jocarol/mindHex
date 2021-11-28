const logger = (req: { ip: any; body: any; }, res: any, next: () => void) => {
    console.log(`${new Date().toISOString()} | ${req.ip} | ${JSON.stringify(req.body.searchString)}`);
    next();
};

module.exports = logger;