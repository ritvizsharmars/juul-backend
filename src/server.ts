/**
 * Module for creation of server on a specific port
 * @module src/server
 */
import cors from "cors";
import express from "express";
import path from "path";
import { json, urlencoded } from "body-parser";
import env from "./util/env";
import { knexClient, initialize } from "./util/global";

const execute = async (): Promise<void> => {
  try {
    await initialize();
    const app = express();
    app.set("views", path.join(__dirname, "../views"));
    app.set("view engine", "ejs");
    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended: true }));

    app.get("/", (req, res) => res.render("index"));

    app.get("/accounts", async (req, res) => {
      try {
        const result = await knexClient.knex
          .withSchema("salesforce")
          .select(
            "account.id",
            "account.name",
            "account.phone",
            "account.website",
            "account.annualrevenue",
            "account.industry",
            "account.billingstreet"
          )
          .from("account");

        res.render("accounts", { result });
      } catch (err) {
        res.status(500).send();
      }
    });

    app.get("/knex", async (req, res) => {
      try {
        res.send({ hello: "db" });
      } catch (err) {
        res.status(500).send();
      }
    });

    app.listen(env.PORT, () =>
      console.log(`Example app listening on port ${env.PORT}!`)
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

execute();
