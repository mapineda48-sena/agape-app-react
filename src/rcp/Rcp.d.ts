interface Inventory {
  Add(name: string): Promise<bool>;
}

interface Api {
  sayHello(name: string, file:any): Promise<string>;
  login(user, passsword): Promise<bool>;
  inventory: Inventory;
}

export default Api;
