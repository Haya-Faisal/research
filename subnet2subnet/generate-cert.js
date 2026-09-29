const selfsigned = require("selfsigned");
const fs = require("fs");

const attrs = [{ name: "commonName", value: "localhost" }];

selfsigned.generate(attrs, { days: 365 }, (err, pems) => {
  if (err) {
    console.error("Error generating cert:", err);
    return;
  }
  console.log("pems object:", pems); // debug: see what we actually got back

  fs.writeFileSync("key.pem", pems.private);
  fs.writeFileSync("cert.pem", pems.cert);
  console.log("Generated key.pem and cert.pem successfully");
});
