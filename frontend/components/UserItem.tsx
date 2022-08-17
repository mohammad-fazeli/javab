import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { fetchLessons } from "../store/users/action";
interface IProps {
  name: string;
  _id: string;
}

const UserItem: React.FC<IProps> = ({ _id, name }) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => {
    return {
      userLessons: state.users.userLessons,
      allLessons: state.users.allLessons,
    };
  });
  console.log(state);
  useEffect(() => {
    dispatch(fetchLessons(_id) as any);
  }, [_id, dispatch]);

  return (
    <div className="flex py-2 items-center justify-between border-b border-b-[#E1E1E1] dark:border-b-[#3D494C]">
      {name}
    </div>
  );
};

export default UserItem;
