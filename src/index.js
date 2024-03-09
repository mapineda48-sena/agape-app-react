const rpc = require("util/axios").default;

(async () => {
  const modules = await rpc();

  // Crear un contexto con todos los archivos en './someDirectory', incluyendo subdirectorios, que terminan en '.js'
  var requireModule = require.context("./rpc", true, /\.js$/);

  // Esto ejecutará la función de require para cada archivo correspondiente al contexto
  requireModule.keys().forEach(function (fileName) {
    // Cargar el módulo
    var module = requireModule(fileName);

    // Puedes realizar operaciones con el módulo cargado aquí...
    modules
      .filter(([moduleName]) => moduleName === fileName)
      .forEach(([, key, fn]) => (module[key] = fn));
  });

  //React App
  require("./App");
})().catch(console.error);
