import express from "express";
import { appSetup } from "./setup/init";
import { routerSetup } from "./setup/router";
import { middlewaresSetup } from "./setup/middlewares";

const app = express();

middlewaresSetup(app);
appSetup(app);
routerSetup(app);
