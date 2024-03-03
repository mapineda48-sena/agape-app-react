const _ = require("lodash");

function toPathValuesIntegersOnly(obj, baseKey = "") {
  return _.transform(
    obj,
    (result, value, key) => {
      // Para arrays, la clave será el índice, por lo que construimos la ruta adecuadamente
      // ya sea usando punto para objetos o corchetes para índices de arrays.
      let currentKey = Array.isArray(obj)
        ? `${baseKey}[${key}]`
        : baseKey
        ? `${baseKey}.${key}`
        : key;
      if (_.isPlainObject(value) || Array.isArray(value)) {
        result.push(...toPathValuesIntegersOnly(value, currentKey));
      } else if (Number.isInteger(value)) {
        result.push([currentKey, value]);
      }
    },
    []
  );
}

// Ejemplo de uso:
let objeto = [
  {
    a: { b: { c: 1, d: "2", e: [2.5, 3, { f: 4, g: "5" }] } },
    h: "texto",
    i: [5.5, { j: 6, k: 7 }, 8],
  },
];

let entradas = toPathValuesIntegersOnly(objeto);

//console.log(entradas);

const res = [];

entradas.forEach(([key, val]) => _.set(res, key, val));

const foo = _.cloneDeep(objeto);

entradas.map(([key]) => key).forEach((key) => _.unset(foo, key));

console.log(objeto);
console.log(res);
console.log(foo);
