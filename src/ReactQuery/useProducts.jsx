import axios from 'axios';
import React from 'react'
import { useQuery } from 'react-query';
import apiBaseUrl from '../config/apiConfig';
import { isCacheExpired } from './isCacheExpired';


export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}products`);
    return response.data;
  } catch (error) {
    // Restituisci direttamente l'oggetto di errore
    throw new Error(error.message);
  }
};

/* export const useProducts = () => {
  return useQuery(["products"], async () => {
    // Se i dati sono presenti in cache, restituisci quelli senza chiamare l'API
    const cachedData = JSON.parse(localStorage.getItem("products"));

    // Chiamare l'API indipendentemente dalla presenza di dati in cache
    try {
      const apiData = await fetchProducts();

      // Se i dati in cache sono diversi dai dati dell'API, aggiorna la cache
      if (
        cachedData &&
        JSON.stringify(apiData) !== JSON.stringify(cachedData)
      ) {
        localStorage.setItem("products", JSON.stringify(apiData));
      }

      return apiData;
    } catch (error) {
      // Gestire l'errore se necessario
      throw new Error(error.message);
    }
  });
};
 */

export const useProducts = () => {
  return useQuery(["products"], async () => {
    const cachedData = JSON.parse(localStorage.getItem("products"));

    // Decide se chiamare l'API in base a un intervallo di tempo (ad esempio, ogni 10 minuti)
    const shouldFetchFromAPI = !cachedData || isCacheExpired(cachedData);

    if (shouldFetchFromAPI) {
      try {
        const apiData = await fetchProducts();
        localStorage.setItem(
          "products",
          JSON.stringify({ data: apiData, timestamp: Date.now() }),
        );

        return apiData;
      } catch (error) {
        throw new Error(error.message);
      }
    } else {
      // Utilizza i dati dalla cache
      return cachedData.data || cachedData;
    }
  });
};