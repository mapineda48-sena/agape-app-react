import { Project, InterfaceDeclaration, PropertySignature } from "ts-morph";
import * as fs from "fs";

// Inicializa un proyecto ts-morph
const project = new Project();
const sourceFile = project.addSourceFileAtPath("src/api.d.ts");

// Función para procesar una interfaz y sus propiedades de manera recursiva
function procesarInterfaz(i: InterfaceDeclaration): any {
    let resultado:any = {};
    const properties = i.getProperties();
    properties.forEach((p) => {
        const name = p.getName();
        const type = p.getType();
        // Verificar si el tipo de la propiedad es una interfaz
        if (type.isInterface()) {
            // Encontrar la declaración de la interfaz (asumiendo que está en el mismo archivo)
            const interfazDeclaracion:any = type.getSymbol()?.getDeclarations()[0];
            if (interfazDeclaracion && InterfaceDeclaration.is(interfazDeclaracion)) {
                // Procesar la interfaz de manera recursiva
                resultado[name] = procesarInterfaz(interfazDeclaracion);
            }
        } else {
            // Si no es una interfaz, simplemente asignar el nombre de la propiedad como valor
            resultado[name] = name;
        }
    });
    return resultado;
}

// Objeto para almacenar el resultado final
let resultadoFinal:any = {};

// Recorrer cada interfaz del archivo y procesar sus propiedades
sourceFile.getInterfaces().forEach((i) => {
    resultadoFinal[i.getName()] = procesarInterfaz(i);
});

// Escribir el resultado a un archivo .js
// const outputPath = "salida.js";
// const content = `const resultado = ${JSON.stringify(resultadoFinal, null, 2)};\nmodule.exports = resultado;`;
// fs.writeFileSync(outputPath, content, "utf8");

//console.log(`Archivo ${outputPath} ha sido generado.`);


fs.writeFileSync("src/api.json", JSON.stringify(resultadoFinal.Api, null, 2), "utf8");
