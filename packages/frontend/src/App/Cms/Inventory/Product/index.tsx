import { createProduct } from "backend/service/inventory/product";
import Form from "App/Form";
import Input from "App/Form/Field/Input";
import CategorySelect from "./Category";
import SubCategorySelect from "./SubCategory";
import Images from "./Images";
import Submit from "App/Form/Submit";
import Cms from "App/Cms";

export default function FormNewProduct() {
  return (
    <Cms>
      <div className="container">
        <Form onSubmit={createProduct} merge className="row g-3">
          <h1>Productos</h1>
          <div className="col-12">
            <Images path="images" />
          </div>
          <div className="col-12">
            <Input.Text required label="Nombre" name="fullName" />
          </div>
          <div className="col-5">
            <CategorySelect />
          </div>
          <div className="col-5">
            <SubCategorySelect />
          </div>
          <div className="col-2">
            <Input.Float required label="Precio" name="price" />
          </div>
          <div className="col-12">
            <Input.TextArea label="Descripción" name="description" rows={3} />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="gridCheck"
              />
              <label className="form-check-label" htmlFor="gridCheck">
                Habilitado
              </label>
            </div>
          </div>
          <div className="col-12">
            <Submit className="btn btn-primary">Enviar</Submit>
          </div>
        </Form>
      </div>
    </Cms>
  );
}
