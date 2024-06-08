import { useEmitter } from "components/EventEmitter";
import { withPortalToRoot } from "components/Portals";
import { deleteProduct } from "backend/service/inventory/product";
import useModal from "hook/useModal";
import { EVENT_DELETE } from "./event";

const useDeleteProduct = withPortalToRoot((props: any) => {
  const modal = useModal({
    onCreateShow: true,
    onClose: props.remove,
  });

  const emitter = useEmitter();

  return (
    <div className="modal fade" ref={modal.ref} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar Producto</h5>
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
                deleteProduct(props.id).then(() => {
                  emitter.emit(EVENT_DELETE, props.id);
                  if (modal.current) {
                    modal.current.hide();
                  }
                });
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

export default useDeleteProduct;
