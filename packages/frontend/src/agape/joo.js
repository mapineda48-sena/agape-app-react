import React, { useState, useEffect } from "react";

const ContextMenu = ({ visible, x, y, onClose }) => {
  useEffect(() => {
    const handleMouseDown = () => {
      onClose();
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "white",
        border: "1px solid #ccc",
        zIndex: 1000,
        padding: "10px",
      }}
    >
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>Option 1</li>
        <li>Option 2</li>
        <li>Option 3</li>
      </ul>
    </div>
  );
};

const data = [
  {
    data1: "foo",
    data2: "bar",
  },
];

const Table = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event) => {
    event.preventDefault(); // Evita que se muestre el menú contextual del navegador
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <div>
      <table>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} onContextMenu={handleContextMenu}>
              <td>{row.data1}</td>
              <td>{row.data2}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ContextMenu
        visible={menuVisible}
        x={menuPosition.x}
        y={menuPosition.y}
        onClose={closeMenu}
      />
    </div>
  );
};

export default Table;
