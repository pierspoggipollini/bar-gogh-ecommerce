import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { Loader } from "./Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useConditionalUserData } from "../ReactQuery/useUserData";
import * as UserActions from "../store/user-auth"

const ProtectedRoute = ({ redirectPath = "/login", children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.userAuth.isAuthenticated,
  );
  const user = useSelector((state) => state.userAuth.user);

  const {
    isLoading,
    error,
    data: userData,
    refetch,
  } = useConditionalUserData(isAuthenticated);

  // Verifica se i dati dell'utente sono diversi da quelli già presenti nello stato
  const isNewUserData = JSON.stringify(userData) !== JSON.stringify(user);

  // Effettua il refetch dei dati utente alla prima renderizzazione del componente
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (!isLoading && !error && isAuthenticated && isNewUserData) {
      dispatch(UserActions.setUser({ user: userData }));
    }
  }, [isLoading, error, isAuthenticated, isNewUserData, userData, dispatch]);

  if (isLoading) {
    // Renderizza qualcosa durante la fase di verifica
    return <Loader text="Checking authentication" loaderClass="loader-user" />;
  }

  if (!isAuthenticated || error) {
    // Se l'utente non è autenticato o c'è un errore, reindirizza alla pagina di login specificata
    return <Navigate to={redirectPath} replace />;
  }

  // Se l'utente è autenticato, renderizza i componenti figlio se presenti, altrimenti renderizza l'elemento Outlet per il routing nidificato
  return children || <Outlet />;
};


export default ProtectedRoute;