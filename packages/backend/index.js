const rpc = require("./lib/rpc/connect-client-http.js").default;

exports.service = (async () => {
  const modules = await rpc();

  // Crear un contexto con todos los archivos en './someDirectory', incluyendo subdirectorios, que terminan en 'index.js'
  var requireModule = require.context("./service", true, /\index.js$/);

  // Esto ejecutará la función de require para cada archivo correspondiente al contexto
  requireModule.keys().forEach(function (fileName) {
    // Cargar el módulo
    var module = requireModule(fileName);

    // Puedes realizar operaciones con el módulo cargado aquí...
    modules
      .filter(([moduleName]) => moduleName === fileName)
      .forEach(([, key, fn]) => (module[key] = fn));
  });
})().catch(console.error);
