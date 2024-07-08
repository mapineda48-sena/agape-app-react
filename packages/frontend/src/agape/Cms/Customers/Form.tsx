import { withPortalToRoot } from "components/Portals";
import Input from "components/Form/Field/Input";
import useModal from "hook/useModal";
import { useEmitter } from "components/EventEmitter";
import { useEffect } from "react";
import { EVENT_CLOSE, EVENT_CREATE_OR_UPDATE, EVENT_DELETE } from "./event";
import Form from "components/Form";
import { createCustomer, deleteCustomer } from "backend/service/customer";

export default function CreateCustomerForm({ record }: { record?: any }) {
  return (
    <Form
      initState={record}
      onSubmit={createCustomer}
      thenEvent={EVENT_CREATE_OR_UPDATE}
    >
      <div className="mb-3">
        <Input.Text required label="Nombre completo" name="fullName" />
      </div>
      <div className="mb-3">
        <Input.Text email required label="Correo electrónico" name="email" />
      </div>
      <div className="mb-3">
        <Input.Text required label="Teléfono" name="phone" />
      </div>
      <div className="mb-3">
        <Input.Text required label="Dirección" name="address" />
      </div>
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="exampleCheck1"
        />
        <label className="form-check-label" htmlFor="exampleCheck1">
          Habilitado
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Enviar
      </button>
    </Form>
  );
}

export const useFormCustomers = withPortalToRoot((props: any) => {
  const { remove, fullName, record } = props;
  const emitter = useEmitter();

  const modal = useModal({
    onCreateShow: true,
    onClose: remove,
  });

  useEffect(() => {
    return emitter.on(EVENT_CREATE_OR_UPDATE, () => modal.current?.hide());
  }, [emitter, modal]);

  useEffect(() => {
    return emitter.on(EVENT_CLOSE, remove);
  }, [emitter, remove]);

  return (
    <div className="modal fade" ref={modal.ref} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{fullName ?? "Ciente"}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <CreateCustomerForm record={record} />
          </div>
        </div>
      </div>
    </div>
  );
});

export const useDeleteCustomer = withPortalToRoot(({ record, remove }: any) => {
  const emitter = useEmitter();

  const modal = useModal({
    onCreateShow: true,
    onClose: remove,
  });

  useEffect(() => emitter.on(EVENT_CLOSE, remove), [emitter, remove]);

  return (
    <div className="modal fade" ref={modal.ref} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar Cliente</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <p>Esta seguro que desea continuar</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              onClick={() => {
                deleteCustomer(record.id)
                  .then(() => {
                    emitter.emit(EVENT_DELETE, record);
                  })
                  .catch(console.error)
                  .finally(remove);
              }}
              type="button"
              className="btn btn-primary"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
