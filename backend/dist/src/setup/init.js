"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appSetup = void 0;
const appSetup = (app) => {
    try {
        const PORT = Number(process.env.PORT) || 3001;
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    }
    catch (e) {
        console.error(e);
    }
};
exports.appSetup = appSetup;
