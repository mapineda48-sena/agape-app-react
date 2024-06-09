import { createProduct } from "backend/service/inventory/product";
import Form from "components/Form";
import Input from "components/Form/Field/Input";
import CategorySelect from "./Category";
import SubCategorySelect from "./SubCategory";
import Images from "./Images";
import Submit from "components/Form/Submit";
import { EVENT_UPDATE } from "../event";
import { IProduct } from "backend/models/inventory/product";

export default function FormNewProduct(props: { product?: IProduct }) {
  return (
    <div className="container">
      <Form
        onSubmit={createProduct}
        merge
        initState={props.product}
        thenEvent={EVENT_UPDATE}
        className="row g-3"
      >
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
  );
}
