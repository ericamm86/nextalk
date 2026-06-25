const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const databaseName = process.env.PGDATABASE || "nextalk";

const adminConfig = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: "postgres",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD,
};

const appConfig = {
  ...adminConfig,
  database: databaseName,
};

async function ensureDatabase() {
  const client = new Client(adminConfig);
  await client.connect();

  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [databaseName]
  );

  if (result.rows.length === 0) {
    await client.query(`CREATE DATABASE ${databaseName}`);
    console.log(`Banco '${databaseName}' criado.`);
  } else {
    console.log(`Banco '${databaseName}' ja existe.`);
  }

  await client.end();
}

async function runSchema() {
  const schemaPath = path.join(__dirname, "..", "database", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  const client = new Client(appConfig);

  await client.connect();
  await client.query(schema);
  await client.end();

  console.log("Schema aplicado com sucesso.");
}

async function main() {
  try {
    await ensureDatabase();
    await runSchema();
  } catch (error) {
    console.error("Erro ao configurar banco de dados:");
    console.error(error.message);
    process.exit(1);
  }
}

main();
