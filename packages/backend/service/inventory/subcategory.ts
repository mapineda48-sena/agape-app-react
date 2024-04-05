let id = 0;

export function sayHello(person: { fullName: string }) {
  id++;
  return Promise.resolve(`Hello ${person.fullName} ${id}`);
}