const rpc = require("./lib/rpc/connect-client-http.js").default;

exports.service = (async () => {
  const modules = await rpc();

  // Crear un contexto con todos los archivos en './someDirectory', incluyendo subdirectorios, que terminan en 'index.js'
  var requireModule = require.context("./service", true, /\.js$/);

  // Esto ejecutará la función de require para cada archivo correspondiente al contexto
  requireModule.keys().forEach(function (moduleName) {
    // Cargar el módulo
    var localModule = requireModule(moduleName);
    var remoteModule = modules[moduleName];

    // Puedes realizar operaciones con el módulo cargado aquí...
    setExport(remoteModule, localModule);
  });
})().catch(console.error);

function setExport(src, dest) {
  Object.entries(src).forEach(([exportName, fn]) => {
    dest[exportName] = fn;
  });
}
