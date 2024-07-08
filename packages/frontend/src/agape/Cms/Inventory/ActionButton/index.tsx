import { FaSearch } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";

export default function ActionButtonCms(props: Props) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1em",
        right: "1em",
      }}
    >
      <div
        className="btn-group-vertical"
        role="group"
        aria-label="Vertical button group"
      >
        <button
          onClick={props.OnCreate}
          type="button"
          className="btn btn-primary"
        >
          <MdAddBox />
        </button>
        <button
          onClick={props.OnSearch}
          type="button"
          className="btn btn-primary"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
}

/**
 * Types
 */

export interface Props {
  OnCreate?: () => void;
  OnSearch?: () => void;
}
