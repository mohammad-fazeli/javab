import { logout, setUser } from "../store/user/slice";
import { refresh } from "../store/user/action";
import axios from "axios";
import { RootState } from "../store/store";

export async function handleError(error: any, thunkAPI: any) {
  //Unauthorized code, but you can get a new token
  if (error.response?.data.status === 403) {
    try {
      await thunkAPI.dispatch(refresh()).unwrap(); //refresh token request
      const token = (thunkAPI.getState() as RootState).user.token; //get new token
      const data = error.config.data; //Restore data for refetch
      const url = error.config.url; //Restore url for refetch
      const method = error.config.method; //Restore method for refetch
      //refetch
      const response = await axios({
        url,
        method,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      if (err.response.data.status === 401) {
        thunkAPI.dispatch(logout());
        return thunkAPI.rejectWithValue(err.response.data);
      }
      return thunkAPI.rejectWithValue(err.response.data);
    }
  } else if (error.response?.data.status === 401) {
    thunkAPI.dispatch(logout());
    return thunkAPI.rejectWithValue(error.response?.data);
  }
  return thunkAPI.rejectWithValue(error.response?.data);
}

export async function handleErrorServerSide(
  error: any,
  exToken: string,
  store: any
) {
  //Unauthorized code, but you can get a new token
  if (error.response?.data.status === 403) {
    try {
      const responseRefreshToken = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/refresh`,
        {
          headers: {
            Authorization: `Bearer ${exToken}`,
          },
        }
      );
      store.dispatch(
        setUser({
          user: responseRefreshToken.data.user,
          token: responseRefreshToken.data.token,
        })
      );
      const data = error.config.data; //Restore data for refetch
      const url = error.config.url; //Restore url for refetch
      const method = error.config.method; //Restore method for refetch
      //refetch
      const response = await axios({
        url,
        method,
        data,
        headers: {
          Authorization: `Bearer ${responseRefreshToken.data.token}`,
        },
      });
      return response;
    } catch (err: any) {
      if (err.response.data.status === 401) {
        return 401;
      }
    }
  } else if (error.response?.data.status === 401) {
    return 401;
  }
  return error.response?.data.status as number;
}
