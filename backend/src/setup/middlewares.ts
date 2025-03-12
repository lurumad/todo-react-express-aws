import { NotFoundErrorMapper } from "@/infrastructure/error-mappers/NotFoundErrorMapper";
import bodyParser from "body-parser";
import { Express, NextFunction, Request, Response } from "express";
import { User } from "@/domain/entities/model";
import cors from "cors";
import { HttpProblemResponse } from "express-http-problem-details";
import {
  DefaultMappingStrategy,
  MapperRegistry,
} from "http-problem-details-mapper";
import { OAuth2Client } from "google-auth-library";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const strategy = new DefaultMappingStrategy(
  new MapperRegistry().registerMapper(new NotFoundErrorMapper())
);

export const middlewaresSetup = (app: Express) => {
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }))
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(verifyGoogleToken);
  app.use(HttpProblemResponse({ strategy }));
};

const verifyGoogleToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (process.env.NODE_ENV === "test") {
    req.user = {
      userId: "test",
      email: "test@test.com",
    };
    next();
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return
  }

  const token = authHeader.split(" ")[1];

  try {
    const info = await client.getTokenInfo(token);

    if (!info.email_verified) {
      res.status(401).json({ error: "Email not verified" });
      return;
    }

    if (!info.sub) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.user = {
      userId: info.sub,
      email: info.email,
    };

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
