import ActionButtonCms from "../Inventory/ActionButton";
import LayoutCms from "../Layout";
import { getAllCustomers, IAllCustomer } from "backend/service/customer";
import { useFormCustomers } from "./Form";
import useContextMenu from "./ContextMenu";
import { useEmitter } from "components/EventEmitter";
import { useEffect, useState } from "react";
import { EVENT_CREATE_OR_UPDATE, EVENT_DELETE } from "./event";
import "./index.css";

export const OnInit = getAllCustomers;

export default function Customer({ records }: IAllCustomer) {
  const [state, setState] = useState(records);

  const showContextMenu = useContextMenu();
  const showFormCustomers = useFormCustomers();
  const emitter = useEmitter();

  useEffect(() =>
    emitter.on(EVENT_CREATE_OR_UPDATE, (record: any) => {
      setState((state) => {
        const current = state.findIndex((current) => current.id === record.id);

        if (!state[current]) {
          return [record, ...state];
        }

        const next = [...state];
        next[current] = record;

        return next;
      });
    })
  );

  useEffect(() =>
    emitter.on(EVENT_DELETE, (record: any) => {
      setState((state) => state.filter((i) => i.id !== record.id));
    })
  );

  if (!state || !state.length) {
    return (
      <LayoutCms>
        <ActionButtonCms OnCreate={() => showFormCustomers()} />
        <div className="container">
          <span>sin resultados</span>
        </div>
      </LayoutCms>
    );
  }

  return (
    <LayoutCms>
      <ActionButtonCms OnCreate={() => showFormCustomers()} />
      <div className="container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre Completo</th>
              <th scope="col">Correo electrónico</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Dirección</th>
              <th scope="col">Habilitado</th>
            </tr>
          </thead>
          <tbody>
            {state.map((record, index) => (
              <tr
                key={index}
                onContextMenu={(e) => {
                  e.preventDefault();

                  showContextMenu({
                    x: e.pageX,
                    y: e.pageY,
                    record,
                  });
                }}
                className="agape-shadow-hover"
              >
                <th scope="row">{record.id}</th>
                <td>{record.fullName}</td>
                <td>{record.email}</td>
                <td>{record.phone}</td>
                <td>{record.address}</td>
                <td>{record.isEnabled ? "Si" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LayoutCms>
  );
}
