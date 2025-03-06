import { Express, json } from "express";
import cors from "cors";

export const appSetup = (app: Express) => {
  try {
    const PORT = Number(process.env.PORT) || 3001;

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};
