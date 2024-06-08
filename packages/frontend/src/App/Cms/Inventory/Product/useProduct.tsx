import { withPortalToRoot } from "components/Portals";
import useModal from "hook/useModal";
import FormNewProduct from "./Form";
import { useEmitter } from "components/EventEmitter";
import { useEffect } from "react";
import { EVENT_UPDATE } from "./event";

const useModalPortal = withPortalToRoot(({ remove, style, ...props }: any) => {
  const emitter = useEmitter();

  const modal = useModal({
    onCreateShow: true,
    onClose: remove,
  });

  useEffect(() => {
    emitter.on(EVENT_UPDATE, () => {
      modal.current?.hide();
    });
  }, [emitter, modal]);

  return (
    <div className="modal fade" ref={modal.ref} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{props?.fullName ?? "Producto"}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <FormNewProduct product={props} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default useModalPortal;
