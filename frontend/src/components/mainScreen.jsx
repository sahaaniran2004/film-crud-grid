import React, { useEffect, useState } from "react";
import axios from "axios";
import FilmCrudGrid from "./filmCrudGrid";
import SearchAppBar from "./searchAppBar";

const MainScreen = () => {
  const [film, setFilm] = useState([]);
  const [gridData, setGridData] = useState(false);

  const filmData = async (data) => {
    if (data === "" || data == null) {
      setGridData(true);
    } else {
      setGridData(false);
      const payload = { title: data };
      try {
        const response = await axios.post(
          "http://localhost:3000/film/search",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        const mappedData = data.map((item) => ({
          id: item.film_id,
          title: item.title,
          description: item.description,
          length: item.length,
          rating: item.rating,
        }));
        setFilm(mappedData);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const fetchFilmData = async () => {
    const apiUrl = "http://localhost:3000/film/fetch";
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;
      const mappedData = data.map((item) => ({
        id: item.film_id,
        title: item.title,
        description: item.description,
        length: item.length,
        rating: item.rating,
      }));
      setFilm(mappedData);
    } catch (err) {
      console.error("Error fetching film data:", err);
    }
  };

  useEffect(() => {
    fetchFilmData();
  }, [gridData]);

  return (
    <div>
      <SearchAppBar searchData={filmData} />
      <div style={{ marginTop: "50px" }}>
        <FilmCrudGrid film={film} fetchFilmData={fetchFilmData} />
      </div>
    </div>
  );
};

export default MainScreen;
