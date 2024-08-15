const http = require("http");
const ping = require("ping");
const readline = require("readline");

async function measureHttpLatency(host, path) {
  const options = {
    hostname: host,
    port: 3000,
    path: path,
    method: "GET",
  };

  const start = process.hrtime();
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        const end = process.hrtime(start);
        const latency = end[0] * 1000 + end[1] / 1000000;
        resolve(latency);
      });
    });

    req.on("error", (err) => {
      console.error(`Request error: ${err.message}`);
      resolve(null);
    });

    req.end();
  });
}

async function measurePingLatency(host, numOfPings = 5) {
  const pingResults = [];
  let packetLossCount = 0;

  for (let i = 0; i < numOfPings; i++) {
    const res = await ping.promise.probe(host);
    if (res.alive) {
      pingResults.push(res.time);
    } else {
      packetLossCount++;
    }
  }

  const avgLatency =
    pingResults.reduce((a, b) => a + b, 0) / pingResults.length;
  const packetLoss = (packetLossCount / numOfPings) * 100;

  console.log(`Ping Results for ${host}:`);
  console.log(`Average Latency: ${avgLatency.toFixed(2)} ms`);
  console.log(`Packet Loss: ${packetLoss.toFixed(2)}%`);

  return { avgLatency, packetLoss };
}

async function performTest(host) {
  const path = "/test";

  const httpLatency = await measureHttpLatency(host, path);
  console.log(
    `HTTP Latency: ${httpLatency ? httpLatency.toFixed(2) : "N/A"} ms`
  );

  const { avgLatency, packetLoss } = await measurePingLatency(host);

  console.log(`Returned Values from measurePingLatency:`);
  console.log(
    `Average Ping Latency: ${avgLatency ? avgLatency.toFixed(2) : "N/A"} ms`
  );
  console.log(`Packet Loss: ${packetLoss ? packetLoss.toFixed(2) : "N/A"}%`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter server IP or hostname: ", (host) => {
  performTest(host).then(() => rl.close());
});
