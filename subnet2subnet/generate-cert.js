const selfsigned = require("selfsigned");
const fs = require("fs");

const attrs = [{ name: "commonName", value: "localhost" }];

async function main() {
  const pems = await selfsigned.generate(attrs, { days: 365 });
  fs.writeFileSync("key.pem", pems.private);
  fs.writeFileSync("cert.pem", pems.cert);
  console.log("Generated key.pem and cert.pem successfully");
}

main().catch((err) => {
  console.error("Error generating cert:", err);
});
