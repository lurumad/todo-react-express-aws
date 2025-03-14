import express from "express";
import { appSetup } from "./setup/init";
import { routerContollersSetup } from "./setup/router.controllers";
import { postMiddlewaresSetup, preMiddlewaresSetup } from "./setup/middlewares";
import { routerSetup } from "./setup/router";

const app = express();
routerSetup(app);
preMiddlewaresSetup(app);
appSetup(app);
routerContollersSetup(app);
postMiddlewaresSetup(app);
