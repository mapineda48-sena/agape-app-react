// import { randomUUID } from "crypto";
// import documentsType from "./documentType.json";
// import db from "../../models";

// export default async function populateData() {
//   const [dni] = await Promise.all(
//     documentsType.map((document) => db.documentType.create(document))
//   );

//   const role = await db.employee.role.create({
//     fullName: "SuperUser",
//     isEnabled: false,
//   });

//   const user = await db.user.create({
//     fullName: "Miguel Pineda",
//     email: "mapineda48@indiatimes.com",
//     city: "Wafang",
//     department: "Desa Werasari",
//     birthday: new Date("1993-08-18T04:08:07Z"),
//     documentNumber: randomUUID(),
//     documentTypeId: dni.getDataValue("id"),
//   });

//   const employee = await db.employee.associate.create({
//     userId: user.getDataValue("id"),
//   });

//   /**
//    * Import change after sync
//    */
//   await db.employee.access.create({
//     employeeId: employee.getDataValue("id"),
//     username: "admin",
//     password: "admin",
//     isEnabled: true,
//   });

//   await db.employee.associateRole.create({
//     associateId: employee.getDataValue("id"),
//     roleId: role.getDataValue("id"),
//   });
// }

export default null;