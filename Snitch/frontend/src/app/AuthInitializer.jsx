import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading as setAuthLoading } from "../features/auth/state/auth.slice";
import { setCart, setLoading as setCartLoading } from "../features/cart/state/cart.slice";
import { getMe } from "../features/auth/services/auth.api";
import { getCart } from "../features/cart/service/cart.api";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { guestId } = useSelector((state) => state.cart);

  useEffect(() => {
    const initializeApp = async () => {
      dispatch(setAuthLoading(true));
      dispatch(setCartLoading());
      
      try {
        // 1. Initialize Auth
        const authResponse = await getMe();
        if (authResponse.success) {
          dispatch(setUser(authResponse.data));
        } else {
          dispatch(setUser(null));
        }

        // 2. Initialize Cart
        // Always try to fetch cart (either as guest or logged in user)
        const cartParams = { page: 1, limit: 10 };
        if (guestId) cartParams.guestId = guestId;
        
        const cartResponse = await getCart(cartParams);
        if (cartResponse.success) {
          dispatch(setCart(cartResponse.data));
        }
      } catch (err) {
        dispatch(setUser(null));
      } finally {
        // Give a tiny buffer for states to sync before revealing the UI
        setTimeout(() => {
          dispatch(setAuthLoading(false));
        }, 200);
      }
    };

    initializeApp();

    const handleSessionExpired = () => {
      dispatch(setUser(null));
      dispatch(setAuthLoading(false));
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [dispatch, guestId]);

  return children;
};

export default AuthInitializer;
