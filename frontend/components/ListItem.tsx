import React, { useState } from "react";
import Button from "./Button";
import Item from "./Item";

interface IProps {
  items: { _id: string; title: string }[];
  canEdit: boolean;
  title: string;
  addButtonText: string;
  addFunction: () => void;
  handleDeleteItem: (id: string) => void;
  handleUpdateItem: (obj: { _id: string; title: string }) => void;
  to: string;
}

const ListItem: React.FC<IProps> = ({
  items,
  canEdit,
  title,
  addButtonText,
  addFunction,
  handleDeleteItem,
  handleUpdateItem,
  to,
}) => {
  const [state, setState] = useState({
    search: "",
  });
  return (
    <div>
      <div className="min-h-[calc(100vh-57px)] px-3 md:border md:border-t-0 md:border-b-0 border-[#E1E1E1] dark:md:border-[#3D494C]">
        <div className="flex justify-between items-center">
          <h1>{title}</h1>
          {canEdit && (
            <div className="bg-[#F7F5FB] dark:bg-[#475B63] rounded-xl px-2">
              <Button onClick={addFunction}>{addButtonText}</Button>
            </div>
          )}
        </div>
        <div>
          <input
            type="text"
            className="w-11/12 block mx-auto my-8 rounded-lg p-2 dark:bg-[#475B63] outline-none"
            placeholder="جستجو..."
            value={state.search}
            onChange={(e) => {
              setState((prevState) => {
                return {
                  ...prevState,
                  search: e.target.value,
                };
              });
            }}
          />
        </div>
        {items.length > 0 ? (
          <div className="flex flex-col gap-2">
            {items
              .filter((item) =>
                item.title.toLowerCase().includes(state.search.toLowerCase())
              )
              .map((item) => (
                <Item
                  key={item._id}
                  _id={item._id}
                  canEdit={canEdit}
                  onDelete={handleDeleteItem}
                  onEdit={handleUpdateItem}
                  title={item.title}
                  to={`/${to}/${item._id}`}
                />
              ))}
          </div>
        ) : (
          <div className="text-center">هیچ آیتمی وجود ندارد</div>
        )}
      </div>
    </div>
  );
};

export default ListItem;
