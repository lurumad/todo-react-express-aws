import express from "express";
import { appSetup } from "./setup/init";
import { routerContollersSetup } from "./setup/router.controllers";
import { middlewaresSetup } from "./setup/middlewares";
import { routerSetup } from "./setup/router";

const app = express();

routerSetup(app);
middlewaresSetup(app);
appSetup(app);
routerContollersSetup(app);
