importScripts('wasm_exec.js');

const wasm_url = "core.wasm";
const go = new Go();

onmessage = async ({
  data
}) => {
  let messageType = data.status

  if (messageType === "load") {
    postMessage('Worker loading');
    server = await wsConnect();

    if (!WebAssembly.instantiateStreaming) { // polyfill
      WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
      };
    }

    WebAssembly.instantiateStreaming(fetch(wasm_url), go.importObject).then((result) => {
      go.run(result.instance);
    });

    postMessage('Wasm loading');
  }
  if (messageType === "run") {
    postMessage('Runing');
    server.onmessage = ({
      data
    }) => {
      if (data.length > 5) {
        // send raw data to golang
        loadSignal(data)
      }
    };
  }
  if (messageType === "windows-size") {
    let windows = JSON.stringify(data.windows)
    setWindowsSize(windows)

  }
  if (messageType === "close") {
    server.close();
    postMessage('Closing');
  }
}

const wsConnect = async () => {
  return new Promise(function (resolve, reject) {
    let server = new WebSocket("ws://surface-scanner.local:81/", [
      "arduino",
    ]);
    server.onopen = function () {
      resolve(server);
    };
    server.onerror = function (err) {
      reject(err);
    };
  });
}

// incoming function for send points to deawer stage (canvas)
function sendScreenUpdate(bs64) {
  if (bs64.length > 10) {

    postMessage(bs64);
  }
}